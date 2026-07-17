require("dotenv").config();
const express = require("express");
const cookies = require("cookie-parser");
const cors = require("cors");
const path = require("path");

const app = express();

app.use(express());
app.use(express.json());
app.use(cookies());
app.use(
  cors({
    credentials: true,
    origin: "http://localhost:5173",
  }),
);
app.use(express.static("./public"));

// Require routes
const authRouter = require("../src/routes/auth.routes");
const postRouter = require("../src/routes/post.routes");
const followRoute = require("../src/routes/follow.routes");
const likeRouter = require("../src/routes/like.routes");
const saveRouter = require("../src/routes/saved.routes");
const commentRouter = require("../src/routes/comment.routes");

// Use routes
app.use("/api/auth", authRouter);
app.use("/api/post", postRouter);
app.use("/api/post", likeRouter);
app.use("/api/users", followRoute);
app.use("/api/post", saveRouter);
app.use("/api/post", commentRouter);
app.use("*name", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "./public/index.html"));
});

module.exports = app;
