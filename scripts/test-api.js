const axios = require("axios");

const BASE_URL = "http://localhost:5001/api";
let jwtToken = null;
let testUserId = null;
let testUsername = null;
let testPostId = null;

const testResults = [];

function logResult(name, success, detail = "") {
	testResults.push({ name, success, detail });
	const status = success ? "✅" : "❌";
	console.log(`${status} ${name}${detail ? " - " + detail : ""}`);
}

async function testRegisterAndLogin() {
	try {
		testUsername = "test_creator_" + Date.now();
		const res = await axios.post(`${BASE_URL}/users/register`, {
			username: testUsername,
			email: `${testUsername}@mail.com`,
			password: "testpassword",
			fullName: "Test Creator",
			role: "creator", // Tambahkan role creator
		});

		if (res.data.data && res.data.data.user && res.data.data.user.id) {
			testUserId = res.data.data.user.id;
			jwtToken = res.data.data.token;
			logResult("Registrasi & Login user creator", true, "User ID: " + testUserId);
		} else {
			logResult("Registrasi & Login user creator", false, "Respons tidak sesuai");
			return false;
		}
	} catch (err) {
		logResult("Registrasi & Login user creator", false, err.response?.data?.message || err.message);
		return false;
	}
	return true;
}

async function testGetCreators() {
	try {
		const res = await axios.get(`${BASE_URL}/users/creators`);
		if (Array.isArray(res.data) && res.data.length > 0) {
			logResult("Ambil daftar creator", true);
		} else {
			logResult("Ambil daftar creator", false, "Response bukan array atau kosong");
		}
	} catch (err) {
		logResult("Ambil daftar creator", false, err.response?.data?.error || err.message);
	}
}

async function testCreatePost() {
	if (!jwtToken) {
		logResult("Buat postingan baru", false, "Token JWT tidak ditemukan");
		return;
	}
	if (!testUserId) {
		logResult("Buat postingan baru", false, "User ID tidak ditemukan");
		return;
	}

	try {
		const res = await axios.post(
			`${BASE_URL}/posts`,
			{
				// Menggunakan nama field yang benar sesuai skema
				creator: testUserId,
				title: "Judul Postingan Test",
				content: "Isi konten test",
				media_url: "https://via.placeholder.com/150",
			},
			{
				headers: { Authorization: `Bearer ${jwtToken}` },
			}
		);

		if (res.data && res.data._id) {
			testPostId = res.data._id;
			logResult("Buat postingan baru", true);
		} else {
			logResult("Buat postingan baru", false, "Tidak ada _id di response");
		}
	} catch (err) {
		logResult("Buat postingan baru", false, err.response?.data?.error || err.message);
	}
}

async function testSupport() {
	if (!jwtToken) {
		logResult("Kirim support/donasi", false, "Token JWT tidak ditemukan");
		return;
	}
	if (!testUserId || !testPostId) {
		logResult("Kirim support/donasi", false, "Prasyarat tidak terpenuhi (User/Post ID)");
		return;
	}

	try {
		const res = await axios.post(
			`${BASE_URL}/support`,
			{
				// Menggunakan nama field yang benar sesuai skema
				fan_id: testUserId,
				creator_id: testUserId, // Asumsi fan dan creator adalah user yang sama
				amount: 10000,
				message: "Support test",
			},
			{
				headers: { Authorization: `Bearer ${jwtToken}` },
			}
		);

		if (res.data && res.data._id) {
			logResult("Kirim support/donasi", true);
		} else {
			logResult("Kirim support/donasi", false, "Tidak ada _id di response");
		}
	} catch (err) {
		logResult("Kirim support/donasi", false, err.response?.data?.error || err.message);
	}
}

async function runTests() {
	console.log("\n=== Menjalankan Pengujian Otomatis ===");

	const authSuccess = await testRegisterAndLogin();
	if (authSuccess) {
		await testGetCreators();
		await testCreatePost();
		await testSupport();
	}

	console.log("\n=== Ringkasan Pengujian ===");
	testResults.forEach((r) => {
		const status = r.success ? "✅" : "❌";
		console.log(`${status} ${r.name}${r.detail ? " - " + r.detail : ""}`);
	});
	const failed = testResults.filter((r) => !r.success);
	if (failed.length > 0) {
		process.exitCode = 1;
	}
}

runTests();
