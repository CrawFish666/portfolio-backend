const express = require("express");
const router = express.Router();

const controller = require("../../controllers/technologyCategories.controller");

router.get("/", controller.getAll);

module.exports = router;