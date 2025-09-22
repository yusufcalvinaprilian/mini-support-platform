// config/index.js
const dotenv = require("dotenv");

// Memuat variabel lingkungan dari file .env
dotenv.config();

const config = {
	development: {
		PORT: process.env.PORT,
		MONGODB_URI: process.env.MONGODB_URI,
		JWT_SECRET: process.env.JWT_SECRET,
		JWT_EXPIRE: process.env.JWT_EXPIRE,
		FRONTEND_URL: process.env.FRONTEND_URL,
	},
	production: {
		PORT: process.env.PORT,
		MONGODB_URI: process.env.MONGODB_URI,
		JWT_SECRET: process.env.JWT_SECRET,
		JWT_EXPIRE: process.env.JWT_EXPIRE,
		FRONTEND_URL: process.env.FRONTEND_URL,
	},
};

const currentConfig = config[process.env.NODE_ENV || "development"];

// Validasi variabel lingkungan yang krusial
if (!currentConfig.MONGODB_URI) {
	throw new Error("MONGODB_URI is not defined in the environment variables.");
}
if (!currentConfig.JWT_SECRET) {
	throw new Error("JWT_SECRET is not defined in the environment variables.");
}

module.exports = currentConfig;
