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

// שליפת כל הסדנאות
exports.getAllClasses = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        c.id, c.title, c.description, c.date, c.spots, c.created_by, c.created_at,
        u.full_name AS created_by_name
      FROM classes c
      LEFT JOIN users u ON u.id = c.created_by
      ORDER BY c.date ASC
    `);

    res.json({ ok: true, classes: rows });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
};