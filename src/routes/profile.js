const express = require("express");
const { userAuth } = require("../middlewares/auth");
const { validateProfileEditData } = require("../utills/validations");
const validator = require("validator");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const profileRouter = express.Router();

//PROFILE/VIEW
profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send({ data: user, message: "User fetched successfully!" });
  } catch (error) {
    res.sendStatus(400).send("Error: " + error.message);
  }
});

//PROFILE/EDIT
profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateProfileEditData(req)) {
      throw new Error("Can't update data!");
    }
    const loggedInUser = req.user;

    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));

    await loggedInUser.save();

    res.send({
      message: `${loggedInUser.firstName} , your profile is updated successfully !`,
      data: loggedInUser,
    });
  } catch (error) {
    res.status(400).send("Error : " + error.message);
  }
});
//FORGETPASSWORD
profileRouter.post("/profile/password", async (req, res) => {
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
module.exports = profileRouter;
