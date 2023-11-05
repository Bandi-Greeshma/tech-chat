const Mongoose = require("mongoose");
const { Schema, Types, model } = Mongoose;

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, require: true },
  dp: { type: String, default: "" },
  contacts: {
    type: [
      {
        type: Types.ObjectId,
        ref: "User",
      },
    ],
    default: [],
  },
  socket: { type: String },
  token: { type: String },
});

const User = model("User", userSchema);

module.exports = User;
