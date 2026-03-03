const router = require("express").Router();
const classController = require("../controllers/classController");
const { requireAuth, requireAdmin } = require("../middleware/authMiddleware");

// public: כל אחד יכול לראות מפגשים (אפשר גם להחליט שרק מחוברים)
router.get("/", classController.getAllClasses);

// admin only: יצירת מפגש
router.post("/", requireAuth, requireAdmin, classController.createClass);

module.exports = router;