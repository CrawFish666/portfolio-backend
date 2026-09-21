const express = require("express");
const router = express.Router();

const projectRoutes = require("./projects.routes");
const technologyRoutes = require("./technologies.routes");
const feedbackRoutes = require("./feedback.routes");
const settingsRoutes = require("./settings.routes");
const categoriesOfTechnologyRoutes = require("./categoriesOfTechnology.routes");
const availabilityStatusesRoutes = require("./availabilityStatuses.routes");
const experienceRoutes = require("./experience.routes");
const educationRoutes = require("./education.routes");
const languageRoutes = require("./language.routes");


router.use("/projects", projectRoutes);
router.use("/experience", experienceRoutes);
router.use("/technology", technologyRoutes);
router.use("/settings", settingsRoutes);
router.use("/feedback",  feedbackRoutes);
router.use("/categoriesOfTechnology", categoriesOfTechnologyRoutes);
router.use("/availabilityStatuses", availabilityStatusesRoutes);
router.use("/education", educationRoutes);
router.use("/languages", languageRoutes);

module.exports = router;
