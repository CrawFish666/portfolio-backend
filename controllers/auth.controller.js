const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const ApiError = require("../utils/ApiError");
const sendSuccess = require("../utils/sendSuccess");

const User = require("../models/User");
const Session = require("../models/Session");
const ResetPwdToken = require("../models/ResetPwdToken");

const { generateAccessToken, generateRefreshToken } = require("../utils/generateToken");
const hashToken = require("../utils/hashToken");
const asyncHandler = require("../utils/asyncHandler");
const { sendResetPasswordEmail } = require("../utils/mailer");
const {
	registerSchema,
	loginSchema,
	resetPasswordSchema,
	forgotPasswordSchema,
} = require("../validation/authValidationScheme");

const REFRESH_TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 дней
const RESET_TOKEN_TTL_MS = 10 * 60 * 1000; // 10 минут

// ═══════════════════════════════════════════════════════════
// Вспомогательная функция — ставит refresh в куку
// ═══════════════════════════════════════════════════════════
const setRefreshCookie = (res, refreshToken) => {
	res.cookie("refreshToken", refreshToken, {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		// Если strict, то при разработке (разные порты фронт/бэк) кука потеряется
		sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
		path: "/",
		maxAge: REFRESH_TOKEN_TTL_MS,
	});
};


const createSession = async (user, refreshToken, req) => {
	const now = new Date();
	await Session.create({
		userId: user._id,
		refreshTokenHash: hashToken(refreshToken),
		expiresAt: new Date(now.getTime() + REFRESH_TOKEN_TTL_MS),
		lastUsedAt: now,
		userAgent: req.headers["user-agent"] || "",
		ip: req.ip || req.connection?.remoteAddress || "",
	});
};

const issueTokensAndRespond = async (res, user, req, {
	status = 200,
	message = "Успешная авторизация",
} = {}) => {
	const accessToken = generateAccessToken(user);
	const refreshToken = generateRefreshToken(user._id);

	await createSession(user, refreshToken, req);
	setRefreshCookie(res, refreshToken);

	sendSuccess(res, {
		status,
		message,
		data: {
			accessToken,
		},
	});
};

const findValidResetToken = async (rawToken) => {
	if (!rawToken) {
		return null;
	}

	const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex");

	return ResetPwdToken.findOne({
		tokenHash: hashedToken,
		expiresAt: { $gt: new Date() },
	});
};

// ═══════════════════════════════════════════════════════════
// @desc    Регистрация
// @route   POST /api/auth/register
// ═══════════════════════════════════════════════════════════
const register = asyncHandler(async (req, res) => {
	const parsed = registerSchema.safeParse(req.body);
	if (!parsed.success) {
		throw parsed.error;
	}

	const { username, name, email, password } = parsed.data;

	if (await User.findOne({ email })) {
		throw new ApiError(
			409,
			"EMAIL_ALREADY_EXISTS",
			"Этот email уже зарегистрирован."
		);
	}

	if (await User.findOne({ username })) {
		throw new ApiError(
			409,
			"USERNAME_ALREADY_EXISTS",
			"Этот логин уже занят."
		);
	}

	const user = await User.create({ username, name, email, password });

	await issueTokensAndRespond(res, user, req, {
		status: 201,
		message: "Пользователь зарегистрирован",
	});
});

// ═══════════════════════════════════════════════════════════
// @desc    Вход
// @route   POST /api/auth/login
// ═══════════════════════════════════════════════════════════
const login = asyncHandler(async (req, res) => {
	const parsed = loginSchema.safeParse(req.body);
	if (!parsed.success) {
		throw parsed.error;
	}

	const { email, password } = parsed.data;

	const user = await User.findOne({ email }).select("+password");
	if (!user || !(await user.comparePassword(password))) {
		throw new ApiError(
			401,
			"INVALID_CREDENTIALS",
			"Неверный email или пароль."
		);
	}

	await issueTokensAndRespond(res, user, req, {
		message: "Вход выполнен",
	});
});

// ═══════════════════════════════════════════════════════════
// @desc    Обновить access-токен по refresh-токену
// @route   POST /api/auth/refresh
// ═══════════════════════════════════════════════════════════
const refresh = asyncHandler(async (req, res) => {
	const token = req.cookies?.refreshToken;
	if (!token) {
		throw new ApiError(
			401,
			"REFRESH_TOKEN_REQUIRED",
			"Refresh-токен отсутствует."
		);
	}

	let decoded;
	try {
		decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
	} catch {
		res.clearCookie("refreshToken", { path: "/" });
		throw new ApiError(
			401,
			"INVALID_REFRESH_TOKEN",
			"Refresh-токен истёк или невалиден."
		);
	}

	const session = await Session.findOne({
		userId: decoded.sub,
		refreshTokenHash: hashToken(token),
	});

	if (!session || session.expiresAt < new Date()) {
		if (session) {
			await Session.deleteOne({ _id: session._id });
		}
		res.clearCookie("refreshToken", { path: "/" });
		throw new ApiError(
			401,
			"SESSION_EXPIRED",
			"Сессия не найдена или истекла."
		);
	}

	const user = await User.findById(decoded.sub);
	if (!user) {
		// Юзера удалили из БД — чистим все его "осиротевшие" сессии
		await Session.deleteMany({ userId: decoded.sub });
		res.clearCookie("refreshToken", { path: "/" });
		throw new ApiError(
			401,
			"USER_NOT_FOUND",
			"Пользователь не найден."
		);
	}

	// Rotation: новая пара токенов, старый refresh больше недействителен
	const newRefreshToken = generateRefreshToken(user._id);
	session.refreshTokenHash = hashToken(newRefreshToken);
	session.lastUsedAt = new Date();
	await session.save();

	setRefreshCookie(res, newRefreshToken);
	sendSuccess(res, {
		message: "Токен обновлён",
		data: {
			accessToken: generateAccessToken(user),
		},
	});
});

// ═══════════════════════════════════════════════════════════
// @desc    Выход
// @route   POST /api/auth/logout
// ═══════════════════════════════════════════════════════════
const logout = asyncHandler(async (req, res) => {
	const token = req.cookies?.refreshToken;

	if (token) {
		const decoded = jwt.decode(token);
		if (decoded?.sub) {
			await Session.deleteOne({ userId: decoded.sub, refreshTokenHash: hashToken(token) });
		}
	}

	res.clearCookie("refreshToken", { path: "/" });
	sendSuccess(res, {
		message: "Вы вышли из системы.",
	});
});

// ═══════════════════════════════════════════════════════════
// @desc    Получить данные текущего пользователя
// @route   GET /api/auth/me (protect)
// ═══════════════════════════════════════════════════════════
const getMe = asyncHandler(async (req, res) => {
	sendSuccess(res, {
		message: "Профиль получен",
		data: req.user,
	});
});

// ═══════════════════════════════════════════════════════════
// @desc    Обновить профиль
// @route   PUT /api/auth/me (protect)
// ═══════════════════════════════════════════════════════════
const updateProfile = asyncHandler(async (req, res) => {
	const { name, email } = req.body;

	const user = await User.findByIdAndUpdate(
		req.user._id,
		{ name, email },
		{ new: true, runValidators: true }
	).select("-password");

	if (!user) {
		throw new ApiError(
			404,
			"USER_NOT_FOUND",
			"Пользователь не найден."
		);
	}

	sendSuccess(res, {
		message: "Профиль обновлён",
		data: user,
	});
});

// ═══════════════════════════════════════════════════════════
// @desc    Проверить есть ли юзер с такой почтой, выслать письмо
// @route   POST /forgot-password
// ═══════════════════════════════════════════════════════════
const sendRecoveryPasswordToken = asyncHandler(async (req, res) => {
	const parsed = forgotPasswordSchema.safeParse(req.body);
	if (!parsed.success) {
		throw parsed.error;
	}

	const { email } = parsed.data;
	const user = await User.findOne({ email });

	const successMessage = "Если email существует, письмо отправлено";

	// Если юзера не нашли — не сообщаем об этом (не палим, существует ли email)
	if (!user) {
		return sendSuccess(res, {
			message: successMessage,
		});
	}

	await ResetPwdToken.deleteMany({ userId: user._id });

	const rawToken = crypto.randomBytes(32).toString("hex");
	const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex");

	await ResetPwdToken.create({
		userId: user._id,
		tokenHash: hashedToken,
		expiresAt: new Date(Date.now() + RESET_TOKEN_TTL_MS),
	});

	const resetLink = `${process.env.CLIENT_URL}/reset-password/${rawToken}`;
	await sendResetPasswordEmail(user.email, resetLink);

	sendSuccess(res, {
		message: successMessage,
	});
});


// ═══════════════════════════════════════════════════════════
// @desc    Проверить, валиден ли токен сброса
// @route   GET /reset-password/:token/verify
// ═══════════════════════════════════════════════════════════
const verifyResetPwdToken = asyncHandler(async (req, res) => {
	const resetToken = await findValidResetToken(req.params.token);

	if (!resetToken) {
		throw new ApiError(
			400,
			"RESET_TOKEN_INVALID",
			"Токен недействителен или истёк"
		);
	}

	sendSuccess(res, {
		message: "Токен действителен",
		data: {
			valid: true,
		},
	});
});

// ═══════════════════════════════════════════════════════════
// @desc    Проверить валиден ли токен + сбросить пароль через токен у юзера
// @route   POST /api/auth/reset-password
// ═══════════════════════════════════════════════════════════
const resetPasswordViaToken = asyncHandler(async (req, res) => {
	const parsed = resetPasswordSchema.safeParse({ password: req.body.password });
	if (!parsed.success) {
		throw parsed.error;
	}

	const resetToken = await findValidResetToken(req.body.token);
	if (!resetToken) {
		throw new ApiError(
			400,
			"RESET_TOKEN_INVALID",
			"Токен недействителен или истёк"
		);
	}

	const user = await User.findById(resetToken.userId).select("+password");
	if (!user) {
		throw new ApiError(
			400,
			"RESET_TOKEN_INVALID",
			"Токен недействителен или истёк"
		);
	}

	user.password = parsed.data.password;
	await user.save();

	await ResetPwdToken.deleteOne({ _id: resetToken._id });
	await Session.deleteMany({ userId: user._id });

	sendSuccess(res, {
		message: "Пароль успешно изменён",
	});
});


module.exports = {
	register,
	login,
	refresh,
	logout,
	getMe,
	updateProfile,
	sendRecoveryPasswordToken,
	verifyResetPwdToken,
	resetPasswordViaToken
};