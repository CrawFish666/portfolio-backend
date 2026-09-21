const express = require("express");
const router = express.Router();

const publicRoutes = require("./public");
const adminRoutes = require("./admin");
const authRoutes = require("./auth.routes");

router.use("/auth", authRoutes);
router.use("/", publicRoutes);
router.use("/admin", adminRoutes);

module.exports = router;