const service = require("../services/experience.service");
const { createVisibilityCrudController } = require("./base/crudController");

const base = createVisibilityCrudController(service, { deleteMessage: "Опыт работы удалён" });

module.exports = {
	getExperiences: base.getPublic,
	getAdminExperiences: base.getAdmin,
	getExperienceById: base.getById,
	createExperience: base.create,
	updateExperience: base.update,
	deleteExperienceById: base.remove,
};
