const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema(
	{
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
			index: true,
		},
		refreshTokenHash: {
			type: String,
			required: true,
		},
		expiresAt: {
			type: Date,
			required: true,
			index: { expireAfterSeconds: 0 }, // TTL — MongoDB сам удалит
		},
		lastUsedAt: {
			type: Date,
			required: true,
		},
		userAgent: {
			type: String,
			default: "",
		},
		ip: {
			type: String,
			default: "",
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Session", sessionSchema);
