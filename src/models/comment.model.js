const mongoose = require("mongoose");

const commentsSchema = new mongoose.Schema(
  {
    comment: {
      type: String,
      require: [true, "comment is required"],
    },
    commentedBy: String,
    commentedPost: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "post",
      required: [true, "post is required"],
    },
  },
  { timestamps: true },
);

commentsSchema.index({ comment: 1, commentedBy: 1 }, { unique: true });

const commentModel = mongoose.model("comment", commentsSchema);

module.exports = commentModel;
