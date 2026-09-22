const { rateLimit, ipKeyGenerator } = require("express-rate-limit");
const getClientIp = require("../utils/getClientIp");

// Защита от подбора пароля / спама регистраций.
const loginLimiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 минут
	max: 10,
	keyGenerator: (req) => ipKeyGenerator(getClientIp(req)),
	standardHeaders: true,
	legacyHeaders: false,
	skipSuccessfulRequests: true, // успешные логины не расходуют лимит
	handler: (req, res, next) => {
		next(
			new ApiError(
				429,
				"RATE_LIMIT_EXCEEDED",
				"Слишком много попыток входа. Повторите позже."
			)
		);
	},
});

// forgot-password рассылает письмо — лимитируем отдельно и мягче,
// чтобы нельзя было завалить чужой email уведомлениями
const forgotPasswordLimiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	max: 5,
	keyGenerator: (req) => ipKeyGenerator(getClientIp(req)),
	standardHeaders: true,
	legacyHeaders: false,
	handler: (req, res, next) => {
		next(
			new ApiError(
				429,
				"RATE_LIMIT_EXCEEDED",
				"Слишком много запросов. Повторите позже."
			)
		);
	},
});

module.exports = { loginLimiter, forgotPasswordLimiter };
