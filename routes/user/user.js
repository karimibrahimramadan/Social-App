const router = require("express").Router();
const authController = require("../../controllers/authController");
const userController = require("../../controllers/userController");
const { retrictTo } = require("../../middlewares/auth");

router.post("/signup", authController.signup);

router.get("/verify-email/:token", authController.verifyEmail);

router.post("/login", authController.login);

router.patch("/forgotpassword", authController.forgotPassword);

router.patch("/resetpassword/:token", authController.resetPassword);

router.use(retrictTo("user"));

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

router.get("/:id", retrictTo("admin", "user"), userController.getUser);

router.get("/", retrictTo("admin", "user"), userController.getAllUsers);

router.use(retrictTo("admin"));

router.patch("/:id", userController.updateUser);

router.delete("/:id", userController.deleteUser);

module.exports = router;
