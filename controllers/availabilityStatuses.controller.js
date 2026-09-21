const service = require("../services/availabilityStatuses.service");
const { createSimpleCrudController } = require("./base/crudController");

module.exports = createSimpleCrudController(service, { deleteMessage: "Статус доступности удалён" });
