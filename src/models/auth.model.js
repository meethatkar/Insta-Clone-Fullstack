const mongoose = require("mongoose");

const accountSchema = new mongoose.Schema({
    username: {
        "type": String,
        "required" : [true, "username is required"]
    },
    password: {
        "type": String,
        "required": [true, "password is required"]
    },
    gender: String,
    bio: String,
    email: {
        "type": String,
        "required": [true, "email is required"]
    },
    profilePicture: {
        "type": String,
        "default": "https://ik.imagekit.io/a4ft9seaz/default_profile_image.avif?updatedAt=1781778325742"
    }
}, {timestamp: true})

const accountModel = mongoose.model("accounts", accountSchema);

module.exports = accountModel;