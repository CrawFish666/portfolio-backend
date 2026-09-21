const ApiError = require("../utils/ApiError");
const escapeHtml = require("escape-html");

const Feedback = require("../models/Feedback");
const Settings = require("../models/Settings");
const mailer = require("../utils/mailer");

const createFeedback = async (data, req) => {
	// Cooldown по email (1 минута)
	const recentByEmail = await Feedback.findOne({
		email: data.email.toLowerCase(),
		createdAt: { $gte: new Date(Date.now() - 60 * 1000) },
	});

	if (recentByEmail) {
		throw new ApiError(
			429,
			"FEEDBACK_RATE_LIMITED",
			"Вы уже отправляли сообщение недавно"
		);
	}

	// Дубликат того же сообщения за последние 24ч
	const duplicateMessage = await Feedback.findOne({
		email: data.email.toLowerCase(),
		message: data.message,
		createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
	});

	if (duplicateMessage) {
		throw new ApiError(
			409,
			"DUPLICATE_FEEDBACK",
			"Такое сообщение уже отправлено"
		);
	}

	const feedbackMessage = await Feedback.create({
		name: data.name,
		email: data.email.toLowerCase(),
		subject: data.subject,
		message: data.message,
		ip: req.ip || "",
		userAgent: req.get("user-agent") || "",
	});

	// Пересылка на почту админа, если включено в Settings
	const settings = await Settings.findOne();
	const feedbackSettings = settings?.feedbackSettings;

	if (feedbackSettings?.sendEmailNotification && feedbackSettings?.notificationEmail) {
		const safeName = escapeHtml(feedbackMessage.name);
		const safeEmail = escapeHtml(feedbackMessage.email);
		const safeSubject = escapeHtml(feedbackMessage.subject).replace(/[\r\n]/g, " ");
		const safeMessage = escapeHtml(feedbackMessage.message);

		await mailer.sendMail({
			to: feedbackSettings.notificationEmail,
			subject: `Новое сообщение: ${safeSubject}`,
			from: `"${safeName} через CrawFish Portfolio" <no-reply@streamlytv.top>`,
			replyTo: feedbackMessage.email,
			html: `
				<h2>Новое обращение</h2>
				<p><b>Имя:</b> ${safeName}</p>
				<p><b>Email:</b> ${safeEmail}</p>
				<p><b>Тема:</b> ${safeSubject}</p>
				<p><b>Сообщение:</b></p>
				<pre style="white-space: pre-wrap; font-family: Arial, sans-serif;">${safeMessage}</pre>
			`,
		});
	}

	return feedbackMessage;
};

module.exports = { createFeedback };
