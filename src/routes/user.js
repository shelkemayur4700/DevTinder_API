const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const userRouter = express.Router();
const USER_SAFE_DATA = " firstName lastName age gender skills about profileURL";
userRouter.get("/user/requests/recived", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequests = await ConnectionRequest.find({
      toUserId: loggedInUser?._id,
      status: "interested",
    }).populate("fromUserId", USER_SAFE_DATA);
    res.send({ message: "Data fetched successfully", connectionRequests });
  } catch (error) {
    res.status(400).send("Error: " + error.message);
  }
});
userRouter.get("/user/connection", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const ConnectionReq = await ConnectionRequest.find({
      $or: [
        { fromUserId: loggedInUser?._id, status: "accepted" },
        { toUserId: loggedInUser?._id, status: "accepted" },
      ],
    })
      .populate("fromUserId", USER_SAFE_DATA)
      .populate("toUserId", USER_SAFE_DATA);
      
    const data = ConnectionReq?.map((d) => {
      if (d.fromUserId._id.toString() === loggedInUser._id.toString()) {
        return d.toUserId;
      }
      return d.fromUserId;
    });
    res.send({ message: "Requests fetched sucessfully", data });
  } catch (error) {
    res.status(400).send("Error: " + error.message);
  }
});
module.exports = userRouter;
