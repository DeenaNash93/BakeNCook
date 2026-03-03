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
    const [rows] = await pool.query(
      "SELECT * FROM classes ORDER BY date ASC"
    );

    res.json({ ok: true, classes: rows });

  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
};