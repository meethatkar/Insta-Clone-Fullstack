const express = require("express");
const identifyUser = require("../middlewares/auth.middleware");
const followController = require("../controllers/follow.controller");

const followRoute = express.Router();

/**
 * @route POST /api/users/follow/:username
 * @description follow a user
 * @access Private
 */
followRoute.post(
  "/follow/:username",
  identifyUser,
  followController.followUserController,
);

/**
 * @route POST /api/users/unfollow/:username
 * @description  unfollow a user
 * @access Private
 */
followRoute.post(
  "/unfollow/:username",
  identifyUser,
  followController.unfollowUserController,
);

/**
 * @route POST /api/users/status/:username
 * @description update follow status
 * @access Private
 */
followRoute.post(
  "/status/:username",
  identifyUser,
  followController.updateFollowStatusController,
);

/**
 * @route GET /api/users/count/:username
 * @description get followers and following count
 * @access Private
 */
followRoute.get(
  "/count/:username",
  identifyUser,
  followController.getFollowCount,
);

/**
 * @route GET /api/users/followingList/:username
 * @description get following user list
 * @access Private
 */
followRoute.get(
  "/followingList/:username",
  identifyUser,
  followController.getFollowingUserList,
);

/**
 * @route GET /api/users/followerList/:username
 * @description get follower user list
 * @access Private
 */
followRoute.get(
  "/followerList/:username",
  identifyUser,
  followController.getFollowerUserList,
);

/**
 * @route GET /api/users/followPendingList/:username
 * @description get following user list
 * @access Private
 */
followRoute.get(
  "/followPendingList/:username",
  identifyUser,
  followController.getFollowPendingUserList,
);

// TODO:- API To get list of followers and following

module.exports = followRoute;
