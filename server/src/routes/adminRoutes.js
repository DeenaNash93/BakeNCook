const express = require("express");
const router = express.Router();

const adminStatsController = require("../controllers/adminStatsController");
const { requireAuth, requireAdmin } = require("../middleware/authMiddleware");

router.get("/stats", requireAuth, requireAdmin, adminStatsController.getDashboardStats);

router.patch("/users/:id/block", requireAuth, requireAdmin, adminStatsController.blockUser);

router.patch("/users/:id/unblock", requireAuth, requireAdmin, adminStatsController.unblockUser);

module.exports = router;