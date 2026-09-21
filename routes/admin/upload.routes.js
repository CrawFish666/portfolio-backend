const express = require("express");
const router = express.Router();

const controller = require("../../controllers/upload.controller");
const { createUpload } = require("../../middlewares/upload.middleware");

const uploadCV = createUpload({
	destination: "uploads/cv",
	mimetypes: ["application/pdf"],
	maxSize: 15 * 1024 * 1024,
});

const uploadProjectImage = createUpload({
	destination: "uploads/projects",
	mimetypes: ["image/jpeg", "image/png", "image/webp", "image/gif"],
	maxSize: 10 * 1024 * 1024,
});

router.post("/cv", uploadCV.single("cv"), controller.uploadCV);
router.delete("/cv", controller.removeCV);
router.post("/project-image", uploadProjectImage.single("image"), controller.uploadProjectImage);

module.exports = router;
