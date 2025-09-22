#!/usr/bin/env node

/**
 * Script untuk test koneksi MongoDB
 * Menjalankan: node scripts/test-connection.js
 */

require("dotenv").config();
const mongoose = require("mongoose");

console.log("🔍 Testing MongoDB Connection...\n");

// Display connection info (without credentials)
const uri = process.env.MONGODB_URI;
if (uri) {
	const urlParts = uri.split("@");
	if (urlParts.length > 1) {
		console.log(`📡 Connection String: mongodb+srv://***@${urlParts[1]}`);
	} else {
		console.log(`📡 Connection String: ${uri}`);
	}
} else {
	console.log("❌ MONGODB_URI not found in .env file");
	process.exit(1);
}

// Test connection
const testConnection = async () => {
	try {
		console.log("\n🔄 Attempting to connect...");

		const options = {
			maxPoolSize: 10,
			serverSelectionTimeoutMS: 10000, // 10 seconds timeout
			socketTimeoutMS: 45000,
			family: 4,
		};

		const conn = await mongoose.connect(uri, options);

		console.log("✅ SUCCESS: Connected to MongoDB!");
		console.log(`📊 Host: ${conn.connection.host}`);
		console.log(`📊 Database: ${conn.connection.name}`);
		console.log(`📊 Ready State: ${conn.connection.readyState}`);

		// Test basic operation
		const collections = await conn.connection.db.listCollections().toArray();
		console.log(`📊 Collections: ${collections.length} found`);

		await mongoose.connection.close();
		console.log("\n🎉 Connection test completed successfully!");
		process.exit(0);
	} catch (error) {
		console.log("\n❌ CONNECTION FAILED:");
		console.log(`Error: ${error.message}\n`);

		if (error.message.includes("IP")) {
			console.log("💡 SOLUTION: Add your IP address to MongoDB Atlas whitelist");
			console.log("   1. Go to MongoDB Atlas Dashboard");
			console.log('   2. Click "Network Access" in the left sidebar');
			console.log('   3. Click "Add IP Address"');
			console.log('   4. Add your current IP or use "0.0.0.0/0" for all IPs (less secure)');
			console.log("   5. Wait a few minutes for changes to take effect\n");
		}

		if (error.message.includes("authentication")) {
			console.log("💡 SOLUTION: Check your username and password in connection string");
			console.log("   Make sure the credentials are correct in your .env file\n");
		}

		if (error.message.includes("cluster")) {
			console.log("💡 SOLUTION: Check your cluster name in connection string");
			console.log("   Make sure the cluster name matches your Atlas cluster\n");
		}

		process.exit(1);
	}
};

testConnection();
