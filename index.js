const express = require("express");
const app = express();
const http = require("http").createServer(app);
const mongoose = require("mongoose");
const db = "mongodb://localhost:27017/CHAT";
const chatSchema = require("./model/chatModel");
const groupSchema = require("./model/groupModel");

const io = require("socket.io")(3000);
const port = 5000;
mongoose
  .connect(db)
  .then(() => {
    console.log(`connected successfully`);
  })
  .catch((err) => console.log(`not successfully`));

const users = {};
let rooms = {};

io.on("connection", async (socket) => {
  // const abcd = await chatSchema.find({});
  // for (let doc of abcd) {
  //   socket.emit("showingPastMessages", doc.message);
  // }

  // const dateFun = (currentDate) => {
  //   var dd = currentDate.getDate();
  //   var month = currentDate.getMonth() + 1; //Be careful! January is 0 not 1
  //   var year = currentDate.getFullYear();
  //   return `${dd}-${month}-${year}`;
  // };

  // let currentDate = dateFun(new Date());
  // console.log("currentDate", currentDate);

  // let msg;

  // for (let data of abcd) {
  //   const ZZ = dateFun(data.createdAt);
  //   console.log("ZZ", ZZ);
  //   if (ZZ === currentDate) {
  //     msg = `${data.message}`;
  //     socket.emit("showingPastMessages", msg);
  //   } else {
  //     msg = `${data.message} ${ZZ}`;
  //     socket.emit("showingPastMessages", msg);
  //   }
  // }
  socket.on("new-user", (name) => {
    users[socket.id] = name;
    socket.broadcast.emit("user-connected", name);
  });

  socket.on("create", function (room) {
    rooms[socket.id] = room;
    // socket.room = roomname;
    // socket.join(roomname);
    socket.broadcast.emit("user-join-room", room);
    console.log("room", room);
  });
  socket.on("send-room-message", async (message) => {
    socket.broadcast.emit("room-message", {
      message: message,
      username: rooms[socket.id],
      room: room,
    });
    const data = new groupSchema({
      username: rooms[socket.id],
      message: message,
      room: room,
    });
    console.log("data", data);
    await data.save();
  });

  socket.on("send-chat-message", async (message, time) => {
    socket.broadcast.emit("chat-message", {
      message: message,
      name: users[socket.id],
      time,
    });
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

http.listen(port, () => {
  console.log(5000, `Listening on port `);
});
