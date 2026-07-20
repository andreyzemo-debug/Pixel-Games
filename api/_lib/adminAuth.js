/* ============================================================
   Pixel&Games — Admin session helper
   Stateless, HMAC-signed session cookie. No database/session
   store needed (fits the serverless/Vercel deployment model).
   ============================================================ */

const crypto = require("crypto");

const COOKIE_NAME = "admin_session";
const SESSION_TTL_SECONDS = 12 * 60 * 60; // 12 hours

function getSecret() {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) {
    throw new Error("ADMIN_SESSION_SECRET is not configured on the server");
  }
  return secret;
}

function b64url(input) {
  return Buffer.from(input)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function b64urlDecode(input) {
  const pad = input.length % 4 === 0 ? "" : "=".repeat(4 - (input.length % 4));
  const base64 = input.replace(/-/g, "+").replace(/_/g, "/") + pad;
  return Buffer.from(base64, "base64").toString("utf8");
}

function sign(payloadB64, secret) {
  return b64url(crypto.createHmac("sha256", secret).update(payloadB64).digest());
}

function createSessionToken(adminId, extra = {}) {
  const secret = getSecret();
  const payload = {
    id: String(adminId),
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS,
    ...extra,
  };
  const payloadB64 = b64url(JSON.stringify(payload));
  const sig = sign(payloadB64, secret);
  return `${payloadB64}.${sig}`;
}

function verifySessionTokenDetailed(token) {
  if (!token || typeof token !== "string") return { payload: null, reason: "no_cookie" };
  if (!token.includes(".")) return { payload: null, reason: "malformed" };

  let secret;
  try {
    secret = getSecret();
  } catch {
    return { payload: null, reason: "no_secret" };
  }

  const [payloadB64, sig] = token.split(".");
  if (!payloadB64 || !sig) return { payload: null, reason: "malformed" };

  const expectedSig = sign(payloadB64, secret);
  const a = Buffer.from(sig);
  const b = Buffer.from(expectedSig);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
    return { payload: null, reason: "bad_signature" };
  }

  let payload;
  try {
    payload = JSON.parse(b64urlDecode(payloadB64));
  } catch {
    return { payload: null, reason: "malformed" };
  }

  if (!payload || typeof payload.exp !== "number") return { payload: null, reason: "malformed" };
  if (Math.floor(Date.now() / 1000) > payload.exp) return { payload: null, reason: "expired" };

  const adminId = String(process.env.TELEGRAM_ADMIN_ID || "");
  if (!adminId) return { payload: null, reason: "no_admin_id_env" };
  if (payload.id !== adminId) return { payload: null, reason: "admin_id_mismatch" };

  return { payload, reason: null };
}

// Kept for existing callers (requireAdmin, etc.) — same behavior as before.
function verifySessionToken(token) {
  return verifySessionTokenDetailed(token).payload;
}

function setSessionCookie(res, token) {
  res.setHeader(
    "Set-Cookie",
    `${COOKIE_NAME}=${encodeURIComponent(token)}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=${SESSION_TTL_SECONDS}`
  );
}

function clearSessionCookie(res) {
  res.setHeader(
    "Set-Cookie",
    `${COOKIE_NAME}=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0`
  );
}

/* ------------------------------------------------------------
   readSession(req)
   Reads the admin_session cookie from the incoming request and
   returns the verified session payload, or null if missing,
   malformed, expired, tampered, or not the configured admin.
   ------------------------------------------------------------ */
function readSession(req) {
  return readSessionDetailed(req).payload;
}

function readSessionDetailed(req) {
  const header = (req.headers && req.headers.cookie) || "";
  let token = null;
  header.split(";").some((pair) => {
    const idx = pair.indexOf("=");
    if (idx === -1) return false;
    const key = pair.slice(0, idx).trim();
    if (key === COOKIE_NAME) {
      token = decodeURIComponent(pair.slice(idx + 1).trim());
      return true;
    }
    return false;
  });
  return verifySessionTokenDetailed(token);
}

/* ------------------------------------------------------------
   requireAdmin(req, res)
   Guard used by every protected admin action:
     const admin = requireAdmin(req, res);
     if (!admin) return; // 401 response already sent
   Returns the session object on success.
   ------------------------------------------------------------ */
function requireAdmin(req, res) {
  const session = readSession(req);
  if (!session) {
    res.status(401).json({ ok: false, error: "unauthorized" });
    return null;
  }
  return session;
}

module.exports = {
  COOKIE_NAME,
  SESSION_TTL_SECONDS,
  createSessionToken,
  verifySessionToken,
  verifySessionTokenDetailed,
  setSessionCookie,
  clearSessionCookie,
  readSession,
  readSessionDetailed,
  requireAdmin,
};