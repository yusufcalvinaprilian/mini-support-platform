const express = require("express");
const auth = require("../middleware/auth");
const Support = require("../models/Support");
const User = require("../models/User");
const mongoose = require("mongoose");
const router = express.Router();

router.post("/", auth, async (req, res) => {
	try {
		const { creator_id, amount, message } = req.body;
		const fan_id = req.user.userId;

		// --- 1. Validasi Input dan Format ---
		if (!creator_id || !amount) {
			return res.status(400).json({ success: false, message: "Creator ID and amount are required." });
		}

		// KRITIS: Validasi apakah creator_id adalah format ObjectId yang valid
		if (!mongoose.Types.ObjectId.isValid(creator_id)) {
			return res.status(400).json({ success: false, message: "Invalid creator ID format." });
		}

		// Cari creator untuk memastikan dia ada sebelum update
		const creatorUser = await User.findById(creator_id);
		if (!creatorUser || creatorUser.role !== "creator") {
			return res.status(404).json({ success: false, message: "Creator not found or is not a creator role." });
		}

		// --- 2. Buat dan Simpan Support Baru ---
		const newSupport = new Support({ fan_id, creator_id, amount, message });
		const support = await newSupport.save();

		// --- 3. Update Saldo Creator ---
		// $inc untuk menaikkan field 'balance' secara atomik
		await User.findByIdAndUpdate(creator_id, {
			$inc: { balance: amount },
		});

		return res.status(201).json({
			success: true,
			message: "Donation received and processed successfully.",
			data: support,
		});
	} catch (err) {
		// Logging yang lebih jelas
		console.error("FATAL SUPPORT TRANSACTION ERROR:", err);

		// Cek jika error adalah error validasi Mongoose
		if (err.name === "ValidationError" || err.name === "CastError") {
			return res.status(400).json({ success: false, message: err.message });
		}

		return res.status(500).json({ success: false, message: "Internal Server Error during support transaction." });
	}
});

module.exports = router;
