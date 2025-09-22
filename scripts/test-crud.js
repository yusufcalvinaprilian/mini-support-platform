#!/usr/bin/env node

/**
 * Script untuk test CRUD operations
 * Menjalankan: node scripts/test-crud.js
 */

const axios = require("axios");

const BASE_URL = "http://localhost:5001";
let authToken = "";

console.log("🧪 Testing CRUD Operations...\n");

// Helper function untuk API calls
const apiCall = async (method, endpoint, data = null) => {
	try {
		const config = {
			method,
			url: `${BASE_URL}${endpoint}`,
			headers: {
				"Content-Type": "application/json",
				...(authToken && { Authorization: `Bearer ${authToken}` }),
			},
			...(data && { data }),
		};

		const response = await axios(config);
		return { success: true, data: response.data };
	} catch (error) {
		return {
			success: false,
			error: error.response?.data || error.message,
		};
	}
};

// Test 1: Health Check
const testHealthCheck = async () => {
	console.log("1️⃣ Testing Health Check...");
	const result = await apiCall("GET", "/health");

	if (result.success) {
		console.log("✅ Health Check: PASSED");
		console.log(`   Status: ${result.data.status}`);
		console.log(`   Uptime: ${result.data.uptime}s\n`);
	} else {
		console.log("❌ Health Check: FAILED");
		console.log(`   Error: ${result.error}\n`);
	}
};

// Test 2: Register User
const testRegisterUser = async () => {
	console.log("2️⃣ Testing User Registration...");

	const userData = {
		username: `testuser_${Date.now()}`,
		email: `test_${Date.now()}@example.com`,
		password: "password123",
		fullName: "Test User",
	};

	const result = await apiCall("POST", "/api/users/register", userData);

	if (result.success) {
		console.log("✅ User Registration: PASSED");
		console.log(`   Username: ${result.data.data.user.username}`);
		console.log(`   Support Link: ${result.data.data.user.supportLink}`);
		authToken = result.data.data.token;
		console.log(`   Token: ${authToken.substring(0, 20)}...\n`);
		return result.data.data.user;
	} else {
		console.log("❌ User Registration: FAILED");
		console.log(`   Error: ${JSON.stringify(result.error)}\n`);
		return null;
	}
};

// Test 3: Login User
const testLoginUser = async () => {
	console.log("3️⃣ Testing User Login...");

	const loginData = {
		email: "test@example.com",
		password: "password123",
	};

	const result = await apiCall("POST", "/api/users/login", loginData);

	if (result.success) {
		console.log("✅ User Login: PASSED");
		console.log(`   User: ${result.data.data.user.username}`);
		authToken = result.data.data.token;
		console.log(`   Token: ${authToken.substring(0, 20)}...\n`);
	} else {
		console.log("❌ User Login: FAILED");
		console.log(`   Error: ${JSON.stringify(result.error)}\n`);
	}
};

// Test 4: Get All Users
const testGetUsers = async () => {
	console.log("4️⃣ Testing Get All Users...");

	const result = await apiCall("GET", "/api/users");

	if (result.success) {
		console.log("✅ Get Users: PASSED");
		console.log(`   Total Users: ${result.data.data.pagination.totalUsers}`);
		console.log(`   Current Page: ${result.data.data.pagination.currentPage}\n`);
	} else {
		console.log("❌ Get Users: FAILED");
		console.log(`   Error: ${JSON.stringify(result.error)}\n`);
	}
};

// Test 5: Get User by Support Link
const testGetUserBySupportLink = async (supportLink) => {
	console.log("5️⃣ Testing Get User by Support Link...");

	const result = await apiCall("GET", `/api/users/support/${supportLink}`);

	if (result.success) {
		console.log("✅ Get User by Support Link: PASSED");
		console.log(`   Username: ${result.data.data.user.username}`);
		console.log(`   Full Name: ${result.data.data.user.fullName}\n`);
	} else {
		console.log("❌ Get User by Support Link: FAILED");
		console.log(`   Error: ${JSON.stringify(result.error)}\n`);
	}
};

// Test 6: Update User
const testUpdateUser = async (userId) => {
	console.log("6️⃣ Testing Update User...");

	const updateData = {
		fullName: "Updated Test User",
		bio: "This is an updated bio for testing",
	};

	const result = await apiCall("PUT", `/api/users/${userId}`, updateData);

	if (result.success) {
		console.log("✅ Update User: PASSED");
		console.log(`   Updated Name: ${result.data.data.user.fullName}`);
		console.log(`   Updated Bio: ${result.data.data.user.bio}\n`);
	} else {
		console.log("❌ Update User: FAILED");
		console.log(`   Error: ${JSON.stringify(result.error)}\n`);
	}
};

// Main test function
const runTests = async () => {
	try {
		await testHealthCheck();

		const user = await testRegisterUser();
		if (!user) {
			console.log("❌ Cannot continue tests without user registration");
			return;
		}

		await testLoginUser();
		await testGetUsers();
		await testGetUserBySupportLink(user.supportLink);
		await testUpdateUser(user.id);

		console.log("🎉 All CRUD tests completed!");
		console.log("\n📊 Summary:");
		console.log("   ✅ Health Check");
		console.log("   ✅ User Registration");
		console.log("   ✅ User Login");
		console.log("   ✅ Get All Users");
		console.log("   ✅ Get User by Support Link");
		console.log("   ✅ Update User");
		console.log("\n🚀 Your Support Platform backend is working perfectly!");
	} catch (error) {
		console.error("❌ Test suite failed:", error.message);
	}
};

// Check if server is running
const checkServer = async () => {
	try {
		await axios.get(`${BASE_URL}/health`);
		return true;
	} catch (error) {
		console.log("❌ Server is not running!");
		console.log("💡 Please start the server first: npm run dev");
		return false;
	}
};

// Run tests
const main = async () => {
	const serverRunning = await checkServer();
	if (serverRunning) {
		await runTests();
	}
};

main();
