import express from "express";
import { Server } from "socket.io";
import { createServer } from "http";
import cors from "cors";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";

const PORT = 4848;
const SECRET_KEY = "VIVEK_GOSWAMI";

const app = express();
const server = createServer(app);
app.use(cors());

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

//   socket.emit("welcome",`Welcome to the server ${socket.id}`);
//   socket.broadcast.emit("Welcome",`Hey,${socket.id} join the server`);

// socket middleware
// io.use((socket, next) => {
//   cookieParser()(socket.request, socket.request.res, (err) => {
//     if (err) return next(err);

//     const token = socket.request.cookies.token;

//     if (!token) return next(new Error("Authentication Error: No token"));

//     const decoded = jwt.verify(token, SECRET_KEY);

//     if (!decoded)
//       return next(new Error("Authentication Error not able to decode"));

//     next();
//   });
// });

io.on("connection", (socket) => {
  console.log("User connected", socket.id);

  socket.on("message", ({ message, room }) => {
    console.log(message, room);
    io.to(room).emit("receive-message", message);
  });

  socket.on("join-room", (room) => {
    socket.join(room);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected", socket.id);
  });
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});
app.get("/login", (req, res) => {
  const token = jwt.sign(
    {
      _id: "asdfasdfasdfasdfasdfasdfasdfasdfasdfasdf",
    },
    SECRET_KEY
  );

  res
    .cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    })
    .json("Login Successful");
});

server.listen(PORT, () => {
  console.log("listening on port " + PORT);
});
