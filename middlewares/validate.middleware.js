
// Универсальный валидатор req.body по Zod-схеме.
// При успехе — перезаписывает req.body уже провалидированными данными
// (со всеми default() и трансформациями из схемы).
const validate = (schema) => {
	return (req, res, next) => {
		const result = schema.safeParse(req.body);

		if (!result.success) {
			return next(result.error);
		}

		req.body = result.data;
		next();
	};
};

module.exports = validate;
