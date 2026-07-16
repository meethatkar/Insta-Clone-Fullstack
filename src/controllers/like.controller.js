const likeModel = require("../models/like.model");
const postModel = require("../models/post.model");

async function checkPostExists(id) {

}

async function checkIsAlreadyLiked(username, postId, isLikedApi) {

}

async function likePostController(req, res) {
    const username = req.user.username;
    const postId = req.params.postId;

    const isPostCreated = await postModel.findById(postId);

    if (!isPostCreated) {
        return res.status(404).json({
            message: "post not found"
        })
    }

    const isPostAlreadyLiked = await likeModel.findOne({
        likedBy: username,
        likedPost: postId
    })

    if (isPostAlreadyLiked) {
        return res.status(409).json({
            message: "you have already liked this post"
        })
    }

    const likedPost = await likeModel.create({
        likedPost: postId,
        likedBy: username
    })

    res.status(201).json({
        message: "you liked the post",
        data: likedPost
    })
}

async function unlikePostController(req, res) {
    const username = req.user.username;
    const { postId } = req.params;

    const isPostCreated = await postModel.findById(postId);

    if (!isPostCreated) {
        return res.status(404).json({
            message: "post not found"
        })
    }

    const isPostAlreadyLiked = await likeModel.findOne({
        likedBy: username,
        likedPost: postId
    })

    if (!isPostAlreadyLiked) {
        return res.status(404).json({
            message: "you have not liked this post"
        })
    }

    const delResult = await likeModel.findByIdAndDelete(isPostAlreadyLiked._id);

    res.status(204).json({
        message: "you unliked the post",
        delResult
    })

}

module.exports = {
    likePostController,
    unlikePostController
}