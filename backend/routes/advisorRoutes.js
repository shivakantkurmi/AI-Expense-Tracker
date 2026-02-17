const express = require("express");
const advisorController = require("../controllers/advisorController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Get financial advice (requires authentication)
router.post("/get-advice", authMiddleware, advisorController.getAdvice);

module.exports = router;
