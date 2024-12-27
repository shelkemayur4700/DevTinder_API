const express = require("express");
const connectDB = require("./src/config/dataBase");
const User = require("./src/models/user");
const app = express();
app.use(express.json());
app.post("/signup", async (req, res) => {
  //creating user instance
  const user = new User(req?.body);
  try {
    await user.save();
    res.send("User added successfully!");
  } catch (error) {
    res.status(400).send("Error to save user");
  }
});

connectDB()
  .then(() => {
    console.log("DataBase is connected sucessfully!");
    app.listen(7777, () => {
      console.log("server running on 7777");
    });
  })
  .catch((error) => console.log(error));
