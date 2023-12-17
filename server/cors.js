const cors = require("cors");

const options = {
  origin: ["http://localhost:4200"],
  allowedHeaders: ["authorization", "socket", "content-type"],
  exposedHeaders: ["authorization"],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "HEADERS"],
};

const corsMiddleware = cors(options);

module.exports = { options, corsMiddleware };
