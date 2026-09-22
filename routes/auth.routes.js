const express = require("express");
const router = express.Router();
const {
	register,
	login,
	refresh,
	logout,
	getMe,
	updateProfile,
	sendRecoveryPasswordToken,
	verifyResetPwdToken,
	resetPasswordViaToken
} = require("../controllers/auth.controller");
const { protect } = require("../middlewares/authMiddleware");
const { loginLimiter, forgotPasswordLimiter } = require("../middlewares/authLimiter.middleware");
const csrfMiddleware = require("../middlewares/csrf.middleware");

router.post("/register", loginLimiter, register);
router.post("/login", loginLimiter, login);
router.post("/refresh", csrfMiddleware, refresh);
router.post("/logout", csrfMiddleware, logout);
router.get("/me", protect, getMe);
router.put("/me", protect, updateProfile);
router.post("/forgot-password", forgotPasswordLimiter, sendRecoveryPasswordToken);
router.get("/reset-password/:token/verify", verifyResetPwdToken);
router.post("/reset-password", forgotPasswordLimiter, resetPasswordViaToken);

module.exports = router;
