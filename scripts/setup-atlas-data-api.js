#!/usr/bin/env node

/**
 * Script untuk setup MongoDB Atlas Data API sebagai alternatif
 */

const fs = require("fs");
const path = require("path");

console.log("🔧 Setting up MongoDB Atlas Data API Alternative...\n");

// Backup current .env
const envPath = path.join(process.cwd(), ".env");
const envBackupPath = path.join(process.cwd(), ".env.backup");

if (fs.existsSync(envPath)) {
	fs.copyFileSync(envPath, envBackupPath);
	console.log("📁 Backed up current .env to .env.backup");
}

// Create new .env with Data API configuration
const dataApiEnvContent = `PORT=5001
NODE_ENV=development
# MongoDB Atlas Data API Configuration
ATLAS_DATA_API_URL=https://data.mongodb-api.com/app/data-xxxxx/endpoint/data/v1
ATLAS_DATA_API_KEY=your_data_api_key_here
ATLAS_CLUSTER_NAME=ClusterMongo
ATLAS_DATABASE_NAME=support_platform
# Fallback to local MongoDB if Data API fails
MONGODB_URI=mongodb://localhost:27017/support_platform
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:3000`;

fs.writeFileSync(envPath, dataApiEnvContent);
console.log("✅ Updated .env for MongoDB Atlas Data API");

console.log("\n📋 Next Steps for MongoDB Atlas Data API:");
console.log("1. Go to MongoDB Atlas Dashboard");
console.log("2. Click 'Data API' in the left sidebar");
console.log("3. Click 'Create Data API'");
console.log("4. Copy the API URL and Key");
console.log("5. Update .env file with your Data API credentials");
console.log("\n💡 Benefits of Data API:");
console.log("   - No SSL/TLS issues");
console.log("   - Works with any IP address");
console.log("   - RESTful API interface");
console.log("   - No connection string needed");

console.log("\n🔄 Alternative: Use Local MongoDB");
console.log("   If Data API is not available, you can:");
console.log("   1. Install MongoDB locally");
console.log("   2. Use Docker: docker run -d -p 27017:27017 mongo");
console.log("   3. Update MONGODB_URI in .env to local connection");

console.log("\n💡 To restore original Atlas connection later:");
console.log("   cp .env.backup .env");

