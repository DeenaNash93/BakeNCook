const router = require("express").Router();
const classController = require("../controllers/classController");
const registrationController = require("../controllers/registrationController");

const { requireAuth, requireAdmin } = require("../middleware/authMiddleware");

router.get("/", classController.getAllClasses);
router.get("/my", requireAuth, classController.getMyClasses);

router.post("/", requireAuth, requireAdmin, classController.createClass);
router.post("/:id/register", requireAuth, registrationController.registerToClass);
router.post("/:id/cancel", requireAuth, registrationController.cancelRegistration);
router.get("/ping", (req, res) => res.json({ ok: true, route: "classes ping" }));
module.exports = router;