const http = require("node:http");

const { Server } = require("socket.io");

const { app } = require("./app");
const { options } = require("./cors");

// server instance created using express app
const server = http.createServer(app);

const User = require("./models/user");
const Chat = require("./models/chat");
const Message = require("./models/message");

const io = new Server(server, {
  cors: options,
});

io.use((socket, next) => {
  const { authorization } = socket.handshake.headers;

  next();
});

io.on("connection", (socket) => {
  socket.emit("confirm", "connecttion confirmed");

  socket.on("getChats", async ({ userid, isFirstConnection }, cb) => {
    const user = await User.findById(userid).populate({
      path: "chats",
      select: "_id users latestMsg",
    });
    const rooms = user.chats.map((chat) => chat._id.toString());
    socket.join(chats);
    if (isFirstConnection && cb) {
      cb(
        user.toJSON({
          flattenMaps: true,
          flattenObjectIds: true,
        }).chats
      );
    }
  });

  socket.on(
    "new_message",
    async ({ chatid, body, sentby, replyTo = undefined }, cb) => {
      const user = await User.findById(sentby);
      const chat = await Chat.findById(chatid);
      const newMessage = await new Message({
        chat: chat._id,
        from: user._id,
        text: body.text,
        replyTo,
        seenBy: [user._id],
      }).save();
      await chat.addMessage(newMessage);
      io.to(chatid).emit(
        "new_message",
        newMessage.toJSON({
          flattenMaps: true,
          flattenObjectIds: true,
        })
      );
    }
  );
});

io.on;

module.exports = { server, io };
