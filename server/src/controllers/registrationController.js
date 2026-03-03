const pool = require("../config/db");

// POST /api/classes/:id/register
exports.registerToClass = async (req, res) => {
  const classId = Number(req.params.id);
  const userId = req.user.id;

  try {
    // 1) לוודא שסדנה קיימת + להביא spots
    const [classRows] = await pool.query(
      "SELECT id, spots FROM classes WHERE id = ?",
      [classId]
    );

    if (classRows.length === 0) {
      return res.status(404).json({ ok: false, message: "סדנה לא נמצאה" });
    }

    const spots = classRows[0].spots;

    // 2) כמה רשומים כרגע?
    const [countRows] = await pool.query(
      "SELECT COUNT(*) AS cnt FROM class_registrations WHERE class_id = ? AND status = 'registered'",
      [classId]
    );

    const registeredCount = countRows[0].cnt;

    // 3) אם מלא
    if (registeredCount >= spots) {
      return res.status(409).json({ ok: false, message: "אין מקומות פנויים" });
    }

    // 4) הרשמה (אם קיימת הרשמה בעבר - נחזיר ל-registered)
    await pool.query(
      `
      INSERT INTO class_registrations (user_id, class_id, status)
      VALUES (?, ?, 'registered')
      ON DUPLICATE KEY UPDATE status='registered', created_at=CURRENT_TIMESTAMP
      `,
      [userId, classId]
    );

    return res.status(201).json({ ok: true, message: "נרשמת לסדנה בהצלחה" });
  } catch (err) {
    return res.status(500).json({ ok: false, error: err.message });
  }
};

// POST /api/classes/:id/cancel
exports.cancelRegistration = async (req, res) => {
  const classId = Number(req.params.id);
  const userId = req.user.id;

  try {
    const [result] = await pool.query(
      `
      UPDATE class_registrations
      SET status='cancelled'
      WHERE user_id=? AND class_id=? AND status='registered'
      `,
      [userId, classId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        ok: false,
        message: "לא נמצאה הרשמה פעילה לביטול",
      });
    }

    return res.json({ ok: true, message: "ביטלת הרשמה לסדנה" });
  } catch (err) {
    return res.status(500).json({ ok: false, error: err.message });
  }
};