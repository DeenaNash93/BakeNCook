const router = require("express").Router();
const pool = require("../config/db");

router.get("/health", (req, res) => {
  res.json({ ok: true, message: "Bake N Cook API running" });
});

router.get("/db", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT 1 AS ok");
    res.json({ ok: true, rows });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

module.exports = router;