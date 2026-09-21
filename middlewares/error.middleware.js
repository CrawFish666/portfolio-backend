const mongoose = require("mongoose");
const { ZodError } = require("zod");
const jwt = require("jsonwebtoken");

module.exports = (err, req, res, next) => {
	let status = err.status || err.statusCode || 500;
	let code = err.code || "INTERNAL_SERVER_ERROR";
	let message = err.message || "Внутренняя ошибка сервера";
	let details = err.details ?? null;

	if (err instanceof ZodError) {
		status = 400;
		code = "VALIDATION_ERROR";
		message = "Ошибка валидации";

		details = err.issues.map((issue) => ({
			field: issue.path.join("."),
			message: issue.message,
		}));
	}

	if (err.code === 11000) {
		status = 409;
		code = "DUPLICATE_RESOURCE";
		message = "Такая запись уже существует";

		const field = Object.keys(err.keyValue || {})[0];

		details = field
			? [{ field, message: `Поле "${field}" уже существует` }]
			: null;
	}

	if (err instanceof mongoose.Error.CastError) {
		status = 400;
		code = "INVALID_ID";
		message = "Некорректный идентификатор";
		details = null;
	}

	if (err instanceof mongoose.Error.ValidationError) {
		status = 400;
		code = "DATABASE_VALIDATION_ERROR";
		message = "Ошибка данных";

		details = Object.entries(err.errors).map(([field, error]) => ({
			field,
			message: error.message,
		}));
	}

	if (err instanceof jwt.TokenExpiredError) {
		status = 401;
		code = "TOKEN_EXPIRED";
		message = "Срок действия токена истёк";
		details = null;
	}

	if (err instanceof jwt.JsonWebTokenError) {
		status = 401;
		code = "INVALID_TOKEN";
		message = "Некорректный токен";
		details = null;
	}

	if (status >= 500) {
		console.error({
			method: req.method,
			url: req.originalUrl,
			message: err.message,
			stack: err.stack,
		});
	}

	return res.status(status).json({
		success: false,
		message,
		error: {
			code,
			details,
		},
	});
}
