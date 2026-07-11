/* ============================================================
   Pixel&Games — Admin: news / announcements
   GET    /api/admin/news            -> list
   POST   /api/admin/news            -> create  { item }
   PUT    /api/admin/news            -> update  { id, item }
   DELETE /api/admin/news?id=...     -> delete

   Persisted in the Sheet's "News" tab (Apps Script appendix).
   Separate from the bot's own static NEWS array in
   api/_lib/bot.js — that array is left untouched so the bot's
   existing 📰 News button keeps working with zero risk either
   way. Point the bot at this feed later if you want one source
   of truth; see the writeup for how.
   ============================================================ */

const { requireAdmin } = require("../_lib/adminAuth");
const Sheets = require("../_lib/sheets");

function validateNews(item) {
  if (!item || typeof item !== "object") return "item object is required";
  if (!item.title || typeof item.title !== "string") return "title is required";
  if (!item.body || typeof item.body !== "string") return "body is required";
  return null;
}

module.exports = async (req, res) => {
  res.setHeader("Cache-Control", "no-store");
  if (!requireAdmin(req, res)) return;

  if (req.method === "GET") {
    const result = await Sheets.listNews();
    if (!result.ok) return res.status(502).json({ ok: false, error: result.error || "Could not load news" });
    return res.status(200).json({ ok: true, news: result.news });
  }

  if (req.method === "POST") {
    const { item } = req.body || {};
    const err = validateNews(item);
    if (err) return res.status(400).json({ ok: false, error: err });

    const result = await Sheets.addNews(item);
    if (!result.ok) return res.status(502).json({ ok: false, error: result.error || "Could not add news item" });
    return res.status(201).json({ ok: true, item: result.item });
  }

  if (req.method === "PUT") {
    const { id, item } = req.body || {};
    if (!id) return res.status(400).json({ ok: false, error: "id is required" });
    const err = validateNews(item);
    if (err) return res.status(400).json({ ok: false, error: err });

    const result = await Sheets.updateNews(id, item);
    if (!result.ok) return res.status(502).json({ ok: false, error: result.error || "Could not update news item" });
    return res.status(200).json({ ok: true });
  }

  if (req.method === "DELETE") {
    const id = (req.query && req.query.id) || (req.body && req.body.id);
    if (!id) return res.status(400).json({ ok: false, error: "id is required" });

    const result = await Sheets.deleteNews(id);
    if (!result.ok) return res.status(502).json({ ok: false, error: result.error || "Could not delete news item" });
    return res.status(200).json({ ok: true });
  }

  return res.status(405).json({ ok: false, error: "Method not allowed" });
};