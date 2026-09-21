const express = require("express");
const router = express.Router();

const validate = require("../../middlewares/validate.middleware");
const { updateStatusSchema, replySchema } = require("../../validation/adminFeedback.validator");
const {
	getFeedbackList,
	getFeedbackById,
	updateFeedbackStatus,
	replyToFeedback,
	deleteFeedbackById,
} = require("../../controllers/adminFeedback.controller");

router.get("/", getFeedbackList);
router.get("/:id", getFeedbackById);
router.patch("/:id/status", validate(updateStatusSchema), updateFeedbackStatus);
router.post("/:id/reply", validate(replySchema), replyToFeedback);
router.delete("/:id", deleteFeedbackById);

module.exports = router;
