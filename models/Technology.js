const mongoose = require("mongoose");

const technologySchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			trim: true,
			unique: true,
		},

		slug: {
			type: String,
			required: true,
			trim: true,
			unique: true,
			lowercase: true,
		},

		icon: {
			type: String,
			trim: true,
			default: "",
		},

		website: {
			type: String,
			trim: true,
			default: "",
		},

		category: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "TechnologyCategory",
			required: true,
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

technologySchema.index({ order: 1 });
technologySchema.index({ category: 1 });

module.exports = mongoose.model("Technology", technologySchema);