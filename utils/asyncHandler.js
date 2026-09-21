// Хелпер для async-контроллеров, чтобы не писать try/catch и next(error)
// везде. Если промис упадет из контроллера то ошибка сама в next полетит
// в общий error.middleware
const asyncHandler = (handler) => (req, res, next) => {
	Promise.resolve(handler(req, res, next)).catch(next);
};

module.exports = asyncHandler;