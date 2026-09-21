const { z } = require("zod");

const updateStatusSchema = z.object({
	status: z.enum(["new", "read", "answered", "archived"]),
});

const replySchema = z.object({
	message: z.string()
		.trim()
		.min(3, "Минимум 3 символа")
		.max(5000, "Максимум 5000 символов"),
});

module.exports = {
	updateStatusSchema,
	replySchema,
};