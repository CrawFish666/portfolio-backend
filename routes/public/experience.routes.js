const express = require("express");
const router = express.Router();

const controller = require("../../controllers/experience.controller");

router.get("/", controller.getExperiences);

module.exports = router;