const express = require("express");
const identifyUser = require("../middlewares/auth.middleware");
const saveController = require("../\/controllers/saved.controller");

const savedRoute = express.Router();

/**
 * @route "/api/post/saved/:postId"
 * @description saved post by user
 * @access Private
 */
savedRoute.post("/saved/:postId", identifyUser, saveController.saveUserPost);

/**
 * route "/api/post/unsave/:postId"
 * @description unsaved post refered to user
 * @access Private
 */
savedRoute.delete(
  "/unsaved/:postId",
  identifyUser,
  saveController.unsaveUserPost,
);

module.exports = savedRoute;
