require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const Router = require("./routers/router.js");
const mongoose = require("mongoose");
const path = require("path");
const { createServer } = require("http");

const server = createServer(app);

const io = require("socket.io")(server, {
  cors: { origin: "http://localhost:5173" },
});

io.on("connection", (socket) => {
  console.log(`user with id of ${socket.id} has joined`);

  socket.on("addroom", (room) => {
    socket.emit("send-info", room);
  });

  socket.on("disconnect", () => {
    `User with id of ${socket.id} has been disconnected.`;
  });
});

app.use(
  cors({
    origin: "*",
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use(Router);

server.listen(3000, () => {
  console.log("listening on port 3000");
});

mongoose
  .connect(process.env.CONNECTION_STRING)
  .then(() => console.log("Database connected..."))
  .catch((err) => console.log("Oops some issues:" + err.message));
