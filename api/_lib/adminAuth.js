const crypto = require("crypto");

const SECRET = process.env.ADMIN_SESSION_SECRET;
const COOKIE_NAME = "admin_session";
const EXPIRES = 24 * 60 * 60 * 1000;

function createSessionToken(adminId, profile = {}) {
  const expires = Date.now() + EXPIRES;

  const payload = JSON.stringify({
    adminId,
    profile,
    expires,
  });

  const payload64 = Buffer.from(payload).toString("base64url");

  const signature = crypto
    .createHmac("sha256", SECRET)
    .update(payload64)
    .digest("hex");

  return `${payload64}.${signature}`;
}

function verifySessionToken(token) {
  if (!SECRET || !token) return null;

  const parts = token.split(".");
  if (parts.length !== 2) return null;

  const payload64 = parts[0];
  const signature = parts[1];

  const expected = crypto
    .createHmac("sha256", SECRET)
    .update(payload64)
    .digest("hex");

  if (signature !== expected) return null;

  const data = JSON.parse(
    Buffer.from(payload64, "base64url").toString("utf8")
  );

  if (Date.now() > data.expires) return null;

  return data;
}

function setSessionCookie(res, token) {
  res.setHeader(
    "Set-Cookie",
    `${COOKIE_NAME}=${token}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=86400`
  );
}

function clearSessionCookie(res) {
  res.setHeader(
    "Set-Cookie",
    `${COOKIE_NAME}=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0`
  );
}

module.exports = {
  createSessionToken,
  verifySessionToken,
  setSessionCookie,
  clearSessionCookie,
};