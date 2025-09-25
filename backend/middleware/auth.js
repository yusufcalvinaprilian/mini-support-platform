// backend/middleware/auth.js

const jwt = require("jsonwebtoken");
const User = require("../models/User");
const mongoose = require("mongoose"); // Diperlukan untuk validasi ObjectId

module.exports = async (req, res, next) => {
	// LOG A: Cek apakah middleware auth tercapai
	console.log("LOG A: Middleware Auth Tercapai.");

	const authHeader = req.header("Authorization");
	if (!authHeader) {
		console.log("LOG B: Gagal - Tidak ada token.");
		return res.status(401).json({ success: false, message: "Tidak ada token, otorisasi ditolak." });
	}

	try {
		const token = authHeader.replace("Bearer ", "");
		const decoded = jwt.verify(token, process.env.JWT_SECRET);

		// LOG C: Token berhasil diverifikasi
		console.log("LOG C: Token Berhasil Diverifikasi. User ID:", decoded.userId);

		// KRITIS: Simpan ID pengguna sebagai 'userId' dan 'id' untuk kompatibilitas
		req.user = {
			userId: decoded.userId, // Standard untuk diakses di route
			id: decoded.userId, // Tambahan untuk kompatibilitas
		};

		// Validasi ID format MongoDB
		if (!mongoose.Types.ObjectId.isValid(req.user.userId)) {
			return res.status(400).json({
				success: false,
				message: "Invalid user ID format in token payload.",
			});
		}

		// Cek user di DB dan pastikan aktif
		const user = await User.findById(req.user.userId);
		if (!user || !user.isActive) {
			return res.status(401).json({
				success: false,
				message: "Token valid, but user is inactive or not found.",
			});
		}

		console.log("LOG D: Otorisasi Berhasil.");
		next();
	} catch (err) {
		// LOG E: Token tidak valid
		console.error("LOG E: Token Tidak Valid.", err.message);
		return res.status(401).json({ success: false, message: "Token tidak valid atau kedaluwarsa." });
	}
};
