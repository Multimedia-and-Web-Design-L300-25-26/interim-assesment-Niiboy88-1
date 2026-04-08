const express = require("express");
const router = express.Router();
const { register, login, logout } = require("../controllers/authController");
const { protect } = require("../middleware/auth");

// POST /register  – Create new account
router.post("/register", register);

// POST /login  – Authenticate user
router.post("/login", login);

// POST /logout  – Clear token cookie
router.post("/logout", protect, logout);

module.exports = router;
