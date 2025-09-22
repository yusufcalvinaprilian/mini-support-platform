#!/usr/bin/env node

/**
 * Script untuk mengatasi masalah koneksi MongoDB Atlas
 */

require("dotenv").config();
const mongoose = require("mongoose");

console.log("🔧 Fixing MongoDB Atlas Connection...\n");

const testConnection = async () => {
	try {
		console.log("🔄 Testing with different connection options...");

		// Coba dengan options yang berbeda
		const options = {
			maxPoolSize: 10,
			serverSelectionTimeoutMS: 30000, // 30 seconds
			socketTimeoutMS: 45000,
			family: 4,
			// Coba tanpa SSL options yang bermasalah
		};

		const conn = await mongoose.connect(process.env.MONGODB_URI, options);

		console.log("✅ SUCCESS: Connected to MongoDB Atlas!");
		console.log(`📊 Host: ${conn.connection.host}`);
		console.log(`📊 Database: ${conn.connection.name}`);
		console.log(`📊 Ready State: ${conn.connection.readyState}`);

		// Test basic operation
		const collections = await conn.connection.db.listCollections().toArray();
		console.log(`📊 Collections: ${collections.length} found`);

		await mongoose.connection.close();
		console.log("\n🎉 MongoDB Atlas connection test completed successfully!");
		process.exit(0);
	} catch (error) {
		console.log("\n❌ CONNECTION FAILED:");
		console.log(`Error: ${error.message}\n`);

		if (error.message.includes("SSL") || error.message.includes("TLS")) {
			console.log("💡 SSL/TLS SOLUTION:");
			console.log("   1. Update Node.js: brew upgrade node");
			console.log("   2. Try different TLS version");
			console.log("   3. Use MongoDB Compass to test connection");
			console.log("   4. Contact MongoDB Atlas support\n");
		}

		if (error.message.includes("authentication")) {
			console.log("💡 AUTHENTICATION SOLUTION:");
			console.log("   1. Check username and password in .env");
			console.log("   2. Verify user exists in MongoDB Atlas");
			console.log("   3. Check user permissions");
			console.log("   4. Try creating new database user\n");
		}

		if (error.message.includes("IP")) {
			console.log("💡 IP WHITELIST SOLUTION:");
			console.log("   1. Add your IP to MongoDB Atlas Network Access");
			console.log("   2. Use 0.0.0.0/0 for all IPs (less secure)");
			console.log("   3. Wait 1-2 minutes for changes to take effect\n");
		}

		// Saran alternatif
		console.log("🔄 ALTERNATIVE SOLUTIONS:");
		console.log("   1. Use MongoDB Atlas Compass (GUI) to test connection");
		console.log("   2. Try different connection string format");
		console.log("   3. Use MongoDB Atlas Data API instead");
		console.log("   4. Contact MongoDB Atlas support for SSL issues\n");

		process.exit(1);
	}
};

testConnection();
