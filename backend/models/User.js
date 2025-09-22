const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// User Schema untuk support platform
const userSchema = new mongoose.Schema(
	{
		// Informasi dasar user
		username: {
			type: String,
			required: [true, "Username is required"],
			unique: true,
			trim: true,
			minlength: [3, "Username must be at least 3 characters"],
			maxlength: [30, "Username cannot exceed 30 characters"],
		},
		email: {
			type: String,
			required: [true, "Email is required"],
			unique: true,
			trim: true,
			lowercase: true,
			match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "Please enter a valid email"],
		},
		password: {
			type: String,
			required: [true, "Password is required"],
			minlength: [6, "Password must be at least 6 characters"],
			select: false, // Jangan tampilkan password di response
		},

		// Informasi profil
		fullName: {
			type: String,
			required: [true, "Full name is required"],
			trim: true,
			maxlength: [100, "Full name cannot exceed 100 characters"],
		},
		avatar: {
			type: String,
			default: null, // URL avatar dari cloud storage
		},
		bio: {
			type: String,
			maxlength: [500, "Bio cannot exceed 500 characters"],
			default: "",
		},

		// Informasi support platform
		supportLink: {
			type: String,
			unique: true,
			sparse: true, // Allow null values but ensure uniqueness when not null
			trim: true,
		},
		isVerified: {
			type: Boolean,
			default: false,
		},
		role: {
			type: String,
			enum: ["user", "admin"],
			default: "user",
		},

		// Statistik user
		totalDonations: {
			type: Number,
			default: 0,
		},
		totalDonors: {
			type: Number,
			default: 0,
		},

		// Status akun
		isActive: {
			type: Boolean,
			default: true,
		},
		lastLogin: {
			type: Date,
			default: null,
		},
	},
	{
		timestamps: true, // Otomatis tambahkan createdAt dan updatedAt
	}
);

// Index untuk performa query (unique fields sudah otomatis di-index)
// userSchema.index({ email: 1 }); // Sudah unique, tidak perlu index manual
// userSchema.index({ username: 1 }); // Sudah unique, tidak perlu index manual
// userSchema.index({ supportLink: 1 }); // Sudah unique, tidak perlu index manual

// Middleware: Hash password sebelum save
userSchema.pre("save", async function (next) {
	// Hanya hash password jika password diubah
	if (!this.isModified("password")) return next();

	try {
		// Hash password dengan salt rounds 12
		const salt = await bcrypt.genSalt(12);
		this.password = await bcrypt.hash(this.password, salt);
		next();
	} catch (error) {
		next(error);
	}
});

// Method: Compare password untuk login
userSchema.methods.comparePassword = async function (candidatePassword) {
	return await bcrypt.compare(candidatePassword, this.password);
};

// Method: Generate support link otomatis
userSchema.methods.generateSupportLink = function () {
	if (!this.supportLink) {
		this.supportLink = `support-${this.username.toLowerCase()}`;
	}
	return this.supportLink;
};

// Method: Update last login
userSchema.methods.updateLastLogin = function () {
	this.lastLogin = new Date();
	return this.save();
};

// Virtual: Public profile data (tanpa password)
userSchema.virtual("publicProfile").get(function () {
	return {
		id: this._id,
		username: this.username,
		fullName: this.fullName,
		avatar: this.avatar,
		bio: this.bio,
		supportLink: this.supportLink,
		isVerified: this.isVerified,
		totalDonations: this.totalDonations,
		totalDonors: this.totalDonors,
		createdAt: this.createdAt,
	};
});

// Transform JSON output
userSchema.set("toJSON", {
	virtuals: true,
	transform: function (doc, ret) {
		delete ret.password;
		delete ret.__v;
		return ret;
	},
});

module.exports = mongoose.model("User", userSchema);
