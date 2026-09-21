const z = require("zod");
const { AVAILABILITY_STATUS_VALUES } = require("../constants/availabilityStatus");

// Разрешаем пустую строку ИЛИ валидный URL — все ссылки необязательны
const optionalUrlSchema = z
	.string()
	.trim()
	.url("Неверный формат ссылки")
	.optional()
	.or(z.literal(""));

const optionalEmailSchema = z.email("Неверный формат email").optional().or(z.literal(""));

const updateSettingsSchema = z.object({
	cvUrl: z.string().optional(),

	profile: z.object({
		location: z.object({
			city: z.string().trim().optional(),
			country: z.string().trim().optional(),
		}).optional(),

		experienceYears: z.number().min(0).optional(),
	}).optional(),

	availabilityStatus: z.string().optional(),

	contacts: z.array(
		z.object({
			type: z.string(),
			label: z.string(),
			url: z.string(),
			icon: z.string().optional(),
			order: z.number().optional(),
			isActive: z.boolean().optional(),
			isExternal: z.boolean().optional(),
		})
	).optional(),

	feedbackSettings: z.object({
		sendEmailNotification: z.boolean().optional(),
		notificationEmail: optionalEmailSchema,
	}).optional(),
});

module.exports = { updateSettingsSchema };