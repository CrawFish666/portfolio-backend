const mongoose = require("mongoose");

const projectStatusSchema = new mongoose.Schema(
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
		// Сортировка по order
		order: {
			type: Number,
			default: 0,
		},
		// Если захочу убрать возможность добавлять этот статус в проекты, то false
		isActive: {
			type: Boolean,
			default: true,
		},
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model("ProjectStatus", projectStatusSchema);