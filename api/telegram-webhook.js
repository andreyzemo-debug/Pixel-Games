/* ============================================================
   Pixel&Games — Telegram webhook endpoint
   Telegram POSTs every update (message, button tap, etc.) here.
   Verifies the secret token Telegram sends back (set via
   /api/telegram-setup) so random requests to this URL can't
   pretend to be Telegram, then hands off to api/_lib/bot.js.
   ============================================================ */

const { handleUpdate } = require("./_lib/bot");

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const expectedSecret = process.env.TELEGRAM_WEBHOOK_SECRET;
  if (expectedSecret) {
    const gotSecret = req.headers["x-telegram-bot-api-secret-token"];

    if (gotSecret !== expectedSecret) {
      // Do NOT echo the expected/received secret back in the response
      // or to logs — doing so lets anyone who hits this URL read the
      // webhook secret and then spoof Telegram updates with it.
      return res.status(401).json({ ok: false, error: "Unauthorized" });
    }
  }

  try {
    await handleUpdate(req.body || {});
  } catch (err) {
    // Telegram retries on non-2xx, so log and still return 200 —
    // one bad update should never wedge the webhook.
    console.error("Telegram webhook error:", err);
  }

  res.status(200).json({ ok: true });
};