const express = require("express");
const router = express.Router();

const { verifyJWTToken } = require("../../middleware/JWT.middleware");
const authController = require("../controllers/auth.controller");
const authValidation = require("../validators/auth.validator");

router.post("/register", authValidation.register, authController.register);
router.post("/login", authValidation.login, authController.login);
router.post("/reset",  authController.resetpassword);
router.post("/request/reset", authController.requestresetpassword);
router.post("/resetwithtoken", authController.restpasswordwithtoken);



module.exports = router;