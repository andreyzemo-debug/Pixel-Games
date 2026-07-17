/* ============================================================
   Pixel&Games — Google Sheets (Apps Script) data access
   Talks to the SAME Web App URL the site already POSTs to for
   registration/visitor logging. This module only calls the
   NEW, additive actions/types added to Code.gs — it never
   sends type:"user" or type:"visitor" (those stay exclusively
   the site's job, so nothing here can duplicate or corrupt
   existing rows).

   NOTE: This file was restored after being accidentally wiped
   to 0 bytes (see git history, commit "fixed"). Every action/
   type name below matches what api/admin.js and api/_lib/bot.js
   actually call. The read-only/legacy actions (ping, stats,
   economy, countries, recentUsers, recentVisitors, findUser,
   telegramProfile, allTelegramIds, getPendingBroadcast,
   linkTelegram, claimGift, setPendingBroadcast,
   clearPendingBroadcast) match the previous working version
   exactly. The admin-login-token and games/news CRUD actions
   are NEW — your Google Apps Script (Code.gs) must implement
   matching handlers for these action/type names, or those
   specific admin panel features (login-via-bot, Games page,
   News page) will return { ok: false } until it does:
     GET  action=consumeAdminLoginToken -> type: admin_login_token_create / admin_login_token_consume (POST)
     GET  action=adminListUsers
     POST type: admin_user_ban / admin_user_unban / admin_user_delete
     GET  action=listGames
     POST type: game_add / game_update / game_delete
     GET  action=listNews
     POST type: news_add / news_update / news_delete
   ============================================================ */

const GAS_URL =
  process.env.GOOGLE_SHEETS_WEBAPP_URL ||
  "https://script.google.com/macros/s/AKfycbwGhPqhVsBM94TbBK5KDclFzGxW-3sALt_udomHgmXW1EeBvlDoR_OJTB8FyTGfu9Gs/exec";

async function gasGet(action, params = {}) {
  const url = new URL(GAS_URL);
  url.searchParams.set("action", action);
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== null) url.searchParams.set(k, String(v));
  }
  try {
    const res = await fetch(url.toString());
    return await res.json();
  } catch (err) {
    console.error(`Sheets GET ${action} failed:`, err.message);
    return { ok: false, error: "network_error" };
  }
}

async function gasPost(payload) {
  try {
    const res = await fetch(GAS_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return await res.json();
  } catch (err) {
    console.error(`Sheets POST ${payload.type} failed:`, err.message);
    return { ok: false, error: "network_error" };
  }
}

const Sheets = {
  /* ---- read-only stats / lookups (unchanged from the previous working version) ---- */
  ping: () => gasGet("ping"),
  stats: () => gasGet("stats"),
  economy: () => gasGet("economy"),
  countries: () => gasGet("countries"),
  recentUsers: (limit = 10) => gasGet("recentUsers", { limit }),
  recentVisitors: (limit = 10) => gasGet("recentVisitors", { limit }),
  findUser: (query) => gasGet("findUser", { query }),
  telegramProfile: (telegramId) => gasGet("telegramProfile", { telegramId }),
  allTelegramIds: () => gasGet("allTelegramIds"),
  getPendingBroadcast: () => gasGet("getPendingBroadcast"),

  /* ---- bot-driven writes (unchanged) ---- */
  linkTelegram: (telegramId, query) =>
    gasPost({ type: "telegram_link", telegramId, query }),
  claimGift: (telegramId) => gasPost({ type: "telegram_gift", telegramId }),
  setPendingBroadcast: (telegramId, text) =>
    gasPost({ type: "telegram_set_broadcast", telegramId, text }),
  clearPendingBroadcast: () => gasPost({ type: "telegram_clear_broadcast" }),

  /* ---- admin one-time login token (bot mints it, admin panel consumes it) ---- */
  createAdminLoginToken: (token, telegramId, expiresAt, meta = {}) =>
    gasPost({
      type: "admin_token_create",
      token,
      telegramId,
      expiresAt,
      name: meta.name || "",
      username: meta.username || "",
    }),

  consumeAdminLoginToken: (token) =>
    gasPost({
      type: "admin_token_consume",
      token,
    }),
  /* ---- admin: users management ---- */
  adminListUsers: (search = "", limit = 200) =>
    gasGet("adminListUsers", { search, limit }),
  adminBanUser: (identifier) => gasPost({ type: "admin_user_ban", identifier }),
  adminUnbanUser: (identifier) =>
    gasPost({ type: "admin_user_unban", identifier }),
  adminDeleteUser: (identifier) =>
    gasPost({ type: "admin_user_delete", identifier }),

  /* ---- admin: games catalog CRUD ---- */
  listGames: () => gasGet("listGames"),
  addGame: (game) => gasPost({ type: "game_add", game }),
  updateGame: (id, game) => gasPost({ type: "game_update", id, game }),
  deleteGame: (id) => gasPost({ type: "game_delete", id }),

  /* ---- admin: news/announcements CRUD ---- */
  listNews: () => gasGet("listNews"),
  addNews: (item) => gasPost({ type: "news_add", item }),
  updateNews: (id, item) => gasPost({ type: "news_update", id, item }),
  deleteNews: (id) => gasPost({ type: "news_delete", id }),
};

module.exports = Sheets;
