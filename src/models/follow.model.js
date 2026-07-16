const mongoose = require("mongoose");

const followSchema = new mongoose.Schema({
  follower: {
    type: String,
    required: [true, "follower is required"]
  },
  followee: {
    type: String,
    required: [true, "followee is required"]
  },
  status: {
    type: String,
    default: "pending",
    enum: {
      values: ["pending", "accepted", "rejected"],
      message: "status can be only pending, accepted or rejected"
    }
  }
}, {timestamps: true})

// 4th Check:- unique records, one user follows a person only once. (database check version for 3rd validation check)
followSchema.index({ follower: 1, followee: 1}, { unique: true })

const followModel = mongoose.model("follows", followSchema);

module.exports = followModel;