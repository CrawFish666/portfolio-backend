const asyncHandler = require("../utils/asyncHandler");
const feedbackService = require("../services/feedback.service");
const sendSuccess = require("../utils/sendSuccess");


// Валидация вынесена в middlewares/validate.middleware.js (см. роут) —
// сюда req.body приходит уже провалидированным.
const createFeedback = asyncHandler(async (req, res) => {
	const feedback = await feedbackService.createFeedback(
		req.body,
		req
	);

	sendSuccess(res, {
		status: 201,
		message: "Сообщение успешно отправлено",
		data: {
			id: feedback._id,
		},
	});
});

module.exports = { createFeedback };
