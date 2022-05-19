const express = require("express");
const app = express();
const http = require("http").createServer(app);
const mongoose = require("mongoose");
const db = "mongodb://localhost:27017/CHAT";
const chatSchema = require("./model/chatModel");
const io = require("socket.io")(3000);

mongoose
  .connect(db)
  .then(() => {
    console.log(`connected successfully`);
  })
  .catch((err) => console.log(`not successfully`));

const users = {};

io.on("connection", (socket) => {
  socket.on("new-user", (name) => {
    users[socket.id] = name;
    socket.broadcast.emit("user-connected", name);
  });

  socket.on("send-chat-message", async (message) => {
    console.log("aaaaaa1111111", message);
    socket.broadcast.emit("chat-message", {
      message: message,
      name: users[socket.id],
    });

    console.log("aaaaaaaaaaaa", message);
    const data = new chatSchema({
      name: users[socket.id],
      message: message,
    });
    await data.save();
  });

  socket.on("disconnect", () => {
    socket.broadcast.emit("user-disconnected", users[socket.id]);
    delete users[socket.id];
  });
});

http.listen(() => {
  console.log(3000, `Listening on port `);
});
