const express = require("express");
const { userAuth } = require("../middlewares/auth");
const { validateProfileEditData } = require("../utills/validations");
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
      throw new Error("Invalid Edit request!");
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
module.exports = profileRouter;
