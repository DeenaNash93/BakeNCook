import { useEffect, useState } from "react";
import {
  getMyClasses,
  cancelRegistration,
} from "../services/myClassesService";

function MyClassesPage() {
  const [classes, setClasses] = useState([]);
  const [message, setMessage] = useState("");

  async function loadMyClasses() {
    const data = await getMyClasses();

    if (data.ok) {
      setClasses(data.classes || []);
    } else {
      setMessage("שגיאה בטעינת הסדנאות שלך");
    }
  }

  useEffect(() => {
    loadMyClasses();
  }, []);

  const handleCancel = async (classId) => {
    const data = await cancelRegistration(classId);

    if (!data.ok) {
      setMessage(data.message || "שגיאה בביטול הרשמה");
      return;
    }

    setMessage(data.message || "ההרשמה בוטלה");
    await loadMyClasses();
  };

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>הסדנאות שלי</h1>

      {message && <p style={styles.message}>{message}</p>}

      {classes.length === 0 ? (
        <div style={styles.emptyBox}>
          <h2 style={styles.emptyTitle}>עדיין לא נרשמת לשום סדנה</h2>
          <p style={styles.emptyText}>
            אפשר להיכנס לעמוד הסדנאות ולהירשם למפגש שמתאים לך.
          </p>
        </div>
      ) : (
        <div style={styles.grid}>
          {classes.map((item) => (
            <div key={item.id} style={styles.card}>
              <h2 style={styles.cardTitle}>{item.title}</h2>

              <p>
                <strong>תיאור:</strong> {item.description || "ללא תיאור"}
              </p>

              <p>
                <strong>תאריך:</strong>{" "}
                {new Date(item.date).toLocaleString("he-IL")}
              </p>

              <p>
                <strong>מקומות:</strong> {item.spots}
              </p>

              <p>
                <strong>יוצר הסדנה:</strong>{" "}
                {item.created_by_name || "לא ידוע"}
              </p>

              <button
                onClick={() => handleCancel(item.id)}
                style={styles.cancelButton}
              >
                בטל הרשמה
              </button>
            </div>
          ))}
        </div>
      )}
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
  emptyBox: {
    backgroundColor: "#fff",
    padding: "30px",
    borderRadius: "14px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
    textAlign: "center",
  },
  emptyTitle: {
    marginTop: 0,
    marginBottom: "10px",
  },
  emptyText: {
    margin: 0,
    color: "#555",
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
  cancelButton: {
    marginTop: "15px",
    width: "100%",
    padding: "12px",
    border: "none",
    borderRadius: "8px",
    backgroundColor: "#c94f4f",
    color: "#fff",
    fontSize: "16px",
    cursor: "pointer",
  },
};

export default MyClassesPage;