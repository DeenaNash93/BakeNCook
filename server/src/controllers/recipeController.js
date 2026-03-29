const pool = require("../config/db");

// יצירת מתכון (user) -> pending
exports.createRecipe = async (req, res) => {
  try {
    const { title, category, prep_time, ingredients, instructions, image } = req.body;

    if (!title || !ingredients || !instructions) {
      return res.status(400).json({ ok: false, message: "שדות חסרים" });
    }

    const [result] = await pool.query(
      `
      INSERT INTO recipes
      (user_id, title, category, prep_time, ingredients, instructions, status, image)
      VALUES (?, ?, ?, ?, ?, ?, 'pending', ?)
      `,
      [
        req.user.id,
        title,
        category || null,
        prep_time || null,
        ingredients,
        instructions,
        image || null
      ]
    );

    res.status(201).json({
      ok: true,
      message: "המתכון נשלח לאישור",
      recipeId: result.insertId
    });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
};

// כל המתכונים המאושרים (public)

exports.getApprovedRecipes = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `
      SELECT 
        r.id,
        r.title,
        r.category,
        r.prep_time,
        r.ingredients,
        r.instructions,
        r.image,
        r.created_at,
        u.full_name AS author
      FROM recipes r
      LEFT JOIN users u ON u.id = r.user_id
      WHERE r.status='approved'
      ORDER BY r.created_at DESC
      `
    );

    res.json({ ok: true, recipes: rows });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
};



// מתכונים שלי (user) - כל הסטטוסים
exports.getMyRecipes = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `
      SELECT id, title, category, prep_time, status, image, created_at
      FROM recipes
      WHERE user_id = ?
      ORDER BY created_at DESC
      `,
      [req.user.id]
    );

    res.json({ ok: true, recipes: rows });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
};

// admin: מתכונים שמחכים לאישור
exports.getPendingRecipes = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `
      SELECT 
        r.id,
        r.title,
        r.category,
        r.prep_time,
        r.ingredients,
        r.instructions,
        r.image,
        r.created_at,
        u.full_name AS author,
        u.email
      FROM recipes r
      LEFT JOIN users u ON u.id = r.user_id
      WHERE r.status = 'pending'
      ORDER BY r.created_at ASC
      `
    );

    res.json({ ok: true, recipes: rows });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
};

// admin: אישור/דחייה
exports.updateRecipeStatus = async (req, res) => {
  try {
    const recipeId = Number(req.params.id);
    const { status } = req.body; // 'approved' | 'rejected'

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ ok: false, message: "סטטוס לא תקין" });
    }

    const [result] = await pool.query(
      "UPDATE recipes SET status=? WHERE id=?",
      [status, recipeId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ ok: false, message: "מתכון לא נמצא" });
    }

    res.json({ ok: true, message: "הסטטוס עודכן" });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
};

exports.uploadRecipeImage = async (req, res) => {
  try {
    const recipeId = Number(req.params.id);

    if (!req.file) {
      return res.status(400).json({ ok: false, message: "לא נשלחה תמונה" });
    }

    const imagePath = `/uploads/${req.file.filename}`;

    const [result] = await pool.query(
      "UPDATE recipes SET image = ? WHERE id = ?",
      [imagePath, recipeId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ ok: false, message: "מתכון לא נמצא" });
    }

    res.json({
      ok: true,
      message: "התמונה נשמרה בהצלחה",
      image: imagePath,
    });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
};
exports.uploadOwnRecipeImage = async (req, res) => {
  try {
    const recipeId = Number(req.params.id);

    if (!req.file) {
      return res.status(400).json({ ok: false, message: "לא נשלחה תמונה" });
    }

    const [rows] = await pool.query(
      "SELECT id, user_id FROM recipes WHERE id = ?",
      [recipeId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ ok: false, message: "מתכון לא נמצא" });
    }

    const recipe = rows[0];

    if (recipe.user_id !== req.user.id) {
      return res.status(403).json({
        ok: false,
        message: "אין לך הרשאה להעלות תמונה למתכון הזה",
      });
    }

    const imagePath = `/uploads/${req.file.filename}`;

    await pool.query(
      "UPDATE recipes SET image = ? WHERE id = ?",
      [imagePath, recipeId]
    );

    res.json({
      ok: true,
      message: "התמונה נשמרה בהצלחה",
      image: imagePath,
    });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
};
exports.deleteRecipe = async (req, res) => {
  try {
    const recipeId = Number(req.params.id);

    const [result] = await pool.query(
      "DELETE FROM recipes WHERE id = ?",
      [recipeId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        ok: false,
        message: "מתכון לא נמצא",
      });
    }

    res.json({
      ok: true,
      message: "המתכון נמחק בהצלחה",
    });
  } catch (err) {
    res.status(500).json({
      ok: false,
      error: err.message,
    });
  }
};