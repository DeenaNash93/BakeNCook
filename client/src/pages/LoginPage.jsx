import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../services/authService";
import logo from "../assets/logo.png";
function LoginPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
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

    const data = await loginUser(form);

    if (!data.ok) {
      setMessage(data.message || "שגיאה בהתחברות");
      return;
    }

    if (data.user.role === "admin") {
      navigate("/admin");
    } else {
      navigate("/classes");
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <img src={logo} alt="BakeNCook" style={styles.logo} />
        <h1>התחברות</h1>

        <form onSubmit={handleSubmit} style={styles.form}>
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
            התחבר
          </button>
        </form>

        {message && <p style={styles.message}>{message}</p>}

        <p>
          עדיין אין לך חשבון? <Link to="/register">להרשמה</Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  logo: {
  width: "140px",
  display: "block",
  margin: "0 auto 15px auto",
},

  page: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f8f8",
  },
  card: {
    width: "100%",
    maxWidth: "400px",
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
    color: "crimson",
  },
};

export default LoginPage;