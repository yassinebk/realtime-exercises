import http from "http";
import handler from "serve-handler";
import nanobuffer from "nanobuffer";
import { Server } from "socket.io";

const msg = new nanobuffer(50);
const getMsgs = () => Array.from(msg).reverse();

msg.push({
  user: "brian",
  text: "hi",
  time: Date.now(),
});

// serve static assets
const server = http.createServer((request, response) => {
  return handler(request, response, {
    public: "./frontend",
  });
});

// websocket server init

const io = new Server(server, (socket) => {});

io.on("connection", (socket) => {
  console.log(`connected ${socket.id}`);

  socket.emit("msg:get", { msg: getMsgs() });

  socket.on("msg:post", (data) => {
    console.log("Received new Data", data);
    msg.push({
      ...data,
      time: Date.now(),
    });
    socket.emit("msg:get", { msg: getMsgs() });
  });
});

io.on("disconnect", () => {
  console.log(`disconnected ${socket.id}`);
});

const port = process.env.PORT || 8080;

server.listen(port, () =>
  console.log(`Server running at http://localhost:${port}`)
);
