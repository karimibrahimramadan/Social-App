const router = require("express").Router();
const postController = require("../../controllers/postController");
const { protect } = require("../../middlewares/auth");
const validation = require("../../middlewares/validation");
const validators = require("./postValidation");
const { upload, fileValidation } = require("../../utils/multer");
const commentRouter = require("../comment/comment");

router.use("/:postId/comments", commentRouter);

router.use(protect);

router.post(
  "/",
  upload("posts", fileValidation.image).array("images", 10),
  validation(validators.createPostValidation),
  postController.uploadPostPics,
  postController.setUserId,
  postController.createPost
);

router.patch(
  "/:id",
  //   upload("posts", fileValidation.image).fields(),
  validation(validators.updatePostValidation),
  postController.updatePost
);

router.get(
  "/find/:id",
  validation(validators.getPostValidation),
  postController.getPost
);

router.get(
  "/:userId?",
  validation(validators.getAllPostsValidation),
  postController.setFilterObj,
  postController.getAllPosts
);

router.delete(
  "/:id",
  validation(validators.deletePostValidation),
  postController.deletePost
);

module.exports = router;
