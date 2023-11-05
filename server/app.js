// built-in imports
const http = require("node:http");
const path = require("node:path");

// Pre run env info setup
require("dotenv").config({ path: path.join(require.main.path, ".env") });

// external imports
const express = require("express");
const { Server } = require("socket.io");
const bodyParser = require("body-parser");
const cors = require("cors");

// app initialized
const app = express();

// different types of parser registered
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// application cors setup
const corsOptions = {
  origin: ["http://localhost:4200"],
  allowedHeaders: ["Authorize", "Socket"],
  exposedHeaders: ["Authorize"],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "HEADERS"],
};
app.use(cors(corsOptions));

// route imports
const authRoutes = require("./routes/auth.routes");

// registering routes
app.use("/api/v1/auth", authRoutes);

// server instance created using express app
const server = http.createServer(app);

// Socket instance creation using http server instance
const io = new Server(server, { cors: corsOptions });

// importing socket listeners

// registering on connection
io.on("connection", (socket) => {});

// DB connecter execution
require("./db.connector")(() => {
  // Starting Server event loop
  server.listen(process.env.PORT, () =>
    console.log(
      `Server running on port ${process.env.PORT} url: http://localhost:${process.env.PORT}`
    )
  );
});
