const jwt = require("jsonwebtoken");

const User = require("../models/user");
const { handleCatch, handleCatchSocket } = require("../utils/catch.handler");
const { ServerError } = require("../utils/error.handler");

const protectRoute = handleCatch(async (req, res, next) => {
  const bearer = req.cookies["authorization"];
  const data = await verifyToken(bearer);
  req.sender = data;
  next();
});

const protectSocket = handleCatchSocket(async (socket, next) => {
  const { authorization } = socket.handshake.cookies;
  const user = await verifyToken(authorization);
  socket.data.user = user;
  next();
});

const verifyToken = async (bearer) => {
  const token = bearer.split(" ")[1];

  const decoded = jwt.verify(token, process.env.JWT_KEY);
  if (!decoded) throw ServerError.getDefinedError("malformedToken");

  const { id, iat } = decoded;

  const user = await User.findById(id);
  if (!user) throw ServerError.getDefinedError("invalidUser");

  if (!user.verifyTokenDate(iat))
    throw ServerError.getDefinedError("expiredToken");

  return user;
};

module.exports = { protectRoute, verifyToken, protectSocket };
