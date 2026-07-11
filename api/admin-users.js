/* ============================================================
   Pixel&Games — Admin: users
   GET  /api/admin/users?search=term       -> list/search users
   POST /api/admin/users  {action, identifier} -> ban/unban/delete
     action: "ban" | "unban" | "delete"
     identifier: the user's email or userId (as stored in Sheets)
   ============================================================ */

const { requireAdmin } = require("../_lib/adminAuth");
const Sheets = require("../_lib/sheets");

module.exports = async (req, res) => {
  res.setHeader("Cache-Control", "no-store");
  if (!requireAdmin(req, res)) return;

  if (req.method === "GET") {
    const search = (req.query && req.query.search) || "";
    const limit = Math.min(parseInt((req.query && req.query.limit) || "200", 10) || 200, 500);

    const result = await Sheets.adminListUsers(search, limit);
    if (!result.ok) {
      return res.status(502).json({ ok: false, error: result.error || "Could not load users" });
    }
    return res.status(200).json({ ok: true, users: result.users });
  }

  if (req.method === "POST") {
    const { action, identifier } = req.body || {};

    if (!identifier || typeof identifier !== "string") {
      return res.status(400).json({ ok: false, error: "identifier is required" });
    }
    if (!["ban", "unban", "delete"].includes(action)) {
      return res.status(400).json({ ok: false, error: "action must be ban, unban, or delete" });
    }

    let result;
    if (action === "ban") result = await Sheets.adminBanUser(identifier);
    if (action === "unban") result = await Sheets.adminUnbanUser(identifier);
    if (action === "delete") result = await Sheets.adminDeleteUser(identifier);

    if (!result.ok) {
      return res.status(502).json({ ok: false, error: result.error || "Action failed" });
    }
    return res.status(200).json({ ok: true });
  }

  return res.status(405).json({ ok: false, error: "Method not allowed" });
};