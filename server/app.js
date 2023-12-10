// built-in imports
const path = require("node:path");

// Pre run env info setup
require("dotenv").config({ path: path.join(require.main.path, ".env") });

// external imports
const express = require("express");

// app initialized
const app = express();

// different types of parser registered
app.use(express.json());

// application cors setup
const { corsMiddleware } = require("./cors");
app.use(corsMiddleware);

// route imports
const authRoutes = require("./routes/auth.routes");
const chatRoutes = require("./routes/chat.routes");

// registering routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/chat", chatRoutes);

// error handler middleware
app.use((err, req, res, next) => {
  if (!err.type) {
    err.status = 500;
    err.type = "serverError";
    err.message = "Something went wrong";
  }

  res.status(err.status).json({
    type: err.type,
    message: err.message,
  });
});

module.exports = { app };
