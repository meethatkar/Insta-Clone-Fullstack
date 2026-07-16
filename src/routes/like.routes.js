const express = require("express");
const likePostController = require("../controllers/like.controller");
const identifyUser = require("../middlewares/auth.middleware");

const likeRoute = express.Router();

/**
 * @route POST /api/post/like/:postId
 * @description user liked post
 * @access Private
 */
likeRoute.post("/like/:postId", identifyUser, likePostController.likePostController);

/**
 * @route POST /api/post/unlike/:postId
 * @description user unliked post
 * @access Private
 */
likeRoute.post("/unlike/:postId", identifyUser, likePostController.unlikePostController);

module.exports = likeRoute;