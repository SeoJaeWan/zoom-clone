import express from "express";
import http from "http";
import WebSocket from "ws";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));

app.get("/", (req, res) => res.render("home"));
app.get("/*", (req, res) => res.redirect("/"));

// app.listen(3000);

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const sockets = [];

wss.on("connection", (socket) => {
  //   console.log(socket);
  socket["nickname"] = "Anon";
  // -- 소켓을 임의 데이터베이스(배열)에 저장 --
  sockets.push(socket);
  // socket.send("hello!!");

  // -- 소켓 연결 종료 시 작동 --
  socket.on("close", () => console.log("Disconnected from the Browser"));

  // -- FrontEnd로부터 메시지를 전달 받은 후 추가적인 작업 --
  socket.on("message", (message) => {
    const data = JSON.parse(message.toString());
    switch (data.type) {
      case "new_message":
        sockets.forEach((client) => {
          client.send(`${socket.nickname}: ${data.payload}`);
        });

        break;
      case "nickname":
        socket["nickname"] = data.payload;
        break;
    }
  });
});

server.listen(3000, () => console.log("Listening on http://localhost:3000"));
