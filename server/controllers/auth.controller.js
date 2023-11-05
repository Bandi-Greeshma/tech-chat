const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/user");
const { sendErrorResponse } = require("../utils/error.handler");

const register = async (req, res, next) => {
  const { name, email, password } = req.body;

  try {
    if ((!name, !email, !password)) throw { type: "incompleteData" };

    const existingUser = await User.findOne({ email });
    if (existingUser) throw { type: "existingUser" };

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();
    res
      .status(200)
      .json({ success: true, message: "User created successfully" })
      .end();
  } catch (error) {
    sendErrorResponse(error, next);
  }
};
const login = async (req, res, next) => {
  const { email, password } = req.body;
  const socketId = req.get("Socket");

  try {
    if ((!email, !password)) throw { type: "incompleteData" };

    const user = await User.findOne({ email })
      .populate("contacts", "_id name email dp")
      .exec();
    if (!user) throw { type: "invalidData" };

    const match = await bcrypt.compare(password, user.password);
    if (!match) throw { type: "invalidData" };

    const token = jwt.sign({ id: user._id.toString() }, process.env.JWT_KEY);
    const hashedToken = await bcrypt.hash(token, 12);

    await user.updateOne({
      $set: {
        token: hashedToken,
        socket: socketId,
      },
    });

    const responseObj = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      contacts: user.contacts,
    };

    res.setHeader("Authorize", `bearer ${token}`);
    res.status(200).json(responseObj).end();
  } catch (error) {
    sendErrorResponse(error, next);
  }
};
const fetchUser = (req, res, next) => {};
const requestReset = (req, res, next) => {};
const reset = (req, res, next) => {};

module.exports = { register, login, fetchUser, requestReset, reset };
