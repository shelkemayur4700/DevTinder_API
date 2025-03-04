const express = require("express");
const connectDB = require("./src/config/dataBase");
const cookieParser = require("cookie-parser");
const authRouter = require("./src/routes/auth");
const requestRouter = require("./src/routes/request");
const profileRouter = require("./src/routes/profile");
const userRouter = require("./src/routes/user");
const cors = require("cors");
const paymentRouter = require("./src/routes/payment");
const webhookRouter = require("./src/routes/webhook");
const http = require("http");
const initializeSocket = require("./src/utills/socket");
const  chatRouter  = require("./src/routes/chat");

const app = express();
require("dotenv").config();
//cornjob to trigger mails to all request users
// require("./src/utills/cronJob");
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use((req, res, next) => {
  if (req.originalUrl === "/webhook") {
    next();
  } else {
    express.json()(req, res, next);
  }
});
app.use(cookieParser());
// app.use(express.json());

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);
app.use("/", paymentRouter);
app.use("/", webhookRouter);
app.use("/", chatRouter);
//wensocket configuration
const server = http.createServer(app);
initializeSocket(server);

connectDB()
  .then(() => {
    server.listen(process.env.PORT, () => {
      console.log("server running on 7777");
    });
  })
  .catch((error) => console.log("SERVER ERROR", error));
