#!/usr/bin/env node

/**
 * Script untuk setup MongoDB lokal sebagai alternatif
 */

const fs = require("fs");
const path = require("path");

console.log("🔧 Setting up Local MongoDB for Development...\n");

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

console.log("\n📋 Next Steps:");
console.log("1. Install MongoDB locally:");
console.log("   brew install mongodb-community");
console.log("   brew services start mongodb-community");
console.log("\n2. Or use Docker:");
console.log("   docker run -d -p 27017:27017 --name mongodb mongo:latest");
console.log("\n3. Test connection:");
console.log("   npm run test:connection");
console.log("\n4. Start server:");
console.log("   npm run dev");

console.log("\n💡 To restore MongoDB Atlas later:");
console.log("   cp .env.backup .env");
