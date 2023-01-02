const router = require("express").Router();
const postController = require("../../controllers/postController");
const { protect } = require("../../middlewares/auth");
const validation = require("../../middlewares/validation");
const validators = require("./postValidation");
const { upload, fileValidation } = require("../../utils/multer");
const commentRouter = require("../comment/comment");

router.use("/:postId/comments", commentRouter);

router.use(protect);

router.get("/feed", postController.feed);

router.post(
  "/",
  upload("posts", fileValidation.image).array("images", 20),
  validation(validators.createPostValidation),
  postController.uploadPostPics,
  postController.setUserId,
  postController.createPost
);

router.patch(
  "/:id",
  upload("posts", fileValidation.image).fields([
    { name: "images", maxCount: 20 },
    { name: "imagesArr", maxCount: 20 },
  ]),
  validation(validators.updatePostValidation),
  postController.uploadPostPicsUpdates,
  postController.updatePost
);

router.get(
  "/find/:id",
  validation(validators.postIdValidation),
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
  validation(validators.postIdValidation),
  postController.deletePost
);

router.patch(
  "/like/:id",
  validation(validators.postIdValidation),
  postController.likePost
);

module.exports = router;
