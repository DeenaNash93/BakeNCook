const pool = require("../config/db");

exports.getDashboardStats = async (req, res) => {
  try {
    const [[usersCount]] = await pool.query(
      "SELECT COUNT(*) AS total_users FROM users"
    );

    const [[activeUsers]] = await pool.query(
      "SELECT COUNT(*) AS active_users FROM users WHERE status = 'active'"
    );

    const [[blockedUsers]] = await pool.query(
      "SELECT COUNT(*) AS blocked_users FROM users WHERE status = 'blocked'"
    );

    const [[adminsCount]] = await pool.query(
      "SELECT COUNT(*) AS total_admins FROM users WHERE role = 'admin'"
    );

    const [[classesCount]] = await pool.query(
      "SELECT COUNT(*) AS total_classes FROM classes"
    );

    const [[registrationsCount]] = await pool.query(
      "SELECT COUNT(*) AS total_registrations FROM class_registrations WHERE status = 'registered'"
    );

    const [[cancelledCount]] = await pool.query(
      "SELECT COUNT(*) AS total_cancelled FROM class_registrations WHERE status = 'cancelled'"
    );

    const [[recipesCount]] = await pool.query(
      "SELECT COUNT(*) AS total_recipes FROM recipes"
    );

    const [[approvedRecipes]] = await pool.query(
      "SELECT COUNT(*) AS approved_recipes FROM recipes WHERE status = 'approved'"
    );

    const [[pendingRecipes]] = await pool.query(
      "SELECT COUNT(*) AS pending_recipes FROM recipes WHERE status = 'pending'"
    );

    const [classStats] = await pool.query(`
      SELECT 
        c.id,
        c.title,
        c.date,
        c.spots,
        COUNT(cr.id) AS registered_count,
        (c.spots - COUNT(cr.id)) AS spots_left
      FROM classes c
      LEFT JOIN class_registrations cr
        ON cr.class_id = c.id AND cr.status = 'registered'
      GROUP BY c.id
      ORDER BY c.date ASC
    `);

    const [users] = await pool.query(`
      SELECT id, full_name, email, role, status, created_at
      FROM users
      ORDER BY created_at DESC
    `);

    res.json({
      ok: true,
      stats: {
        total_users: usersCount.total_users,
        active_users: activeUsers.active_users,
        blocked_users: blockedUsers.blocked_users,
        total_admins: adminsCount.total_admins,
        total_classes: classesCount.total_classes,
        total_registrations: registrationsCount.total_registrations,
        total_cancelled: cancelledCount.total_cancelled,
        total_recipes: recipesCount.total_recipes,
        approved_recipes: approvedRecipes.approved_recipes,
        pending_recipes: pendingRecipes.pending_recipes,
      },
      classes: classStats,
      users,
    });
  } catch (err) {
    res.status(500).json({
      ok: false,
      error: err.message,
    });
  }
};

exports.blockUser = async (req, res) => {
  try {
    const userId = Number(req.params.id);

    const [result] = await pool.query(
      "UPDATE users SET status = 'blocked' WHERE id = ?",
      [userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ ok: false, message: "משתמש לא נמצא" });
    }

    res.json({ ok: true, message: "המשתמש נחסם בהצלחה" });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
};

exports.unblockUser = async (req, res) => {
  try {
    const userId = Number(req.params.id);

    const [result] = await pool.query(
      "UPDATE users SET status = 'active' WHERE id = ?",
      [userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ ok: false, message: "משתמש לא נמצא" });
    }

    res.json({ ok: true, message: "החסימה בוטלה בהצלחה" });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
};