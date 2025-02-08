const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(process.env.DATABASEURI);
};

module.exports = connectDB;
