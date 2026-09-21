const rateLimit = require("express-rate-limit");

const feedbackLimiter = rateLimit({
	windowMs: 60 * 1000, // 1 минута 
	max: 3,
	standardHeaders: true,
	legacyHeaders: false,
	message: {
		message: "Повторная отправка возможна через минуту",
	},
});
module.exports = feedbackLimiter;