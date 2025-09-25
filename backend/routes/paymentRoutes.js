// backend/routes/paymentRoutes.js
const express = require("express");
const { createSnapTransaction, handleNotification } = require("../controllers/paymentController");
const auth = require("../middleware/auth"); // Diperlukan untuk otorisasi dari Fan
const router = express.Router();

// @route   POST /api/payment/snap-token
// @desc    Membuat transaksi Midtrans Snap dan mendapatkan token.
// @access  Private (Hanya bisa diakses oleh Fan yang sudah login)
router.post("/snap-token", auth, createSnapTransaction);

// @route   POST /api/payment/notification
// @desc    Endpoint untuk menerima notifikasi (webhook) dari Midtrans.
// @access  Public (Harus Public agar server Midtrans bisa mengirim data)
router.post("/notification", handleNotification);

module.exports = router;
