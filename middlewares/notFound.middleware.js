const ApiError = require("../utils/ApiError");

const notFoundMiddleware = (req, res, next) => {
	next(new ApiError(
		404,
		"ROUTE_NOT_FOUND",
		"Маршрут не найден"
	));
};

module.exports = notFoundMiddleware;
