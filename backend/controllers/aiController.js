// backend/controllers/aiController.js
const { OpenAI } = require("openai");
const dotenv = require("dotenv");

dotenv.config();

// Inisialisasi klien OpenAI
const openai = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY, // Mengambil kunci dari .env
});

// @desc    Generate a short caption for a post
// @route   POST /api/ai/caption
// @access  Private (memerlukan autentikasi)
exports.generateCaption = async (req, res) => {
	try {
		// Ambil prompt dari body request. Beri nilai default jika kosong.
		const { prompt } = req.body;
		const finalPrompt = prompt || "Write a short, enthusiastic thank you note to supporters for their latest donation.";

		// Validasi input
		if (!prompt) {
			return res.status(400).json({ success: false, message: "Prompt is required in the request body." });
		}

		// Panggil API OpenAI
		const response = await openai.chat.completions.create({
			model: "gpt-3.5-turbo",
			messages: [
				{
					role: "system",
					content: "You are a creative assistant that generates short, positive social media captions for creators. The caption should be 1-2 sentences max.",
				},
				{
					role: "user",
					content: finalPrompt,
				},
			],
			max_tokens: 50, // Batasi panjang respons
			temperature: 0.7,
		});

		// Ekstrak hasil caption
		const caption = response.choices[0].message.content.trim();

		return res.json({ success: true, caption });
	} catch (error) {
		console.error("FATAL OPENAI API Error:", error.message);
		// Tangani error jika API key salah atau limit terlampaui
		return res.status(500).json({
			success: false,
			message: "Failed to generate caption due to an internal API error.",
			errorDetail: process.env.NODE_ENV === "development" ? error.message : null,
		});
	}
};
