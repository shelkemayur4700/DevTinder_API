const express = require("express");
const bcrypt = require("bcrypt");
const validator = require("validator");
const connectDB = require("./src/config/dataBase");
const User = require("./src/models/user");
const { validateSignUpData } = require("./src/utills/validations");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const { userAuth } = require("./src/middlewares/auth");
const app = express();

app.use(express.json());
app.use(cookieParser());
app.post("/signup", async (req, res) => {
  const { firstName, lastName, emailId, password } = req.body;
  try {
    //validate user data first
    validateSignUpData(req);
    // hash the password
    const passwordHash = await bcrypt.hash(password, 10);
    //creating user instance
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });
    await user.save();
    res.send("User added successfully!");
  } catch (error) {
    res.status(400).send("Error : " + error.message);
  }
});
app.post("/login", async (req, res) => {
  const { emailId, password } = req.body;
  try {
    //validate user data first
    if (!validator.isEmail(emailId)) {
      throw new Error("Invalid credentials");
    }
    //compare the password
    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("Invalid credentials");
    }
    const isPassworValid = user.validatePassword(password);
    if (isPassworValid) {
      //generate JWT token
      const token = await user.getJWT();
      console.log(token);
      //add token in cookie and send back to user
      res.cookie("token", token, {
        expires: new Date(Date.now() + 900000),
      });
      res.send("login sucess");
    } else {
      throw new Error("Invalid credentials");
    }
  } catch (error) {
    res.status(400).send("Error : " + error.message);
  }
});
app.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send({ data: user, message: "User fetched successfully!" });
  } catch (error) {
    res.sendStatus(400).send("Error: " + error.message);
  }
});

connectDB()
  .then(() => {
    console.log("DataBase is connected sucessfully!");
    app.listen(7777, () => {
      console.log("server running on 7777");
    });
  })
  .catch((error) => console.log("SERVER ERROR", error));
