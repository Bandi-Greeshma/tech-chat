const Mongoose = require("mongoose");
const { Schema, Types, model } = Mongoose;

const messageSchema = new Schema({
  from: { type: Types.ObjectId, required: true, ref: "User" },
  to: { type: Types.ObjectId, required: true, ref: "User" },
  type: { type: String, required: true },
  replyTo: { type: Types.ObjectId, default: "", ref: "Message" },
  text: { type: String, required: true },
  timestamp: { type: Date, default: new Date() },
});

module.exports = model("Message", messageSchema);
