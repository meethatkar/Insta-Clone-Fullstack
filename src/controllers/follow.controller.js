const followModel = require("../models/follow.model");
const userModel = require("../models/auth.model");

async function followUserController(req, res) {
  const followerName = req.user.username;
  const followeeName = req.params.username;

  // 1st Check:- can't follow yourself
  if (followeeName == followerName) {
    return res.status(409).json({
      message: "you can't follow yourself",
    });
  }

  // 2nd Check:-  checking user (followee) exists or not ?
  const isFolloweeExists = await userModel.findOne({
    username: followeeName,
  });

  if (!isFolloweeExists) {
    return res.status(404).json({
      message: "user not exists",
    });
  }

  // 3rd Check:- checking does user already followed it or not.
  const isAlreadyFollowed = await followModel.findOne({
    follower: followerName,
    followee: followeeName,
  });

  if (isAlreadyFollowed) {
    return res.status(409).json({
      message: `you are already following ${followeeName}`,
    });
  }

  const followingData = await followModel.create({
    follower: followerName,
    followee: followeeName,
    status: "pending",
  });

  res.status(201).json({
    message: `${followerName} now follows ${followeeName}`,
    data: followingData,
  });
}

async function unfollowUserController(req, res) {
  const followerName = req.user.username;
  const followeeName = req.params.username;

  const isFolloweeExists = await userModel.findOne({
    username: followeeName,
  });

  if (!isFolloweeExists) {
    return res.status(404).json({
      message: "user not exists",
    });
  }

  const isUserBeginFollowed = await followModel.findOne({
    follower: followerName,
    followee: followeeName,
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
  const followeeName = req.user.username;
  const { status } = req.body;

  const isFolloweeExists = await userModel.findOne({
    username: followeeName,
  });

  if (!isFolloweeExists) {
    return res.status(404).json({
      message: "followee not exists",
    });
  }

  const isFolloweeFollows = await followModel.findOne({
    followee: followeeName,
    follower: followerName,
  });

  if (!isFolloweeFollows) {
    return res.status(404).json({
      message: `${followeeName} not follows ${followerName}`,
    });
  }

  const updatedStatus = await followModel.findByIdAndUpdate(
    isFolloweeFollows._id,
    {
      status: status,
    },
    {
      runValidators: true,
      returnDocument: "after",
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

  const followeeCount = await followModel.countDocuments({
    follower: username,
    status: "accepted",
  });

  const followerCount = await followModel.countDocuments({
    followee: username,
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

  const followeeList = await followModel.find({
    follower: username,
    status: "accepted",
  });

  res.status(200).json({
    message: "fetched following Data",
    followeeList,
  });
}

async function getFollowerUserList(req, res) {
  const { username } = req.params;

  const followerList = await followModel.find({
    followee: username,
    status: "accepted",
  });

  res.status(200).json({
    message: "fetched follower Data",
    followerList,
  });
}

async function getFollowPendingUserList(req, res) {
  const { username } = req.params;

  const followPendingList = await followModel.find({
    followee: username,
    status: "pending",
  });

  res.status(200).json({
    message: "fetched follow pending Data",
    followPendingList,
  });
}

module.exports = {
  followUserController,
  unfollowUserController,
  updateFollowStatusController,
  getFollowCount,
  getFollowingUserList,
  getFollowerUserList,
  getFollowPendingUserList,
};
