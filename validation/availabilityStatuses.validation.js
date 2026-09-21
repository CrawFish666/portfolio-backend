const z = require("zod");

const availabilityStatusSchema = z.object({
	code: z
		.string()
		.trim()
		.min(1, "Код обязателен")
		.regex(
			/^[a-z0-9-]+$/,
			"Код может содержать только латинские буквы, цифры и дефис"
		),

	title: z
		.string()
		.trim()
		.min(1, "Название обязательно")
		.max(50, "Название не может быть длиннее 50 символов"),

	color: z
		.string()
		.trim()
		.min(1, "Цвет обязателен"),

	icon: z
		.string()
		.trim()
		.optional(),

	order: z
		.number()
		.optional(),

	isActive: z
		.boolean()
		.optional(),
});

const updateAvailabilityStatusSchema =
	availabilityStatusSchema.partial();

module.exports = {
	availabilityStatusSchema,
	updateAvailabilityStatusSchema,
};