/* ============================================================
   Pixel&Games — Google Sheets (Apps Script) data access
   Talks to the SAME Web App URL the site already POSTs to for
   registration/visitor logging. This module only calls the
   NEW, additive actions/types added to Code.gs — it never
   sends type:"user" or type:"visitor" (those stay exclusively
   the site's job, so nothing here can duplicate or corrupt
   existing rows).
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

  linkTelegram: (telegramId, query) =>
    gasPost({ type: "telegram_link", telegramId, query }),
  claimGift: (telegramId) =>
    gasPost({ type: "telegram_gift", telegramId }),
  setPendingBroadcast: (telegramId, text) =>
    gasPost({ type: "telegram_set_broadcast", telegramId, text }),
  clearPendingBroadcast: () =>
    gasPost({ type: "telegram_clear_broadcast" }),
};

module.exports = Sheets;