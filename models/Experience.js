const mongoose = require("mongoose");

const experienceSchema = new mongoose.Schema(
	{
		position: {
			type: String,
			required: true,
			trim: true,
			maxlength: 60,
		},

		company: {
			type: String,
			required: true,
			trim: true,
			maxlength: 120,
		},

		companyUrl: {
			type: String,
			trim: true,
		},

		location: {
			type: String,
			trim: true,
			maxlength: 120,
		},

		description: {
			type: String,
			trim: true,
			maxlength: 3000,
		},

		tech: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "Technology",
			},
		],

		achievements: [
			{
				type: String,
				trim: true,
				maxlength: 200,
			},
		],

		startDate: {
			type: Date, // 2022-06
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

module.exports = mongoose.model("Experience", experienceSchema);