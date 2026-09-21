const jwt = require("jsonwebtoken");
const User = require("../models/User");
const ApiError = require("../utils/ApiError");

const getBearerToken = (req) => {
	const header = req.headers.authorization;

	if (!header?.startsWith("Bearer ")) {
		return null;
	}

	return header.slice(7).trim();
};

// Защита роутов — проверяем Bearer access-токен
const protect = async (req, res, next) => {
	const token = getBearerToken(req);

	if (!token) {
		return next(new ApiError(
			401,
			"AUTH_REQUIRED",
			"Не авторизован. Токен отсутствует."
		));
	}

	try {
		const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

		const user = await User.findById(decoded.sub)
			.select("-password");

		if (!user) {
			return next(new ApiError(
				401,
				"USER_NOT_FOUND",
				"Пользователь не найден."
			));
		}

		req.user = user;
		next();
	} catch (error) {
		next(error);
	}
};

// Опциональная авторизация: если есть валидный Bearer-токен — подтягиваем юзера,
// если нет или он невалиден — просто идём дальше без req.user
const optionalAuth = async (req, res, next) => {
	const token = getBearerToken(req);

	if (!token) {
		return next();
	}

	try {
		const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

		req.user = await User.findById(decoded.sub)
			.select("-password");
	} catch {
		// Необязательная авторизация не блокирует запрос.
	}

	next();
};

// Доступ только для роли admin. Должен стоять СТРОГО после protect —
// читает req.user, который заполняет protect.
const adminOnly = (req, res, next) => {
	if (req.user?.role !== "admin") {
		return next(new ApiError(
			403,
			"FORBIDDEN",
			"Доступ запрещён. Требуются права администратора."
		));
	}
	next();
};

module.exports = { protect, optionalAuth, adminOnly };
