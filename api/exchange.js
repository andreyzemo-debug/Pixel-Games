/* ============================================================
   Pixel&Games — Currency Exchange (user-facing)
   api/exchange.js

   Consolidated into one file for the same reason api/admin.js is:
   Vercel Hobby caps a project at 12 Serverless Functions. Routes
   are dispatched via ?action=... (GET) or { action } in the JSON
   body (POST), same convention as api/admin.js.

   Actions:
     rate      GET   - public, returns the current coins->USD rate
     sync-coins POST - background sync of a user's local coin balance
                        into the server-side "siteCoins" ledger (Users
                        sheet, column O). Fire-and-forget from the
                        client every time coins change locally.
     history   GET   - a user's own exchange requests
     create    POST  - submit a new exchange request

   IMPORTANT — read before assuming this is bulletproof:
   Pixel&Games' site accounts (email/password) have NO server-side
   session of their own — auth today is 100% client-side
   (localStorage). There is no cookie or token here that proves
   "this request really came from the browser logged into
   user@gmail.com". `identifier` is trusted the same way
   findUser/telegram_link already trust it elsewhere in this
   codebase — it is NOT a new weaker link, but it is also not a
   real authentication boundary.

   What this DOES still guarantee, and why it's an improvement over
   trusting the browser's number outright:
     - The USD amount is always computed server-side from COINS_PER_USD
       (api/_lib/exchangeConfig.js), never accepted from the client.
     - The balance checked against is the last-synced "siteCoins"
       value in Sheets, not whatever the exchange form happens to send.
     - Coins are deducted server-side, atomically with request
       creation, in a single Apps Script execution (see
       exchange_create in Code.gs) — a user can't submit two requests
       against the same coins by racing the UI.
     - Exchange requests always land in "pending" for manual admin
       review before any real payout happens.
   A user tampering with DevTools still can't grant themselves coins
   they were never synced as having, or exchange more than their last
   known synced balance. Closing the remaining gap (someone forging
   sync-coins calls for an identifier they don't own) would require
   adding real server-side sessions for site accounts — a much larger
   change than this feature, flagged separately rather than silently
   "fixed" here.
   ============================================================ */

const Sheets = require("./_lib/sheets");
const TG = require("./_lib/telegram");
const { COINS_PER_USD, isValidExchangeAmount, coinsToUsd } = require("./_lib/exchangeConfig");

function escapeHtml(str) {
  return String(str == null ? "" : str).replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]));
}

function send(res, status, body) {
  return res.status(status).json(body);
}

function cleanIdentifier(v) {
  return typeof v === "string" ? v.trim().slice(0, 200) : "";
}

/* GET — public. */
async function handleRate(req, res) {
  if (req.method !== "GET") return send(res, 405, { ok: false, error: "Method not allowed" });
  return send(res, 200, { ok: true, coinsPerUsd: COINS_PER_USD });
}

/* POST — background sync of the client's local coin balance. */
async function handleSyncCoins(req, res) {
  if (req.method !== "POST") return send(res, 405, { ok: false, error: "Method not allowed" });

  const identifier = cleanIdentifier(req.body && req.body.identifier);
  const coins = Number(req.body && req.body.coins);

  if (!identifier) return send(res, 400, { ok: false, error: "identifier is required" });
  if (!Number.isFinite(coins) || coins < 0 || !Number.isInteger(coins)) {
    return send(res, 400, { ok: false, error: "coins must be a non-negative integer" });
  }
  // Sanity cap — nothing legitimate should sync a value this large.
  if (coins > 100000000) return send(res, 400, { ok: false, error: "coins value out of range" });

  const result = await Sheets.syncSiteCoins(identifier, coins);
  if (!result.ok) return send(res, 502, { ok: false, error: result.error || "Sync failed" });
  return send(res, 200, { ok: true });
}

/* GET — a user's own exchange history. */
async function handleHistory(req, res) {
  if (req.method !== "GET") return send(res, 405, { ok: false, error: "Method not allowed" });

  const identifier = cleanIdentifier((req.query && req.query.identifier) || "");
  if (!identifier) return send(res, 400, { ok: false, error: "identifier is required" });

  const result = await Sheets.myExchangeHistory(identifier);
  if (!result.ok) return send(res, 502, { ok: false, error: result.error || "Could not load history" });
  return send(res, 200, { ok: true, requests: result.requests || [] });
}

/* POST — submit a new exchange request. Server re-validates everything;
   the client's numbers are only ever used as a starting guess. */
async function handleCreate(req, res) {
  if (req.method !== "POST") return send(res, 405, { ok: false, error: "Method not allowed" });

  const body = req.body || {};
  const identifier = cleanIdentifier(body.identifier);
  const coins = Number(body.coins);
  const paymentMethod = typeof body.paymentMethod === "string" ? body.paymentMethod.trim().slice(0, 60) : "";
  const payoutDetails = typeof body.payoutDetails === "string" ? body.payoutDetails.trim().slice(0, 300) : "";
  const username = typeof body.username === "string" ? body.username.trim().slice(0, 120) : "";
  const email = typeof body.email === "string" ? body.email.trim().slice(0, 200) : "";

  if (!identifier) return send(res, 400, { ok: false, error: "identifier is required" });
  if (!isValidExchangeAmount(coins)) {
    return send(res, 400, { ok: false, error: `coins must be a whole number of at least ${COINS_PER_USD}` });
  }
  if (!paymentMethod) return send(res, 400, { ok: false, error: "paymentMethod is required" });
  if (!payoutDetails) return send(res, 400, { ok: false, error: "payoutDetails is required" });

  const result = await Sheets.createExchangeRequest({
    identifier,
    coins,
    paymentMethod,
    payoutDetails,
    username,
    email,
  });

  if (!result.ok) {
    const status = result.error === "insufficient_coins" || result.error === "not_found" ? 400 : 502;
    return send(res, status, { ok: false, error: result.error || "Could not create exchange request" });
  }

  // Best-effort admin-channel notification — never blocks the response.
  if (process.env.TELEGRAM_CHAT_ID && result.request) {
    const r = result.request;
    TG.sendMessage(
      process.env.TELEGRAM_CHAT_ID,
      `💱 <b>New Exchange Request</b>\n${escapeHtml(username || email || identifier)}\n🪙 ${coins} coins → $${coinsToUsd(coins).toFixed(2)}\nMethod: ${escapeHtml(paymentMethod)}\nRequest: ${escapeHtml(r.requestId || "")}`
    ).catch(() => {});
  }

  return send(res, 201, { ok: true, request: result.request });
}

/* ------------------------------------------------------------
   Router
   ------------------------------------------------------------ */
module.exports = async (req, res) => {
  res.setHeader("Cache-Control", "no-store");

  const action = (req.query && req.query.action) || (req.body && req.body.action);

  try {
    switch (action) {
      case "rate":
        return await handleRate(req, res);
      case "sync-coins":
        return await handleSyncCoins(req, res);
      case "history":
        return await handleHistory(req, res);
      case "create":
        return await handleCreate(req, res);
      default:
        return send(res, 400, { ok: false, error: "Unknown or missing action" });
    }
  } catch (err) {
    console.error(`exchange.js action=${action} failed:`, err);
    return send(res, 500, { ok: false, error: "Internal server error" });
  }
};