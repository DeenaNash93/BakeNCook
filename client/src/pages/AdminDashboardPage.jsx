import { useEffect, useState } from "react";
import { getAdminStats, blockUser, unblockUser } from "../services/adminService";

function AdminDashboardPage() {
  const [stats, setStats] = useState(null);
  const [classes, setClasses] = useState([]);
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState("");

  async function loadDashboard() {
    const data = await getAdminStats();

    if (!data.ok) {
      setMessage(data.message || "שגיאה בטעינת נתוני אדמין");
      return;
    }

    setStats(data.stats);
    setClasses(data.classes || []);
    setUsers(data.users || []);
  }

  useEffect(() => {
    loadDashboard();
  }, []);

  const handleBlockUser = async (userId) => {
    const data = await blockUser(userId);
    setMessage(data.message || "");
    await loadDashboard();
  };

  const handleUnblockUser = async (userId) => {
    const data = await unblockUser(userId);
    setMessage(data.message || "");
    await loadDashboard();
  };

  if (message && !stats) {
    return <h2 style={{ padding: "30px" }}>{message}</h2>;
  }

  if (!stats) {
    return <h2 style={{ padding: "30px" }}>טוען נתונים...</h2>;
  }

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>דשבורד מנהל</h1>

      {message && <p style={styles.message}>{message}</p>}

      <div style={styles.grid}>
        <div style={styles.card}>סה"כ משתמשים: {stats.total_users}</div>
        <div style={styles.card}>משתמשים פעילים: {stats.active_users}</div>
        <div style={styles.card}>משתמשים חסומים: {stats.blocked_users}</div>
        <div style={styles.card}>סה"כ מנהלים: {stats.total_admins}</div>
        <div style={styles.card}>סה"כ סדנאות: {stats.total_classes}</div>
        <div style={styles.card}>סה"כ הרשמות: {stats.total_registrations}</div>
        <div style={styles.card}>סה"כ ביטולים: {stats.total_cancelled}</div>
        <div style={styles.card}>סה"כ מתכונים באתר: {stats.approved_recipes}</div>
        <div style={styles.card}>מתכונים מאושרים: {stats.approved_recipes}</div>
        <div style={styles.card}>מתכונים ממתינים: {stats.pending_recipes}</div>
      </div>

      <h2 style={styles.subtitle}>סטטיסטיקות סדנאות</h2>

      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th>כותרת</th>
              <th>תאריך</th>
              <th>מקומות</th>
              <th>נרשמו</th>
              <th>מקומות פנויים</th>
            </tr>
          </thead>
          <tbody>
            {classes.map((item) => (
              <tr key={item.id}>
                <td>{item.title}</td>
                <td>{new Date(item.date).toLocaleString("he-IL")}</td>
                <td>{item.spots}</td>
                <td>{item.registered_count}</td>
                <td>{item.spots_left}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 style={styles.subtitle}>כל המשתמשים במערכת</h2>

      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th>שם</th>
              <th>אימייל</th>
              <th>תפקיד</th>
              <th>סטטוס</th>
              <th>פעולה</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.full_name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>{user.status}</td>
                <td>
                  {user.status === "active" ? (
                    <button
                      style={styles.blockButton}
                      onClick={() => handleBlockUser(user.id)}
                    >
                      חסום משתמש
                    </button>
                  ) : (
                    <button
                      style={styles.unblockButton}
                      onClick={() => handleUnblockUser(user.id)}
                    >
                      בטל חסימה
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const styles = {
  page: {
    padding: "30px",
    backgroundColor: "#f8f8f8",
    minHeight: "100vh",
  },
  title: {
    marginBottom: "20px",
  },
  subtitle: {
    marginTop: "30px",
    marginBottom: "15px",
  },
  message: {
    marginBottom: "20px",
    fontWeight: "bold",
    color: "#8a4b08",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "15px",
  },
  card: {
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
    fontWeight: "bold",
  },
  tableWrapper: {
    overflowX: "auto",
    backgroundColor: "#fff",
    borderRadius: "12px",
    padding: "15px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  blockButton: {
    border: "none",
    backgroundColor: "#d9534f",
    color: "#fff",
    padding: "8px 12px",
    borderRadius: "8px",
    cursor: "pointer",
  },
  unblockButton: {
    border: "none",
    backgroundColor: "#4caf50",
    color: "#fff",
    padding: "8px 12px",
    borderRadius: "8px",
    cursor: "pointer",
  },
};

export default AdminDashboardPage;