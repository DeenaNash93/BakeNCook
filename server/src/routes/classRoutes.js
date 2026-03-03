const router = require("express").Router();
const classController = require("../controllers/classController");
const registrationController = require("../controllers/registrationController");
const { requireAuth, requireAdmin } = require("../middleware/authMiddleware");

router.get("/", classController.getAllClasses);

router.post("/", requireAuth, requireAdmin, classController.createClass);

router.post("/:id/register", requireAuth, registrationController.registerToClass);
router.post("/:id/cancel", requireAuth, registrationController.cancelRegistration);

module.exports = router;