const { sendErrorResponse } = require("./error.handler");

const handleCatch = (fn) => (req, res, next) =>
  fn(req, res, next).catch((err) => {
    sendErrorResponse(err, next);
  });

const handleCatchSocket = (fn) => (socket, next) =>
  fn(socket, next).catch((err) => {
    sendErrorResponse(err, next);
  });

module.exports = { handleCatch, handleCatchSocket };
