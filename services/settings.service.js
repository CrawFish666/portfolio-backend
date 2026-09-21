const ApiError = require("../utils/ApiError");
const AvailabilityStatus = require("../models/AvailabilityStatus");
const Settings = require("../models/Settings");

const getSettings = async () => {
	const settings = await Settings.findOne().populate("availabilityStatus");

	if (!settings) {
		throw new ApiError(
			404,
			"SETTINGS_NOT_FOUND",
			"Настройки не найдены"
		);
	}

	return settings;
};

const updateSettings = async (data) => {
	// cvUrl обновляется отдельным эндпоинтом (загрузка файла), сюда не пускаем
	const { cvUrl, ...settingsData } = data;

	if (settingsData.availabilityStatus) {
		const statusExists = await AvailabilityStatus.exists({ _id: settingsData.availabilityStatus });

		if (!statusExists) {
			throw new ApiError(
				400,
				"AVAILABILITY_STATUS_NOT_FOUND",
				"Указанный статус доступности не существует"
			);
		}
	}

	const settings = await Settings.findOneAndUpdate({}, settingsData, {
		new: true,
		runValidators: true,
	}).populate("availabilityStatus");

	if (!settings) {
		throw new ApiError(
			404,
			"SETTINGS_NOT_FOUND",
			"Настройки не найдены"
		);
	}

	return settings;
};


module.exports = { getSettings, updateSettings };
