const express = require("express");
const router = express.Router();

const validate = require("../../middlewares/validate.middleware");
const {
	availabilityStatusSchema,
	updateAvailabilityStatusSchema,
} = require("../../validation/availabilityStatuses.validation");
const controller = require("../../controllers/availabilityStatuses.controller");

router.get("/:id", controller.getById);
router.post("/", validate(availabilityStatusSchema), controller.create);
router.put("/:id", validate(updateAvailabilityStatusSchema), controller.update);
router.delete("/:id", controller.remove);

module.exports = router;
