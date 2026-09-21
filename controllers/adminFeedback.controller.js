const asyncHandler = require("../utils/asyncHandler");
const feedbackService = require("../services/adminFeedback.service");
const sendSuccess = require("../utils/sendSuccess");


const getFeedbackList = asyncHandler(async (req, res) => {
	const feedbacks = await feedbackService.getFeedbackList({
		page: Number(req.query.page) || 1,
		limit: Number(req.query.limit) || 20,
		status: req.query.status,
		search: req.query.search,
	});

	sendSuccess(res, {
		message: "Сообщения получены",
		data: feedbacks,
	});
});

const getFeedbackById = asyncHandler(async (req, res) => {
	const data = await feedbackService.getFeedbackById(
		req.params.id
	);

	sendSuccess(res, {
		message: "Сообщение получено",
		data,
	});
});

// status/message приходят уже провалидированными через validate.middleware
const updateFeedbackStatus = asyncHandler(async (req, res) => {
	const data = await feedbackService.updateFeedbackStatus(
		req.params.id,
		req.body.status
	);

	sendSuccess(res, {
		message: "Статус сообщения обновлён",
		data,
	});
});

const replyToFeedback = asyncHandler(async (req, res) => {
	const data = await feedbackService.replyToFeedback(
		req.params.id,
		req.body.message
	);

	sendSuccess(res, {
		message: "Ответ отправлен",
		data,
	});
});

const deleteFeedbackById = asyncHandler(async (req, res) => {
	const data = await feedbackService.deleteFeedbackById(
		req.params.id
	);

	sendSuccess(res, {
		message: "Сообщение удалено",
		data: {
			id: data._id,
		},
	});
});

module.exports = {
	getFeedbackList,
	getFeedbackById,
	updateFeedbackStatus,
	replyToFeedback,
	deleteFeedbackById,
};
