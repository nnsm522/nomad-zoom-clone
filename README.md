#Noom

Zoom Clone using NodeJS, WebRTC and Websockets.

# INTRODUCTION

## 0.2 Server Setup

1. 폴더 생성 후 "npm init -y" 명령어를 통해 package.json 파일 생성 (main, script, keywords, author 삭제)
2. README.md 파일 생성
3. "npm i nodemon -D", "npm i @babel/core @babel/cli @babel/node @babel/preset-env -D"
4. nodemon.json 파일, babel.config.json 파일 생성
5. .gitignore 파일 생성 후 "/node_modules" 추가
6. nodemon.json 파일에 {"exec": "babel-node src/server.js"} 작성
7. babel.config.json 파일에 {"presets": ["@babel/preset-env"]} 작성
8. package.json에 script로 "dev": "nodemon" 작성 ("npm run dev" 실행하면 nodemon.json이 실행되고 그 안의 exec 코드가 실행됨)
9. "npm i express", "npm i pug"
10. scr 폴더 생성 -> server.js 파일 생성 -> express 작동 코드 작성

## 0.3 Frontend Setup

1. static file을 만들기 위해 public 폴더 및 js/app.js 파일 생성 (app.js는 유저에게 js를 전송)
2. pug 렌더링을 위해 server.js 파일에 app.set()을 통해 pug 설정 -> 설정 경로(views) 폴더도 함께 생성
3. views/home.pug 파일 생성 후 기본 html 작성
4. server.js 파일에 app.get()을 통해 "/" 경로에서 "home.pug"가 렌더 되도록 설정
   - view engine을 pug로 세팅했기 때문에 pug파일 렌더 가능
5. static 작업을 위해 server.js 파일에 app.use()를 통해 유저가 /public으로 가면 public 폴더를 보여주게 설정
6. home.pug 파일에 script(src="/public/js/app.js") 작성
7. nodemon에서 FrontEnd 파일을 수정할 때는 새로고침 되지 않게 하기 위해 nodemon.json 파일에 코드 추가
   - "ignore": ["src/public/*"]
8. home.pug 파일에서 mvpcss 적용되도록 link 추가
   - link(rel="stylesheet", href="https://unpkg.com/mvp.css")

# CHAT WITH WEBSOCKETS

## 1.2 WebSockets in Node JS

1. "npm i ws"
2. server.js 파일에서 http.createServer(app)을 통해 http 서버를 만들고
3. new WebSocket.Server({server})을 통해 http 서버 위에 websocket 서버를 만듦
4. 이제 동일한 포트에서 http 서버와 ws 서버를 모두 사용 가능

## 1.3 WebSocket Events

1. wss(web socket server)에 "connection" 에 대한 event listener를 달아줌.
   - wss.on("connection", callbackFn) 형태
2. app.js 에서 new WebSocket("경로")을 통해 서버와 연결
   - 경로는 http protocol이 아닌 ws protocol을 사용해야 함.
   - window.location.host를 통해 현재 브라우저의 위치를 받아옴.

## 1.4 WebSocket Messages

1. server.js에서 wss connection에 대한 callbackFn에서 Browser와 소통이 가능
   - socket.on(event, callbackFn) : Browser의 open, close, message 등에 대한 eventListener
   - socket.send(data) : Browser에 data를 전송
2. app.js에서 socket.addEventListener(event, callbackFn) : Browser에서 server 상태를 감시
3. app.js에서 socket.send(data) : Browser에서 server에 data를 전송

## 1.6 Chat Completed

1. home.pug 파일에서 text를 전송할 수 있는 form을 만듦
2. app.js에서 document.querySelector("form") 을 통해 form을 불러오고, submit에 대한 eventListener를 생성
3. eventListener의 callbackFn에서는 input.value를 socket.send(data)를 통해 서버로 전송
4. server.js에서 connection된 socket을 array에 저장 후 Browser에서 보낸 message를 각 socket들에게 재전송

## 1.7 Nicknames part One

1. home.pug에서 nickname을 쓸 form을 추가로 생성
   - message form과 구분하기 위해 id 사용
   - app.js에서 querySelector도 id로 찾도록 수정
2. nickForm에도 messageForm과 같이 eventListener 등록
3. server에서 nickname인지 new_message인지 구분할 수 있도록 JSON 형태로 message를 전송
   - message의 형식은 string이어야 하므로 JSON.stringify()로 가공 후 전송
   - messageForm과 nickForm 모두 사용할 것이므로 function으로 만듦

## 1.8N icknames part Two

1. server는 Browser에서 전달받은 message를 JSON.parse()를 통해 javascript Object로 변환
   - JSON.stringify() : JSON을 string으로 바꿔줌
   - JSON.parse() : string을 javascript Object로 바꿔줌
2. socket에 nickname 데이터를 추가해서 nickname을 save하면 socket의 nickname이 변경되도록 함
   - socket["nickname"] = "Anonymous" 로 초기값은 익명으로 설정
   - message.type === "nickname" 이면 socket["nickname"] 을 변경
3. message.type === "new_message" 이면 "nickname : new_message" 형태로 Browser에 전송

# SOCKET.IO

## 2.1 Installing SocketIO

1. npm install socket.io
2. socket.io는 client에 /soket.io/socket.io.js 를 제공함
   - socket.io는 websocket의 부가기능이 아니기 때문에 back-end와 front-end 모두 설치되어야 함
   - websocket은 browser에 미리 설치되어있지만 socket.io는 설치되어있지 않음
   - socket.io는 더 많은 기능이 있어서 websocket보다 무거움
3. home.pug에서 /soket.io/socket.io.js를 불러옴
   - script(src="/soket.io/socket.io.js")
4. server.js에서 http서버 위에 socketIO 서버 만들고 connection event를 생성함
   - import { Server } from "socket.io";
   - const wsServer = new Server(httpServer);
   - wsServer.on("connection", callbackFn);
