const ApiError = require("../utils/ApiError");
const escapeHtml = require("escape-html");

const Feedback = require("../models/Feedback");
const mailer = require("../utils/mailer");
const escapeRegex = require("../utils/escapeRegex");

const getFeedbackList = async ({ page = 1, limit = 10, status, search }) => {
	const filter = {};

	if (status && status !== "all") {
		filter.status = status;
	}

	if (search) {
		const safeSearch = escapeRegex(search);
		filter.$or = [
			{ name: { $regex: safeSearch, $options: "i" } },
			{ email: { $regex: safeSearch, $options: "i" } },
			{ subject: { $regex: safeSearch, $options: "i" } },
		];
	}

	const skip = (page - 1) * limit;

	const [items, total] = await Promise.all([
		Feedback.find(filter)
			.sort({ createdAt: -1 })
			.skip(skip)
			.limit(limit)
			.select("name email subject status createdAt readAt"),
		Feedback.countDocuments(filter),
	]);

	return { items, total, page, pages: Math.ceil(total / limit) };
};

const getFeedbackById = async (id) => {
	const feedback = await Feedback.findById(id);

	if (!feedback) {
		throw new ApiError(
			404,
			"FEEDBACK_NOT_FOUND",
			"Сообщение не найдено"
		);
	}

	if (feedback.status === "new") {
		feedback.status = "read";
		feedback.readAt = new Date();
		await feedback.save();
	}

	return feedback;
};

const updateFeedbackStatus = async (id, status) => {
	const feedback = await Feedback.findById(id);

	if (!feedback) {
		throw new ApiError(
			404,
			"FEEDBACK_NOT_FOUND",
			"Сообщение не найдено"
		);
	}

	feedback.status = status;

	if (status === "read" && !feedback.readAt) {
		feedback.readAt = new Date();
	}

	await feedback.save();

	return feedback;
};

const replyToFeedback = async (id, message) => {
	const feedback = await Feedback.findById(id);

	if (!feedback) {
		throw new ApiError(
			404,
			"FEEDBACK_NOT_FOUND",
			"Сообщение не найдено"
		);
	}

	const safeName = escapeHtml(feedback.name);
	const safeSubject = escapeHtml(feedback.subject);
	const safeReply = escapeHtml(message);

	await mailer.sendMail({
		to: feedback.email,
		subject: `Re: ${safeSubject}`,
		html: `
			<p>Здравствуйте, ${safeName}!</p>
			<div style="white-space: pre-wrap; font-family: Arial, sans-serif;">${safeReply}</div>
			<hr />
			<p style="color:#666;font-size:12px;">Это письмо отправлено с сайта CrawFish Portfolio.</p>
		`,
	});

	feedback.replies.push({ message, sentAt: new Date() });
	feedback.status = "answered";

	await feedback.save();

	return feedback;
};

const deleteFeedbackById = async (id) => {
	const feedback = await Feedback.findByIdAndDelete(id);

	if (!feedback) {
		throw new ApiError(
			404,
			"FEEDBACK_NOT_FOUND",
			"Сообщение не найдено"
		);
	}

	return feedback;
};

module.exports = {
	getFeedbackList,
	getFeedbackById,
	updateFeedbackStatus,
	replyToFeedback,
	deleteFeedbackById,
};
