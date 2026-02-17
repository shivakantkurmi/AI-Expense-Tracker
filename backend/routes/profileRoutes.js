const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const profileController = require("../controllers/profileController");

const router = express.Router();

// Get user profile
router.get("/profile", authMiddleware, profileController.getProfile);

// Update user profile
router.put("/profile", authMiddleware, profileController.updateProfile);

module.exports = router;
