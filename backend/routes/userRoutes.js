const express = require("express");
const { registerUser, loginUser, getUsers, getUserById, getUserBySupportLink, updateUser, deleteUser } = require("../controllers/userController");

const router = express.Router();

// @route   POST /api/users/register
// @desc    Register new user
// @access  Public
router.post("/register", registerUser);

// @route   POST /api/users/login
// @desc    Login user
// @access  Public
router.post("/login", loginUser);

// @route   GET /api/users
// @desc    Get all users with pagination
// @access  Public
router.get("/", getUsers);

// @route   GET /api/users/:id
// @desc    Get user by ID
// @access  Public
router.get("/:id", getUserById);

// @route   GET /api/users/support/:supportLink
// @desc    Get user by support link
// @access  Public
router.get("/support/:supportLink", getUserBySupportLink);

// @route   PUT /api/users/:id
// @desc    Update user profile
// @access  Private (akan ditambahkan middleware auth)
router.put("/:id", updateUser);

// @route   DELETE /api/users/:id
// @desc    Delete user (soft delete)
// @access  Private (akan ditambahkan middleware auth)
router.delete("/:id", deleteUser);

module.exports = router;
