const mongoose = require("mongoose");

const technologyCategorySchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, "Название категории обязательно"],
			trim: true,
			unique: true,
		},

		slug: {
			type: String,
			required: [true, "Slug обязателен"],
			trim: true,
			unique: true,
			lowercase: true,
			match: [
				/^[a-z0-9-]+$/,
				"Slug может содержать только латинские буквы, цифры и дефис",
			],
		},

		color: {
			type: String,
			required: [true, "Цвет обязателен"],
			default: "#64748B",
		},
		icon: {
			type: String,
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

technologyCategorySchema.index({ order: 1 });

module.exports = mongoose.model(
	"TechnologyCategory",
	technologyCategorySchema
);