const cron = require("node-cron");
const { subDays, startOfDay, endOfDay } = require("date-fns");
const sendEmail = require("./sendEmail");
const ConnectionRequest = require("../models/connectionRequest");

cron.schedule("34 22 * * *", async () => {
  //send mail to all ppl who got request previous day
  try {
    const yesterday = subDays(new Date(), 0);
    console.log(yesterday);
    const yesterdayStart = startOfDay(yesterday);
    const yesterdayEnd = endOfDay(yesterday);

    const pendingRequests = await ConnectionRequest.find({
      status: "interested",
      createdAt: {
        $gte: yesterdayStart,
        $lt: yesterdayEnd,
      },
    }).populate("fromUserId toUserId");

    const listOfEmails = [
      ...new Set(pendingRequests?.map((req) => req?.toUserId?.emailId)),
    ];
    console.log(listOfEmails);
    for (const email of listOfEmails) {
      //send emails
      try {
        const res = await sendEmail(
          "New Friend Requests for " + email,
          "There are many friend requests pending, please login on devTinder.digital to accept or reject!"
        );
        console.log(res);
      } catch (error) {
        console.log(error);
      }
    }
  } catch (error) {
    console.log(error);
  }
});
