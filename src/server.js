import express from "express";
import http from "http";
// import WebSocket from "ws";
import SocketIO from "socket.io";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));

// app.get("/", (req, res) => res.render("home"));
app.get("/", (req, res) => res.render("socket"));
app.get("/*", (req, res) => res.redirect("/"));

const server = http.createServer(app);
const io = SocketIO(server);

io.on("connection", (socket) => {
  socket["nickname"] = "Anon";

  socket.on("room", (msg, showRoom) => {
    socket.join(msg);

    showRoom();

    socket.to(msg).emit("welcome", socket["nickname"]);
  });
  socket.on("disconnecting", () => {
    socket.rooms.forEach((room) =>
      socket.to(room).emit("bye", socket["nickname"])
    );
  });
  socket.on("new_message", (msg, room, done) => {
    socket.to(room).emit("new_message", `${socket["nickname"]}: ${msg}`);
    done();
  });
  socket.on("nickname", (nickname) => {
    socket["nickname"] = nickname;
  });
});

// websocket

// const wss = new WebSocket.Server({ server });
// const sockets = [];

// wss.on("connection", (socket) => {
//   //   console.log(socket);
//   socket["nickname"] = "Anon";
//   // -- 소켓을 임의 데이터베이스(배열)에 저장 --
//   sockets.push(socket);
//   // socket.send("hello!!");

//   // -- 소켓 연결 종료 시 작동 --
//   socket.on("close", () => console.log("Disconnected from the Browser"));

//   // -- FrontEnd로부터 메시지를 전달 받은 후 추가적인 작업 --
//   socket.on("message", (message) => {
//     const data = JSON.parse(message.toString());
//     switch (data.type) {
//       case "new_message":
//         sockets.forEach((client) => {
//           client.send(`${socket.nickname}: ${data.payload}`);
//         });

//         break;
//       case "nickname":
//         socket["nickname"] = data.payload;
//         break;
//     }
//   });
// });

// app.listen(3000);

server.listen(3000, () => console.log("Listening on http://localhost:3000"));
