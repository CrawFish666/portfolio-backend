const mongoose = require("mongoose");

const availabilityStatusSchema = new mongoose.Schema(
	{
		code: {
			type: String,
			required: true,
			unique: true,
			trim: true,
			lowercase: true,
		},

		title: {
			type: String,
			required: true,
			trim: true,
		},

		color: {
			type: String,
			required: true,
			trim: true,
		},

		icon: {
			type: String,
			trim: true,
			default: "",
		},

		order: {
			type: Number,
			default: 0,
		},

		isActive: {
			type: Boolean,
			default: true,
		},
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model(
	"AvailabilityStatus",
	availabilityStatusSchema
);