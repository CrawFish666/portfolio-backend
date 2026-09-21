const mongoose = require("mongoose");


const projectSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: [true, "Название проекта обязательно"],
			trim: true,
			maxlength: [100, "Название не может быть длиннее 100 символов"],
		},
		slug: {
			type: String,
			required: [true, "Slug обязателен"],
			unique: true,
			trim: true,
			lowercase: true,
			match: [/^[a-z0-9-]+$/, "Slug может содержать только латинские буквы, цифры и дефис"],
		},
		liveDemo_url: {
			type: String,
			trim: true,
			default: "",
		},
		is_public: {
			type: Boolean,
			default: true,
		},
		status: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "ProjectStatus",
			required: [true, "Статус обязателен"],
		},
		short_description: {
			type: String,
			trim: true,
			maxlength: [200, "Краткое описание не может быть длиннее 200 символов"],
		},
		full_description: {
			type: String,
			trim: true,
		},
		tech: {
			type: [
				{
					type: mongoose.Schema.Types.ObjectId,
					ref: "Technology",
				},
			],
			default: [],
		},
		image_url: {
			type: String,
			trim: true,
			default: "",
		},
		source_url: {
			type: String,
			trim: true,
			default: "",
		},
		favorite: {
			type: Boolean,
			default: false,
		},
	},
	{ timestamps: true }
);

// Индексы для быстрого поиска
projectSchema.index({ favorite: 1 });
projectSchema.index({ is_public: 1 });
projectSchema.index({ status: 1 });
projectSchema.index({ title: "text", short_description: "text" });

module.exports = mongoose.model("Project", projectSchema);