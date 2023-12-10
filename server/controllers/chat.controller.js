const User = require("../models/user");
const Chat = require("../models/chat");
const { getIO } = require("../socket");

const { sendErrorResponse } = require("../utils/error.handler");

const addNewChat = async (req, res, next) => {
  try {
    const { sender } = req;
    const { names } = req.body;

    let recievers = (await User.find()).filter((user) =>
      names.includes(user?.name)
    );

    const users = [sender._id, ...recievers.map((reciever) => reciever._id)];

    const newGroup = await new Chat({
      type: recievers.length > 1 ? "group" : "single",
      users,
    }).save();

    [sender, ...recievers].forEach((user) =>
      user.updateOne({
        $set: {
          chats: [newGroup._id, ...user.chats],
        },
      })
    );

    await newGroup.populate({
      path: "users",
      model: "User",
      select: "_id name email dp",
    });

    const chatObj = newGroup.toObject({
      flattenMaps: true,
      flattenObjectIds: true,
    });

    getIO()
      .to(recievers.map((reciever) => reciever.socket))
      .emit("new_chat", chatObj);

    res.status(200).json({
      success: true,
      chat: chatObj,
    });
  } catch (error) {
    sendErrorResponse(error, next);
  }
};

const fetchValidUserNames = () => {};

module.exports = { addNewChat };
