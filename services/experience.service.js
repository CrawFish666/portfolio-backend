const Experience = require("../models/Experience");
const { createVisibilityCrudService } = require("./base/crudService");

const populateOptions = {
	path: "tech",
	populate: { path: "category" },
};

module.exports = createVisibilityCrudService(Experience, {
	notFoundMessage: "Опыт работы не найден",
	notFoundCode: "EXPERIENCE_NOT_FOUND",
	publicSort: { order: 1, startDate: -1 },
	populate: populateOptions,
});
