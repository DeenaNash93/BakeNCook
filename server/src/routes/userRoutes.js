const router = require("express").Router();
const { requireAuth } = require("../middleware/authMiddleware");
const pool = require("../config/db");

router.get("/profile", requireAuth, async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT id, full_name, email, role, status FROM users WHERE id = ?",
      [req.user.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ ok: false, message: "משתמש לא נמצא" });
    }

    res.json({
      ok: true,
      user: rows[0],
    });
  } catch (err) {
    res.status(500).json({
      ok: false,
      error: err.message,
    });
  }
});

module.exports = router;