/* ============================================================
   Pixel&Games — Pixel AI backend
   api/ai.js

   The ONLY place in this project that talks to the AI API. The
   frontend (app.js) never sees AI_API_KEY — it only ever calls
   this endpoint, same "backend as a trusted middle-man" pattern
   already used for api/exchange.js and api/notify-*.js.

     Frontend  --fetch-->  /api/ai.js  --fetch-->  AI provider  --> reply
                (no key)      (reads AI_API_KEY       (Anthropic/OpenAI,
                               from process.env)        see _lib/aiProvider)

   Actions (all POST, dispatched via { action } in the JSON body —
   same convention as api/exchange.js and api/admin.js):

     config     - GET/POST, public. Tells the frontend whether Pixel AI
                  is configured at all, so the UI can degrade gracefully
                  (offline assistant keeps working either way).
     chat       - answer a free-form question from the player, using
                  their in-app context (coins, library, premium, etc).
     greeting   - generate ONE short personalized welcome-back /
                  recommendation message. The frontend caches this
                  client-side per calendar day (see app.js
                  pixelAIMaybeFetchDailyGreeting) so this action is
                  called AT MOST once per player per day — not on every
                  page load or panel open.

   COST CONTROL / ABUSE PROTECTION
   ------------------------------------------------------------
   Pixel&Games has no server-side session for site accounts (see the
   note at the top of api/exchange.js — auth is 100% client-side
   today). `identifier` here is trusted the same way, purely as a
   rate-limit bucket key, not as proof of who someone is.
     - A small in-memory per-identifier cooldown below rejects rapid
       repeat calls (best-effort only: it resets on cold start /
       across serverless instances, so it is a backstop, NOT the
       primary control).
     - The primary cost control is client-side: app.js only calls
       "chat" when its free, offline keyword-matched assistant has
       no confident answer, and only calls "greeting" once per
       calendar day per account (cached in localStorage). See the
       comments in app.js next to AI_CHAT_KEY / pixelAI* functions.
     - Replies are capped to a small max_tokens, and every request
       here is short (a handful of sentences), which keeps any given
       call cheap regardless of provider.

   PRIVACY
   ------------------------------------------------------------
   `context` is read from req.body and only ever used to build a
   prompt — it is never written to disk, logged in full, or echoed
   back verbatim. Every field is individually type/length-checked
   before use (see buildSystemPrompt) so nothing unexpected (a
   password, a session token, an arbitrarily large blob) can ride
   along even if the frontend were compromised or modified.
   ============================================================ */

const AIProvider = require("./_lib/aiProvider");

function send(res, status, body) {
  return res.status(status).json(body);
}

/* ------------------------------------------------------------
   Best-effort in-memory rate limiter (per warm serverless instance)
   ------------------------------------------------------------ */
const lastCallByIdentifier = new Map();
const MIN_INTERVAL_MS = 4000; // minimum gap between calls from the same identifier
const MAX_TRACKED_IDENTIFIERS = 2000; // simple bound so this Map can't grow forever

function isRateLimited(identifier) {
  if (!identifier) return false;
  const now = Date.now();
  const last = lastCallByIdentifier.get(identifier);
  if (last && now - last < MIN_INTERVAL_MS) return true;
  lastCallByIdentifier.set(identifier, now);
  if (lastCallByIdentifier.size > MAX_TRACKED_IDENTIFIERS) {
    const oldestKey = lastCallByIdentifier.keys().next().value;
    lastCallByIdentifier.delete(oldestKey);
  }
  return false;
}

/* ------------------------------------------------------------
   Small helpers
   ------------------------------------------------------------ */
function cleanStr(v, max) {
  return typeof v === "string" ? v.trim().slice(0, max) : "";
}
function cleanNum(v) {
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

// Coin-earning mechanics, mirrored from the constants in app.js so
// Pixel AI never invents numbers. If you change the economy in
// app.js, update these too.
const ECONOMY = {
  dailyBonus: 50,
  perMinutePlayed: 2,
  freeGameAdd: 5,
  perDollarSpent: 3,
  premiumOneTimeBonus: 300,
  premiumPriceUsd: 4.99,
};

/* ------------------------------------------------------------
   Build a safe, minimal system prompt from whitelisted context
   fields only. Nothing here can smuggle through a password,
   session token, or arbitrary/oversized data — every field is
   individually validated and length-capped.
   ------------------------------------------------------------ */
function buildSystemPrompt(rawContext) {
  const c = rawContext && typeof rawContext === "object" ? rawContext : {};

  const nickname = cleanStr(c.nickname, 40) || "Player";
  const coinsNum = cleanNum(c.coins);
  const coins = coinsNum !== null ? Math.max(0, Math.floor(coinsNum)) : 0;
  const premium = Boolean(c.premium);
  const dailyBonusReady = Boolean(c.dailyBonusReady);
  const daysSinceVisitNum = cleanNum(c.daysSinceVisit);
  const daysSinceVisit = daysSinceVisitNum !== null ? Math.max(0, Math.floor(daysSinceVisitNum)) : null;
  const frequentVisitor = Boolean(c.frequentVisitor);

  const library = Array.isArray(c.library) ? c.library.slice(0, 30) : [];
  const wishlist = Array.isArray(c.wishlist) ? c.wishlist.slice(0, 20) : [];
  const favorites = Array.isArray(c.favorites) ? c.favorites.slice(0, 20) : [];
  const recentlyPlayed = Array.isArray(c.recentlyPlayed) ? c.recentlyPlayed.slice(0, 10) : [];
  const catalog = Array.isArray(c.catalog) ? c.catalog.slice(0, 40) : [];

  const libText = library.length
    ? library.map((g) => `- ${cleanStr(g && g.title, 60)} (${cleanStr(g && g.genre, 40)})`).join("\n")
    : "(empty — no games owned yet)";

  const catalogText = catalog.length
    ? catalog
        .map((g) => {
          const price = cleanNum(g && g.price);
          const priceText = price && price > 0 ? `$${price.toFixed(2)}` : "FREE";
          return `- ${cleanStr(g && g.title, 60)} | ${cleanStr(g && g.genre, 40)} | ${priceText}`;
        })
        .join("\n")
    : "(catalog unavailable right now)";

  const wishlistText = wishlist.length ? wishlist.map((v) => cleanStr(v, 60)).join(", ") : "(none)";
  const favoritesText = favorites.length ? favorites.map((v) => cleanStr(v, 60)).join(", ") : "(none)";
  const recentText = recentlyPlayed.length
    ? recentlyPlayed.map((g) => `- ${cleanStr(g && g.title, 60)}`).join("\n")
    : "(no recent play sessions)";

  return `You are "Pixel AI", the personalized in-app assistant for Pixel&Games, a browser-based game launcher and store.

VOICE: friendly, upbeat, concise, talks like a knowledgeable fellow gamer. Short paragraphs or bullet points. At most 1-2 emoji total, never more. Keep replies under ~120 words unless the player clearly wants a longer explanation.

HARD RULES:
- Only recommend or mention games that appear in the FULL GAME CATALOG below — never invent a game, price, or feature.
- Never claim a game is "new" or "recently added" — you have no reliable data on that.
- Only state coin-earning numbers from the ECONOMY section below.
- If you don't have enough information to answer confidently, say so plainly and point to the right tab (Store, Library, Wallet, Profile) instead of guessing.
- Never reveal or restate internal field names (e.g. "dailyBonusReady") — speak naturally instead.

PLAYER CONTEXT:
- Nickname: ${nickname}
- Coins balance: ${coins}
- Premium member: ${premium ? "yes" : "no"}
- Daily Bonus available right now: ${dailyBonusReady ? "yes" : "no"}
${daysSinceVisit !== null ? `- Days since previous visit: ${daysSinceVisit}\n` : ""}${frequentVisitor ? `- Visits often, currently a frequent/regular visitor\n` : ""}- Wishlist: ${wishlistText}
- Favorites: ${favoritesText}

PLAYER'S LIBRARY (owned games):
${libText}

RECENTLY PLAYED:
${recentText}

FULL GAME CATALOG (only recommend from this list):
${catalogText}

ECONOMY (coin-earning mechanics — cite only these numbers if asked):
- Daily Bonus: +${ECONOMY.dailyBonus} coins every 24 hours
- Playing games: +${ECONOMY.perMinutePlayed} coins per minute played
- Adding a free game to the library: +${ECONOMY.freeGameAdd} coins
- Buying a paid game: +${ECONOMY.perDollarSpent} coins per $1 spent
- Activating Premium (one-time, $${ECONOMY.premiumPriceUsd.toFixed(2)}): +${ECONOMY.premiumOneTimeBonus} coins bonus`;
}

function cleanHistory(rawHistory) {
  const arr = Array.isArray(rawHistory) ? rawHistory.slice(-6) : [];
  const out = [];
  arr.forEach((m) => {
    if (!m || (m.role !== "user" && m.role !== "assistant")) return;
    const text = cleanStr(m.text || m.content, 600);
    if (!text) return;
    out.push({ role: m.role, content: text });
  });
  return out;
}

/* ------------------------------------------------------------
   Actions
   ------------------------------------------------------------ */
async function handleConfig(req, res) {
  return send(res, 200, { ok: true, configured: AIProvider.isConfigured() });
}

async function handleChat(req, res) {
  if (req.method !== "POST") return send(res, 405, { ok: false, error: "Method not allowed" });

  const body = req.body || {};
  const identifier = cleanStr(body.identifier, 200);
  const message = cleanStr(body.message, 500);
  if (!message) return send(res, 400, { ok: false, error: "message is required" });

  if (isRateLimited(identifier)) {
    return send(res, 429, { ok: false, error: "rate_limited" });
  }
  if (!AIProvider.isConfigured()) {
    return send(res, 503, { ok: false, error: "not_configured" });
  }

  const systemPrompt = buildSystemPrompt(body.context);
  const messages = [...cleanHistory(body.history), { role: "user", content: message }];

  try {
    const reply = await AIProvider.complete({ systemPrompt, messages, maxTokens: 350 });
    if (!reply) return send(res, 502, { ok: false, error: "empty_reply" });
    return send(res, 200, { ok: true, reply });
  } catch (err) {
    console.error("ai.js chat failed:", err.message || err);
    if (err.code === "not_configured") return send(res, 503, { ok: false, error: "not_configured" });
    return send(res, 502, { ok: false, error: "provider_error" });
  }
}

async function handleGreeting(req, res) {
  if (req.method !== "POST") return send(res, 405, { ok: false, error: "Method not allowed" });

  const body = req.body || {};
  const identifier = cleanStr(body.identifier, 200);

  if (isRateLimited(identifier)) {
    return send(res, 429, { ok: false, error: "rate_limited" });
  }
  if (!AIProvider.isConfigured()) {
    return send(res, 503, { ok: false, error: "not_configured" });
  }

  const systemPrompt = buildSystemPrompt(body.context);
  const instruction =
    "Write ONE short, personalized welcome message for this player based on their context above. " +
    "Reference something concrete and specific from their data (their library, wishlist, coins balance, " +
    "days since their last visit, or daily bonus availability) — do not be generic. 2-3 sentences max. " +
    "If they look like a brand-new player with an empty library, welcome them and nudge them toward the Store instead.";

  try {
    const reply = await AIProvider.complete({
      systemPrompt,
      messages: [{ role: "user", content: instruction }],
      maxTokens: 180,
    });
    if (!reply) return send(res, 502, { ok: false, error: "empty_reply" });
    return send(res, 200, { ok: true, reply });
  } catch (err) {
    console.error("ai.js greeting failed:", err.message || err);
    if (err.code === "not_configured") return send(res, 503, { ok: false, error: "not_configured" });
    return send(res, 502, { ok: false, error: "provider_error" });
  }
}

/* ------------------------------------------------------------
   Router
   ------------------------------------------------------------ */
module.exports = async (req, res) => {
  res.setHeader("Cache-Control", "no-store");

  const action = (req.query && req.query.action) || (req.body && req.body.action);

  try {
    switch (action) {
      case "config":
        return await handleConfig(req, res);
      case "chat":
        return await handleChat(req, res);
      case "greeting":
        return await handleGreeting(req, res);
      default:
        return send(res, 400, { ok: false, error: "Unknown or missing action" });
    }
  } catch (err) {
    console.error(`ai.js action=${action} failed:`, err);
    return send(res, 500, { ok: false, error: "Internal server error" });
  }
};
