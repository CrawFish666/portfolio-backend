const Language = require("../models/Language");
const { createVisibilityCrudService } = require("./base/crudService");

module.exports = createVisibilityCrudService(Language, {
	notFoundMessage: "Язык не найден",
	notFoundCode: "LANGUAGE_NOT_FOUND",
	publicSort: { order: 1 },
});
