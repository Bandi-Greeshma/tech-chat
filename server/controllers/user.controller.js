const fs = require("node:fs/promises");

const multer = require("multer");

const { handleCatch } = require("../utils/catch.handler");
const { ServerError } = require("../utils/error.handler");
const { emitter, getDpPath } = require("../utils/util.helper");

const checkPassword = async (pass) => {
  const verified = await sender.verifyPassword(pass);
  if (!verified) throw ServerError.getDefinedError("invalidData");
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/images/user");
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split("/")[1];
    cb(
      null,
      `${file.filename.split(".").slice(0, -1).join(".")}-${
        req.sender._id
      }-${Date.now()}.${ext}`
    );
  },
});

const fileFilter = (req, file, cb) => {
  if (!file.mimetype.startsWith("image"))
    return cb(ServerError.getDefinedError("invalidFileType"), false);
  cb(null, true);
};

const upload = multer({ storage, fileFilter });

const parseImage = (field) => upload.single(field);

const deletePrevDp = async (filename) => {
  await fs.unlink(getDpPath(filename));
};

const fetchUser = (req, res) => {
  const { sender } = req;

  res.status(200).json({
    _id: sender._id.toString(),
    username: sender.username,
    email: sender.email,
    dp: sender.dp,
    status: sender.status,
  });
};

const updateUser = handleCatch(async (req, res) => {
  const {
    sender,
    body: { currentPassword, ...data },
    file: { filename },
  } = req;

  await checkPassword(currentPassword);

  if (filename) {
    data = { ...data, dp: filename };
    if (sender.dp) await deletePrevDp(sender.dp);
  }
  await sender.updateOne(
    {
      $set: data,
    },
    { runValidators: true }
  );

  res.status(200).json({
    status: "success",
    data: {
      _id: sender._id,
      username: sender.username,
      email: sender.email,
      dp: sender.dp,
      status: sender.status,
    },
  });
});

const updatePassword = handleCatch(async (req, res) => {
  const {
    sender,
    body: { currentPassword, password },
  } = req;

  await checkPassword(currentPassword);

  sender.password = password;
  await sender.save();

  res.status(200).json({
    status: "success",
    message: "Password updated successfully",
  });
});

const deleteUser = handleCatch(async (req, res) => {
  const {
    sender,
    body: { currentPassword },
  } = req;

  await checkPassword(currentPassword);

  emitter.emit("socket_disconnect", sender.socket);
  await sender.delteOne();

  res.status(200).json({
    status: "success",
    message: "Account deleted successfully",
  });
});

module.exports = {
  fetchUser,
  parseImage,
  updateUser,
  updatePassword,
  deleteUser,
};
