// backend/routes/aiRoutes.js
const express = require("express");
const { generateCaption } = require("../controllers/aiController");
const auth = require("../middleware/auth");
const router = express.Router();

// @route   POST /api/ai/caption
// @desc    Generate a caption using OpenAI
// @access  Private (memerlukan token JWT)
router.post("/caption", auth, generateCaption);

module.exports = router;
