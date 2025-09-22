const User = require("../models/User");
const jwt = require("jsonwebtoken");
const config = require("../config/env");

// Generate JWT Token
const generateToken = (userId) => {
	return jwt.sign({ userId }, config.JWT_SECRET, {
		expiresIn: config.JWT_EXPIRE,
	});
};

// @desc    Register new user
// @route   POST /api/users/register
// @access  Public
const registerUser = async (req, res) => {
	try {
		const { username, email, password, fullName } = req.body;

		// Validasi input
		if (!username || !email || !password || !fullName) {
			return res.status(400).json({
				success: false,
				message: "All fields are required",
			});
		}

		// Cek apakah user sudah ada
		const existingUser = await User.findOne({
			$or: [{ email }, { username }],
		});

		if (existingUser) {
			return res.status(400).json({
				success: false,
				message: "User with this email or username already exists",
			});
		}

		// Buat user baru
		const user = await User.create({
			username,
			email,
			password,
			fullName,
		});

		// Generate support link otomatis
		user.generateSupportLink();
		await user.save();

		// Generate token
		const token = generateToken(user._id);

		res.status(201).json({
			success: true,
			message: "User registered successfully",
			data: {
				user: user.publicProfile,
				token,
			},
		});
	} catch (error) {
		console.error("Register error:", error);
		res.status(500).json({
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
		const { email, password } = req.body;

		// Validasi input
		if (!email || !password) {
			return res.status(400).json({
				success: false,
				message: "Email and password are required",
			});
		}

		// Cari user dengan password
		const user = await User.findOne({ email }).select("+password");

		if (!user) {
			return res.status(401).json({
				success: false,
				message: "Invalid credentials",
			});
		}

		// Cek password
		const isPasswordValid = await user.comparePassword(password);

		if (!isPasswordValid) {
			return res.status(401).json({
				success: false,
				message: "Invalid credentials",
			});
		}

		// Update last login
		await user.updateLastLogin();

		// Generate token
		const token = generateToken(user._id);

		res.status(200).json({
			success: true,
			message: "Login successful",
			data: {
				user: user.publicProfile,
				token,
			},
		});
	} catch (error) {
		console.error("Login error:", error);
		res.status(500).json({
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

		// Query users dengan pagination
		const users = await User.find({ isActive: true }).select("-password").sort({ createdAt: -1 }).skip(skip).limit(limit);

		// Total count untuk pagination
		const total = await User.countDocuments({ isActive: true });

		res.status(200).json({
			success: true,
			data: {
				users,
				pagination: {
					currentPage: page,
					totalPages: Math.ceil(total / limit),
					totalUsers: total,
					hasNext: page < Math.ceil(total / limit),
					hasPrev: page > 1,
				},
			},
		});
	} catch (error) {
		console.error("Get users error:", error);
		res.status(500).json({
			success: false,
			message: "Server error while fetching users",
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

		const user = await User.findById(id).select("-password");

		if (!user) {
			return res.status(404).json({
				success: false,
				message: "User not found",
			});
		}

		res.status(200).json({
			success: true,
			data: {
				user,
			},
		});
	} catch (error) {
		console.error("Get user error:", error);
		res.status(500).json({
			success: false,
			message: "Server error while fetching user",
			error: process.env.NODE_ENV === "development" ? error.message : {},
		});
	}
};

// @desc    Get user by support link
// @route   GET /api/users/support/:supportLink
// @access  Public
const getUserBySupportLink = async (req, res) => {
	try {
		const { supportLink } = req.params;

		const user = await User.findOne({ supportLink }).select("-password");

		if (!user) {
			return res.status(404).json({
				success: false,
				message: "Support page not found",
			});
		}

		res.status(200).json({
			success: true,
			data: {
				user,
			},
		});
	} catch (error) {
		console.error("Get user by support link error:", error);
		res.status(500).json({
			success: false,
			message: "Server error while fetching support page",
			error: process.env.NODE_ENV === "development" ? error.message : {},
		});
	}
};

// @desc    Update user profile
// @route   PUT /api/users/:id
// @access  Private (akan ditambahkan middleware auth)
const updateUser = async (req, res) => {
	try {
		const { id } = req.params;
		const { fullName, bio, avatar } = req.body;

		// Validasi input
		const updateData = {};
		if (fullName) updateData.fullName = fullName;
		if (bio !== undefined) updateData.bio = bio;
		if (avatar) updateData.avatar = avatar;

		const user = await User.findByIdAndUpdate(id, updateData, { new: true, runValidators: true }).select("-password");

		if (!user) {
			return res.status(404).json({
				success: false,
				message: "User not found",
			});
		}

		res.status(200).json({
			success: true,
			message: "User updated successfully",
			data: {
				user,
			},
		});
	} catch (error) {
		console.error("Update user error:", error);
		res.status(500).json({
			success: false,
			message: "Server error while updating user",
			error: process.env.NODE_ENV === "development" ? error.message : {},
		});
	}
};

// @desc    Delete user (soft delete)
// @route   DELETE /api/users/:id
// @access  Private (akan ditambahkan middleware auth)
const deleteUser = async (req, res) => {
	try {
		const { id } = req.params;

		const user = await User.findByIdAndUpdate(id, { isActive: false }, { new: true });

		if (!user) {
			return res.status(404).json({
				success: false,
				message: "User not found",
			});
		}

		res.status(200).json({
			success: true,
			message: "User deactivated successfully",
		});
	} catch (error) {
		console.error("Delete user error:", error);
		res.status(500).json({
			success: false,
			message: "Server error while deleting user",
			error: process.env.NODE_ENV === "development" ? error.message : {},
		});
	}
};

module.exports = {
	registerUser,
	loginUser,
	getUsers,
	getUserById,
	getUserBySupportLink,
	updateUser,
	deleteUser,
};
