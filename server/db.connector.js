const mongoose = require("mongoose");

const connect = (cb) => {
  mongoose
    .connect(process.env.MONGO_URI)
    .then((data) => {
      console.log("DB connected");
      cb();
    })
    .catch((err) => console.log(err));
};

module.exports = connect;
