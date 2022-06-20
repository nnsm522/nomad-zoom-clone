import { doesNotMatch } from "assert";
import express from "express";
import http from "http";
// import WebSocket from "ws";
import { Server } from "socket.io";

const app = express();

app.set("view engine", "pug"); //view engine을 pug로 설정
app.set("views", __dirname + "/views"); //template 경로 설정
app.use("/public", express.static(__dirname + "/public")); // public url을 생성하여 static 파일 제공

app.get("/", (req, res) => res.render("home")); //route 설정
app.get("/*", (req, res) => res.redirect("/")); //다른 주소 입력하면 /로 redirect

const handleListen = () => console.log(`Listening on http://localhost:3000`);

const httpServer = http.createServer(app);
const wsServer = new Server(httpServer); //http 서버 위에 socketIO 서버 만듦

wsServer.on("connection", (socket) => {
  socket.onAny((event) => {
    console.log(`Socket Event: ${event}`);
  });
  socket.on("enter_room", (roomName, fn) => {
    socket.join(roomName);
    fn();
    socket.to(roomName).emit("welcome");
  });
});

/* 
//같은 포트에서 http와 websocket을 동시에 사용 (http 서버 위에 ws 서버를 만듦)
const wss = new WebSocket.Server({ server });
// connection된 socket을 저장하는 fake database
const sockets = [];

wss.on("connection", (socket) => {
  //connection된 frontend가 socket으로 전달됨
  sockets.push(socket);
  socket["nickname"] = "Anonymous";
  console.log("Connected to Browser ✔");
  socket.on("close", () => console.log("Disconnected from the Browser"));
  socket.on("message", (msg) => {
    const message = JSON.parse(msg);
    switch (message.type) {
      case "new_message":
        sockets.forEach((aSocket) =>
          aSocket.send(`${socket.nickname} : ${message.payload}`)
        );
        break;
      case "nickname":
        socket["nickname"] = message.payload;
        break;
    }
  });
});
 */

httpServer.listen(3000, handleListen);
