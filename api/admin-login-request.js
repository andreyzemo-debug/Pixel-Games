const crypto = require("crypto");
const TG = require("./_lib/telegram");
const Sheets = require("./_lib/sheets");

module.exports = async (req, res) => {
  res.setHeader("Cache-Control", "no-store");

  if (req.method !== "POST") {
    return res.status(405).json({
      ok: false,
      error: "Method not allowed",
    });
  }

  const adminId = process.env.TELEGRAM_ADMIN_ID;

  if (!adminId) {
    return res.status(500).json({
      ok: false,
      error: "TELEGRAM_ADMIN_ID is not configured",
    });
  }

  const code = String(
    crypto.randomInt(100000, 999999)
  );

  const save = await Sheets.createAdminLoginCode(
    adminId,
    code
  );

  if (!save.ok) {
    return res.status(500).json(save);
  }

  await TG.sendMessage(
    adminId,
`🔐 <b>Pixel&Games Admin Login</b>

Your login code:

<code>${code}</code>

The code expires in 5 minutes.`
  );

  return res.status(200).json({
    ok: true,
  });
};