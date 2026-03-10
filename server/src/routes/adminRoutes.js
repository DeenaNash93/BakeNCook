const express = require("express");
const router = express.Router();

const adminStatsController = require("../controllers/adminStatsController");
const { requireAuth, requireAdmin } = require("../middleware/authMiddleware");

router.get("/stats", requireAuth, requireAdmin, adminStatsController.getDashboardStats);

module.exports = router;