// Валидирует переменные окружения и вызывает dotenv.config(). IMPORTANT: должно быть первым
const env = require("./config/env");
const mongoose = require("mongoose");
const path = require("path");
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");

const connectDB = require("./config/db");
const notFoundMiddleware = require("./middlewares/notFound.middleware");
const errorMiddleware = require("./middlewares/error.middleware");

const routes = require("./routes");
const bootstrap = require("./scripts/bootstrap");
const sendSuccess = require("./utils/sendSuccess");

const app = express();

app.set("trust proxy", 1);
// ─── Middleware ───────────────────────────────────────────
app.use(
	helmet({

		contentSecurityPolicy: false,

		crossOriginResourcePolicy: { policy: "cross-origin" },
	})
);
app.use(
	cors({
		origin: (origin, callback) => {
			// Разрешаем Postman, curl и server-to-server запросы (origin отсутствует)
			if (!origin || env.clientOrigins.includes(origin)) {
				return callback(null, true);
			}
			return callback(new Error(`CORS: ${origin} не разрешён.`));
		},
		credentials: true,
	})
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ─── Routes ──────────────────────────────────────────────
app.get("/api", (req, res) => {
	sendSuccess(res, {
		message: "API работает",
	});
});

app.use("/api", routes);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ─── Универсальный 404 ────────────────────────────────────
app.use(notFoundMiddleware);
// ─── Error Handler ───────────────────────────────────────
app.use(errorMiddleware);

// ─── Запуск сервера ───────────────────────────────────────
const startServer = async () => {
	console.log("[server] Запуск приложения...");

	await connectDB();
	console.log("[server] MongoDB подключена");

	await bootstrap();

	const server = app.listen(env.port, "0.0.0.0", () => {
		console.log(
			`[server] Сервер запущен на http://localhost:${env.port}`
		);
	});

	const shutdown = async (signal) => {
		console.log(`[server] Получен сигнал ${signal}`);

		server.close(async () => {
			await mongoose.connection.close();

			console.log("[server] MongoDB соединение закрыто");
			console.log("[server] Сервер остановлен");

			process.exit(0);
		});
	};

	process.on("SIGINT", () => shutdown("SIGINT"));
	process.on("SIGTERM", () => shutdown("SIGTERM"));
};

startServer().catch((error) => {
	console.error("Ошибка запуска сервера:", error);
	process.exit(1);
});
