// Internal imports
const http = require("node:http");
const { EventEmitter } = require("node:events");

// External imports
const { Server } = require("socket.io");
const mongoose = require("mongoose");

// Custom Internal imports
const { app } = require("./app");
const { options } = require("./cors");

const User = require("./models/user");
const Chat = require("./models/chat");
const Message = require("./models/message");
const { protectSocket } = require("./middlewares/auth.middleware");
const cookie = require("cookie");

// Local event emitter set-up
const emitter = new EventEmitter();

// server instance created using express app
const server = http.createServer(app);

// Socket server initiated
const io = new Server(server, { cors: options });

io.use((socket, next) => {
  const cookies = cookie.parse(socket.handshake.headers.cookie);
  socket.handshake.cookies = cookies;
  next();
});

io.use(protectSocket);

io.on("connection", async (socket) => {
  const user = socket.data.user;

  socket.emit("confirm", "connection confirmed");

  socket.on("getChats", async ({ userid, isFirstConnection }, cb) => {
    const user = await User.findById(userid).populate({
      path: "chats",
      select: "_id users latestMsg",
      populate: [
        {
          path: "users",
          select: "_id use email dp",
          match: { _id: { $ne: new mongoose.Types.ObjectId(userid) } },
        },
      ],
    });
    const rooms = user.chats.map((chat) => chat._id.toString());
    socket.join(rooms);
    if (isFirstConnection && cb) {
      cb(
        user.toJSON({
          flattenMaps: true,
          flattenObjectIds: true,
        }).chats
      );
    }
  });

  socket.on("new_chat", async ({ contacts, firstMessage }, cb) => {
    const newChat = await new Chat({
      type: contacts.length > 1 ? "group" : "single",
      users: [userid, ...contacts],
    }).save();
    emitter.emit("internal_joinroom", newChat);
    newChat.populate({
      path: "users",
      select: "_id username email dp",
    });
    cb({
      _id: newChat._id.toString(),
      type: newChat.type,
      users: newChat.users,
      latestMsg: newChat.latestMsg,
    });
  });

  emitter.on("internal_joinroom", (chat) => {
    if (chat.users.includes(user._id)) socket.join(chat._id.toString());
  });

  socket.on(
    "new_message",
    async ({ chatid, body, sentby, replyTo = undefined }, cb) => {
      const chat = await Chat.findById(chatid);
      const newMessage = await new Message({
        chat: chat._id,
        from: user._id,
        text: body.text,
        replyTo,
        seenBy: [sentby],
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

module.exports = { server, io };
