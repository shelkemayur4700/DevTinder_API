const express = require("express");
const connectDB = require("./src/config/dataBase");
const cookieParser = require("cookie-parser");
const authRouter = require("./src/routes/auth");
const requestRouter = require("./src/routes/request");
const profileRouter = require("./src/routes/profile");
const userRouter = require("./src/routes/user");
const cors = require("cors");
const app = express();
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials:true
  })
);
app.use(express.json());
app.use(cookieParser());

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);

connectDB()
  .then(() => {
    console.log("DataBase is connected sucessfully!");
    app.listen(7777, () => {
      console.log("server running on 7777");
    });
  })
  .catch((error) => console.log("SERVER ERROR", error));
