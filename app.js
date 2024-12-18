const express = require("express");

const app = express();
//instance of express

//request handler(function)
app.use((req, res) => {
  res.send("hello from server");
}); //this will send hello from server on any request
//but in the app.use function we can give first args as route e.g /home then it will only send response on that route.
app.use("/hello", (req, res) => {
  res.send("hello hello hello");
});

app.listen(3000, () => {
  console.log("server running on 3000");
});
//server listening to 3000 port
//this callback function only executes when server is listening
//to port 3000
