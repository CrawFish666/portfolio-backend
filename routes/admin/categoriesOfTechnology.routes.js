const express = require("express");
const router = express.Router();

const validate = require("../../middlewares/validate.middleware");
const {
	technologyCategorySchema,
	updateTechnologyCategorySchema,
} = require("../../validation/technologyCategories.validation");
const controller = require("../../controllers/technologyCategories.controller");

router.get("/:id", controller.getById);
router.post("/", validate(technologyCategorySchema), controller.create);
router.put("/:id", validate(updateTechnologyCategorySchema), controller.update);
router.delete("/:id", controller.remove);

module.exports = router;
