const AvailabilityStatus = require("../models/AvailabilityStatus");
const ProjectStatus = require("../models/ProjectStatus");
const Settings = require("../models/Settings");
const User = require("../models/User");

const availabilityStatuses = [
	{
		code: "open",
		title: "Open to Work",
		color: "#22c55e",
		icon: "Briefcase",
		order: 1,
		isActive: true,
	},
	{
		code: "busy",
		title: "Busy",
		color: "#eab308",
		icon: "Clock",
		order: 2,
		isActive: true,
	},
	{
		code: "not_available",
		title: "Not Available",
		color: "#ef4444",
		icon: "XCircle",
		order: 3,
		isActive: true,
	},
];

const projectStatuses = [
	{
		code: "completed",
		title: "Completed",
		order: 1,
		isActive: true,
	},
	{
		code: "in_progress",
		title: "In Progress",
		order: 2,
		isActive: true,
	},
	{
		code: "coming_soon",
		title: "Coming Soon",
		order: 3,
		isActive: true,
	},
	{
		code: "archived",
		title: "Archived",
		order: 4,
		isActive: true,
	},
];

const upsertMany = async (Model, items, key, label) => {
	console.log(`[bootstrap] Проверка: ${label}`);

	for (const item of items) {
		await Model.updateOne(
			{ [key]: item[key] },
			{ $set: item },
			{ upsert: true }
		);
	}

	console.log(`[bootstrap] Готово: ${label}`);
};

const ensureSettings = async () => {
	console.log("[bootstrap] Проверка настроек...");

	const existingSettings = await Settings.findOne();

	if (existingSettings) {
		console.log("[bootstrap] Настройки уже существуют");
		return;
	}

	const defaultStatus = await AvailabilityStatus.findOne({
		code: "open",
	});

	await Settings.create({
		availabilityStatus: defaultStatus?._id,
		profile: {
			location: {
				city: "",
				country: "",
			},
			experienceYears: 0,
		},
		contacts: [],
		feedbackSettings: {
			sendEmailNotification: false,
			notificationEmail: process.env.ADMIN_EMAIL || "",
		},
	});

	console.log("[bootstrap] Настройки созданы");
};

const ensureAdmin = async () => {
	const {
		ADMIN_USERNAME,
		ADMIN_USER_EMAIL,
		ADMIN_USER_PASSWORD,
	} = process.env;

	if (!ADMIN_USERNAME || !ADMIN_USER_EMAIL || !ADMIN_USER_PASSWORD) {
		if (process.env.NODE_ENV === "production") {
			throw new Error(
				"Для production нужны ADMIN_USERNAME, ADMIN_USER_EMAIL и ADMIN_USER_PASSWORD"
			);
		}

		console.warn(
			"[bootstrap] Admin пропущен: admin env-переменные не заданы"
		);

		return;
	}

	console.log("[bootstrap] Проверка admin-пользователя...");

	const email = ADMIN_USER_EMAIL.toLowerCase();

	const existingUser = await User.findOne({
		$or: [
			{ email },
			{ username: ADMIN_USERNAME },
		],
	});

	if (existingUser) {
		if (existingUser.role !== "admin") {
			throw new Error(
				"Пользователь с admin email или username уже существует, но не является admin"
			);
		}

		console.log("[bootstrap] Admin-пользователь уже существует");
		return;
	}

	await User.create({
		username: ADMIN_USERNAME,
		email,
		password: ADMIN_USER_PASSWORD,
		name: "Administrator",
		role: "admin",
		isVerified: true,
	});

	console.log("[bootstrap] Admin-пользователь создан");
};

const bootstrap = async () => {
	console.log("[bootstrap] Инициализация базы данных началась");

	await upsertMany(
		AvailabilityStatus,
		availabilityStatuses,
		"code",
		"availability statuses"
	);

	await upsertMany(
		ProjectStatus,
		projectStatuses,
		"code",
		"project statuses"
	);

	await ensureSettings();
	await ensureAdmin();

	console.log("[bootstrap] Инициализация базы данных завершена");
};

module.exports = bootstrap;