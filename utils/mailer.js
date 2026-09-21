const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
	host: process.env.SMTP_URL,
	port: Number(process.env.SMTP_PORT),
	secure: process.env.SMTP_SECURE === "true",
	auth: {
		user: process.env.SMTP_LOGIN,
		pass: process.env.SMTP_PASSWORD,
	},
});

transporter.verify((error) => {
	if (error) {
		console.error("SMTP connection error:", error);
	} else {
		console.log("✅ SMTP сервер готов принимать письма");
	}
});

const DEFAULT_FROM = '"CrawFish Portfolio" <no-reply@streamlytv.top>';

async function sendMail({ to, subject, html, text, from = DEFAULT_FROM, replyTo }) {
	try {
		const info = await transporter.sendMail({
			from,
			to,
			subject,
			html,
			text,
			...(replyTo ? { replyTo } : {}),
		});
		return info;
	} catch (error) {
		console.error("Ошибка отправки письма:", error);
		throw new Error("Не удалось отправить письмо");
	}
}

async function sendResetPasswordEmail(email, resetLink) {
	return sendMail({
		to: email,
		subject: "Восстановление пароля",
		html: `
			<p>Вы запросили восстановление пароля. Ссылка работает 15 минут.</p>
			<p><a href="${resetLink}">Сбросить пароль</a></p>
			<p>Если это были не вы — просто проигнорируйте это письмо.</p>
		`,
	});
}

module.exports = { sendMail, sendResetPasswordEmail };
