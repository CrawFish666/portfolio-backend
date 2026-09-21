const mongoose = require("mongoose");


const settingsSchema = new mongoose.Schema(
	{
		cvUrl: {
			type: String,
			default: "",
		},

		profile: {
			location: {
				city: {
					type: String,
					default: "",
				},

				country: {
					type: String,
					default: "",
				},
			},

			experienceYears: {
				type: Number,
				default: 0,
			},
		},

		availabilityStatus: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "AvailabilityStatus",
		},

		contacts: [
			{
				type: {
					type: String,
					required: true,
				},

				label: {
					type: String,
					required: true,
				},

				url: {
					type: String,
					required: true,
				},

				icon: {
					type: String,
					default: "",
				},

				order: {
					type: Number,
					default: 0,
				},

				isActive: {
					type: Boolean,
					default: true,
				},

				isExternal: {
					type: Boolean,
					default: true
				}
			}
		],

		feedbackSettings: {
			sendEmailNotification: { type: Boolean, default: false, },
			notificationEmail: { type: String, default: "", },
		},

	},
	{
		timestamps: true,
	}
);


module.exports = mongoose.model(
	"Settings",
	settingsSchema
);