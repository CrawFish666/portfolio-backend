const express = require("express");
const router = express.Router();

const controller = require("../../controllers/education.controller");

router.get("/", controller.getEducations);

module.exports = router;