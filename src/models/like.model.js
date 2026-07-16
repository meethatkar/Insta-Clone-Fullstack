const mongoose = require("mongoose");

const likeSchema = new mongoose.Schema({
    likedPost: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "post",
        require: [true, "post is required to liked by user"]
    },
    likedBy: {
        type: String,
        require: [true, "user is require to like the post"]
    }
}, {timestamps: true})

likeSchema.index({ likedPost: 1, likedBy: 1}, { unique: true });

const likeModel = mongoose.model("likes", likeSchema);

module.exports = likeModel;
