const cors = require("cors");

const options = {
  origin: ["http://localhost:4200"],
  allowedHeaders: ["authorization", "Socket"],
  exposedHeaders: ["authorization"],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "HEADERS"],
};

const corsMiddleware = cors(options);

module.exports = { options, corsMiddleware };
