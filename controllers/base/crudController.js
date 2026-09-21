const asyncHandler = require("../../utils/asyncHandler");
const sendSuccess = require("../../utils/sendSuccess");

/*
	Для сервисов, созданных через createVisibilityCrudService
	(есть публичный getPublic/getAdmin список).
*/
const createVisibilityCrudController = (service, { deleteMessage = "Запись удалена" } = {}) => ({
	getPublic: asyncHandler(async (req, res) => {
		const data = await service.getPublic();
		sendSuccess(res, {
			message: "Записи получены",
			data
		})
	}),
	getAdmin: asyncHandler(async (req, res) => {
		const data = await service.getAdmin();
		sendSuccess(res, {
			message: "Записи получены",
			data
		})
	}),
	getById: asyncHandler(async (req, res) => {
		const data = await service.getById(req.params.id);
		sendSuccess(res, {
			message: "Запись получена",
			data
		})
	}),
	create: asyncHandler(async (req, res) => {
		const data = await service.create(req.body);
		sendSuccess(res, {
			status: 201,
			message: "Запись создана",
			data,
		});
	}),
	update: asyncHandler(async (req, res) => {
		const data = await service.update(req.params.id, req.body);
		sendSuccess(res, {
			message: "Запись обновлена",
			data,
		});
	}),
	remove: asyncHandler(async (req, res) => {
		await service.remove(req.params.id);

		sendSuccess(res, {
			message: deleteMessage,
		});
	}),
});

/**
	Для сервисов, созданных через createCrudService
	(единый getAll без деления на публичный/админский).
*/
const createSimpleCrudController = (service, { deleteMessage = "Запись удалена" } = {}) => ({
	getAll: asyncHandler(async (req, res) => {
		const data = await service.getAll();

		sendSuccess(res, {
			message: "Записи получены",
			data,
		});
	}),
	getById: asyncHandler(async (req, res) => {
		const data = await service.getById(req.params.id);

		sendSuccess(res, {
			message: "Запись получена",
			data,
		});
	}),
	create: asyncHandler(async (req, res) => {
		const data = await service.create(req.body);

		sendSuccess(res, {
			status: 201,
			message: "Запись создана",
			data,
		});
	}),
	update: asyncHandler(async (req, res) => {
		const data = await service.update(req.params.id, req.body);

		sendSuccess(res, {
			message: "Запись обновлена",
			data,
		});
	}),
	remove: asyncHandler(async (req, res) => {
		await service.remove(req.params.id);

		sendSuccess(res, {
			message: deleteMessage,
		});
	}),
});

module.exports = { createVisibilityCrudController, createSimpleCrudController };
