const crypto = require("crypto");

/**
 * Хэширует refresh-токен алгоритмом SHA-256.
 * В БД храним только хэш — если база утечёт,
 * токены нельзя будет использовать.
 */
const hashToken = (token) => {
	return crypto.createHash("sha256").update(token).digest("hex");
};

module.exports = hashToken;
