const express = require("express");
const router = express.Router();

const validate = require("../../middlewares/validate.middleware");
const { projectSchema, updateProjectSchema } = require("../../validation/projectsValidationScheme");
const controller = require("../../controllers/projects.controller");

router.get("/", controller.getProjectsByAdmin);
router.get("/:id", controller.getProjectById);
router.post("/", validate(projectSchema), controller.createProject);
router.put("/:id", validate(updateProjectSchema), controller.updateProject);
router.delete("/:id", controller.deleteProject);

module.exports = router;
