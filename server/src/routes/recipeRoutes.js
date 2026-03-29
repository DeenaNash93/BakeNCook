const express = require("express");
const router = express.Router();
const upload = require("../middleware/uploadMiddleware");

const recipeController = require("../controllers/recipeController");
const { requireAuth, requireAdmin } = require("../middleware/authMiddleware");

// public: לראות מתכונים מאושרים
router.get("/", recipeController.getApprovedRecipes);

// user: יצירת מתכון (pending)
router.post("/", requireAuth, recipeController.createRecipe);

// user: המתכונים שלי
router.get("/my", requireAuth, recipeController.getMyRecipes);

// admin: מתכונים שמחכים לאישור
router.get("/pending", requireAuth, requireAdmin, recipeController.getPendingRecipes);

// admin: עדכון סטטוס מתכון
router.patch("/:id/status", requireAuth, requireAdmin, recipeController.updateRecipeStatus);

router.patch(
  "/:id/image",
  requireAuth,
  requireAdmin,
  upload.single("image"),
  recipeController.uploadRecipeImage
);
router.patch(
  "/:id/upload-image",
  requireAuth,
  upload.single("image"),
  recipeController.uploadOwnRecipeImage
);
router.delete(
  "/:id",
  requireAuth,
  requireAdmin,
  recipeController.deleteRecipe
);

module.exports = router;