const express = require("express");
const postController = require("../controllers/post.controller");
const multer = require("multer");
const identifyUser = require("../middlewares/auth.middleware");

const upload = multer({ storage: multer.memoryStorage() })

const postRoute = express.Router();

/**
* @route post /api/post
* @description create post
* @access Private
*/
postRoute.post("/", upload.single("postImage"), identifyUser, postController.createPostController)

/** 
* @route get /api/post
* @description get all post created by that user
* @access Private
*/
postRoute.get("/", identifyUser, postController.getUserAllPost);

/**
* @route get /api/post/details/:postId
* @description get post detail 
* @access Private
*/
postRoute.get("/detail/:postId", identifyUser, postController.getPostDetails);

/**
 * @route get /api/post/feed
 * @description get all post information with it's user's detail
 * @access Private
 */
postRoute.get("/feed", identifyUser, postController.getUserFeed);

module.exports = postRoute;