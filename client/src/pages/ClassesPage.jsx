import { useEffect, useState } from "react";
import {
  getAllClasses,
  registerToClass,
  cancelClassRegistration,
  createClass,
  deleteClass,
} from "../services/classService";
import { getProfile } from "../services/userService";

function ClassesPage() {
  const [classes, setClasses] = useState([]);
  const [message, setMessage] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [visibleCount, setVisibleCount] = useState(3);

  const [form, setForm] = useState({
    title: "",
    description: "",
    date: "",
    spots: "",
  });

  async function loadClasses() {
    const data = await getAllClasses();

    if (!data.ok) {
      setMessage("שגיאה בטעינת סדנאות");
      return;
    }

    setClasses(data.classes || []);
  }

  useEffect(() => {
    async function initPage() {
      await loadClasses();

      const profileData = await getProfile();
      if (profileData.ok && profileData.user?.role === "admin") {
        setIsAdmin(true);
      }
    }

    initPage();
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

  const handleDeleteClass = async (classId) => {
    const confirmed = window.confirm("האם למחוק את הסדנה הזו? פעולה זו לא ניתנת לביטול.");
    if (!confirmed) return;

    const data = await deleteClass(classId);
    setMessage(data.message || "");

    if (data.ok) {
      await loadClasses();
    }
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleCreateClass = async (e) => {
    e.preventDefault();
    setMessage("");

    const data = await createClass(form);

    if (!data.ok) {
      setMessage(data.message || "שגיאה ביצירת סדנה");
      return;
    }

    setMessage("הסדנה נוצרה בהצלחה");
    setForm({
      title: "",
      description: "",
      date: "",
      spots: "",
    });

    await loadClasses();
  };

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>
        {isAdmin ? "ניהול סדנאות" : "הסדנאות הקרובות"}
      </h1>

      {message && <p style={styles.message}>{message}</p>}

      <div style={styles.layout}>
        <div style={styles.listSection}>
          <h2>{isAdmin ? "כל הסדנאות" : "סדנאות זמינות"}</h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, minmax(320px, 1fr))",
              gap: "40px",
              width: "100%",
              justifyItems: "stretch",
              padding: "0 12px",
            }}
          >
            {classes.slice(0, isAdmin ? classes.length : visibleCount).map((item) => (
              <div key={item.id} style={styles.card}>
                <h2 style={styles.cardTitle}>{item.title}</h2>
                <p><strong>תיאור:</strong> {item.description || "ללא תיאור"}</p>
                <p>
                  <strong>תאריך:</strong>{" "}
                  {new Date(item.date).toLocaleString("he-IL")}
                </p>
                <p><strong>מקומות:</strong> {item.spots}</p>
                <p><strong>נרשמו:</strong> {item.registered_count}</p>
                <p><strong>מקומות פנויים:</strong> {item.spots_left}</p>
                <p><strong>יוצר:</strong> {item.created_by_name || "לא ידוע"}</p>

                {isAdmin && (
                  <button
                    style={styles.deleteButton}
                    onClick={() => handleDeleteClass(item.id)}
                  >
                    מחק סדנה
                  </button>
                )}

                {!isAdmin && (
                  <>
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
                  </>
                )}
              </div>
            ))}
          </div>
        </div>

        {!isAdmin && (
          <div style={styles.loadMoreWrapper}>
            {visibleCount < classes.length && (
              <button
                style={styles.loadMoreButton}
                onClick={() => setVisibleCount((prev) => Math.min(prev + 3, classes.length))}
              >
                ➜ טען 3 סדנאות נוספות
              </button>
            )}

            {visibleCount > 3 && (
              <button
                style={{ ...styles.loadMoreButton, backgroundColor: "#777" }}
                onClick={() => setVisibleCount((prev) => Math.max(prev - 3, 3))}
              >
                ← הפחת ל-3 האחרונות
              </button>
            )}
          </div>
        )}

        {isAdmin && (
          <div style={styles.formCard}>
            <h2>יצירת סדנה חדשה</h2>

            <form onSubmit={handleCreateClass} style={styles.form}>
              <input
                type="text"
                name="title"
                placeholder="כותרת הסדנה"
                value={form.title}
                onChange={handleChange}
                style={styles.input}
              />

              <textarea
                name="description"
                placeholder="תיאור"
                value={form.description}
                onChange={handleChange}
                style={styles.textarea}
              />

              <input
                type="datetime-local"
                name="date"
                value={form.date}
                onChange={handleChange}
                style={styles.input}
              />

              <input
                type="number"
                name="spots"
                placeholder="מספר מקומות"
                value={form.spots}
                onChange={handleChange}
                style={styles.input}
              />

              <button type="submit" style={styles.button}>
                צור סדנה
              </button>
            </form>
          </div>
        )}
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

  layout: {
    display: "grid",
    gridTemplateColumns: "1fr 2fr",
    gridTemplateAreas: '"form list"',
    gap: "24px",
    alignItems: "start",
  },

  listSection: {
    gridArea: "list",
  },

  formCard: {
    gridArea: "form",
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "14px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
    maxWidth: "520px",
    width: "100%",
    justifySelf: "start",
    marginBottom: "30px",
  },

  form: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    marginTop: "15px",
  },

  input: {
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #ccc",
  },

  textarea: {
    minHeight: "100px",
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    resize: "vertical",
  },

  button: {
    marginTop: "10px",
    width: "100%",
    padding: "12px",
    border: "none",
    borderRadius: "8px",
    backgroundColor: "#d98c3f",
    color: "#fff",
    fontSize: "16px",
    cursor: "pointer",
  },
  deleteButton: {
    marginTop: "10px",
    width: "100%",
    padding: "12px",
    border: "none",
    borderRadius: "8px",
    backgroundColor: "#d9534f",
    color: "#fff",
    fontSize: "16px",
    cursor: "pointer",
  },

  listSection: {
    width: "100%",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
    gap: "24px",
    width: "100%",
  },

  card: {
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "14px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
    transition: "0.2s",
    minWidth: "320px",
    maxWidth: "400px",
    width: "100%",
  },
  loadMoreWrapper: {
    marginTop: "16px",
    display: "flex",
    gap: "10px",
    justifyContent: "flex-start",
    flexWrap: "wrap",
  },
  loadMoreButton: {
    padding: "10px 16px",
    border: "none",
    borderRadius: "8px",
    backgroundColor: "#5c88c3",
    color: "#fff",
    cursor: "pointer",
  },

  cardTitle: {
    marginTop: 0,
    marginBottom: "15px",
  },
};

export default ClassesPage;