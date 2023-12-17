const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const chatSchema = new Schema({
  type: { type: String, required: true, enum: ["prrivate", "group"] },
  users: {
    type: [{ type: Schema.Types.ObjectId, ref: "User" }],
    required: true,
  },
  buffers: {
    type: [
      {
        user: mongoose.Schema.ObjectId,
        start: Number,
      },
    ],
    required: true,
  },
  latestMsg: { type: String, default: "" },
});

chatSchema.pre("save", function (next) {
  if (this.isNew) {
    this.buffers = this.users.map((user) => ({ user, start: 0 }));
  }
  next();
});

chatSchema.methods.updateBuffer = function (user, buffer) {
  this.buffers = [
    ...this.buffers.filter(
      (buffer) => buffer.user.toString() === user._id.toString(),
      { user: user._id, start: buffer }
    ),
  ];
  return this.save();
};

const Chat = model("Chat", chatSchema);

module.exports = Chat;
