const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://shelkemayur4700:0JmfhMKVNbgFfYqS@ganesh.mpo1a.mongodb.net/DevTinder"
  );
};

module.exports = connectDB;
