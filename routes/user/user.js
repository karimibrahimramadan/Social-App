const router = require("express").Router();
const authController = require("../../controllers/authController");

router.post("/signup", authController.signup);

router.get("/verify-email/:token", authController.verifyEmail);

router.post("/login", authController.login);

router.patch("/forgotpassword", authController.forgotPassword);

router.patch("/resetpassword/:token", authController.resetPassword);

router.patch("/me/updatepassword", authController.updatePassword);

module.exports = router;
