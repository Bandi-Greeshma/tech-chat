const { promisify } = require("node:util");
const { randomBytes, createHash } = require("node:crypto");

const jwt = require("jsonwebtoken");

const signToken = promisify(jwt.sign);

const User = require("../models/user");
const { handleCatch } = require("../utils/catch.handler");
const { ServerError } = require("../utils/error.handler");
const { sendmail } = require("../mailer");

const register = handleCatch(async (req, res) => {
  const { username, email, password } = req.body;

  if ((!username, !email, !password))
    throw ServerError.getDefinedError("incompleteData");

  const existingUser = await User.findOne({
    $or: [{ username }, { email }],
  });
  if (existingUser) throw ServerError.getDefinedError("existingUser");

  await new User({
    username,
    email,
    password,
  }).save();

  res
    .status(200)
    .json({ success: true, message: "User created successfully" })
    .end();
});

const login = handleCatch(async (req, res) => {
  const { username, password } = req.body;

  if ((!username, !password))
    throw ServerError.getDefinedError("incompleteData");

  const user = await User.findOne({ $or: [{ username }, { email: username }] });
  if (!user) throw ServerError.getDefinedError("invalidData");

  const match = await user.verifyPassword(password);
  console.log(user.verifyPassword);
  if (!match) throw ServerError.getDefinedError("invalidData");

  const token = await signToken(
    { id: user._id.toString() },
    process.env.JWT_KEY,
    {
      expiresIn: "1h",
    }
  );

  const responseObj = {
    _id: user._id.toString(),
    username: user.username,
    email: user.email,
    dp: user.dp,
  };

  res.cookie("authorization", `Bearer ${token}`, {
    maxAge: process.env.JWT_COOKIE_AGE * 60 * 60 * 1000,
    httpOnly: true,
    secure: process.env.NODE_ENV === "prod",
  });
  res.status(200).json(responseObj).end();
});

const fetchUser = (req, res, next) => {
  const { sender } = req;

  res
    .status(200)
    .json({
      _id: sender._id.toString(),
      username: sender.username,
      email: sender.email,
      dp: sender.dp,
    })
    .end();
};

const requestReset = handleCatch(async (req, res) => {
  const { username } = req.body;

  const user = await User.findOne({ $or: [{ username }, { email: username }] });
  const resetToken = randomBytes(32).toString("hex");
  const hashedToken = createHash("sha256").update(resetToken).digest("hex");
  user.token = hashedToken;
  user.tokenExpire = Date.now();
  await user.save();
  await sendmail({
    email: user.email,
    key: "reset",
    url: `http://localhost:4200/reset?${resetToken}`,
  });
  res.status(200).json({
    status: "success",
    message: "An email with reset link was sent to registered mail id",
  });
});

const resetPassword = handleCatch(async (req, res) => {
  const { password, token } = req.body;

  const hashedToken = createHash("sha256").update(token).digest("hex");
  const user = await User.findOne({
    token: hashedToken,
    tokenExpire: { $gt: Date.now() },
  }).select("_id username email dp");
  if (!user) throw ServerError.getDefinedError("malformedToken");

  user.password = password;
  user.token = undefined;
  user.tokenExpire = undefined;
  await user.save();

  const authToken = await signToken(
    { id: user._id.toString() },
    process.env.JWT_KEY,
    { expiresIn: "1h" }
  );

  res.setHeader("authorization", `Bearer ${authToken}`);
  res.status(200).json(user);
});

module.exports = { register, login, fetchUser, requestReset, resetPassword };