const router = require("express").Router();
const authController = require("../../controllers/authController");
const userController = require("../../controllers/userController");
const { retrictTo, protect } = require("../../middlewares/auth");
const { upload, fileValidation } = require("../../utils/multer");

router.post("/signup", authController.signup);

router.get("/verify-email/:token", authController.verifyEmail);

router.post("/login", authController.login);

router.patch("/forgotpassword", authController.forgotPassword);

router.patch("/resetpassword/:token", authController.resetPassword);

router.use(protect);

router.patch("/me/updatepassword", authController.updatePassword);

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

router.get("/:id", retrictTo("admin", "user"), userController.getUser);

router.get("/", retrictTo("admin", "user"), userController.getAllUsers);

router.use(retrictTo("admin"));

router.patch("/:id", userController.updateUser);

router.delete("/:id", userController.deleteUser);

module.exports = router;
