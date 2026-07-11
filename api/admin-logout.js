/* ============================================================
   Pixel&Games — Admin logout
   POST /api/admin/logout — clears the admin session cookie.
   ============================================================ */

const { clearSessionCookie } = require("../_lib/adminAuth");

module.exports = async (req, res) => {
  res.setHeader("Cache-Control", "no-store");

  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  clearSessionCookie(res);
  return res.status(200).json({ ok: true });
};