// built-in imports
const path = require("node:path");

// Pre run env info setup
require("dotenv").config({ path: path.join(require.main.path, ".env") });

// external imports
const express = require("express");
const cookieParser = require("cookie-parser");

// app initialized
const app = express();

// different types of parser registered
app.use(express.json());
app.use(cookieParser());

// application cors setup
const { corsMiddleware } = require("./cors");
app.use(corsMiddleware);

// route imports
const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");

// error handler import
const { ServerError } = require("./utils/error.handler");

// registering routes
app.use(express.static("./public"));
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/user", userRoutes);
app.all("*", (req, res, next) =>
  next(ServerError.getDefinedError("invalidPath"))
);

// error handler middleware
app.use((err, req, res, next) => {
  console.log(err.stack);
  res.status(err.code).json({
    type: err.type,
    message: err.message,
  });
});

module.exports = { app };
