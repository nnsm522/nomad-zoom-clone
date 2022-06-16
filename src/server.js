import express from "express";
import http from "http";
import WebSocket from "ws";

const app = express();

app.set("view engine", "pug"); //view engine을 pug로 설정
app.set("views", __dirname + "/views"); //template 경로 설정
app.use("/public", express.static(__dirname + "/public")); // public url을 생성하여 static 파일 제공

app.get("/", (req, res) => res.render("home")); //route 설정
app.get("/*", (req, res) => res.redirect("/")); //다른 주소 입력하면 /로 redirect

const handleListen = () => console.log(`Listening on http://localhost:3000`);

//같은 포트에서 http와 websocket을 동시에 사용 (http 서버 위에 ws 서버를 만듦)
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

server.listen(3000, handleListen);
