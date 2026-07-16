const bcrypt = require("bcrypt");
const accountModel = require("../models/auth.model");
const jwt = require("jsonwebtoken");

async function registerController(req, res) {
  const { username, password, email, bio, gender, profilePicture } = req.body;

  const isUserExisted = await accountModel.findOne({
    $or: [{ username }, { email }],
  });

  if (isUserExisted) {
    return res.status(409).json({
      message:
        isUserExisted.email === email
          ? "email is already register, try to login"
          : "username is already taken please try another one",
    });
  }

  const hashsedPassword = await bcrypt.hash(password, 10);

  const user = await accountModel.create({
    username,
    password: hashsedPassword,
    email,
    bio,
    profilePicture,
    gender,
  });

  const token = jwt.sign(
    {
      user: user._id,
      username: user.username,
    },
    process.env.JWT_TOKEN,
    { expiresIn: "1d" },
  );

  res.cookie("jwt_token", token);

  res.status(201).json({
    message: "registration successfull",
    Data: {
      username,
      email,
      profilePicture,
      bio,
      gender,
    },
  });
}

async function loginController(req, res) {
  const { username, email, password } = req.body;

  const isUserExisted = await accountModel.findOne({
    $or: [{ username }, { email }],
  });

  if (!isUserExisted) {
    return res.status(400).json({
      message: "user not found",
    });
  }

  const isPasswordCorrect = await bcrypt.compare(
    password,
    isUserExisted.password,
  );

  if (!isPasswordCorrect) {
    return res.status(401).json({
      message: "invalid password",
    });
  }

  const token = jwt.sign(
    {
      user: isUserExisted._id,
      username: isUserExisted.username,
    },
    process.env.JWT_TOKEN,
    { expiresIn: "1d" },
  );

  res.cookie("jwt_token", token);

  res.status(201).json({
    message: "login success",
    data: {
      username: isUserExisted.username,
      email: isUserExisted.email,
      gender: isUserExisted.gender,
      profileImage: isUserExisted.profilePicture,
      bio: isUserExisted.bio,
    },
  });
}

async function getLoggedInUserController(req, res) {
  const username = req.user.username;

  const accountData = await accountModel.findOne({
    username,
  });

  res.status(200).json({
    message: "data fetched successfully",
    data: {
      username: accountData.username,
      email: accountData.email,
      gender: accountData.gender,
      bio: accountData.bio,
      profileImage: accountData.profilePicture,
    },
  });
}

module.exports = {
  registerController,
  loginController,
  getLoggedInUserController,
};
