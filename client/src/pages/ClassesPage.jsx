import { useEffect, useState } from "react";
import {
  getAllClasses,
  registerToClass,
  cancelClassRegistration,
} from "../services/classService";

function ClassesPage() {
  const [classes, setClasses] = useState([]);
  const [message, setMessage] = useState("");

  async function loadClasses() {
    const data = await getAllClasses();

    if (!data.ok) {
      setMessage("שגיאה בטעינת סדנאות");
      return;
    }

    setClasses(data.classes || []);
  }

  useEffect(() => {
    loadClasses();
  }, []);

  const handleRegister = async (classId) => {
    const data = await registerToClass(classId);
    setMessage(data.message || "");

    await loadClasses();
  };

  const handleCancel = async (classId) => {
    const data = await cancelClassRegistration(classId);
    setMessage(data.message || "");

    await loadClasses();
  };

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>הסדנאות הקרובות</h1>

      {message && <p style={styles.message}>{message}</p>}

      <div style={styles.grid}>
        {classes.map((item) => (
          <div key={item.id} style={styles.card}>
            <h2 style={styles.cardTitle}>{item.title}</h2>
            <p><strong>תיאור:</strong> {item.description}</p>
            <p>
              <strong>תאריך:</strong>{" "}
              {new Date(item.date).toLocaleString("he-IL")}
            </p>
            <p><strong>מקומות:</strong> {item.spots}</p>
            <p><strong>נרשמו:</strong> {item.registered_count}</p>
            <p><strong>מקומות פנויים:</strong> {item.spots_left}</p>
            <p><strong>יוצר:</strong> {item.created_by_name || "לא ידוע"}</p>

            {item.is_registered ? (
              <button
                style={{ ...styles.button, backgroundColor: "#b23b3b" }}
                onClick={() => handleCancel(item.id)}
              >
                בטל הרשמה
              </button>
            ) : (
              <button
                style={styles.button}
                onClick={() => handleRegister(item.id)}
                disabled={item.spots_left <= 0}
              >
                {item.spots_left <= 0 ? "מלא" : "הירשם לסדנה"}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    backgroundColor: "#f8f8f8",
    padding: "30px",
  },
  title: {
    marginBottom: "20px",
  },
  message: {
    marginBottom: "20px",
    fontWeight: "bold",
    color: "#8a4b08",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "20px",
  },
  card: {
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "14px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
  },
  cardTitle: {
    marginTop: 0,
    marginBottom: "15px",
  },
  button: {
    marginTop: "15px",
    width: "100%",
    padding: "12px",
    border: "none",
    borderRadius: "8px",
    backgroundColor: "#d98c3f",
    color: "#fff",
    fontSize: "16px",
  },
};

export default ClassesPage;