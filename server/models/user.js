const mongoose = require("mongoose");
const { Schema, model } = mongoose;
const bcrypt = require("bcrypt");

const userSchema = new Schema({
  username: {
    type: String,
    trim: true,
    required: true,
    unique: true,
    minLength: 6,
  },
  email: { type: String, trim: true, required: true, unique: true },
  password: {
    type: String,
    required: true,
    match: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+{}:;<>,.?~\\-]).{8,20}$/,
  },
  dp: { type: String, default: "" },
  status: { type: String, enum: ["online", "offline"], default: "offline" },
  socket: { type: String, default: "" },
  token: String,
  tokenExpire: Date,
  passwordModifiedAt: { type: Date, default: Date.now() },
});

userSchema.pre(/^find/g, (next) => {
  this.populate({
    path: "contacts",
    select: "_id username email dp status",
  });
  next();
});

userSchema.pre("save", async function (next) {
  if (this.isNew || this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, +process.env.SALT_ROUNDS);
    this.passwordModifiedAt = Date.now();
  }
  next();
});

userSchema.methods.verifyPassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.verifyTokenDate = function (tokenDate) {
  return tokenDate * 1000 > new Date(this.passwordModifiedAt).getTime();
};

userSchema.methods.verifyResetToken = function (candidateToken) {
  return bcrypt.compare(candidateToken, this.token);
};

userSchema.methods.updateStatus = function (status) {
  this.status = status === "online" ? status : "offline";
  return this.save();
};

const User = model("User", userSchema);

module.exports = User;
