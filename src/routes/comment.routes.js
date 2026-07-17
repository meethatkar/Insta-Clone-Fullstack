const express = require("express");
const identifyUser = require("../middlewares/auth.middleware");
const commentController = require("../controllers/comment.controller");

const commentRoute = express.Router();

/**
 * @route "/api/post/comment/:postId"
 * @description adding comment for post, single comment per user
 * @access Private
 */
commentRoute.post(
  "/comment/:postId",
  identifyUser,
  commentController.createUserComments,
);

module.exports = commentRoute;
