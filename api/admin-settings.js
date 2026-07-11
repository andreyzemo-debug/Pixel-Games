/* ============================================================
   Pixel&Games — Admin: settings viewer
   GET /api/admin/settings
   Read-only. Shows WHICH environment variables are configured
   without ever exposing secret values (tokens, URLs with
   embedded secrets, etc. are masked to their last 4 chars).
   ============================================================ */

const { requireAdmin } = require("../_lib/adminAuth");

function mask(value) {
  if (!value) return null;
  const str = String(value);
  if (str.length <= 4) return "••••";
  return `••••••${str.slice(-4)}`;
}

module.exports = async (req, res) => {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "GET") {
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }
  if (!requireAdmin(req, res)) return;

  const env = process.env;

  return res.status(200).json({
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
};