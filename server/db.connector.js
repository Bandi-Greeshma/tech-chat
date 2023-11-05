const Mongoose = require("mongoose");

const connect = (cb) => {
  Mongoose.connect()
    .then((data) => {
      console.log("Connected with ", data.connection);
      cb();
    })
    .catch((err) => console.log(err));
};

module.exports = connect;
