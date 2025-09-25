// server.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const connectDB = require("./config/database"); // Pastikan file ini ada
const config = require("./config/env"); // Pastikan file ini ada

// Initialize Express app
const app = express();

// Connect to MongoDB
connectDB();

// --- Middleware Global ---
app.use(helmet()); // Security headers
app.use(
	cors({
		origin: config.FRONTEND_URL, // Mengizinkan akses dari frontend Anda
		credentials: true,
	})
);
app.use(morgan("combined")); // Logging setiap request
app.use(express.json({ limit: "10mb" })); // Memproses body JSON
app.use(express.urlencoded({ extended: true })); // Memproses body URL-encoded

// --- Import Routes ---
// Pastikan semua file ini ada di folder /routes
const userRoutes = require("./routes/userRoutes");
const postRoutes = require("./routes/postRoutes");
const supportRoutes = require("./routes/supportRoutes");
const paymentRoutes = require("./routes/paymentRoutes"); // Rute Midtrans
const aiRoutes = require("./routes/aiRoutes"); // AKTIFKAN RUTE AI

// --- API Routes ---
// Gunakan rute yang sudah digabungkan
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/support", supportRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/ai", aiRoutes); // AKTIFKAN RUTE AI DI SINI

// --- Public / Health Check Routes ---
app.get("/", (req, res) => {
	res.json({
		message: "Support Platform API",
		version: "1.0.0",
		status: "running",
		endpoints: ["/api/users", "/api/posts", "/api/support", "/api/payment", "/api/ai"],
	});
});

app.get("/health", (req, res) => {
	res.json({
		status: "OK",
		timestamp: new Date().toISOString(),
		uptime: process.uptime(),
	});
});

// --- Error Handling Middleware ---
// Harus ditempatkan di akhir, sebelum 404 handler
app.use((err, req, res, next) => {
	console.error(err.stack);
	res.status(500).json({
		message: "Something went wrong! Internal Server Error",
		error: process.env.NODE_ENV === "development" ? err.message : {},
	});
});

// --- 404 Handler ---
// Harus selalu ditempatkan paling akhir
app.use("*", (req, res) => {
	res.status(404).json({
		message: "Route not found",
	});
});

// --- Start Server ---
const PORT = config.PORT;
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
	console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
});
