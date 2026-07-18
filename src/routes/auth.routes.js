const express = require("express");
const authController = require("../controllers/auth.controllers");
const identifyUser = require("../middlewares/auth.middleware");
const authRouter = express.Router();

/**
 * @route POST /api/auth/register
 * @access Public
 */
authRouter.post("/register", authController.registerController);

/**
 * @route POST /api/auth/login
 * @access Public
 */
authRouter.post("/login", authController.loginController);

/**
 * @route GET /api/auth/get-me
 * @description get currently logged in user's information
 * @access Private
 */
authRouter.get(
  "/get-me",
  identifyUser,
  authController.getLoggedInUserController,
);

authRouter.post(
  "/logout",
  identifyUser,
  authController.logoutController,
);

module.exports = authRouter;
