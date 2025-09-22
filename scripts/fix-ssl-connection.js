#!/usr/bin/env node

/**
 * Script untuk mengatasi masalah SSL connection MongoDB Atlas
 */

require("dotenv").config();
const mongoose = require("mongoose");

console.log("🔧 Fixing SSL Connection Issues...\n");

const testConnection = async () => {
	try {
		console.log("🔄 Testing with SSL options...");

		// Connection options untuk mengatasi SSL issues
		const options = {
			maxPoolSize: 10,
			serverSelectionTimeoutMS: 10000,
			socketTimeoutMS: 45000,
			family: 4,
			// SSL options untuk mengatasi TLS issues
			ssl: true,
			// Remove deprecated options
		};

		const conn = await mongoose.connect(process.env.MONGODB_URI, options);

		console.log("✅ SUCCESS: Connected to MongoDB!");
		console.log(`📊 Host: ${conn.connection.host}`);
		console.log(`📊 Database: ${conn.connection.name}`);
		console.log(`📊 Ready State: ${conn.connection.readyState}`);

		// Test basic operation
		const collections = await conn.connection.db.listCollections().toArray();
		console.log(`📊 Collections: ${collections.length} found`);

		await mongoose.connection.close();
		console.log("\n🎉 SSL connection test completed successfully!");
		process.exit(0);
	} catch (error) {
		console.log("\n❌ SSL CONNECTION FAILED:");
		console.log(`Error: ${error.message}\n`);

		if (error.message.includes("SSL") || error.message.includes("TLS")) {
			console.log("💡 SSL/TLS SOLUTION:");
			console.log("   1. Update Node.js to latest version");
			console.log("   2. Check MongoDB Atlas cluster status");
			console.log("   3. Try different connection string format");
			console.log("   4. Contact MongoDB Atlas support if issue persists\n");
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

		process.exit(1);
	}
};

testConnection();
