const mongoose = require("mongoose");

const educationSchema = new mongoose.Schema(
	{
		institution: {
			type: String,
			required: true,
			trim: true,
			maxlength: 150,
		},

		degree: {
			type: String,
			required: true,
			trim: true,
			maxlength: 200,
		},

		description: {
			type: String,
			trim: true,
			maxlength: 1000,
		},

		startDate: {
			type: Date,
			required: true,
		},

		endDate: {
			type: Date,
			default: null,
		},

		isCurrent: {
			type: Boolean,
			default: false,
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


module.exports = mongoose.model("Education", educationSchema);