const router = require("express").Router();
const { requireAuth } = require("../middleware/authMiddleware");

router.get("/profile", requireAuth, (req, res) => {
  res.json({
    ok: true,
    message: "User profile",
    user: req.user
  });
});

module.exports = router;