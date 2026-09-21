const express = require("express");
const router = express.Router();

const controller = require("../../controllers/projects.controller");

router.get("/", controller.getProjects);
router.get("/statuses", controller.getStatusOptions);
router.get("/filters", controller.getFilters);
router.get("/:slug", controller.getProjectBySlug);

module.exports = router;
