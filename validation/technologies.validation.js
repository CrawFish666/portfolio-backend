const z = require("zod");

const optionalUrlSchema = z
	.string()
	.trim()
	.url("Неверный формат ссылки")
	.optional()
	.or(z.literal(""));

const technologySchema = z.object({
	name: z
		.string()
		.trim()
		.min(1, "Название технологии обязательно")
		.max(50, "Название не может быть длиннее 50 символов"),

	slug: z
		.string()
		.trim()
		.min(1, "Slug обязателен")
		.regex(
			/^[a-z0-9-]+$/,
			"Slug может содержать только латинские буквы, цифры и дефис"
		),

	icon: z.string().trim().optional().or(z.literal("")),

	category: z
		.string()
		.trim()
		.min(1, "Категория обязательна"),

	website: optionalUrlSchema,

	order: z.number().optional(),

	isActive: z.boolean().optional(),
});

const updateTechnologySchema = technologySchema.partial();

module.exports = {
	technologySchema,
	updateTechnologySchema,
};