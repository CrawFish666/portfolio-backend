const z = require("zod");

const technologyCategorySchema = z.object({
	name: z
		.string()
		.trim()
		.min(1, "Название категории обязательно")
		.max(50, "Название не может быть длиннее 50 символов"),

	slug: z
		.string()
		.trim()
		.min(1, "Slug обязателен")
		.regex(
			/^[a-z0-9-]+$/,
			"Slug может содержать только латинские буквы, цифры и дефис"
		),

	color: z
		.string()
		.trim()
		.min(1, "Цвет обязателен"),

	icon: z.string().trim().default(""),

	order: z.number().int().optional(),

	isActive: z.boolean().default(true),
});

const updateTechnologyCategorySchema =
	technologyCategorySchema.partial();

module.exports = {
	technologyCategorySchema,
	updateTechnologyCategorySchema,
};