const Mongoose = require("mongoose");
const { Schema, model } = Mongoose;

const chatSchema = new Schema({
  type: { type: String, required: true, enum: ["single", "group"] },
  users: {
    type: [{ type: Schema.Types.ObjectId, ref: "User", required: true }],
    default: [],
  },
  messages: {
    type: [{ type: Schema.Types.ObjectId, ref: "Message" }],
    default: [],
  },
  stats: Object,
  latestMsg: { type: String, default: "" },
});

chatSchema.methods.addMessage = function (message) {
  this.messages = [...this.messages, message._id];
  this.latestMsg = message.text;
  return this.save();
};

const Chat = model("Chat", chatSchema);

module.exports = Chat;
