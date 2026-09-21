const service = require("../services/language.service");
const { createVisibilityCrudController } = require("./base/crudController");

const base = createVisibilityCrudController(service, { deleteMessage: "Язык удалён" });

module.exports = {
	getLanguages: base.getPublic,
	getAdminLanguages: base.getAdmin,
	getLanguageById: base.getById,
	createLanguage: base.create,
	updateLanguage: base.update,
	deleteLanguage: base.remove,
};
