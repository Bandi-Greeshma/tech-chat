const Mongoose = require("mongoose");
const { Schema, model } = Mongoose;
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
  chats: {
    type: [
      {
        type: Schema.Types.ObjectId,
        ref: "Chat",
      },
    ],
    default: [],
  },
  token: String,
  tokenExpire: Date,
  createdAt: { type: Date, default: Date.now() },
  passwordModifiedAt: { type: Date, default: Date.now() },
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

const User = model("User", userSchema);

module.exports = User;
