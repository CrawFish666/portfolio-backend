const service = require("../services/education.service");
const { createVisibilityCrudController } = require("./base/crudController");

const base = createVisibilityCrudController(service, { deleteMessage: "Образование удалено" });

module.exports = {
	getEducations: base.getPublic,
	getAdminEducations: base.getAdmin,
	getEducationById: base.getById,
	createEducation: base.create,
	updateEducation: base.update,
	deleteEducation: base.remove,
};
