import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"],
  },
});

const userSocketMap = {}; // store online users {userId:socketId}

io.on("connection", (socket) => {
  console.log("user connected ", socket.id);

  const userId = socket.handshake.query.userId;
  if (userId) userSocketMap[userId] = socket.id;

  // used to send events to all connected users
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    console.log("user disconnected ", socket.id);
    delete userSocketMap[userId];
  });
});

export const getReceiverSocketId = (userId) => {
  return userSocketMap[userId];
};

export { io, app, server };
