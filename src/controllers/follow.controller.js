const followModel = require("../models/follow.model");
const userModel = require("../models/auth.model");

async function followUserController(req, res) {
  const followerId = req.user.user;
  const followeeName = req.params.username;

  // 1st Check:-  checking user (followee) exists or not ?
  const followeeUser = await userModel.findOne({
    username: followeeName,
  });

  if (!followeeUser) {
    return res.status(404).json({
      message: "user not exists",
    });
  }

  const followeeId = followeeUser._id;

  // 2nd Check:- can't follow yourself
  if (followeeId.toString() === followerId.toString()) {
    return res.status(409).json({
      message: "you can't follow yourself",
    });
  }

  // 3rd Check:- checking does user already followed it or not.
  const isAlreadyFollowed = await followModel.findOne({
    follower: followerId,
    followee: followeeId,
  });

  if (isAlreadyFollowed) {
    return res.status(409).json({
      message: `you are already following ${followeeName}`,
    });
  }

  const followingData = await followModel.create({
    follower: followerId,
    followee: followeeId,
    status: "pending",
  });

  res.status(201).json({
    message: `you now follow ${followeeName}`,
    data: followingData,
  });
}

async function unfollowUserController(req, res) {
  const followerId = req.user.user;
  const followeeName = req.params.username;

  const followeeUser = await userModel.findOne({
    username: followeeName,
  });

  if (!followeeUser) {
    return res.status(404).json({
      message: "user not exists",
    });
  }

  const followeeId = followeeUser._id;

  const isUserBeginFollowed = await followModel.findOne({
    follower: followerId,
    followee: followeeId,
  });

  if (!isUserBeginFollowed) {
    return res.status(404).json({
      message: `you are not following ${followeeName} user`,
    });
  }

  const data = await followModel.findByIdAndDelete({
    _id: isUserBeginFollowed._id,
  });

  res.status(200).json({
    message: `you are now not following ${followeeName} user now`,
  });
}

async function updateFollowStatusController(req, res) {
  const followerName = req.params.username;
  const followeeId = req.user.user; // The logged in user is the followee approving the request
  const { status } = req.body;

  const followerUser = await userModel.findOne({
    username: followerName,
  });

  if (!followerUser) {
    return res.status(404).json({
      message: "follower not exists",
    });
  }

  const followerId = followerUser._id;

  const isFolloweeFollows = await followModel.findOne({
    followee: followeeId,
    follower: followerId,
  });

  if (!isFolloweeFollows) {
    return res.status(404).json({
      message: `${followerName} has not requested to follow you`,
    });
  }

  const updatedStatus = await followModel.findByIdAndUpdate(
    isFolloweeFollows._id,
    {
      status: status,
    },
    {
      runValidators: true,
      new: true,
    },
  );

  res.status(200).json({
    message: "status updated",
    data: updatedStatus,
    new: true,
  });
}

async function getFollowCount(req, res) {
  const { username } = req.params;

  const user = await userModel.findOne({ username });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const userId = user._id;

  const followeeCount = await followModel.countDocuments({
    follower: userId,
    status: "accepted",
  });

  const followerCount = await followModel.countDocuments({
    followee: userId,
    status: "accepted",
  });

  res.status(200).json({
    message: "fetched following and follower count",
    followeeCount,
    followerCount,
  });
}

async function getFollowingUserList(req, res) {
  const { username } = req.params;

  const user = await userModel.findOne({ username });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const followeeList = await followModel.find({
    follower: user._id,
    status: "accepted",
  }).populate("followee", "username profilePicture createdAt");

  // Map to a cleaner format if necessary, or just return as is
  // Using the populated followee document as the user object for the frontend
  const formattedList = followeeList.map(item => ({
    ...item.followee.toObject(),
    followDate: item.createdAt
  }));

  res.status(200).json({
    message: "fetched following Data",
    followeeList: formattedList,
  });
}

async function getFollowerUserList(req, res) {
  const { username } = req.params;

  const user = await userModel.findOne({ username });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const followerList = await followModel.find({
    followee: user._id,
    status: "accepted",
  }).populate("follower", "username profilePicture createdAt");

  const formattedList = followerList.map(item => ({
    ...item.follower.toObject(),
    followDate: item.createdAt
  }));

  res.status(200).json({
    message: "fetched follower Data",
    followerList: formattedList,
  });
}

async function getFollowPendingList(req, res) {
  const { username } = req.params;

  const user = await userModel.findOne({ username });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const followPendingList = await followModel.find({
    followee: user._id,
    status: "pending",
  }).populate("follower", "username profilePicture createdAt");
  console.log("PENDING LIST:: ", followPendingList);

  const formattedList = followPendingList.map(item => ({
    ...item.follower.toObject(),
    followDate: item.createdAt
  }));

  console.log("FORMATTED LIST:: ", formattedList);


  res.status(200).json({
    message: "fetched follow pending Data",
    followPendingList: formattedList,
  });
}

module.exports = {
  followUserController,
  unfollowUserController,
  updateFollowStatusController,
  getFollowCount,
  getFollowingUserList,
  getFollowerUserList,
  getFollowPendingUserList: getFollowPendingList,
};
