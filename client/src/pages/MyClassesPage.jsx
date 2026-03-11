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
      setClasses(data.classes);
    }
  }

  useEffect(() => {
    loadMyClasses();
  }, []);

  const handleCancel = async (classId) => {
    const data = await cancelRegistration(classId);

    setMessage(data.message);
    loadMyClasses();
  };

  return (
    <div style={{ padding: "40px" }}>
      <h1>הסדנאות שלי</h1>

      {message && <p>{message}</p>}

      {classes.length === 0 ? (
        <p>לא נרשמת לשום סדנה עדיין</p>
      ) : (
        <table border="1" cellPadding="10">
          <thead>
            <tr>
              <th>כותרת</th>
              <th>תאריך</th>
              <th>פעולה</th>
            </tr>
          </thead>

          <tbody>
            {classes.map((c) => (
              <tr key={c.id}>
                <td>{c.title}</td>

                <td>
                  {new Date(c.date).toLocaleString("he-IL")}
                </td>

                <td>
                  <button
                    onClick={() => handleCancel(c.id)}
                    style={{
                      background: "#c94f4f",
                      color: "white",
                      border: "none",
                      padding: "6px 12px",
                      borderRadius: "6px",
                    }}
                  >
                    בטל הרשמה
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default MyClassesPage;