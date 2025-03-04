const express = require("express");
const { userAuth } = require("../middlewares/auth");
const { Chat } = require("../models/chat");
const { default: mongoose } = require("mongoose");
const chatRouter = express.Router();

chatRouter.get("/chat/:targetUserId", userAuth, async (req, res) => {
  const { targetUserId } = req.params;
  const userId = req.user._id;
  console.log("data from request", targetUserId, userId);
  const participants = [
    new mongoose.Types.ObjectId(userId),
    new mongoose.Types.ObjectId(targetUserId),
  ];
  console.log("participants", participants);
  try {
    let chat = await Chat.findOne({
      participants: { $all: participants },
    }).populate({
      path: "messages.senderId",
      select: "firstName lastName",
    });
    console.log("chat user", chat);
    if (!chat) {
      chat = new Chat({
        participants: [userId, targetUserId],
        messages: [],
      });
      await chat.save();
    }
    res.json(chat);
  } catch (error) {
    console.log("ChatRoute error", error);
  }
});

module.exports = chatRouter;
