const pool = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

function signToken(user) {
  return jwt.sign(
    { id: user.id, role: user.role, status: user.status },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );
}

// POST /api/auth/register
exports.register = async (req, res) => {
  try {
    const { full_name, email, password } = req.body;

    if (!full_name || !email || !password) {
      return res.status(400).json({ ok: false, message: "Missing fields" });
    }

    // check existing email
    const [exists] = await pool.query("SELECT id FROM users WHERE email = ?", [
      email,
    ]);
    if (exists.length > 0) {
      return res.status(409).json({ ok: false, message: "Email already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);

    const [result] = await pool.query(
      "INSERT INTO users (full_name, email, password, role, status) VALUES (?, ?, ?, 'user', 'active')",
      [full_name, email, hashed]
    );

    const user = { id: result.insertId, role: "user", status: "active" };
    const token = signToken(user);

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: false, // בפרודקשן נשים true עם https
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(201).json({ ok: true, message: "Registered", user });
  } catch (err) {
    return res.status(500).json({ ok: false, error: err.message });
  }
};

// POST /api/auth/login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ ok: false, message: "Missing fields" });
    }

    const [rows] = await pool.query(
      "SELECT id, password, role, status FROM users WHERE email = ?",
      [email]
    );

    if (rows.length === 0) {
      return res.status(401).json({ ok: false, message: "Invalid credentials" });
    }

    const userRow = rows[0];

    if (userRow.status === "blocked") {
      return res.status(403).json({ ok: false, message: "User is blocked" });
    }

    const match = await bcrypt.compare(password, userRow.password);
    if (!match) {
      return res.status(401).json({ ok: false, message: "Invalid credentials" });
    }

    const user = { id: userRow.id, role: userRow.role, status: userRow.status };
    const token = signToken(user);

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({ ok: true, message: "Logged in", user });
  } catch (err) {
    return res.status(500).json({ ok: false, error: err.message });
  }
};

// POST /api/auth/logout
exports.logout = async (req, res) => {
  res.clearCookie("token");
  return res.json({ ok: true, message: "Logged out" });
};