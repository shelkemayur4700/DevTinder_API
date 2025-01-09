const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");
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
userRouter.get("/feed", userAuth, async (req, res) => {
  /* feed of the person is except persons to whom he has send the request and himself */
  try {
    const loggedInUser = req.user;
    const page = req.query.page || 1;
    let limit = req.query.limit || 10;
    limit > 50 ? 50 : limit;
    let skip = (page - 1) * limit;
    const connectionReq = await ConnectionRequest.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    }).select("fromUserId toUserId");

    const hideUsersFromFeed = new Set();

    connectionReq.forEach((request) => {
      hideUsersFromFeed.add(request.fromUserId.toString());
      hideUsersFromFeed.add(request.toUserId.toString());
    });
    const feedData = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideUsersFromFeed) } },
        { _id: { $ne: loggedInUser._id } },
      ],
    })
      .select(USER_SAFE_DATA)
      .skip(skip)
      .limit(limit);
    /* pagination added in this api using skip and limit */
    res.send({ data: feedData });
  } catch (error) {
    res.status(400).send("Error: " + error.message);
  }
});
module.exports = userRouter;
