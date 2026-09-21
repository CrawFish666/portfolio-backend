const fs = require("fs/promises");
const path = require("path");
const ApiError = require("../utils/ApiError");
const Settings = require("../models/Settings");

// Используется также projects.service при удалении/замене картинки проекта
const deleteFile = async (fileUrl) => {
	if (!fileUrl) return;

	const filePath = path.join(process.cwd(), fileUrl.replace(/^\//, ""));

	try {
		await fs.unlink(filePath);
	} catch {
		// Файл уже удалён или отсутствует — это не ошибка
	}
};

const uploadCV = async (file) => {
	if (!file) {
		throw new ApiError(
			400,
			"FILE_REQUIRED",
			"Файл не загружен"
		);
	}

	const settings = await Settings.findOne();

	if (!settings) {
		throw new ApiError(
			404,
			"SETTINGS_NOT_FOUND",
			"Настройки не найдены"
		);
	}

	await deleteFile(settings.cvUrl);

	settings.cvUrl = `/uploads/cv/${file.filename}`;
	await settings.save();

	return settings;
};

const removeCV = async () => {
	const settings = await Settings.findOne();

	if (!settings) {
		throw new ApiError(
			404,
			"SETTINGS_NOT_FOUND",
			"Настройки не найдены"
		);
	}

	await deleteFile(settings.cvUrl);

	settings.cvUrl = "";
	await settings.save();

	return settings;
};

const uploadProjectImage = async (file) => {
	if (!file) {
		throw new ApiError(
			400,
			"FILE_REQUIRED",
			"Файл не загружен"
		);
	}

	return { url: `/uploads/projects/${file.filename}` };
};

module.exports = { uploadCV, removeCV, uploadProjectImage, deleteFile };
