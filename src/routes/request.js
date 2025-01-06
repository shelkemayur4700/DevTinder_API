const express = require("express");
const { userAuth } = require("../middlewares/auth");
const requestRouter = express.Router();

requestRouter.get("/request", userAuth, async (req, res) => {
  try {
    res.send({ message: "request sent successfully!" });
  } catch (error) {
    res.sendStatus(400).send("Error: " + error.message);
  }
});
module.exports = requestRouter;
