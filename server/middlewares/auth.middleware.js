const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const User = require("../models/user");
const { sendErrorResponse } = require("../utils/error.handler");

const checkAuth = async (req, res, next) => {
  try {
    const bearer = req.get("Authorize");
    const token = bearer.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_KEY);
    if (!decoded) throw { type: "malformedToken" };

    const { id } = decoded;

    const user = await User.findById(id);
    if (!user) throw { type: "invalidUser" };

    const match = await bcrypt.compare(token, user.token);
    if (!match) throw { type: "malformedToken" };

    req.sender = user;
    next();
  } catch (error) {
    sendErrorResponse(error);
  }
};

module.exports = { checkAuth };
