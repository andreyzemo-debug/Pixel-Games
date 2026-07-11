/* ============================================================
   Pixel&Games — Admin dashboard stats
   GET /api/admin/stats
   Combines Google Sheets stats with live Telegram bot status
   and a merged "latest activity" feed (recent users + visitors).
   ============================================================ */

const { requireAdmin } = require("../_lib/adminAuth");
const Sheets = require("../_lib/sheets");
const TG = require("../_lib/telegram");

module.exports = async (req, res) => {
  res.setHeader("Cache-Control", "no-store");

  if (req.method !== "GET") {
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }
  if (!requireAdmin(req, res)) return;

  const [stats, webhookInfo, recentUsers, recentVisitors] = await Promise.all([
    Sheets.stats(),
    TG.getWebhookInfo().catch(() => ({ ok: false })),
    Sheets.recentUsers(8),
    Sheets.recentVisitors(8),
  ]);

  const botConfigured = Boolean(process.env.TELEGRAM_BOT_TOKEN);
  const botStatus = {
    configured: botConfigured,
    webhookSet: Boolean(webhookInfo && webhookInfo.ok && webhookInfo.result && webhookInfo.result.url),
    webhookUrl: (webhookInfo && webhookInfo.ok && webhookInfo.result && webhookInfo.result.url) || null,
    pendingUpdateCount:
      (webhookInfo && webhookInfo.ok && webhookInfo.result && webhookInfo.result.pending_update_count) ?? null,
    lastErrorMessage:
      (webhookInfo && webhookInfo.ok && webhookInfo.result && webhookInfo.result.last_error_message) || null,
  };

  const activity = []
    .concat(
      (recentUsers.ok ? recentUsers.users : []).map((u) => ({
        type: "registration",
        label: u.username || u.email || "New user",
        detail: [u.account, u.country].filter(Boolean).join(" · "),
        date: u.date || null,
      })),
      (recentVisitors.ok ? recentVisitors.visitors : []).map((v) => ({
        type: "visit",
        label: [v.country, v.city].filter(Boolean).join(", ") || "Visitor",
        detail: [v.browser, v.os].filter(Boolean).join(" / "),
        date: [v.date, v.time].filter(Boolean).join(" "),
      }))
    )
    .filter((a) => a.date)
    .sort((a, b) => String(b.date).localeCompare(String(a.date)))
    .slice(0, 12);

  return res.status(200).json({
    ok: true,
    stats: stats.ok
      ? {
          totalUsers: stats.totalUsers,
          premiumUsers: stats.premiumUsers,
          freeUsers: stats.freeUsers,
          linkedUsers: stats.linkedUsers,
          totalVisitors: stats.totalVisitors,
          todayUsers: stats.todayUsers,
          todayVisitors: stats.todayVisitors,
          onlineNow: stats.onlineNow,
          topCountry: stats.topCountry,
          topBrowser: stats.topBrowser,
          topOS: stats.topOS,
        }
      : null,
    statsError: stats.ok ? null : stats.error || "unavailable",
    bot: botStatus,
    activity,
  });
};