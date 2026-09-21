const ApiError = require("../../utils/ApiError");

const applyPopulate = (query, populate) => (populate ? query.populate(populate) : query);

/**
 * Для справочников с делением на "публичный список" (isVisible: true)
 * и "список для админки" (вообще все записи). Именно так устроены
 * Education, Experience, Language — публичная выдача фильтрует
 * скрытые записи, админка видит всё.
 */
const createVisibilityCrudService = (
	Model,
	{ notFoundMessage = "Запись не найдена", notFoundCode = "RESOURCE_NOT_FOUND", publicSort = {}, adminSort = publicSort, populate = null } = {}
) => ({
	getPublic: async () =>
		applyPopulate(Model.find({ isVisible: true }).sort(publicSort), populate),

	getAdmin: async () => applyPopulate(Model.find().sort(adminSort), populate),

	getById: async (id) => {
		const doc = await applyPopulate(Model.findById(id), populate);
		if (!doc) {
			throw new ApiError(
				404,
				notFoundCode,
				notFoundMessage
			);
		}
		return doc;
	},

	create: async (data) => Model.create(data),

	update: async (id, data) => {
		const doc = await applyPopulate(
			Model.findByIdAndUpdate(id, data, { new: true, runValidators: true }),
			populate
		);
		if (!doc) {
			throw new ApiError(
				404,
				notFoundCode,
				notFoundMessage
			);
		}
		return doc;
	},

	remove: async (id) => {
		const doc = await Model.findByIdAndDelete(id);
		if (!doc) {
			throw new ApiError(
				404,
				notFoundCode,
				notFoundMessage
			);
		}
		return doc;
	},
});

/**
 * Для простых справочников без разделения на публичный/админский
 * список — один общий getAll (AvailabilityStatus и т.п.).
 */
const createCrudService = (
	Model,
	{ notFoundMessage = "Запись не найдена", notFoundCode = "RESOURCE_NOT_FOUND", sort = {}, populate = null } = {}
) => ({
	getAll: async () => applyPopulate(Model.find().sort(sort), populate),

	getById: async (id) => {
		const doc = await applyPopulate(Model.findById(id), populate);
		if (!doc) {
			throw new ApiError(
				404,
				notFoundCode,
				notFoundMessage
			);
		}
		return doc;
	},

	create: async (data) => Model.create(data),

	update: async (id, data) => {
		const doc = await applyPopulate(
			Model.findByIdAndUpdate(id, data, { new: true, runValidators: true }),
			populate
		);
		if (!doc) {
			throw new ApiError(
				404,
				notFoundCode,
				notFoundMessage
			);
		}
		return doc;
	},

	remove: async (id) => {
		const doc = await Model.findByIdAndDelete(id);
		if (!doc) {
			throw new ApiError(
				404,
				notFoundCode,
				notFoundMessage
			);
		}
		return doc;
	},
});

module.exports = { createCrudService, createVisibilityCrudService };
