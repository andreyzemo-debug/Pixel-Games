/* ============================================================
   Pixel&Games — Admin: broadcast
   POST /api/admin/broadcast  { message }
   Sends an announcement to every linked player directly (no
   Telegram-side confirm step — the confirmation dialog lives in
   the dashboard UI instead). Reuses the same "linked players"
   list the bot's /broadcast command already uses.
   ============================================================ */

const { requireAdmin } = require("../_lib/adminAuth");
const Sheets = require("../_lib/sheets");
const TG = require("../_lib/telegram");

const SEND_CAP = 200; // stay well within a single serverless invocation

module.exports = async (req, res) => {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }
  if (!requireAdmin(req, res)) return;

  const message = String((req.body && req.body.message) || "").trim();
  if (!message) {
    return res.status(400).json({ ok: false, error: "message is required" });
  }
  if (message.length > 3500) {
    return res.status(400).json({ ok: false, error: "message is too long (max 3500 characters)" });
  }

  const idsRes = await Sheets.allTelegramIds();
  if (!idsRes.ok) {
    return res.status(502).json({ ok: false, error: "Could not load recipient list" });
  }
  const ids = idsRes.ids || [];
  const escaped = message.replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]));

  let sent = 0;
  let failed = 0;
  for (const id of ids.slice(0, SEND_CAP)) {
    try {
      const result = await TG.sendMessage(id, `📢 <b>Pixel&Games</b>\n\n${escaped}`);
      if (result && result.ok) sent++;
      else failed++;
    } catch {
      failed++;
    }
  }

  return res.status(200).json({
    ok: true,
    sent,
    failed,
    total: ids.length,
    capped: ids.length > SEND_CAP,
  });
};