/* ============================================================
   Pixel&Games — Admin: games catalog
   GET    /api/admin/games            -> list
   POST   /api/admin/games            -> create  { game }
   PUT    /api/admin/games            -> update  { id, game }
   DELETE /api/admin/games?id=...     -> delete

   Persisted in the same Google Sheet the rest of the backend
   already uses (see the "Games" tab added in the Apps Script
   appendix). This is a management store for the catalog data;
   see the integration note in the writeup for wiring it into
   the public Store page.
   ============================================================ */

const { requireAdmin } = require("../_lib/adminAuth");
const Sheets = require("../_lib/sheets");

function validateGame(game) {
  if (!game || typeof game !== "object") return "game object is required";
  if (!game.title || typeof game.title !== "string") return "title is required";
  if (game.price !== undefined && game.price !== null && isNaN(Number(game.price))) return "price must be a number";
  return null;
}

module.exports = async (req, res) => {
  res.setHeader("Cache-Control", "no-store");
  if (!requireAdmin(req, res)) return;

  if (req.method === "GET") {
    const result = await Sheets.listGames();
    if (!result.ok) return res.status(502).json({ ok: false, error: result.error || "Could not load games" });
    return res.status(200).json({ ok: true, games: result.games });
  }

  if (req.method === "POST") {
    const { game } = req.body || {};
    const err = validateGame(game);
    if (err) return res.status(400).json({ ok: false, error: err });

    const result = await Sheets.addGame(game);
    if (!result.ok) return res.status(502).json({ ok: false, error: result.error || "Could not add game" });
    return res.status(201).json({ ok: true, game: result.game });
  }

  if (req.method === "PUT") {
    const { id, game } = req.body || {};
    if (!id) return res.status(400).json({ ok: false, error: "id is required" });
    const err = validateGame(game);
    if (err) return res.status(400).json({ ok: false, error: err });

    const result = await Sheets.updateGame(id, game);
    if (!result.ok) return res.status(502).json({ ok: false, error: result.error || "Could not update game" });
    return res.status(200).json({ ok: true });
  }

  if (req.method === "DELETE") {
    const id = (req.query && req.query.id) || (req.body && req.body.id);
    if (!id) return res.status(400).json({ ok: false, error: "id is required" });

    const result = await Sheets.deleteGame(id);
    if (!result.ok) return res.status(502).json({ ok: false, error: result.error || "Could not delete game" });
    return res.status(200).json({ ok: true });
  }

  return res.status(405).json({ ok: false, error: "Method not allowed" });
};