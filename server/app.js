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

// error handler import
const { ServerError } = require("./utils/error.handler");

// registering routes
app.use(express.static("./public"));
app.use("/api/v1/auth", authRoutes);
app.all("*", (req, res, next) =>
  next(ServerError.getDefinedError("invalidPath"))
);

// error handler middleware
app.use((err, req, res, next) => {
  res.status(err.code).json({
    type: err.type,
    stack: err.stack,
    message: err.message,
  });
});

module.exports = { app };
