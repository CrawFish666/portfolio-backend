const jwt = require("jsonwebtoken");

// Access — живёт 10 минут, хранится в памяти фронтенда
const generateAccessToken = (user) => {
	return jwt.sign(
		{
			sub: user._id,
			username: user.username,
			role: user.role,
			isVerified: user.isVerified,
			avatar: user.avatar,
		},
		process.env.JWT_ACCESS_SECRET,
		{
			expiresIn: "10m",
			algorithm: "HS256",
		}
	);
};

// Refresh — живёт 7 дней, хранится в httpOnly куке
const generateRefreshToken = (userId) => {
	return jwt.sign({ sub: userId }, process.env.JWT_REFRESH_SECRET, {
		expiresIn: "7d",
		algorithm: "HS256",
	});
};

module.exports = { generateAccessToken, generateRefreshToken };
