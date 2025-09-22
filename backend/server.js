require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const connectDB = require("./config/database");
const config = require("./config/env");

// Initialize Express app
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(helmet()); // Security headers
app.use(
	cors({
		origin: config.FRONTEND_URL,
		credentials: true,
	})
);
app.use(morgan("combined")); // Logging
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Import routes
const userRoutes = require("./routes/userRoutes");

// Routes
app.get("/", (req, res) => {
	res.json({
		message: "Support Platform API",
		version: "1.0.0",
		status: "running",
		endpoints: {
			users: "/api/users",
			health: "/health",
		},
	});
});

// Health check endpoint
app.get("/health", (req, res) => {
	res.json({
		status: "OK",
		timestamp: new Date().toISOString(),
		uptime: process.uptime(),
	});
});

// API Routes
app.use("/api/users", userRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
	console.error(err.stack);
	res.status(500).json({
		message: "Something went wrong!",
		error: process.env.NODE_ENV === "development" ? err.message : {},
	});
});

// 404 handler
app.use("*", (req, res) => {
	res.status(404).json({
		message: "Route not found",
	});
});

// Start server
const PORT = config.PORT;
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
	console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
});
