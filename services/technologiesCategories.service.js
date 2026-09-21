const ApiError = require("../utils/ApiError");
const TechnologyCategory = require("../models/TechnologyCategory");
const Technology = require("../models/Technology");
const { createCrudService } = require("./base/crudService");

const base = createCrudService(TechnologyCategory, {
	notFoundMessage: "Категория не найдена",
	notFoundCode: "TECHNOLOGY_CATEGORY_NOT_FOUND",
	sort: { order: 1, name: 1 },
});

// Переопределяем remove: нельзя удалить категорию, пока в ней есть технологии
const remove = async (id) => {
	const technologiesCount = await Technology.countDocuments({ category: id });

	if (technologiesCount > 0) {
		throw new ApiError(
			400,
			"CATEGORY_NOT_EMPTY",
			"Нельзя удалить категорию, пока в ней есть технологии"
		);
	}

	return base.remove(id);
};

// Используется другими сервисами (например technologies.service),
// чтобы проверить, что переданный category существует, до записи в БД
const validateCategory = async (categoryId) => {
	if (!categoryId) return;

	const exists = await TechnologyCategory.exists({ _id: categoryId });

	if (!exists) {
		throw new ApiError(
			400,
			"TECHNOLOGY_CATEGORY_NOT_FOUND",
			"Указанная категория не существует"
		);
	}
};

module.exports = { ...base, remove, validateCategory };
