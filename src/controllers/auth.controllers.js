const bcrypt = require("bcrypt");
const accountModel = require("../models/auth.model");
const jwt = require("jsonwebtoken");
const ImageKit = require("@imagekit/nodejs");
const { toFile } = require("@imagekit/nodejs");

const imageKit = new ImageKit({
  privateKey: process.env.IMAGE_KIT_KEY,
});

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

  res.cookie("jwt_token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 24 * 60 * 60 * 1000,
  });

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

  res.cookie("jwt_token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 24 * 60 * 60 * 1000,
  });

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
    username: username,
  });

  if (!accountData) {
    return res.status(404).json({
      message: "user not found"
    })
  }

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

async function logoutController(req, res) {
  res.clearCookie("jwt_token");
  res.status(201).json({
    message: "user logged out successfully"
  })
}

async function editProfile(req, res) {
  const username_token = req.user.username;

  const oldData = await accountModel.findOne({
    username: username_token
  })

  if (!oldData) {
    return res.status(404).json({
      message: "user not found"
    })
  }

  const { username, bio } = req.body;

  const updateObject = {};

  if (username && username.trim() !== "") {
    updateObject.username = username;
  }

  if (bio && bio.trim() !== "") {
    updateObject.bio = bio;
  }

  if (req.file) {
    const uploadedFile = await imageKit.files.upload({
      file: await toFile(Buffer.from(req.file.buffer), "file"),
      fileName: "updated-profile-image",
      folder: "cohort-instagram"
    })
    updateObject.profilePicture = uploadedFile.url;
  }

  const update = await accountModel.findByIdAndUpdate(oldData._id, updateObject, {
    new: true,
    runValidators: true
  })

  const token = jwt.sign(
    {
      user: update._id,
      username: update.username,
    },
    process.env.JWT_TOKEN,
    { expiresIn: "1d" },
  );

  res.cookie("jwt_token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 24 * 60 * 60 * 1000,
  });

  res.status(200).json({
    message: "profile updated successfully",
    data: update
  })
}

module.exports = {
  registerController,
  loginController,
  getLoggedInUserController,
  logoutController,
  editProfile
};
