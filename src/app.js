require("dotenv").config();
const express = require("express");
const cookies = require("cookie-parser");
const cors = require("cors");
const path = require("path");

const app = express();

app.use(express());
app.use(express.json());
app.use(cookies());
app.use(express.static("./public"));

// 1. Create a list of trusted domain URLs that are permitted to access your API
const allowedOrigins = [
  "http://localhost:5173",                             // Local Vite React Frontend
  "https://insta-clone-fullstack-nk7g.onrender.com"   // Production Live Frontend
];

app.use(
  cors({
    // 2. Instructs the browser to accept and send cookies (credentials) across origins
    credentials: true,

    // 3. Dynamic function called by the `cors` middleware for EVERY incoming HTTP request
    // - `origin`: The value of the incoming HTTP "Origin" request header sent by the client.
    // - `callback`: A function provided by `cors` to return the decision (Error or Permission).
    origin: function (origin, callback) {

      // 4. THE CORE LOGIC:
      // A) `!origin`:
      //    - Standard browser web requests always send an `Origin` header (e.g. "http://localhost:5173").
      //    - BUT non-browser requests (like Postman, cURL, server-to-server calls, or mobile apps) send NO `Origin` header (`origin` is `undefined`).
      //    - Checking `!origin` ensures your Postman testing / server scripts aren't blocked by CORS.
      //
      // B) `allowedOrigins.includes(origin)`:
      //    - Checks if the client's domain exists in your `allowedOrigins` whitelist array.
      if (!origin || allowedOrigins.includes(origin)) {

        // 5. Allow access:
        // `null` means no error occurred.
        // `true` tells `cors` middleware to set header: Access-Control-Allow-Origin: <requesting_origin>
        callback(null, true);

      } else {

        // 6. Block access:
        // If an unauthorized website attempts an API request, return a CORS error.
        callback(new Error("Not allowed by CORS"));

      }
    },
  })
);


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
