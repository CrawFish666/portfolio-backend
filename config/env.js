require("dotenv").config();

// Делаем проверку на критичные переменные окружения.
// Если они отсутствуют нет смысла стартовать. А то может вылезти только позже при использовании
const REQUIRED_ENV_VARS = [
	"MONGO_URI",
	"JWT_ACCESS_SECRET",
	"JWT_REFRESH_SECRET",
	"CLIENT_URL",
];

const missing = REQUIRED_ENV_VARS.filter((key) => !process.env[key]);

if (missing.length > 0) {
	console.error(
		`❌ Не заданы обязательные переменные окружения: ${missing.join(", ")}`
	);
	console.error("   Проверь файл .env (см. .env.example).");
	process.exit(1);
}

module.exports = {
	port: process.env.PORT || 5000,
	nodeEnv: process.env.NODE_ENV || "development",
	isProduction: process.env.NODE_ENV === "production",
	mongoUri: process.env.MONGO_URI,
	clientOrigins: process.env.CLIENT_URL.split(",")
		.map((origin) => origin.trim())
		.filter(Boolean),
	adminEmail: process.env.ADMIN_EMAIL || "",
};
