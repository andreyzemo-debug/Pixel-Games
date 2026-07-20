/* ============================================================
   Pixel&Games — Admin backend (single serverless function)
   api/admin.js

   Consolidated on purpose: Vercel Hobby plan caps a project at
   12 Serverless Functions. Every admin route is dispatched from
   this one file via ?action=... (GET) or { action } in the JSON
   body (POST/PUT/DELETE), instead of one file per endpoint.

   Actions:
     bot-info     GET               - public, returns bot @username (used to link to the bot)
     session      GET               - check current admin session
     verify-token POST              - consume a one-time token from the /admin bot command, issue session cookie
     logout       POST              - clear session cookie
     stats        GET               - dashboard stats + bot status + latest activity
     users        GET / POST        - list/search users; ban/unban/delete
     broadcast    POST              - send announcement to all linked players
     games        GET/POST/PUT/DELETE - games catalog CRUD
     news         GET/POST/PUT/DELETE - news/announcements CRUD
     settings     GET               - masked environment config viewer
     exchanges    GET/POST          - Currency Exchange requests: list/filter, approve/reject (see api/exchange.js for the user-facing side)

   Login flow (replaces the old Telegram Login Widget):
     Admin opens the bot -> sends /admin -> bot checks TELEGRAM_ADMIN_ID
     -> generates a one-time token (stored via ./_lib/sheets, same
     BotMeta pattern as the pending-broadcast state) -> sends a button
     linking to /admin-panel/login.html?token=... -> that page calls
     verify-token here -> we consume the token and issue the same
     signed admin_session cookie as before.

   Uses (unmodified):
     ./_lib/adminAuth    - signed session cookie helpers
     ./_lib/sheets       - Google Sheets (Apps Script) data access
     ./_lib/telegram     - Telegram Bot API wrapper (via bot.js's sibling)

   Note: ./_lib/telegramAuth.js (Telegram Login Widget HMAC verifier) is
   no longer imported here. Left in place rather than deleted, per the
   "avoid unnecessary changes" rule — it's simply unused now.
   ============================================================ */

const { requireAdmin, createSessionToken, setSessionCookie, clearSessionCookie, readSession, readSessionDetailed } = require("./_lib/adminAuth");
const Sheets = require("./_lib/sheets");
const TG = require("./_lib/telegram");
const { coinsToUsd } = require("./_lib/exchangeConfig");

/* ------------------------------------------------------------
   Small helpers
   ------------------------------------------------------------ */
function mask(value) {
  if (!value) return null;
  const str = String(value);
  if (str.length <= 4) return "••••";
  return `••••••${str.slice(-4)}`;
}

function escapeHtml(str) {
  return String(str == null ? "" : str).replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]));
}

function send(res, status, body) {
  return res.status(status).json(body);
}

/* ------------------------------------------------------------
   Action handlers
   ------------------------------------------------------------ */

// GET — public, no auth. Returns the bot's @username so the
// admin panel's login button can link straight to the bot chat.
async function handleBotInfo(req, res) {
  if (req.method !== "GET") return send(res, 405, { ok: false, error: "Method not allowed" });
  try {
    const info = await TG.callTelegram("getMe", {});
    if (!info.ok) return send(res, 502, { ok: false, error: "Could not reach Telegram" });
    return send(res, 200, { ok: true, username: info.result.username });
  } catch (err) {
    return send(res, 500, { ok: false, error: err.message });
  }
}

// GET — check current admin session.
async function handleSession(req, res) {
  if (req.method !== "GET") return send(res, 405, { ok: false, error: "Method not allowed" });
  const { payload, reason } = readSessionDetailed(req);
  if (!payload) return send(res, 200, { ok: true, authenticated: false, reason });
  return send(res, 200, {
    ok: true,
    authenticated: true,
    admin: { id: payload.id, name: payload.name, username: payload.username },
  });
}

// POST — consume a one-time token minted by the /admin bot command,
// issue the same signed admin_session cookie as before.
async function handleVerifyToken(req, res) {
  if (req.method !== "POST") return send(res, 405, { ok: false, error: "Method not allowed" });

  const adminId = String(process.env.TELEGRAM_ADMIN_ID || "");
  if (!adminId) return send(res, 500, { ok: false, error: "TELEGRAM_ADMIN_ID is not configured on the server" });
  if (!process.env.ADMIN_SESSION_SECRET) return send(res, 500, { ok: false, error: "ADMIN_SESSION_SECRET is not configured on the server" });

  const body = req.body || {};
  const token = typeof body.token === "string" ? body.token.trim() : "";
  if (!token) return send(res, 400, { ok: false, error: "token is required" });

  const result = await Sheets.consumeAdminLoginToken(token);
  if (!result.ok) {
    const messages = {
      expired: "This login link has expired. Send /admin in the bot again.",
      invalid: "This login link is invalid. Send /admin in the bot again.",
      not_found: "This login link has already been used or has expired. Send /admin in the bot again.",
    };
    return send(res, 401, { ok: false, error: messages[result.error] || "This login link could not be verified." });
  }

  if (String(result.telegramId) !== adminId) {
    return send(res, 403, { ok: false, error: "This Telegram account is not authorized as admin" });
  }

  const sessionToken = createSessionToken(result.telegramId, {
    name: result.name || "Admin",
    username: result.username || null,
  });
  setSessionCookie(res, sessionToken);

  return send(res, 200, {
    ok: true,
    admin: { id: result.telegramId, name: result.name || "Admin", username: result.username || null },
  });
}

// POST — clear session cookie.
async function handleLogout(req, res) {
  if (req.method !== "POST") return send(res, 405, { ok: false, error: "Method not allowed" });
  clearSessionCookie(res);
  return send(res, 200, { ok: true });
}

// GET — dashboard stats + bot status + latest activity. Admin only.
async function handleStats(req, res) {
  if (req.method !== "GET") return send(res, 405, { ok: false, error: "Method not allowed" });
  if (!requireAdmin(req, res)) return;

  const [stats, webhookInfo, recentUsers, recentVisitors] = await Promise.all([
    Sheets.stats(),
    TG.getWebhookInfo().catch(() => ({ ok: false })),
    Sheets.recentUsers(8),
    Sheets.recentVisitors(8),
  ]);

  const botConfigured = Boolean(process.env.TELEGRAM_BOT_TOKEN);
  const botStatus = {
    configured: botConfigured,
    webhookSet: Boolean(webhookInfo && webhookInfo.ok && webhookInfo.result && webhookInfo.result.url),
    webhookUrl: (webhookInfo && webhookInfo.ok && webhookInfo.result && webhookInfo.result.url) || null,
    pendingUpdateCount:
      (webhookInfo && webhookInfo.ok && webhookInfo.result && webhookInfo.result.pending_update_count) ?? null,
    lastErrorMessage:
      (webhookInfo && webhookInfo.ok && webhookInfo.result && webhookInfo.result.last_error_message) || null,
  };

  const activity = []
    .concat(
      (recentUsers.ok ? recentUsers.users : []).map((u) => ({
        type: "registration",
        label: u.username || u.email || "New user",
        detail: [u.account, u.country].filter(Boolean).join(" · "),
        date: u.date || null,
      })),
      (recentVisitors.ok ? recentVisitors.visitors : []).map((v) => ({
        type: "visit",
        label: [v.country, v.city].filter(Boolean).join(", ") || "Visitor",
        detail: [v.browser, v.os].filter(Boolean).join(" / "),
        date: [v.date, v.time].filter(Boolean).join(" "),
      }))
    )
    .filter((a) => a.date)
    .sort((a, b) => String(b.date).localeCompare(String(a.date)))
    .slice(0, 12);

  return send(res, 200, {
    ok: true,
    stats: stats.ok
      ? {
          totalUsers: stats.totalUsers,
          premiumUsers: stats.premiumUsers,
          freeUsers: stats.freeUsers,
          linkedUsers: stats.linkedUsers,
          totalVisitors: stats.totalVisitors,
          todayUsers: stats.todayUsers,
          todayVisitors: stats.todayVisitors,
          onlineNow: stats.onlineNow,
          topCountry: stats.topCountry,
          topBrowser: stats.topBrowser,
          topOS: stats.topOS,
        }
      : null,
    statsError: stats.ok ? null : stats.error || "unavailable",
    bot: botStatus,
    activity,
  });
}

// GET (list/search) / POST (ban/unban/delete). Admin only.
async function handleUsers(req, res) {
  if (!requireAdmin(req, res)) return;

  if (req.method === "GET") {
    const search = (req.query && req.query.search) || "";
    const limit = Math.min(parseInt((req.query && req.query.limit) || "200", 10) || 200, 500);

    const result = await Sheets.adminListUsers(search, limit);
    if (!result.ok) return send(res, 502, { ok: false, error: result.error || "Could not load users" });
    return send(res, 200, { ok: true, users: result.users });
  }

  if (req.method === "POST") {
    const { userAction, identifier } = req.body || {};

    if (!identifier || typeof identifier !== "string") return send(res, 400, { ok: false, error: "identifier is required" });
    if (!["ban", "unban", "delete"].includes(userAction)) {
      return send(res, 400, { ok: false, error: "userAction must be ban, unban, or delete" });
    }

    let result;
    if (userAction === "ban") result = await Sheets.adminBanUser(identifier);
    if (userAction === "unban") result = await Sheets.adminUnbanUser(identifier);
    if (userAction === "delete") result = await Sheets.adminDeleteUser(identifier);

    if (!result.ok) return send(res, 502, { ok: false, error: result.error || "Action failed" });
    return send(res, 200, { ok: true });
  }

  return send(res, 405, { ok: false, error: "Method not allowed" });
}

// POST — send announcement to every linked player. Admin only.
async function handleBroadcast(req, res) {
  if (req.method !== "POST") return send(res, 405, { ok: false, error: "Method not allowed" });
  if (!requireAdmin(req, res)) return;

  const SEND_CAP = 200; // stay well within a single serverless invocation
  const message = String((req.body && req.body.message) || "").trim();
  if (!message) return send(res, 400, { ok: false, error: "message is required" });
  if (message.length > 3500) return send(res, 400, { ok: false, error: "message is too long (max 3500 characters)" });

  const idsRes = await Sheets.allTelegramIds();
  if (!idsRes.ok) return send(res, 502, { ok: false, error: "Could not load recipient list" });
  const ids = idsRes.ids || [];
  const escaped = escapeHtml(message);

  let sent = 0;
  let failed = 0;
  for (const id of ids.slice(0, SEND_CAP)) {
    try {
      const result = await TG.sendMessage(id, `📢 <b>Pixel&Games</b>\n\n${escaped}`);
      if (result && result.ok) sent++;
      else failed++;
    } catch {
      failed++;
    }
  }

  return send(res, 200, { ok: true, sent, failed, total: ids.length, capped: ids.length > SEND_CAP });
}

// GET/POST/PUT/DELETE — games catalog CRUD. Admin only.
function validateGame(game) {
  if (!game || typeof game !== "object") return "game object is required";
  if (!game.title || typeof game.title !== "string") return "title is required";
  if (game.price !== undefined && game.price !== null && isNaN(Number(game.price))) return "price must be a number";
  return null;
}

async function handleGames(req, res) {
  if (!requireAdmin(req, res)) return;

  if (req.method === "GET") {
    const result = await Sheets.listGames();
    if (!result.ok) return send(res, 502, { ok: false, error: result.error || "Could not load games" });
    return send(res, 200, { ok: true, games: result.games });
  }

  if (req.method === "POST") {
    const { game } = req.body || {};
    const err = validateGame(game);
    if (err) return send(res, 400, { ok: false, error: err });

    const result = await Sheets.addGame(game);
    if (!result.ok) return send(res, 502, { ok: false, error: result.error || "Could not add game" });
    return send(res, 201, { ok: true, game: result.game });
  }

  if (req.method === "PUT") {
    const { id, game } = req.body || {};
    if (!id) return send(res, 400, { ok: false, error: "id is required" });
    const err = validateGame(game);
    if (err) return send(res, 400, { ok: false, error: err });

    const result = await Sheets.updateGame(id, game);
    if (!result.ok) return send(res, 502, { ok: false, error: result.error || "Could not update game" });
    return send(res, 200, { ok: true });
  }

  if (req.method === "DELETE") {
    const id = (req.query && req.query.id) || (req.body && req.body.id);
    if (!id) return send(res, 400, { ok: false, error: "id is required" });

    const result = await Sheets.deleteGame(id);
    if (!result.ok) return send(res, 502, { ok: false, error: result.error || "Could not delete game" });
    return send(res, 200, { ok: true });
  }

  return send(res, 405, { ok: false, error: "Method not allowed" });
}

// GET/POST/PUT/DELETE — news/announcements CRUD. Admin only.
function validateNews(item) {
  if (!item || typeof item !== "object") return "item object is required";
  if (!item.title || typeof item.title !== "string") return "title is required";
  if (!item.body || typeof item.body !== "string") return "body is required";
  return null;
}

async function handleNews(req, res) {
  if (!requireAdmin(req, res)) return;

  if (req.method === "GET") {
    const result = await Sheets.listNews();
    if (!result.ok) return send(res, 502, { ok: false, error: result.error || "Could not load news" });
    return send(res, 200, { ok: true, news: result.news });
  }

  if (req.method === "POST") {
    const { item } = req.body || {};
    const err = validateNews(item);
    if (err) return send(res, 400, { ok: false, error: err });

    const result = await Sheets.addNews(item);
    if (!result.ok) return send(res, 502, { ok: false, error: result.error || "Could not add news item" });
    return send(res, 201, { ok: true, item: result.item });
  }

  if (req.method === "PUT") {
    const { id, item } = req.body || {};
    if (!id) return send(res, 400, { ok: false, error: "id is required" });
    const err = validateNews(item);
    if (err) return send(res, 400, { ok: false, error: err });

    const result = await Sheets.updateNews(id, item);
    if (!result.ok) return send(res, 502, { ok: false, error: result.error || "Could not update news item" });
    return send(res, 200, { ok: true });
  }

  if (req.method === "DELETE") {
    const id = (req.query && req.query.id) || (req.body && req.body.id);
    if (!id) return send(res, 400, { ok: false, error: "id is required" });

    const result = await Sheets.deleteNews(id);
    if (!result.ok) return send(res, 502, { ok: false, error: result.error || "Could not delete news item" });
    return send(res, 200, { ok: true });
  }

  return send(res, 405, { ok: false, error: "Method not allowed" });
}

// GET — masked environment config viewer. Admin only.
async function handleSettings(req, res) {
  if (req.method !== "GET") return send(res, 405, { ok: false, error: "Method not allowed" });
  if (!requireAdmin(req, res)) return;

  const env = process.env;

  return send(res, 200, {
    ok: true,
    bot: {
      TELEGRAM_BOT_TOKEN: { configured: Boolean(env.TELEGRAM_BOT_TOKEN), preview: mask(env.TELEGRAM_BOT_TOKEN) },
      TELEGRAM_ADMIN_ID: { configured: Boolean(env.TELEGRAM_ADMIN_ID), value: env.TELEGRAM_ADMIN_ID || null },
      TELEGRAM_CHAT_ID: { configured: Boolean(env.TELEGRAM_CHAT_ID), value: env.TELEGRAM_CHAT_ID || null },
      TELEGRAM_WEBHOOK_SECRET: { configured: Boolean(env.TELEGRAM_WEBHOOK_SECRET), preview: mask(env.TELEGRAM_WEBHOOK_SECRET) },
      SUPPORT_TELEGRAM_USERNAME: { configured: Boolean(env.SUPPORT_TELEGRAM_USERNAME), value: env.SUPPORT_TELEGRAM_USERNAME || null },
    },
    website: {
      SITE_URL: { configured: Boolean(env.SITE_URL), value: env.SITE_URL || null },
      SITE_PUBLIC_URL: { configured: Boolean(env.SITE_PUBLIC_URL), value: env.SITE_PUBLIC_URL || null },
      SETUP_SECRET: { configured: Boolean(env.SETUP_SECRET), preview: mask(env.SETUP_SECRET) },
    },
    integrations: {
      GOOGLE_SHEETS_WEBAPP_URL: { configured: Boolean(env.GOOGLE_SHEETS_WEBAPP_URL), preview: mask(env.GOOGLE_SHEETS_WEBAPP_URL) },
      ADMIN_GAS_SECRET: { configured: Boolean(env.ADMIN_GAS_SECRET), preview: mask(env.ADMIN_GAS_SECRET) },
    },
    adminPanel: {
      ADMIN_SESSION_SECRET: { configured: Boolean(env.ADMIN_SESSION_SECRET), preview: mask(env.ADMIN_SESSION_SECRET) },
    },
  });
}

// GET (list/search/filter) / POST (approve/reject). Admin only.
// ADDED — Currency Exchange admin review queue.
async function handleExchanges(req, res) {
  if (!requireAdmin(req, res)) return;

  if (req.method === "GET") {
    const status = (req.query && req.query.status) || "";
    const search = (req.query && req.query.search) || "";
    const result = await Sheets.adminListExchanges(status, search);
    if (!result.ok) return send(res, 502, { ok: false, error: result.error || "Could not load exchange requests" });
    return send(res, 200, { ok: true, requests: result.requests || [] });
  }

  if (req.method === "POST") {
    const { requestId, exchangeAction } = req.body || {};
    if (!requestId || typeof requestId !== "string") return send(res, 400, { ok: false, error: "requestId is required" });
    if (!["approve", "reject"].includes(exchangeAction)) {
      return send(res, 400, { ok: false, error: "exchangeAction must be approve or reject" });
    }

    const session = readSession(req);
    const processedBy = (session && (session.username || session.name)) || "admin";

    const result = await Sheets.processExchangeRequest(requestId, exchangeAction, processedBy);
    if (!result.ok) {
      const status = result.error === "already_processed" || result.error === "not_found" ? 409 : 502;
      return send(res, status, { ok: false, error: result.error || "Action failed" });
    }

    // Best-effort admin-channel notification — never blocks the response.
    if (process.env.TELEGRAM_CHAT_ID && result.request) {
      const r = result.request;
      const verb = exchangeAction === "approve" ? "✅ Exchange approved" : "❌ Exchange rejected";
      TG.sendMessage(
        process.env.TELEGRAM_CHAT_ID,
        `${verb}\n${escapeHtml(r.username || r.email || r.userId || "")}\n🪙 ${r.coins} coins → $${coinsToUsd(r.coins).toFixed(2)}\nRequest: ${escapeHtml(requestId)}`
      ).catch(() => {});
    }

    return send(res, 200, { ok: true });
  }

  return send(res, 405, { ok: false, error: "Method not allowed" });
}

/* ------------------------------------------------------------
   Router
   ------------------------------------------------------------ */
module.exports = async (req, res) => {
  res.setHeader("Cache-Control", "no-store");

  const action = (req.query && req.query.action) || (req.body && req.body.action);

  try {
    switch (action) {
      case "bot-info":
        return await handleBotInfo(req, res);
      case "session":
        return await handleSession(req, res);
      case "verify-token":
        return await handleVerifyToken(req, res);
      case "logout":
        return await handleLogout(req, res);
      case "stats":
        return await handleStats(req, res);
      case "users":
        return await handleUsers(req, res);
      case "broadcast":
        return await handleBroadcast(req, res);
      case "games":
        return await handleGames(req, res);
      case "news":
        return await handleNews(req, res);
      case "settings":
        return await handleSettings(req, res);
      case "exchanges":
        return await handleExchanges(req, res);
      default:
        return send(res, 400, { ok: false, error: "Unknown or missing action" });
    }
  } catch (err) {
    console.error(`admin.js action=${action} failed:`, err);
    return send(res, 500, { ok: false, error: "Internal server error" });
  }
};