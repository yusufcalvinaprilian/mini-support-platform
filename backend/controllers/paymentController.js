const midtransClient = require("midtrans-client");
const shortUUID = require("short-uuid");
const User = require("../models/User");
const Support = require("../models/Support");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config();

// Inisialisasi translator short-uuid untuk membuat ID unik
const translator = shortUUID();

// Konfigurasi Midtrans Snap
let snap = new midtransClient.Snap({
	isProduction: false, // Gunakan false untuk Sandbox
	serverKey: process.env.MIDTRANS_SERVER_KEY,
	clientKey: process.env.MIDTRANS_CLIENT_KEY,
});

// @desc    Buat Transaksi Snap (Dapatkan token)
exports.createSnapTransaction = async (req, res) => {
	try {
		const { creatorId, amount, message } = req.body;
		const fanId = req.user.userId;

		// Validasi Kritis
		if (!mongoose.Types.ObjectId.isValid(creatorId) || !amount || amount <= 0) {
			return res.status(400).json({ success: false, message: "Invalid input data." });
		}

		const creator = await User.findById(creatorId);
		const fan = await User.findById(fanId);

		if (!creator || !fan || creator.role !== "creator") {
			return res.status(404).json({ success: false, message: "Creator or Fan not found/invalid." });
		}

		// Buat ID pesanan yang unik menggunakan short-uuid
		const orderId = `SUP-${translator.new()}`;

		let parameter = {
			transaction_details: {
				order_id: orderId,
				gross_amount: amount,
			},
			customer_details: {
				first_name: fan.fullName || fan.username,
				email: fan.email,
			},
			item_details: [
				{
					id: creatorId,
					price: amount,
					quantity: 1,
					name: `Donation to ${creator.username}`,
				},
			],
			custom_expiry: {
				expiry_duration: 60, // 1 jam
				unit: "minute",
			},
			// Metadata untuk menyimpan ID creator dan fan (Kunci untuk Webhook!)
			custom_field1: creatorId,
			custom_field2: fanId,
			custom_field3: message,
		};

		const transaction = await snap.createTransaction(parameter);

		return res.json({
			success: true,
			snapToken: transaction.token,
		});
	} catch (error) {
		console.error("Midtrans Transaction Error:", error.message);
		return res.status(500).json({ success: false, message: "Failed to create Snap transaction: " + error.message });
	}
};

// @desc    Handle Midtrans Webhook Notification
exports.handleNotification = async (req, res) => {
	try {
		const statusResponse = req.body;
		const transactionStatus = statusResponse.transaction_status;
		const fraudStatus = statusResponse.fraud_status;

		// Ambil data penting dari metadata
		const creatorId = statusResponse.custom_field1;
		const fanId = statusResponse.custom_field2;
		const message = statusResponse.custom_field3;
		const grossAmount = parseFloat(statusResponse.gross_amount);
		const orderId = statusResponse.order_id;

		// 1. Cek Status Pembayaran dan Fraud
		if (transactionStatus === "capture" || transactionStatus === "settlement") {
			if (fraudStatus === "accept") {
				// Update Saldo Creator
				await User.findByIdAndUpdate(creatorId, {
					$inc: { balance: grossAmount },
				});

				// Catat transaksi di koleksi Support
				await Support.create({
					fan_id: fanId,
					creator_id: creatorId,
					amount: grossAmount,
					message: message,
					status: "paid",
				});

				console.log(`✅ Saldo Creator ${creatorId} berhasil diperbarui: +${grossAmount}`);
			} else {
				console.log(`❌ Pembayaran Ditolak karena Fraud: ${orderId}`);
			}
		} else if (transactionStatus === "pending") {
			console.log(`⏳ Pembayaran Pending untuk Order ID: ${orderId}`);
		} else if (transactionStatus === "deny" || transactionStatus === "expire" || transactionStatus === "cancel") {
			console.log(`❌ Pembayaran Gagal/Kadaluarsa untuk Order ID: ${orderId}`);
		}

		// Midtrans membutuhkan respons HTTP 200 OK untuk mengonfirmasi penerimaan
		return res.status(200).json({ status: "OK" });
	} catch (error) {
		console.error("Midtrans Notification Handler Error:", error.message);
		return res.status(500).json({ status: "Error processing notification." });
	}
};
