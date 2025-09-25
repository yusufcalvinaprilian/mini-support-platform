const User = require("../models/User");
const jwt = require("jsonwebtoken");
const config = require("../config/env");
const mongoose = require("mongoose");

// Generate JWT Token
const generateToken = (userId) => {
	// Menggunakan process.env.JWT_SECRET dan JWT_EXPIRE untuk menghindari konflik impor config
	return jwt.sign({ userId }, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_EXPIRE,
	});
};

// @desc    Register new user
// @route   POST /api/users/register
// @access  Public
const registerUser = async (req, res) => {
	try {
		const { username, email, password, fullName, role } = req.body;

		if (!username || !email || !password || !fullName) {
			return res.status(400).json({
				// DITAMBAHKAN 'return'
				success: false,
				message: "All fields are required",
			});
		}

		const existingUser = await User.findOne({
			$or: [{ email }, { username }],
		});

		if (existingUser) {
			return res.status(400).json({
				// DITAMBAHKAN 'return'
				success: false,
				message: "User with this email or username already exists",
			});
		}

		// Catatan: Password akan di-hash oleh middleware pre-save di model
		const user = await User.create({
			username,
			email,
			password,
			fullName,
			role: role || "fan",
		});

		if (user.role === "creator") {
			// Logika untuk generate support link dan simpan (jika diperlukan)
			// user.generateSupportLink();
			// await user.save();
		}

		const token = generateToken(user._id);

		return res.status(201).json({
			// DITAMBAHKAN 'return'
			success: true,
			message: "User registered successfully",
			data: {
				user: {
					id: user._id,
					username: user.username,
					email: user.email,
					role: user.role,
				},
				token,
			},
		});
	} catch (error) {
		console.error("Register error:", error);
		return res.status(500).json({
			// DITAMBAHKAN 'return'
			success: false,
			message: "Server error during registration",
			error: process.env.NODE_ENV === "development" ? error.message : {},
		});
	}
};

// @desc    Login user
// @route   POST /api/users/login
// @access  Public
const loginUser = async (req, res) => {
	try {
		const { username, password } = req.body;

		if (!username || !password) {
			return res.status(400).json({
				// DITAMBAHKAN 'return'
				success: false,
				message: "Username and password are required",
			});
		}

		const user = await User.findOne({ username }).select("+password");

		if (!user) {
			return res.status(401).json({
				// DITAMBAHKAN 'return'
				success: false,
				message: "Invalid credentials",
			});
		}

		const isPasswordValid = await user.comparePassword(password);

		if (!isPasswordValid) {
			return res.status(401).json({
				// DITAMBAHKAN 'return'
				success: false,
				message: "Invalid credentials",
			});
		}

		// Update last login (diasumsikan updateLastLogin mengembalikan promise save)
		await user.updateLastLogin();

		const token = generateToken(user._id);

		return res.status(200).json({
			// DITAMBAHKAN 'return'
			success: true,
			message: "Login successful",
			token, // Kirim token di tingkat teratas
			user: user.publicProfile, // Kirim data user di tingkat teratas
		});
	} catch (error) {
		console.error("Login error:", error);
		return res.status(500).json({
			// DITAMBAHKAN 'return'
			success: false,
			message: "Server error during login",
			error: process.env.NODE_ENV === "development" ? error.message : {},
		});
	}
};

// @desc    Get all users (with pagination)
// @route   GET /api/users
// @access  Public
const getUsers = async (req, res) => {
	try {
		const page = parseInt(req.query.page) || 1;
		const limit = parseInt(req.query.limit) || 10;
		const skip = (page - 1) * limit;

		const users = await User.find({ isActive: true }).select("-password").sort({ createdAt: -1 }).skip(skip).limit(limit);

		const total = await User.countDocuments({ isActive: true });

		return res.status(200).json({
			// DITAMBAHKAN 'return'
			success: true,
			users: users.map((user) => user.publicProfile),
			pagination: {
				currentPage: page,
				totalPages: Math.ceil(total / limit),
				totalUsers: total,
				hasNext: page < Math.ceil(total / limit),
				hasPrev: page > 1,
			},
		});
	} catch (error) {
		console.error("Get users error:", error);
		return res.status(500).json({
			// DITAMBAHKAN 'return'
			success: false,
			message: "Server error while fetching users",
			error: process.env.NODE_ENV === "development" ? error.message : {},
		});
	}
};

// @desc    Get all creators
// @route   GET /api/users/creators
// @access  Public
const getCreators = async (req, res) => {
	try {
		const creators = await User.find({ role: "creator", isActive: true });
		return res.status(200).json(creators.map((creator) => creator.publicProfile)); // DITAMBAHKAN 'return'
	} catch (error) {
		console.error("Get creators error:", error);
		return res.status(500).json({
			// DITAMBAHKAN 'return'
			success: false,
			message: "Server error while fetching creators",
			error: process.env.NODE_ENV === "development" ? error.message : {},
		});
	}
};

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Public
const getUserById = async (req, res) => {
	try {
		const { id } = req.params;

		if (!mongoose.Types.ObjectId.isValid(id)) {
			return res.status(400).json({
				// DITAMBAHKAN 'return'
				success: false,
				message: "Invalid user ID format",
			});
		}

		const user = await User.findById(id).select("-password");

		if (!user || !user.isActive) {
			return res.status(404).json({
				// DITAMBAHKAN 'return'
				success: false,
				message: "User not found",
			});
		}

		return res.status(200).json({
			// DITAMBAHKAN 'return'
			success: true,
			data: {
				user: user.publicProfile,
			},
		});
	} catch (error) {
		console.error("Get user error:", error);
		return res.status(500).json({
			// DITAMBAHKAN 'return'
			success: false,
			message: "Server error while fetching user",
			error: process.env.NODE_ENV === "development" ? error.message : {},
		});
	}
};
// Sisanya sama, pastikan fungsi diekspor
const getUserBySupportLink = async (req, res) => {
	/* ... */
};
const updateUser = async (req, res) => {
	/* ... */
};
const deleteUser = async (req, res) => {
	/* ... */
};

module.exports = {
	registerUser,
	loginUser,
	getUsers,
	getCreators,
	getUserById,
	getUserBySupportLink,
	updateUser,
	deleteUser,
};
