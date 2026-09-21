const express = require("express");
const router = express.Router();

const controller = require("../../controllers/language.controller");

router.get("/", controller.getLanguages);

module.exports = router;