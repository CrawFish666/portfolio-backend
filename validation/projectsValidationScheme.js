const z = require("zod");

// Список допустимых кодов статуса не хранится в коде.
// Статусы находятся в коллекции ProjectStatus
// и создаются автоматически при запуске приложения.
// Здесь проверяем только формат,
// существование статуса проверяется отдельно в контроллере.

const optionalUrlSchema = z
	.string()
	.trim()
	.url("Неверный формат ссылки")
	.optional()
	.or(z.literal(""));

const statusSchema = z.string().trim().min(1, "Статус обязателен");

const projectSchema = z.object({
	title: z.string().trim().min(1, "Название проекта обязательно").max(100, "Название не может быть длиннее 100 символов"),
	slug: z.string().trim().min(1, "Slug обязателен").regex(/^[a-z0-9-]+$/, "Slug может содержать только латинские буквы, цифры и дефис"),
	liveDemo_url: optionalUrlSchema,
	is_public: z.boolean().optional(),
	favorite: z.boolean().optional(),
	status: statusSchema,
	short_description: z.string().trim().max(200, "Краткое описание не может быть длиннее 200 символов").optional(),
	full_description: z.string().trim().optional(),
	tech: z.array(z.string()).optional().default([]),
	image_url: optionalUrlSchema,
	source_url: optionalUrlSchema,
});



const updateProjectSchema = projectSchema.partial();

module.exports = { projectSchema, updateProjectSchema };