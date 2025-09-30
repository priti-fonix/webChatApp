const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const mongoose = require("mongoose");
const Message = require("./models/chatSchema");
// connect MongoDB
const db = require("./config/db");
const app = express();
const server = http.createServer(app);

db(); // Connect to MongoDB

// socket.io with CORS
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

app.use(express.static("public"));
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server is running");
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // Join room
  socket.on("joinRoom", async ({ username, room }) => {
    socket.username = username;
    socket.room = room;
    socket.join(room);

    // welcome only current user
    socket.emit("systemMessage", {
      user: "system",
      text: `Welcome ${username} to room ${room}!`,
    });

    // notify others in the room
    socket.broadcast.to(room).emit("systemMessage", {
      user: "system",
      text: `${username} has joined the chat`,
    });

    // fetch last 50 messages from DB
    const history = await Message.find({ room }).sort({ _id: 1 }).limit(50);
    socket.emit("chatHistory", history);
  });

  // New chat message
  socket.on("chatMessage", async (msg) => {
    const newMessage = new Message(msg);
    await newMessage.save();

    // emit to room
    io.to(socket.room).emit("receiveMessage", msg);
  });

  // Typing indicator
  socket.on("typing", (msg) => {
    socket.broadcast.to(socket.room).emit("typing", msg);
  });

  // Disconnect
  socket.on("disconnect", () => {
    if (socket.room && socket.username) {
      io.to(socket.room).emit("systemMessage", {
        user: "system",
        text: `${socket.username} left the chat`,
      });
    }
    console.log("User disconnected:", socket.id);
  });
});

server.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
