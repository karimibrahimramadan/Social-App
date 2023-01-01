const router = require("express").Router();
const authController = require("../../controllers/authController");
const userController = require("../../controllers/userController");
const { retrictTo, protect } = require("../../middlewares/auth");
const validation = require("../../middlewares/validation");
const validators = require("./userValidation");
const { upload, fileValidation } = require("../../utils/multer");

router.post(
  "/signup",
  validation(validators.signupValidation),
  authController.signup
);

router.get(
  "/verify-email/:token",
  validation(validators.verifyEmailValidation),
  authController.verifyEmail
);

router.post(
  "/login",
  validation(validators.loginValidation),
  authController.login
);

router.patch(
  "/forgotpassword",
  validation(validators.forgotpasswordValidation),
  authController.forgotPassword
);

router.patch(
  "/resetpassword/:token",
  validation(validators.resetpasswordValidation),
  authController.resetPassword
);

router.use(protect);

router.patch(
  "/me/updatepassword",
  validation(validators.updatepasswordValidation),
  authController.updatePassword
);

router.get("/me/profile", userController.setParamsId, userController.getUser);

router.patch(
  "/me/update",
  userController.setParamsId,
  userController.updateUser
);

router.delete(
  "/me/delete",
  userController.setParamsId,
  userController.deleteUser
);

router.patch(
  "/me/profilepic",
  upload("users/profile", fileValidation.image).single("image"),
  userController.uploadProfilePic,
  userController.setParamsId,
  userController.updateUser
);

router.get(
  "/:id",
  retrictTo("admin", "user"),
  validation(validators.paramsIdValidation),
  userController.getUser
);

router.patch("/sendrequest/:id", userController.sendRequest);

router.patch("/add/:id", userController.addFriend);

router.patch("/follow/:id", userController.follow);

router.get("/", retrictTo("admin", "user"), userController.getAllUsers);

router.use(retrictTo("admin"));

router.patch(
  "/:id",
  validation(validators.paramsIdValidation),
  userController.updateUser
);

router.delete(
  "/:id",
  validation(validators.paramsIdValidation),
  userController.deleteUser
);

module.exports = router;
