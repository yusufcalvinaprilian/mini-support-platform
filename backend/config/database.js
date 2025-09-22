const mongoose = require("mongoose");
const config = require("./env");

// MongoDB connection configuration
const connectDB = async () => {
	try {
		// Set connection options untuk MongoDB Atlas
		const options = {
			maxPoolSize: 10, // Maintain up to 10 socket connections
			serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
			socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
			family: 4, // Use IPv4, skip trying IPv6
		};

		const conn = await mongoose.connect(config.MONGODB_URI, options);

		console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
		console.log(`📊 Database: ${conn.connection.name}`);
	} catch (error) {
		console.error("❌ Database connection error:", error.message);
		console.error("💡 Please check your MongoDB connection string in .env file");
		process.exit(1);
	}
};

// Handle connection events
mongoose.connection.on("connected", () => {
	console.log("🔗 Mongoose connected to MongoDB");
});

mongoose.connection.on("error", (err) => {
	console.error("❌ Mongoose connection error:", err.message);
});

mongoose.connection.on("disconnected", () => {
	console.log("⚠️  Mongoose disconnected from MongoDB");
});

mongoose.connection.on("reconnected", () => {
	console.log("🔄 Mongoose reconnected to MongoDB");
});

// Graceful shutdown
process.on("SIGINT", async () => {
	await mongoose.connection.close();
	console.log("Mongoose connection closed through app termination");
	process.exit(0);
});

module.exports = connectDB;
