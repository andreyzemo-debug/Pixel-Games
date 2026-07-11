/* ============================================================
   Pixel&Games — Admin login
   POST /api/admin/login
   Body: the raw object the Telegram Login Widget callback gives
   you (id, first_name, username, photo_url, auth_date, hash...).

   1) Verifies the Telegram HMAC signature (proves the payload
      really came from Telegram and wasn't tampered with).
   2) Confirms the Telegram id matches TELEGRAM_ADMIN_ID — the
      SAME env var that already gates the bot's admin menu.
   3) Issues a short-lived, HttpOnly, signed session cookie.
   ============================================================ */

const { verifyTelegramLogin } = require("../_lib/telegramAuth");
const { createSessionToken, setSessionCookie } = require("../_lib/adminAuth");

module.exports = async (req, res) => {
  res.setHeader("Cache-Control", "no-store");

  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  const adminId = String(process.env.TELEGRAM_ADMIN_ID || "");
  if (!adminId) {
    return res.status(500).json({ ok: false, error: "TELEGRAM_ADMIN_ID is not configured on the server" });
  }
  if (!process.env.ADMIN_SESSION_SECRET) {
    return res.status(500).json({ ok: false, error: "ADMIN_SESSION_SECRET is not configured on the server" });
  }

  const data = req.body || {};

  if (!verifyTelegramLogin(data)) {
    return res.status(401).json({ ok: false, error: "Invalid Telegram login payload" });
  }

  if (String(data.id) !== adminId) {
    // Valid Telegram login, but not the configured admin — deny.
    return res.status(403).json({ ok: false, error: "This Telegram account is not authorized as admin" });
  }

  const token = createSessionToken(data.id, {
    name: data.first_name || data.username || "Admin",
    username: data.username || null,
  });
  setSessionCookie(res, token);

  return res.status(200).json({
    ok: true,
    admin: { id: data.id, name: data.first_name || data.username || "Admin", username: data.username || null },
  });
};