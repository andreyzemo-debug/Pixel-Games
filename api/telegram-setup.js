/* ============================================================
   Pixel&Games — one-time webhook registration helper
   Visit this URL once after deploying (with the correct secret)
   to point your bot at /api/telegram-webhook.

   GET /api/telegram-setup?secret=YOUR_SETUP_SECRET
   ============================================================ */

const TG = require("./_lib/telegram");

module.exports = async (req, res) => {
  // Make sure nothing ever caches this response.
  res.setHeader("Cache-Control", "no-store");

  const setupSecret = process.env.SETUP_SECRET;

  if (!setupSecret) {
    return res.status(500).json({
      error: "SETUP_SECRET is not configured on the server",
    });
  }

  const provided = req.query && req.query.secret;

  if (!provided || provided !== setupSecret) {
    return res.status(401).json({
      error: "Invalid or missing ?secret=",
    });
  }

  const siteUrl = process.env.SITE_PUBLIC_URL;

  if (!siteUrl) {
    return res.status(500).json({
      error: "SITE_PUBLIC_URL is not configured on the server",
    });
  }

  const webhookUrl = `${siteUrl.replace(/\/$/, "")}/api/telegram-webhook`;
  const webhookSecret = process.env.TELEGRAM_WEBHOOK_SECRET || "";

  try {
    const result = await TG.setWebhook(webhookUrl, webhookSecret);
    const info = await TG.getWebhookInfo();

    return res.status(200).json({
      ok: true,
      setWebhookResult: result,
      webhookInfo: info,
      webhookUrl,
    });
  } catch (err) {
    return res.status(500).json({
      ok: false,
      error: err.message,
    });
  }
};