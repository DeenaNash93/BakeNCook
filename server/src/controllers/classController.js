const pool = require("../config/db");

// יצירת סדנה (admin)
exports.createClass = async (req, res) => {
  try {
    const { title, description, date, spots } = req.body;

    if (!title || !date) {
      return res.status(400).json({ ok: false, message: "Missing fields" });
    }

    const [result] = await pool.query(
      "INSERT INTO classes (title, description, date, spots, created_by) VALUES (?, ?, ?, ?, ?)",
      [title, description || null, date, spots || 10, req.user.id]
    );

    res.status(201).json({
      ok: true,
      message: "Class created",
      classId: result.insertId
    });

  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
};

exports.deleteClass = async (req, res) => {
  try {
    const classId = Number(req.params.id);

    const [result] = await pool.query(
      "DELETE FROM classes WHERE id = ?",
      [classId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ ok: false, message: "הסדנה לא נמצאה" });
    }

    res.json({ ok: true, message: "הסדנה נמחקה בהצלחה" });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
};

// שליפת כל הסדנאות
exports.getAllClasses = async (req, res) => {
  try {

    const userId = req.user ? req.user.id : null;

    const [rows] = await pool.query(`
      SELECT 
        c.id,
        c.title,
        c.description,
        c.date,
        c.spots,
        c.created_at,
        u.full_name AS created_by_name,

        COUNT(cr.id) AS registered_count,

        (c.spots - COUNT(cr.id)) AS spots_left,

        MAX(CASE WHEN cr.user_id = ? AND cr.status='registered' THEN 1 ELSE 0 END) AS is_registered

      FROM classes c

      LEFT JOIN users u
      ON u.id = c.created_by

      LEFT JOIN class_registrations cr
      ON cr.class_id = c.id AND cr.status='registered'

      GROUP BY c.id

      ORDER BY c.date ASC
    `,[userId]);

    res.json({
      ok: true,
      classes: rows
    });

  } catch (err) {
    res.status(500).json({
      ok:false,
      error: err.message
    });
  }
};

exports.getMyClasses = async (req, res) => {
  try {
    const userId = req.user.id;

    const [rows] = await pool.query(
      `
      SELECT 
        c.id,
        c.title,
        c.description,
        c.date,
        c.spots,
        u.full_name AS created_by_name
      FROM class_registrations cr
      JOIN classes c ON c.id = cr.class_id
      LEFT JOIN users u ON u.id = c.created_by
      WHERE cr.user_id = ? AND cr.status = 'registered'
      ORDER BY c.date ASC
      `,
      [userId]
    );

    res.json({ ok: true, classes: rows });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
};