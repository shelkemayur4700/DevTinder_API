const express = require("express");
const User = require("../models/user");
const authRouter = express.Router();
const bcrypt = require("bcrypt");
const { validateSignUpData } = require("../utills/validations");
const jwt = require("jsonwebtoken");
const validator = require("validator");
const { userAuth } = require("../middlewares/auth");

//SIGNUP
authRouter.post("/signup", async (req, res) => {
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
//LOGIN
authRouter.post("/login", async (req, res) => {
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
//LOGOUT
authRouter.post("/logout", async (req, res) => {
  res
    .cookie("token", null, { expires: new Date(Date.now()) })
    .send("Logout sucessfully!!");
});
module.exports = authRouter;

//FORGETPASSWORD
authRouter.post("/forgetpassword", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    if (!validator.isEmail(emailId)) {
      throw new Error("Invalid email!");
    }
    const user = await User.findOne({ emailId });
    const passwordHash = await bcrypt.hash(password, 10);
    user.password = passwordHash;
    await user.save();
    res.send({
      message: `${user.firstName} your password updated sucessfully!`,
      data: user,
    });
  } catch (error) {
    res.status(400).send("Error : " + error.message);
  }
});
