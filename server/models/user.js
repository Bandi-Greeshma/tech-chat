const Mongoose = require("mongoose");
const { Schema, model } = Mongoose;

const userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  password: { type: String, require: true },
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
  socket: { type: String },
  token: { type: String },
});

const User = model("User", userSchema);

module.exports = User;
