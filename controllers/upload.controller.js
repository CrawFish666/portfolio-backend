const asyncHandler = require("../utils/asyncHandler");
const uploadService = require("../services/upload.service");
const sendSuccess = require("../utils/sendSuccess");

const uploadCV = asyncHandler(async (req, res) => {
	const data = await uploadService.uploadCV(req.file);

	sendSuccess(res, {
		status: 201,
		message: "CV загружено",
		data,
	});
});

const removeCV = asyncHandler(async (req, res) => {
	const data = await uploadService.removeCV();

	sendSuccess(res, {
		message: "CV удалено",
		data,
	});
});

const uploadProjectImage = asyncHandler(async (req, res) => {
	const data = await uploadService.uploadProjectImage(req.file);

	sendSuccess(res, {
		status: 201,
		message: "Изображение проекта загружено",
		data,
	});
});

module.exports = { uploadCV, removeCV, uploadProjectImage };
