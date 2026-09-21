const service = require("../services/technologiesCategories.service");
const { createSimpleCrudController } = require("./base/crudController");

module.exports = createSimpleCrudController(service, { deleteMessage: "Категория удалена" });
