import { useEffect, useMemo, useState } from "react";
import {
  getApprovedRecipes,
  createRecipe,
  uploadRecipeImage,
  getPendingRecipes,
  updateRecipeStatus,
} from "../services/recipeService";
import { getProfile } from "../services/userService";

function RecipesPage() {
  const [recipes, setRecipes] = useState([]);
  const [pendingRecipes, setPendingRecipes] = useState([]);
  const [message, setMessage] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [selectedImages, setSelectedImages] = useState({});
  const [isAdmin, setIsAdmin] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("הכל");

  const [form, setForm] = useState({
    title: "",
    category: "מתוקים",
    prep_time: "",
    ingredients: "",
    instructions: "",
  });

  async function loadRecipes() {
    const data = await getApprovedRecipes();

    if (data.ok) {
      setRecipes(data.recipes || []);
    } else {
      setMessage("שגיאה בטעינת מתכונים");
    }
  }

  async function loadPendingRecipes() {
    const data = await getPendingRecipes();

    if (data.ok) {
      setPendingRecipes(data.recipes || []);
    }
  }

  useEffect(() => {
    async function initPage() {
      await loadRecipes();

      const profileData = await getProfile();
      if (profileData.ok && profileData.user?.role === "admin") {
        setIsAdmin(true);
        await loadPendingRecipes();
      }
    }

    initPage();
  }, []);

  const filteredRecipes = useMemo(() => {
    if (selectedCategory === "הכל") return recipes;
    return recipes.filter((recipe) => recipe.category === selectedCategory);
  }, [recipes, selectedCategory]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    const data = await createRecipe(form);

    if (!data.ok) {
      setMessage(data.message || "שגיאה בהוספת מתכון");
      return;
    }

    if (imageFile) {
      const uploadData = await uploadRecipeImage(data.recipeId, imageFile);

      if (!uploadData.ok) {
        setMessage("המתכון נשמר, אבל העלאת התמונה נכשלה");
        return;
      }
    }

    setMessage("המתכון נשלח לאישור בהצלחה");
    setForm({
      title: "",
      category: "מתוקים",
      prep_time: "",
      ingredients: "",
      instructions: "",
    });
    setImageFile(null);

    await loadRecipes();
    if (isAdmin) {
      await loadPendingRecipes();
    }
  };

  const handleImageSelect = (recipeId, file) => {
    setSelectedImages((prev) => ({
      ...prev,
      [recipeId]: file,
    }));
  };

  const handleReplaceImage = async (recipeId) => {
    const file = selectedImages[recipeId];

    if (!file) {
      setMessage("יש לבחור תמונה קודם");
      return;
    }

    const data = await uploadRecipeImage(recipeId, file);

    if (!data.ok) {
      setMessage(data.message || "שגיאה בהחלפת התמונה");
      return;
    }

    setMessage("התמונה הוחלפה בהצלחה");
    await loadRecipes();
  };

  const handleUpdateRecipeStatus = async (recipeId, status) => {
    const data = await updateRecipeStatus(recipeId, status);

    if (!data.ok) {
      setMessage(data.message || "שגיאה בעדכון סטטוס מתכון");
      return;
    }

    setMessage("סטטוס המתכון עודכן בהצלחה");
    await loadRecipes();
    await loadPendingRecipes();
  };

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>המתכונים</h1>

      {message && <p style={styles.message}>{message}</p>}

      <div style={styles.layout}>
        <div style={styles.formCard}>
          <h2>הוספת מתכון חדש</h2>

          <form onSubmit={handleSubmit} style={styles.form}>
            <input
              type="text"
              name="title"
              placeholder="כותרת המתכון"
              value={form.title}
              onChange={handleChange}
              style={styles.input}
            />

            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              style={styles.input}
            >
              <option value="מתוקים">מתוקים</option>
              <option value="מלוחים">מלוחים</option>
            </select>

            <input
              type="number"
              name="prep_time"
              placeholder="זמן הכנה בדקות"
              value={form.prep_time}
              onChange={handleChange}
              style={styles.input}
            />

            <textarea
              name="ingredients"
              placeholder="מצרכים"
              value={form.ingredients}
              onChange={handleChange}
              style={styles.textarea}
            />

            <textarea
              name="instructions"
              placeholder="אופן הכנה"
              value={form.instructions}
              onChange={handleChange}
              style={styles.textarea}
            />

            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files[0])}
              style={styles.input}
            />

            <button type="submit" style={styles.button}>
              שלח מתכון
            </button>
          </form>
        </div>

        <div style={styles.listSection}>
          <h2>מתכוני הסדנה ומשתתפיה</h2>

          <div style={styles.filterBox}>
            <button
              type="button"
              onClick={() => setSelectedCategory("הכל")}
              style={{
                ...styles.filterButton,
                ...(selectedCategory === "הכל" ? styles.activeFilter : {}),
              }}
            >
              הכל
            </button>

            <button
              type="button"
              onClick={() => setSelectedCategory("מתוקים")}
              style={{
                ...styles.filterButton,
                ...(selectedCategory === "מתוקים" ? styles.activeFilter : {}),
              }}
            >
              מתוקים
            </button>

            <button
              type="button"
              onClick={() => setSelectedCategory("מלוחים")}
              style={{
                ...styles.filterButton,
                ...(selectedCategory === "מלוחים" ? styles.activeFilter : {}),
              }}
            >
              מלוחים
            </button>
          </div>

          <div style={styles.grid}>
            {filteredRecipes.map((recipe) => (
              <div key={recipe.id} style={styles.card}>
                {recipe.image && (
                  <img
                    src={`http://localhost:5000${recipe.image}`}
                    alt={recipe.title}
                    style={styles.image}
                  />
                )}

                <h3>{recipe.title}</h3>

                <p>
                  <strong>קטגוריה:</strong> {recipe.category || "ללא"}
                </p>

                <p>
                  <strong>זמן הכנה:</strong> {recipe.prep_time || "-"} דקות
                </p>

                <p>
                  <strong>מצרכים:</strong> {recipe.ingredients || "ללא"}
                </p>

                <p>
                  <strong>אופן הכנה:</strong> {recipe.instructions || "ללא"}
                </p>

                <p>
                  <strong>מאת:</strong> {recipe.author || "לא ידוע"}
                </p>

                {isAdmin && (
                  <div style={styles.replaceImageBox}>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        handleImageSelect(recipe.id, e.target.files[0])
                      }
                      style={styles.input}
                    />

                    <button
                      type="button"
                      onClick={() => handleReplaceImage(recipe.id)}
                      style={styles.replaceButton}
                    >
                      החלף תמונה
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          {isAdmin && (
            <div style={{ marginTop: "35px" }}>
              <h2>מתכונים ממתינים לאישור</h2>

              {pendingRecipes.length === 0 ? (
                <p>אין כרגע מתכונים ממתינים</p>
              ) : (
                <div style={styles.grid}>
                  {pendingRecipes.map((recipe) => (
                    <div key={recipe.id} style={styles.card}>
                      <h3>{recipe.title}</h3>

                      <p>
                        <strong>קטגוריה:</strong> {recipe.category || "ללא"}
                      </p>

                      <p>
                        <strong>זמן הכנה:</strong> {recipe.prep_time || "-"} דקות
                      </p>

                      <p>
                        <strong>מאת:</strong> {recipe.author || "לא ידוע"}
                      </p>

                      <p>
                        <strong>אימייל:</strong> {recipe.email || "-"}
                      </p>

                      <div style={styles.adminActions}>
                        <button
                          type="button"
                          onClick={() =>
                            handleUpdateRecipeStatus(recipe.id, "approved")
                          }
                          style={styles.approveButton}
                        >
                          אשר
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            handleUpdateRecipeStatus(recipe.id, "rejected")
                          }
                          style={styles.rejectButton}
                        >
                          דחה
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
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
    fontWeight: "bold",
    color: "#8a4b08",
    marginBottom: "20px",
  },
  layout: {
    display: "grid",
    gridTemplateColumns: "1fr 2fr",
    gap: "24px",
  },
  formCard: {
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "14px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
    height: "fit-content",
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
    padding: "12px",
    border: "none",
    borderRadius: "8px",
    backgroundColor: "#d98c3f",
    color: "#fff",
    fontSize: "16px",
  },
  listSection: {
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "14px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
  },
  filterBox: {
    display: "flex",
    gap: "10px",
    marginTop: "15px",
    marginBottom: "20px",
    flexWrap: "wrap",
  },
  filterButton: {
    padding: "10px 16px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    backgroundColor: "#fff",
    cursor: "pointer",
  },
  activeFilter: {
    backgroundColor: "#d98c3f",
    color: "#fff",
    border: "none",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "18px",
    marginTop: "15px",
  },
  card: {
    backgroundColor: "#fafafa",
    padding: "15px",
    borderRadius: "12px",
    border: "1px solid #eee",
  },
  image: {
    width: "100%",
    height: "180px",
    objectFit: "cover",
    borderRadius: "10px",
    marginBottom: "10px",
  },
  replaceImageBox: {
    marginTop: "12px",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  replaceButton: {
    padding: "10px",
    border: "none",
    borderRadius: "8px",
    backgroundColor: "#4f7cc9",
    color: "#fff",
    fontSize: "15px",
    cursor: "pointer",
  },
  adminActions: {
    marginTop: "12px",
    display: "flex",
    gap: "10px",
  },
  approveButton: {
    flex: 1,
    padding: "10px",
    border: "none",
    borderRadius: "8px",
    backgroundColor: "#4caf50",
    color: "#fff",
    cursor: "pointer",
  },
  rejectButton: {
    flex: 1,
    padding: "10px",
    border: "none",
    borderRadius: "8px",
    backgroundColor: "#d9534f",
    color: "#fff",
    cursor: "pointer",
  },
};

export default RecipesPage;