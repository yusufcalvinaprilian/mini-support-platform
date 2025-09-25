#!/usr/bin/env node

/**
 * Script untuk menjalankan semua test secara berurutan
 * Menjalankan: node scripts/run-all-tests.js
 */

const { spawn } = require("child_process");
const path = require("path");

console.log("🚀 Running All Tests for Support Platform\n");

const tests = [
	{
		name: "Get IP Address",
		script: "get-ip.js",
		description: "Getting your current IP address for MongoDB Atlas whitelist",
	},
	{
		name: "Test MongoDB Connection",
		script: "test-connection.js",
		description: "Testing connection to MongoDB Atlas",
	},
	{
		name: "Test CRUD Operations",
		script: "test-crud.js",
		description: "Testing all API endpoints and CRUD operations",
	},
];

const runTest = (test) => {
	return new Promise((resolve) => {
		console.log(`\n📋 ${test.name}`);
		console.log(`📝 ${test.description}`);
		console.log("─".repeat(50));

		const child = spawn("node", [path.join(__dirname, test.script)], {
			stdio: "inherit",
			cwd: process.cwd(),
		});

		child.on("close", (code) => {
			if (code === 0) {
				console.log(`✅ ${test.name}: PASSED\n`);
			} else {
				console.log(`❌ ${test.name}: FAILED (exit code: ${code})\n`);
			}
			resolve(code === 0);
		});

		child.on("error", (error) => {
			console.log(`❌ ${test.name}: ERROR - ${error.message}\n`);
			resolve(false);
		});
	});
};

const runAllTests = async () => {
	console.log("🎯 Starting comprehensive test suite...\n");

	let allPassed = true;

	for (const test of tests) {
		const passed = await runTest(test);
		if (!passed) {
			allPassed = false;

			if (test.name === "Get IP Address") {
				console.log("💡 Please add your IP to MongoDB Atlas Network Access");
				console.log("   Then run: node scripts/test-connection.js\n");
				break;
			} else if (test.name === "Test MongoDB Connection") {
				console.log("💡 Please check your MongoDB connection string in .env file");
				console.log("   Make sure IP is whitelisted and credentials are correct\n");
				break;
			} else if (test.name === "Test CRUD Operations") {
				console.log("💡 Please start the server first: npm run dev");
				console.log("   Then run: node scripts/test-crud.js\n");
				break;
			}
		}
	}

	if (allPassed) {
		console.log("🎉 All tests passed! Your Support Platform is ready to use!");
		console.log("\n📊 Next steps:");
		console.log("   1. Start the server: npm run dev");
		console.log("   2. Open http://localhost:5001 in your browser");
		console.log("   3. Test API endpoints with Postman or curl");
		console.log("   4. Start building your frontend!");
	} else {
		console.log("❌ Some tests failed. Please fix the issues above.");
	}
};

runAllTests();

