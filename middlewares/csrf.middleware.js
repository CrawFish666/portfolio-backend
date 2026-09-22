const ApiError = require("../utils/ApiError");
const env = require("../config/env");

const csrfMiddleware = (req, res, next) => {
	const origin = req.get("Origin");

	if (!origin || !env.clientOrigins.includes(origin)) {
		return next(
			new ApiError(
				403,
				"CSRF_ORIGIN_INVALID",
				"Недопустимый origin"
			)
		);
	}

	next();
};

module.exports = csrfMiddleware;