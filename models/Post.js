const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    content: String,
    images: [String],
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Post must belong to a user"],
    },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

postSchema.virtual("comments", {
  ref: "Comment",
  localField: "_id",
  foreignField: "post",
});

postSchema.pre("findOne", function (next) {
  this.populate([
    {
      path: "user",
      select: "name profilePic",
    },
    {
      path: "comments",
      select: "content",
    },
  ]);
  next();
});

const Post = mongoose.model("Post", postSchema);

module.exports = Post;
