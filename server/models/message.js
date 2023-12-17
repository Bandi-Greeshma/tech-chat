const Mongoose = require("mongoose");
const { Schema, model } = Mongoose;

const messageSchema = new Schema({
  chat: { type: Schema.Types.ObjectId, required: true, ref: "Chat" },
  from: { type: Schema.Types.ObjectId, required: true, ref: "User" },
  seenBy: { type: [{ type: Schema.Types.ObjectId, ref: "User" }], default: [] },
  type: { type: String, required: true, enum: ["reply", "statement"] },
  replyTo: { type: Schema.Types.ObjectId, default: "", ref: "Message" },
  text: { type: String, required: true },
  timestamp: { type: Date, default: Date.now() },
});

messageSchema.pre("save", (next) => {
  this.type = this.replyTo ? "reply" : "statement";
  next();
});

const Message = model("Message", messageSchema);

module.exports = Message;
