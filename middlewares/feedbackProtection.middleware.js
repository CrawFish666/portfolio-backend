const ApiError = require("../utils/ApiError");

// Простая защита формы обратной связи от ботов:
// honeypot-поле + минимальное время заполнения формы.
const feedbackProtection = (req, res, next) => {
	const { website, formOpenedAt } = req.body; // honeypot

	if (website && website.trim() !== "") {
		return next(new ApiError(
			400,
			"INVALID_FEEDBACK_REQUEST",
			"Некорректный запрос"
		));
	}
	// минимальное время заполнения формы
	if (formOpenedAt !== undefined) {
		const openedAt = Number(formOpenedAt);
		const fillTime = Date.now() - openedAt;

		if (!Number.isFinite(openedAt) || fillTime < 3000) {
			return next(new ApiError(
				400,
				"FEEDBACK_TOO_FAST",
				"Слишком быстрая отправка"
			));
		}
	}

	next();
};

module.exports = feedbackProtection;
