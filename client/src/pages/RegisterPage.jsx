import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../services/authService";

function RegisterPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    full_name: "",
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    const data = await registerUser(form);

    if (!data.ok) {
      setMessage(data.message || "שגיאה בהרשמה");
      return;
    }

    setMessage("נרשמת בהצלחה");
    navigate("/classes");
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1>הרשמה</h1>

        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="text"
            name="full_name"
            placeholder="שם מלא"
            value={form.full_name}
            onChange={handleChange}
            style={styles.input}
          />

          <input
            type="email"
            name="email"
            placeholder="אימייל"
            value={form.email}
            onChange={handleChange}
            style={styles.input}
          />

          <input
            type="password"
            name="password"
            placeholder="סיסמה"
            value={form.password}
            onChange={handleChange}
            style={styles.input}
          />

          <button type="submit" style={styles.button}>
            הירשם
          </button>
        </form>

        {message && <p style={styles.message}>{message}</p>}

        <p>
          כבר יש לך חשבון? <Link to="/">להתחברות</Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f8f8",
  },
  card: {
    width: "100%",
    maxWidth: "420px",
    backgroundColor: "#fff",
    padding: "30px",
    borderRadius: "12px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    marginTop: "20px",
  },
  input: {
    padding: "12px",
    fontSize: "16px",
    borderRadius: "8px",
    border: "1px solid #ccc",
  },
  button: {
    padding: "12px",
    fontSize: "16px",
    borderRadius: "8px",
    border: "none",
    backgroundColor: "#d98c3f",
    color: "white",
  },
  message: {
    marginTop: "15px",
    color: "#8a4b08",
  },
};

export default RegisterPage;