const sendSuccess = (
	res,
	{
		status = 200,
		message = "Успешно",
		data = null,
	} = {}
) => {
	return res.status(status).json({
		success: true,
		message,
		data,
	});
};

module.exports = sendSuccess;