const express = require("express");
const User = require("../models/user");
const authRouter = express.Router();
const bcrypt = require("bcrypt");
const { validateSignUpData } = require("../utills/validations");
const validator = require("validator");

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
    const savedUser = await user.save();
    const token = await user.getJWT();
    res
      .cookie("token", token, {
        expires: new Date(Date.now() + 900000),
      })
      .json({ message: "User added successfully!", data: savedUser });
  } catch (error) {
    res.status(400).send("Error : " + error.message);
  }
});
//LOGIN
authRouter.post("/login", async (req, res) => {
  const { emailId, password } = req.body;
  try {
    if (!validator.isEmail(emailId)) {
      throw new Error("Invalid credentials");
    }

    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("Invalid credentials");
    } else {
      const isPassworValid = await user.validatePassword(password); // Ensure proper await

      if (isPassworValid) {
        const token = await user.getJWT();
        res
          .cookie("token", token, {
            expires: new Date(Date.now() + 900000),
          })
          .json({ message: "login success!!!", user });
      } else {
        throw new Error("Invalid credentials");
      }
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
