const express = require("express");
const router = express.Router();

const validate = require("../../middlewares/validate.middleware");
const { technologySchema, updateTechnologySchema } = require("../../validation/technologies.validation");
const controller = require("../../controllers/technologies.controller");

router.get("/", controller.getAllByAdmin);
router.post("/", validate(technologySchema), controller.create);
router.put("/:id", validate(updateTechnologySchema), controller.update);
router.delete("/:id", controller.remove);

module.exports = router;
