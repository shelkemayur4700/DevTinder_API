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
app.get("/user", async (req, res) => {
  //creating user instance
  const { emailId } = req?.body;
  try {
    const userData = await User.findOne({ emailId });
    if (userData.length === 0) {
      res.status(404).send("User not found");
    } else {
      res.send({ data: userData, message: "User fetched successfully!" });
    }
  } catch (error) {
    res.status(400).send("Something went wrong");
  }
});
app.delete("/user", async (req, res) => {
  //creating user instance
  const { id } = req?.body;
  try {
    const userData = await User.findByIdAndDelete(id);
    console.log(userData);
    if (userData) {
      res.status(404).send("User not found");
    } else {
      res.send({ data: userData, message: "User deleted successfully!" });
    }
  } catch (error) {
    res.status(400).send("Something went wrong");
  }
});
app.patch("/user", async (req, res) => {
  //creating user instance
  const { firstName } = req?.body;
  // console.log(firstName, id);
  try {
    const userData = await User.findOneAndUpdate({ firstName }, req?.body, {
      new: true,
    });
    console.log(userData);
    if (userData) {
      res.send({ data: userData, message: "User updated sucessfully!" });
    } else {
      res.status(404).send("User not found");
    }
  } catch (error) {
    res.status(400).send("Something went wrong");
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
