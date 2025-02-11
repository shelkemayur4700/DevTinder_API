const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");
const sendEmail = require("../utills/sendEmail");
const requestRouter = express.Router();
//SEND REQUEST - INTERESTED OR IGNORED
requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req?.user?._id;
      const toUserId = req?.params?.toUserId;
      const status = req?.params?.status;

      //Validate Status
      const allowedStatus = ["ignored", "interested"];
      if (!allowedStatus.includes(status)) {
        throw new Error("Invalid connection request!");
      }
      //validate toUser: ToUser must be in db
      const toUser = await User.findById(toUserId);
      if (!toUser) {
        throw new Error("User not found!");
      }
      //check there is no connection old connection request in db

      const existingConnectionRequest = await ConnectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });

      if (existingConnectionRequest) {
        throw new Error("Connection request already exists !");
      }
      const ConnectionRequestData = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });
      await ConnectionRequestData.save();
      //email service to send email
      await sendEmail(
        toUser.emailId,
        "A new friend request from" + " " + req?.user?.firstName,
        req?.user?.firstName + " " + status + " in " + toUser?.firstName
      );

      res.send({
        message:
          req?.user?.firstName + " " + status + " in " + toUser?.firstName,
        ConnectionRequestData,
      });
    } catch (error) {
      res.status(400).send("Error: " + error.message);
    }
  }
);
//REVIEW REQUEST - ACCEPT OR REJECT
requestRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const loggedInUser = req.user;
      const { status, requestId } = req.params;

      //Allowed status
      const allowedStatus = ["accepted", "rejected"];
      if (!allowedStatus.includes(status)) {
        throw new Error("Invalid status!");
      }
      //request will onlyHave interested status
      //toUserId == LoginedUser == Who is coing to accept the request.
      const requestData = await ConnectionRequest.findOne({
        _id: requestId,
        toUserId: loggedInUser._id,
        status: "interested",
      });
      if (!requestData) {
        throw new Error("Request not found");
      }
      requestData.status = status;
      await requestData.save();
      res.send({ message: "request " + status, requestData });
    } catch (error) {
      res.status(400).send("Error: " + error.message);
    }
  }
);
module.exports = requestRouter;
