/* ============================================================
   Pixel&Games — Google Sheets (Apps Script) data access
   Talks to the SAME Web App URL the site already POSTs to for
   registration/visitor logging. This module only calls the
   NEW, additive actions/types added to Code.gs — it never
   sends type:"user" or type:"visitor" (those stay exclusively
   the site's job, so nothing here can duplicate or corrupt
   existing rows).

   The read-only/legacy actions (ping, stats, economy, countries,
   recentUsers, recentVisitors, findUser, telegramProfile,
   allTelegramIds, getPendingBroadcast, linkTelegram, claimGift,
   setPendingBroadcast, clearPendingBroadcast) match the
   previously working version exactly.

   ADDED — Currency Exchange (see Code.gs "NEW — CURRENCY
   EXCHANGE" section). These are all NEW, additive action/type
   names — none of them touch the "user"/"visitor" rows, the
   Telegram coin columns (K–N), games/news, or admin sessions.
   They read/write ONLY column O ("siteCoins") on Users and the
   new "ExchangeRequests" sheet.
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
  /* ---- read-only stats / lookups (unchanged) ---- */
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

  /* ---- ADDED — Currency Exchange ----
     siteCoins (column O on the Users sheet) is the server's belief of
     a site account's coin balance. The site syncs it in the background
     every time a logged-in user's local balance changes (daily bonus,
     play rewards, achievements, purchases, ...), keyed by the same
     email/userId identifier findUser/telegram_link already use. This
     is the value exchange_create validates and deducts against — never
     a number sent straight from the exchange form. */
  syncSiteCoins: (identifier, coins) =>
    gasPost({ type: "exchange_sync_coins", identifier, coins }),

  createExchangeRequest: ({ identifier, coins, paymentMethod, payoutDetails, username, email }) =>
    gasPost({
      type: "exchange_create",
      identifier,
      coins,
      paymentMethod,
      payoutDetails,
      username,
      email,
    }),

  myExchangeHistory: (identifier) => gasGet("exchangeHistory", { identifier }),

  adminListExchanges: (status = "", search = "") =>
    gasGet("adminListExchanges", { status, search }),

  processExchangeRequest: (requestId, action, processedBy) =>
    gasPost({ type: "exchange_process", requestId, action, processedBy }),
};

module.exports = Sheets;