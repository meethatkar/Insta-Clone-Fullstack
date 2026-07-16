const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
    caption: {
        "type": String,
        "default": ""
    },
    postImage: {
        "type": String,
        "required": [true, "please upload an image"]
    },
    createdBy: {
        "type": mongoose.Schema.Types.ObjectId,
        "ref": "accounts",
        require: [true, "user is required to create a post"]
    },
}, {timestamps: true})

const postModel = mongoose.model("post", postSchema);

module.exports = postModel;