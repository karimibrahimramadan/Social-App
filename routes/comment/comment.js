const router = require("express").Router({ mergeParams: true });
const commentController = require("../../controllers/commentController");
const { protect, retrictTo } = require("../../middlewares/auth");
const validation = require("../../middlewares/validation");
const validators = require("./commentValidation");

router.use(protect);

router.post(
  "/",
  validation(validators.createCommentValidation),
  commentController.setCommentIds,
  commentController.createComment
);

router.get(
  "/find/:id",
  validation(validators.commentIdValidation),
  commentController.getComment
);

router.get(
  "/",
  validation(validators.getAllCommentsValidation),
  commentController.setFilterObj,
  commentController.getAllComments
);

router.use(retrictTo("admin", "user"));

router.patch(
  "/:id",
  validation(validators.updateCommentValidation),
  commentController.updateComment
);

router.delete(
  "/:id",
  validation(validators.commentIdValidation),
  commentController.deleteComment
);

router.patch(
  "/like/:id",
  validation(validators.commentIdValidation),
  commentController.likeComment
);

module.exports = router;
