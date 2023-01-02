const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    content: { type: String, required: [true, "Comment is required"] },
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: [true, "Comment must belong to a post"],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Comment must belong to a user"],
    },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

commentSchema.pre("findOne", function (next) {
  this.populate("user", "name profilePic");
  next();
});

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;
