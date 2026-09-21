const mongoose = require("mongoose");

const resetPwdTokenSchema = new mongoose.Schema({
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true,
		index: true,
	},
	tokenHash: {
		type: String,
		required: true,
	},
	expiresAt: {
		type: Date,
		required: true,
		index: { expireAfterSeconds: 0 }, // TTL — MongoDB сама удалит через 10 мин
	},
});

module.exports = mongoose.model("ResetPwdToken", resetPwdTokenSchema);