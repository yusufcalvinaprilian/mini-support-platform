const express = require("express");
const { registerUser, loginUser, getUsers, getUserById, getUserBySupportLink, updateUser, deleteUser, getCreators } = require("../controllers/userController");
const auth = require("../middleware/auth"); // Asumsi middleware auth sudah ada

const router = express.Router();

// Rute Publik (tidak memerlukan token)
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/creators", getCreators);
router.get("/", getUsers);
router.get("/support/:supportLink", getUserBySupportLink);
router.get("/:id", getUserById);

// Rute Privat (memerlukan token)
// @route   PUT /api/users/:id
// @desc    Update user profile
// @access  Private
router.put("/:id", auth, updateUser);

// @route   DELETE /api/users/:id
// @desc    Delete user (soft delete)
// @access  Private
router.delete("/:id", auth, deleteUser);

// Tambahkan rute privat lainnya di sini
// Contoh: Rute untuk membuat postingan dan donasi
// Rute ini juga harus menggunakan middleware 'auth'

module.exports = router;
