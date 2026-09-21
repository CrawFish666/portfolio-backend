const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
	{
		username: {
			type: String,
			required: [true, "Логин обязателен"],
			unique: true,
			trim: true,
			minlength: [3, "Логин должен быть минимум 3 символа"],
			maxlength: [16, "Логин не может быть длиннее 16 символов"],
		},
		name: {
			type: String,
			trim: true,
			default: "",
		},
		email: {
			type: String,
			required: [true, "Email обязателен"],
			unique: true,
			lowercase: true,
			trim: true,
			match: [/^\S+@\S+\.\S+$/, "Неверный формат email"],
		},
		password: {
			type: String,
			required: [true, "Пароль обязателен"],
			minlength: [8, "Пароль должен быть минимум 8 символов"],
			select: false,
		},
		role: {
			type: String,
			enum: ["user", "admin"],
			default: "user",
		},
		isVerified: {
			type: Boolean,
			default: false,
		},
		avatar: {
			type: String,
			default: "https://api.dicebear.com/9.x/avataaars/svg?seed=default",
		},
	},
	{ timestamps: true }
);

// Хэшируем пароль перед сохранением
userSchema.pre("save", async function () {
	if (!this.isModified("password")) return;

	const salt = await bcrypt.genSalt(12);
	this.password = await bcrypt.hash(this.password, salt);
});

// Метод для сравнения паролей
userSchema.methods.comparePassword = async function (candidatePassword) {
	return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
