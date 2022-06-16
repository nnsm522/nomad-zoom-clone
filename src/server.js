import express from "express";

const app = express();

app.set("view engine", "pug"); //view engine을 pug로 설정
app.set("views", __dirname + "/views"); //template 경로 설정
app.use("/public", express.static(__dirname + "/public")); // public url을 생성하여 static 파일 제공

app.get("/", (req, res) => res.render("home")); //route 설정

const handleListen = () => console.log(`Listening on http://localhost:3000`);
app.listen(3000);
