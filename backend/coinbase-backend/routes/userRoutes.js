const express = require("express");
const router = express.Router();
const { getProfile } = require("../controllers/userController");
const { protect } = require("../middleware/auth");

// GET /profile  – Get authenticated user's profile (protected)
router.get("/profile", protect, getProfile);

module.exports = router;
