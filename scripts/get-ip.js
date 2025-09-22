#!/usr/bin/env node

/**
 * Script untuk mendapatkan IP address saat ini
 * Berguna untuk whitelist di MongoDB Atlas
 */

const https = require("https");

console.log("🌐 Getting your current IP address...\n");

const options = {
	hostname: "api.ipify.org",
	port: 443,
	path: "/",
	method: "GET",
};

const req = https.request(options, (res) => {
	let data = "";

	res.on("data", (chunk) => {
		data += chunk;
	});

	res.on("end", () => {
		const ip = data.trim();
		console.log(`📍 Your current IP address: ${ip}`);
		console.log(`\n💡 Add this IP to MongoDB Atlas Network Access:`);
		console.log(`   1. Go to MongoDB Atlas Dashboard`);
		console.log(`   2. Click "Network Access"`);
		console.log(`   3. Click "Add IP Address"`);
		console.log(`   4. Enter: ${ip}`);
		console.log(`   5. Click "Confirm"`);
		console.log(`\n⏰ Wait 1-2 minutes for changes to take effect`);
		console.log(`\n🧪 Then test connection: node scripts/test-connection.js`);
	});
});

req.on("error", (error) => {
	console.error("❌ Error getting IP address:", error.message);
	console.log("\n💡 Manual steps:");
	console.log("   1. Go to https://whatismyipaddress.com/");
	console.log("   2. Copy your IP address");
	console.log("   3. Add it to MongoDB Atlas Network Access");
});

req.end();
