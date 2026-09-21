const mongoose = require("mongoose");

const languageSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			trim: true,
			maxlength: 50,
		},

		code: {
			type: String,
			required: true,
			trim: true,
			uppercase: true,
			maxlength: 5,
		},

		level: {
			type: String,
			required: true,
			trim: true,
			maxlength: 50,
		},

		description: {
			type: String,
			trim: true,
			maxlength: 300,
		},

		order: {
			type: Number,
			default: 0,
		},

		isVisible: {
			type: Boolean,
			default: true,
		},
	},
	{
		timestamps: true,
	}
);


module.exports = mongoose.model("Language", languageSchema);