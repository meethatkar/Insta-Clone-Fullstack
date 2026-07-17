const commentModel = require("../models/comment.model");
const postModel = require("../models/post.model");

async function createUserComments(req, res) {
  const username = req.user.username;
  const postId = req.params.postId;

  const isPostExist = await postModel.findById(postId);
  if (!isPostExist) {
    return res.status(404).json({
      message: "post no found",
    });
  }

  const isCommented = await commentModel.findOne({
    commentedBy: username,
    commentedPost: postId,
  });

  if (isCommented) {
    return res.status(409).json({
      message: "you can only comment once in a post",
    });
  }

  const result = await commentModel.create({
    comment: req.body.comment,
    commentedBy: username,
    commentedPost: postId,
  });

  res.status(201).json({
    message: "your comment added",
    result,
  });
}

module.exports = {
  createUserComments,
};
