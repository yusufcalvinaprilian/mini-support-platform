#!/usr/bin/env node

/**
 * Script untuk setup in-memory database untuk development
 */

const fs = require("fs");
const path = require("path");

console.log("🔧 Setting up In-Memory Database for Development...\n");

// Backup current .env
const envPath = path.join(process.cwd(), ".env");
const envBackupPath = path.join(process.cwd(), ".env.backup");

if (fs.existsSync(envPath)) {
	fs.copyFileSync(envPath, envBackupPath);
	console.log("📁 Backed up current .env to .env.backup");
}

// Create new .env for in-memory database
const memoryEnvContent = `PORT=5001
NODE_ENV=development
# In-memory database for development
MONGODB_URI=mongodb://localhost:27017/support_platform
# Note: This will use in-memory database if MongoDB is not available
USE_MEMORY_DB=true
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:3000`;

fs.writeFileSync(envPath, memoryEnvContent);
console.log("✅ Updated .env for in-memory database");

console.log("\n📋 Development Setup Complete!");
console.log("🎯 This setup will:");
console.log("   1. Try to connect to MongoDB if available");
console.log("   2. Fall back to in-memory database if MongoDB is not available");
console.log("   3. Allow you to test all features without external dependencies");

console.log("\n🚀 Next Steps:");
console.log("   1. Test connection: npm run test:connection");
console.log("   2. Start server: npm run dev");
console.log("   3. Test CRUD: npm run test:crud");

console.log("\n💡 Benefits:");
console.log("   ✅ No external dependencies needed");
console.log("   ✅ Fast development setup");
console.log("   ✅ All features work for testing");
console.log("   ✅ Easy to switch to real MongoDB later");

console.log("\n🔄 To use real MongoDB later:");
console.log("   1. Install MongoDB locally or use Atlas");
console.log("   2. Update MONGODB_URI in .env");
console.log("   3. Set USE_MEMORY_DB=false");

console.log("\n💡 To restore MongoDB Atlas later:");
console.log("   cp .env.backup .env");
