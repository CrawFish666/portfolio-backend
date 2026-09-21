const express = require("express");
const router = express.Router();

const { protect, adminOnly } = require("../../middlewares/authMiddleware");

const projectRoutes = require("./projects.routes");
const technologyRoutes = require("./technologies.routes");
const feedbackRoutes = require("./feedback.routes");
const settingsRoutes = require("./settings.routes");
const categoriesOfTechnologyRoutes = require("./categoriesOfTechnology.routes");
const availabilityStatusesRoutes = require("./availabilityStatuses.routes");
const uploadRoutes = require("./upload.routes");
const experienceRoutes = require("./experience.routes");
const educationRoutes = require("./education.routes");
const languageRoutes = require("./language.routes");

router.use(protect);
router.use(adminOnly);

router.use("/projects", projectRoutes);
router.use("/technology", technologyRoutes);
router.use("/feedback", feedbackRoutes);
router.use("/settings", settingsRoutes);
router.use("/categoriesOfTechnology", categoriesOfTechnologyRoutes);
router.use("/availabilityStatuses", availabilityStatusesRoutes);
router.use("/upload", uploadRoutes);
router.use("/experience", experienceRoutes);
router.use("/education", educationRoutes);
router.use("/languages", languageRoutes);

module.exports = router;
