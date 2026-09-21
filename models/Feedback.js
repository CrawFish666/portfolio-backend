const mongoose = require("mongoose");
const feedbackSchema = new mongoose.Schema(
	{
		name: {
			type: String, required: true, trim: true, maxlength: 100,
		},
		email: {
			type: String, required: true, trim: true, lowercase: true, maxlength: 200,
		},
		subject: {
			type: String, required: true, trim: true, maxlength: 200,

		},
		message: {
			type: String, required: true, maxlength: 3000,
		},
		status: {
			type: String, enum: ["new", "read", "answered", "archived"],
			default: "new",
		},
		replies: [
			{
				message: {
					type: String, required: true, maxlength: 5000
				},
				sentAt: Date
			},
		],
		readAt: Date,
		ip: {
			type: String, default: "",
		},
		userAgent: {
			type: String, default: "",
		},
	}, {
	timestamps: true,
});


feedbackSchema.index({ email: 1, createdAt: -1 });

feedbackSchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model("Feedback", feedbackSchema);