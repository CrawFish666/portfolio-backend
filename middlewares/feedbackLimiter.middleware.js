const rateLimit = require("express-rate-limit");
const { ipKeyGenerator } = require("express-rate-limit");
const getClientIp = require("../utils/getClientIp");

const feedbackLimiter = rateLimit({
	windowMs: 60 * 1000, // 1 минута 
	max: 3,
	keyGenerator: (req) => ipKeyGenerator(getClientIp(req)),
	standardHeaders: true,
	legacyHeaders: false,
	message: {
		message: "Повторная отправка возможна через минуту",
	},
});
module.exports = feedbackLimiter;