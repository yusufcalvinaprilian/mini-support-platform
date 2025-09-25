// models/Support.js
const mongoose = require("mongoose");

const SupportSchema = new mongoose.Schema({
	fan_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
	creator_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
	amount: { type: Number, required: true },
	message: { type: String },
	status: { type: String, enum: ["pending", "paid", "failed"], default: "paid" }, // Cek status ini
	// ... lainnya
});
module.exports = mongoose.model("Support", SupportSchema);
