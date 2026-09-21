const AvailabilityStatus = require("../models/AvailabilityStatus");
const { createCrudService } = require("./base/crudService");

module.exports = createCrudService(AvailabilityStatus, {
	notFoundMessage: "Статус доступности не найден",
	notFoundCode: "AVAILABILITY_STATUS_NOT_FOUND",
	sort: { order: 1, title: 1 },
});
