const Education = require("../models/Education");
const { createVisibilityCrudService } = require("./base/crudService");

module.exports = createVisibilityCrudService(Education, {
	notFoundMessage: "Образование не найдено",
	notFoundCode: "EDUCATION_NOT_FOUND",
	publicSort: { isCurrent: -1, startDate: 1, order: 1 },
});
