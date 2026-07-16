const savedModel = require("../models/saved.model");
const postModel = require("../models/post.model");

async function saveUserPost(req, res) {
  const username = req.user.username;
  const postId = req.params.postId;

  const isPostExist = await postModel.findById(postId);

  if (!isPostExist) {
    res.status(404).json({
      message: "post not found",
    });
  }

  const isAlreadySaved = await savedModel.findOne({
    savedBy: username,
    savedPost: postId,
  });

  if (isAlreadySaved) {
    return res.status(409).json({
      message: "post is already saved",
    });
  }

  const savedPostData = await savedModel.create({
    savedPost: postId,
    savedBy: username,
  });

  res.status(201).json({
    message: "post saved",
    data: savedPostData,
  });
}

async function unsaveUserPost(req, res) {
  const username = req.user.username;
  const postId = req.params.postId;

  const isPostExist = await postModel.findById(postId);

  if (!isPostExist) {
    res.status(404).json({
      message: "post not found",
    });
  }

  const isAlreadySaved = await savedModel.findOne({
    savedBy: username,
    savedPost: postId,
  });

  if (!isAlreadySaved) {
    return res.status(404).json({
      message: "post is not saved",
    });
  }

  const delResult = await savedModel.findByIdAndDelete(isAlreadySaved._id);

  res.status(204).json({
    message: "post unsaved",
  });
}

module.exports = {
  saveUserPost,
  unsaveUserPost,
};
