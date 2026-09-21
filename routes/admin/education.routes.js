const express = require("express");
const router = express.Router();

const controller = require("../../controllers/education.controller");

router.get("/", controller.getAdminEducations);
router.get("/:id", controller.getEducationById);
router.post("/", controller.createEducation);
router.put("/:id", controller.updateEducation);
router.delete("/:id", controller.deleteEducation);

module.exports = router;
