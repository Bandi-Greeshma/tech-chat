// Internal imports
const http = require("node:http");

// External imports
const { Server } = require("socket.io");
const cookieParser = require("cookie-parser");

// Custom Internal imports
const { app } = require("./app");
const { options } = require("./cors");

const User = require("./models/user");
const Chat = require("./models/chat");
const Message = require("./models/message");
const { ServerError } = require("./utils/error.handler");
const { emitter } = require("./utils/util.helper");

// Custom middleware imports
const { protectSocket } = require("./middlewares/auth.middleware");

// server instance created using express app
const server = http.createServer(app);

// Socket server initiated
const io = new Server(server, { cors: options });

// Wrapper function for express middlewares
const wrap = (fn) => (socket, next) => fn(socket.request, {}, next);

io.use(wrap(cookieParser()));

io.use((socket, next) => {
  if (!socket.request.cookies)
    return next(ServerError.getDefinedError("notAuthorized"));
  next();
});

io.use(protectSocket);

io.on("connection", async (socket) => {
  const user = socket.data.user;
  user.socket = socket.id;
  await user.save({ validateModifiedOnly: true });

  socket.emit("confirm");

  socket.on("get_chats", async ({ isFirstConnection }, cb) => {
    const chats = await Chat.find({ users: { $elemMatch: { $eq: user._id } } });
    const contactids = chats.reduce((acc, chat) => {
      return [
        ...acc,
        chat.users.filter(
          (userContact) => userContact.toString() !== user._id.toString
        ),
      ];
    }, []);
    const contactPersons = await User.find({ _id: { $in: contactids } }).select(
      "_id username email dp status"
    );
    const rooms = chats.map((chat) => chat._id.toString());
    socket.join(rooms);
    if (isFirstConnection && cb) cb({ chats, contacts: contactPersons });
  });

  socket.on("new_chat", async ({ contacts, firstMessage }, cb) => {
    if (!Array.isArray(contacts)) contacts = [contacts];

    const userContacts = await User.find({
      $or: [{ username: { $in: contacts } }, { email: { $in: contacts } }],
    }).select("_id");

    const newChat = await new Chat({
      type: contacts.length > 1 ? "group" : "private",
      users: [user._id, ...userContacts],
      latestMsg: firstMessage,
    }).save();

    const newMessage = await new Message({
      chat: newChat._id,
      from: user._id,
      seenBy: [],
      text: firstMessage,
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
      messages: [
        {
          _id: newMessage._id,
          type: newMessage.type,
          chat: newMessage.chat,
          from: newMessage.from,
          seenBy: newMessage.seenBy,
          latestMsg: newMessage.text,
          timestamp: newMessage.timestamp,
        },
      ],
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

  emitter.on("socket_disconnect", (id) => {
    if (id === socket.id) socket.disconnect(true);
  });
});

module.exports = { server, io };
