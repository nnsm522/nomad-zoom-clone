import express from "express";
import http from "http";
// import WebSocket from "ws";
import { Server } from "socket.io";
import { instrument } from "@socket.io/admin-ui";

const app = express();

app.set("view engine", "pug"); //view engine을 pug로 설정
app.set("views", __dirname + "/views"); //template 경로 설정
app.use("/public", express.static(__dirname + "/public")); // public url을 생성하여 static 파일 제공

app.get("/", (req, res) => res.render("home")); //route 설정
app.get("/*", (req, res) => res.redirect("/")); //다른 주소 입력하면 /로 redirect

const handleListen = () => console.log(`Listening on http://localhost:3000`);

const httpServer = http.createServer(app);
//http 서버 위에 socketIO 서버 만듦
const wsServer = new Server(httpServer, {
  //admin-ui demo
  cors: {
    origin: ["https://admin.socket.io"],
    credentials: true,
  },
});

instrument(wsServer, {
  auth: false,
});

function publicRooms() {
  // const sids = wsServer.sockets.adapter.sids;
  // const rooms = wsServer.sockets.adapter.rooms;
  const {
    sockets: {
      adapter: { sids, rooms },
    },
  } = wsServer;
  const publicRooms = [];
  rooms.forEach((_, key) => {
    if (sids.get(key) === undefined) {
      publicRooms.push(key);
    }
  });
  return publicRooms;
}

function countRoom(roomName) {
  return wsServer.sockets.adapter.rooms.get(roomName)?.size;
}

wsServer.on("connection", (socket) => {
  socket["nickname"] = "Anonymous";
  socket.onAny((event) => {
    console.log(`Socket Event: ${event}`);
  });
  socket.on("enter_room", (nickname, roomName, fn) => {
    socket["nickname"] = nickname;
    socket.join(roomName);
    fn(countRoom(roomName));
    socket.to(roomName).emit("welcome", socket.nickname, countRoom(roomName));
    wsServer.sockets.emit("room_change", publicRooms());
  });
  //disconnecting은 방을 떠나기 직전에 발생됨
  socket.on("disconnecting", () => {
    socket.rooms.forEach((room) =>
      socket.to(room).emit("bye", socket.nickname, countRoom(room) - 1)
    );
  });
  //disconnect는 방을 떠난 후 발생됨
  socket.on("disconnect", () => {
    wsServer.sockets.emit("room_change", publicRooms());
  });
  socket.on("new_message", (msg, room, done) => {
    socket.to(room).emit("new_message", `${socket.nickname}: ${msg}`);
    done();
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
