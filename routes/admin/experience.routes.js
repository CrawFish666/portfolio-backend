const express = require("express");
const router = express.Router();

const controller = require("../../controllers/experience.controller");

router.get("/", controller.getAdminExperiences);
router.get("/:id", controller.getExperienceById);
router.post("/", controller.createExperience);
router.put("/:id", controller.updateExperience);
router.delete("/:id", controller.deleteExperienceById);

module.exports = router;
