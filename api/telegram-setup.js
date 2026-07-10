/* ============================================================
   Pixel&Games — one-time webhook registration helper
   Visit this URL once after deploying (with the correct secret)
   to point your bot at /api/telegram-webhook. See
   TELEGRAM_BOT_SETUP.md for the full walkthrough.

   GET /api/telegram-setup?secret=YOUR_SETUP_SECRET
   ============================================================ */

const TG = require("./_lib/telegram");

module.exports = async (req, res) => {
  console.log("SETUP_SECRET =", process.env.SETUP_SECRET);
  console.log("provided =", req.query?.secret);
  const setupSecret = process.env.SETUP_SECRET;
  if (!setupSecret) {
    return res
      .status(500)
      .json({ error: "SETUP_SECRET is not configured on the server" });
  }
  const provided = req.query && req.query.secret;

  return res.status(200).json({
    setupSecret,
    provided,
  });

  const siteUrl = process.env.SITE_PUBLIC_URL; // e.g. https://your-project.vercel.app
  if (!siteUrl) {
    return res
      .status(500)
      .json({ error: "SITE_PUBLIC_URL is not configured on the server" });
  }

  const webhookUrl = `${siteUrl.replace(/\/$/, "")}/api/telegram-webhook`;
  const webhookSecret = process.env.TELEGRAM_WEBHOOK_SECRET || "";

  const result = await TG.setWebhook(webhookUrl, webhookSecret);
  const info = await TG.getWebhookInfo();

  res
    .status(200)
    .json({ setWebhookResult: result, webhookInfo: info, webhookUrl });
};
