const mongoose = require("mongoose");

const savedSchema = new mongoose.Schema(
  {
    savedBy: String,
    savedPost: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "post",
      require: [true, "post is required to be saved"],
    },
  },
  { timestamps: true },
);

savedSchema.index({ savedBy: 1, savedPost: 1 }, { unique: true });

const savedModel = mongoose.model("savedPost", savedSchema);

module.exports = savedModel;
