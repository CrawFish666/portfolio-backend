const service = require("../services/technologies.service");
const sendSuccess = require("../utils/sendSuccess");
const asyncHandler = require("../utils/asyncHandler");

// Отдельный контроллер (не через фабрику), т.к. у ресурса свои имена
// методов сервиса (getPublic/getAdmin — как getAll/getAllByAdmin) и
// не нужен deleteMessage-паттерн для remove.
module.exports = {
	getAll: asyncHandler(async (req, res) => {
		const data = await service.getPublic();

		sendSuccess(res, {
			message: "Технологии получены",
			data,
		});
	}),
	getAllByAdmin: asyncHandler(async (req, res) => {
		const data = await service.getAdmin();

		sendSuccess(res, {
			message: "Технологии получены",
			data,
		});
	}),
	getById: asyncHandler(async (req, res) => {
		const data = await service.getById(req.params.id);

		sendSuccess(res, {
			message: "Технология получена",
			data,
		});
	}),
	create: asyncHandler(async (req, res) => {
		const data = await service.create(req.body);

		sendSuccess(res, {
			status: 201,
			message: "Технология создана",
			data,
		});
	}),
	update: asyncHandler(async (req, res) => {
		const data = await service.update(
			req.params.id,
			req.body
		);

		sendSuccess(res, {
			message: "Технология обновлена",
			data,
		});
	}),
	remove: asyncHandler(async (req, res) => {
		await service.remove(req.params.id);

		sendSuccess(res, {
			message: "Технология удалена",
			data: {
				id: req.params.id,
			},
		});
	}),
};
