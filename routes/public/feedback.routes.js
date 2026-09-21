const express = require("express");
const router = express.Router();

const validate = require("../../middlewares/validate.middleware");
const { feedbackSchema } = require("../../validation/feedback.validator");
const controller = require("../../controllers/feedback.controller");
const feedbackLimiter = require("../../middlewares/feedbackLimiter.middleware");
const feedbackProtection = require("../../middlewares/feedbackProtection.middleware");

router.post("/", feedbackLimiter, validate(feedbackSchema), feedbackProtection, controller.createFeedback);

module.exports = router;
