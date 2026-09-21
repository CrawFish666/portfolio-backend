const z = require("zod");

const usernameSchema = z
	.string()
	.trim()
	.min(3, "Логин должен быть минимум 3 символа")
	.max(16, "Логин не может быть длиннее 16 символов")
	.regex(/^[a-zA-Z0-9]+$/, "Только латинские буквы и цифры");

const nameSchema = z
	.string()
	.trim()
	.max(50, "Имя не может быть длиннее 50 символов")
	.optional()
	.or(z.literal(""));

const emailSchema = z
	.string()
	.trim()
	.min(1, "Email обязателен")
	.email("Неверный формат email");

const passwordSchema = z
	.string()
	.trim()
	.min(8, "Пароль должен быть минимум 8 символов")
	.regex(/[A-Z]/, "Нужна хотя бы одна заглавная буква")
	.regex(/[0-9]/, "Нужна хотя бы одна цифра")
	.regex(/[^A-Za-z0-9]/, "Нужен хотя бы один спецсимвол");

const registerSchema = z.object({
	username: usernameSchema,
	name: nameSchema,
	email: emailSchema,
	password: passwordSchema,
});

const loginSchema = z.object({
	email: emailSchema,
	password: z.string().trim().min(1, "Введите пароль"),
});

const forgotPasswordSchema = z.object({
	email: emailSchema,
});

const resetPasswordSchema = z.object({
	password: passwordSchema
})

module.exports = { registerSchema, loginSchema, forgotPasswordSchema, resetPasswordSchema };
