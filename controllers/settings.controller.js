const asyncHandler = require("../utils/asyncHandler");
const settingsService = require("../services/settings.service");
const sendSuccess = require("../utils/sendSuccess");

// GET /api/settings
const getSettings = asyncHandler(async (req, res) => {
	const data = await settingsService.getSettings();

	sendSuccess(res, {
		message: "Настройки получены",
		data,
	});
});

// PUT /api/settings
const updateSettings = asyncHandler(async (req, res) => {
	const data = await settingsService.updateSettings(req.body);

	sendSuccess(res, {
		message: "Настройки обновлены",
		data,
	});
});


module.exports = { getSettings, updateSettings };