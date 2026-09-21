const express = require("express");
const router = express.Router();
const validate = require("../../middlewares/validate.middleware");
const { updateSettingsSchema } = require("../../validation/settingsValidationScheme");


const controller = require("../../controllers/settings.controller");

router.put("/", validate(updateSettingsSchema), controller.updateSettings);

module.exports = router;
