// backend/routes/postRoutes.js

const express = require("express");
const auth = require("../middleware/auth");
const Post = require("../models/Post");
const mongoose = require("mongoose");
const router = express.Router();

router.post("/", auth, async (req, res) => {
	// LOG 1: Permintaan tercapai
	console.log("LOG 1: Permintaan POST /posts diterima.");

	// Pastikan kita mendapatkan ID pengguna dari middleware auth
	const creatorId = req.user.userId; // Ambil ID pengguna dari objek yang disimpan di auth.js

	// Pastikan ID pengguna valid (meskipun sudah divalidasi di auth.js, ini lapisan keamanan tambahan)
	if (!creatorId || !mongoose.Types.ObjectId.isValid(creatorId)) {
		console.error("LOG: Gagal, creatorId tidak valid/tidak ditemukan setelah auth.");
		return res.status(401).json({ message: "Otorisasi gagal: Creator ID tidak ditemukan." });
	}

	try {
		const { title, content, media_url } = req.body;

		// Validasi input
		if (!title || !content) {
			console.log("LOG 3: Validasi gagal (data kurang).");
			return res.status(400).json({ message: "Title and content are required." });
		}

		const newPost = new Post({
			creator: creatorId, // Gunakan variabel yang sudah divalidasi
			title,
			content,
			media_url,
		});

		const post = await newPost.save();

		console.log("LOG 4: Postingan berhasil disimpan:", post._id);
		return res.status(201).json(post);
	} catch (err) {
		console.error("LOG 5: Fatal Error di Post Controller:", err.message);
		// Pastikan error dikembalikan sebagai 500
		return res.status(500).json({ message: "Internal Server Error during post creation." });
	}
});

module.exports = router;
