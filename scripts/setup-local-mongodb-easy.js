#!/usr/bin/env node

/**
 * Script untuk setup MongoDB lokal dengan cara termudah
 */

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

console.log("🔧 Setting up Local MongoDB (Easy Way)...\n");

// Backup current .env
const envPath = path.join(process.cwd(), ".env");
const envBackupPath = path.join(process.cwd(), ".env.backup");

if (fs.existsSync(envPath)) {
	fs.copyFileSync(envPath, envBackupPath);
	console.log("📁 Backed up current .env to .env.backup");
}

// Create new .env for local MongoDB
const localEnvContent = `PORT=5001
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/support_platform
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:3000`;

fs.writeFileSync(envPath, localEnvContent);
console.log("✅ Updated .env for local MongoDB");

// Check if MongoDB is available
console.log("\n🔍 Checking MongoDB availability...");

try {
	// Check if MongoDB is running
	execSync("mongosh --version", { stdio: "ignore" });
	console.log("✅ MongoDB shell is available");

	// Try to connect to local MongoDB
	execSync("mongosh --eval 'db.runCommand({ping: 1})' --quiet", { stdio: "ignore" });
	console.log("✅ Local MongoDB is running");

	console.log("\n🎉 Local MongoDB is ready!");
	console.log("📋 Next steps:");
	console.log("   1. Test connection: npm run test:connection");
	console.log("   2. Start server: npm run dev");
	console.log("   3. Test CRUD: npm run test:crud");
} catch (error) {
	console.log("❌ MongoDB is not running locally");
	console.log("\n💡 Solutions:");
	console.log("   1. Install MongoDB locally:");
	console.log("      - Download from: https://www.mongodb.com/try/download/community");
	console.log("      - Or use MongoDB Atlas (cloud)");
	console.log("   2. Use Docker (if available):");
	console.log("      docker run -d -p 27017:27017 --name mongodb mongo:latest");
	console.log("   3. Use MongoDB Atlas Data API (no local setup needed)");

	console.log("\n🔄 For now, let's test with a mock database:");
	console.log("   npm run test:connection");
}

console.log("\n💡 To restore MongoDB Atlas later:");
console.log("   cp .env.backup .env");
