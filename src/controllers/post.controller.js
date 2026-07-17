const ImageKit = require("@imagekit/nodejs");
const { toFile } = require("@imagekit/nodejs");
const postModel = require("../models/post.model");
const likeModel = require("../models/like.model");
const followModel = require("../models/follow.model");
const savedModel = require("../models/saved.model");

const imageKit = new ImageKit({
  privateKey: process.env.IMAGE_KIT_KEY,
});

async function createPostController(req, res) {
  const { caption } = req.body;

  let decoded = req.user.user;

  const uploadedFile = await imageKit.files.upload({
    file: await toFile(Buffer.from(req.file.buffer), "file"),
    fileName: "fileName",
    folder: "cohort-instagram",
  });

  const post = await postModel.create({
    caption: caption,
    createdBy: decoded,
    postImage: uploadedFile.url,
  });
  res.status(201).json({
    message: "post created",
    post,
  });
}

// [protected]
async function getUserAllPost(req, res) {
  let decoded = req.user;
  const posts = await postModel.find({
    createdBy: decoded.user,
  });

  res.status(200).json({
    data: posts,
  });
}

// [protected]
async function getPostDetails(req, res) {
  let decoded = req.user;

  const postId = req.params.postId;

  const post = await postModel.findById(postId);

  if (!post) {
    return res.status(404).json({
      message: "post not found",
    });
  }

  let isValidUser = post.createdBy.toString() === decoded.user;

  if (!isValidUser) {
    return res.status(403).json({
      message: "access forbidden",
    });
  }

  res.status(200).json({
    message: "post details fetched successfully",
    data: post,
  });
}

// [protected]
async function getUserFeed(req, res) {
  const feedData = await Promise.all(
    (
      await postModel
        .find()
        .sort({ createdAt: -1 })
        .populate("createdBy")
        .lean()
    ).map(async (post) => {
      //  ***** Logic is check requrste user liked the post of not
      const isLiked = await likeModel.findOne({
        likedPost: post._id,
        likedBy: req.user.username,
      });
      post.isLiked = !!isLiked;

      //  ***** Logic to check requrste user saved the post or not.
      const isSaved = await savedModel.findOne({
        savedBy: req.user.username,
        savedPost: post._id,
      });
      post.isSaved = !!isSaved;

      // ***** Logic to check requrste user follows post createdBy user or not.
      const isFollowed = await followModel.findOne({
        follower: req.user.username,
        followee: post.createdBy.username,
      });
      post.isFollowed = !!isFollowed;
      return post;
    }),
  );
  res.status(200).json({
    message: "feed fetched successfully",
    data: feedData,
  });
}

// [protected]
// TODO:- to get total post count of a user

module.exports = {
  createPostController,
  getUserAllPost,
  getPostDetails,
  getUserFeed,
};
