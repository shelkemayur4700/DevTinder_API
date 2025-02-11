const mongoose = require("mongoose");

const connectDB = async () => {
  console.log("database connected sucessfully!");
  await mongoose.connect(process.env.DATABASEURI);
};

module.exports = connectDB;
