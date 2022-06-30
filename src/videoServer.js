import express from "express";
import http from "http";
import { Server } from "socket.io";
import { instrument } from "@socket.io/admin-ui";

const app = express();

app.set("view engine", "pug"); //view engine을 pug로 설정
app.set("views", __dirname + "/views"); //template 경로 설정
app.use("/public", express.static(__dirname + "/public")); // public url을 생성하여 static 파일 제공

app.get("/", (req, res) => res.render("videoHome")); //route 설정
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

wsServer.on("connection", (socket) => {
  socket.on("join_room", (roomName, done) => {
    socket.join(roomName);
    done();
    socket.to(roomName).emit("welcome");
  });
});

httpServer.listen(3000, handleListen);
