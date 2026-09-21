const multer = require("multer");
const path = require("path");
const fs = require("fs");

const createUpload = ({ destination, mimetypes, maxSize = 5 * 1024 * 1024 }) => {
	fs.mkdirSync(destination, { recursive: true });

	const storage = multer.diskStorage({
		destination(req, file, cb) {
			cb(null, destination);
		},
		filename(req, file, cb) {
			const ext = path.extname(file.originalname);
			cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`);
		},
	});

	const fileFilter = (req, file, cb) => {
		if (!mimetypes.includes(file.mimetype)) {
			return cb(new Error("Недопустимый тип файла"), false);
		}
		cb(null, true);
	};

	return multer({
		storage,
		fileFilter,
		limits: { fileSize: maxSize },
	});
};

module.exports = { createUpload };
