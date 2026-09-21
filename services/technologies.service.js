const ApiError = require("../utils/ApiError");
const Technology = require("../models/Technology");
const technologyCategoriesService = require("./technologiesCategories.service");
const { createVisibilityCrudService } = require("./base/crudService");

// Technology не размечена полем isVisible — публичный список
// фильтруется по isActive, поэтому переопределяем getPublic/getAdmin,
// но переиспользуем getById/create/update/remove из фабрики.
const base = createVisibilityCrudService(Technology, {
	notFoundMessage: "Технология не найдена",
	notFoundCode: "TECHNOLOGY_NOT_FOUND",
	publicSort: { order: 1, name: 1 },
	populate: "category",
});

const getPublic = async () =>
	Technology.find({ isActive: true }).populate("category").sort({ order: 1, name: 1 });

const getAdmin = async () => Technology.find().populate("category").sort({ order: 1, name: 1 });

const create = async (data) => {
	await technologyCategoriesService.validateCategory(data.category);
	return Technology.create(data);
};

const update = async (id, data) => {
	if (data.category) {
		await technologyCategoriesService.validateCategory(data.category);
	}
	return base.update(id, data);
};

// Используется projects.service при создании/обновлении проекта,
// чтобы убедиться, что все переданные ID технологий существуют
const validateTechnologies = async (technologyIds = []) => {
	if (technologyIds.length === 0) return;

	const count = await Technology.countDocuments({ _id: { $in: technologyIds } });

	if (count !== technologyIds.length) {
		throw new ApiError(
			400,
			"TECHNOLOGIES_NOT_FOUND",
			"Одна или несколько технологий не существуют"
		);
	}
};

module.exports = {
	...base,
	getPublic,
	getAdmin,
	create,
	update,
	validateTechnologies,
};
