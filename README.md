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

## 2.2 SocketIO is Amazing

1. socket.io 에서는 websocket과 다르게 정해진 eventListener를 사용하지 않음
   - socket.emit("costom_event", data) 형태로 eventListener를 원하는대로 만들어냄
   - data는 Object 형태도 가능하며, function도 가능함 (여러개를 전달할 수도 있음)
   - function을 전달하면 server에서 호출하고 front-end에서 실행됨 (function은 반드시 마지막 인자여야 함)
   - front-end에서 함수를 호출 및 실행하지 않고 back-end에서 호출하는 이유는 front-end에서 전송한 data들이 제대로 back-end에서 받았는지 확인할 수 있기 때문
   - 받는 쪽에서는 socket.on("costom_event", callbackFn) 형태로 사용 가능
   - 여러 개의 data가 전달되면 전달한 순서대로 인자로 사용 가능

## 2.4 Rooms

1. home.pug에서 빈 h3 태그를 만듦
2. app.js에서 showRoom 함수를 만들고 submit 버튼을 누르면 roomName과 showRoom 함수를 server로 전송
3. server.js에서는 socket.join(roomName)을 통해 room에 입장
4. 입장 후 front-end에서 전달받은 showRoom 함수 호출

## 2.5 Room Messages

1. server.js에서 socket.to(roomName).emit("welcome")을 추가하여 이미 room에 있는 socket에 "welcome" event 전송
   - socket.to("roomName").emit("event")를 통해 이미 room에 있는 socket에 event를 전송할 수 있음 (자신을 제외한 모든 socket에 전송)
2. app.js에서 socket.on("welcome", Fn)을 통해 server에서 전송한 event에 대한 수행문 작성

## 2.6 Room Notifications

1. room 입장 후 message를 submit하면 자신의 화면에는 You: message가 나오도록 작업
   - socket.emit("new_message", input.value, roomName, Fn)
   - 다른 화면에도 출력하려면 어떤 room인지 알 필요가 있어서 roomName도 함께 전송
2. server.js에서 socket.on("new_message", Fn) 안에 다른 화면에도 message를 보여줄 수 있도록 message 전송
   - socket.to(room).emit("new_message", msg)
   - front-end에서 emit한 event name과 back-end에서 emit한 event name은 같아도 됨
3. app.js에서 socket.on("new_message", Fn)을 통해 message를 출력

## 2.7 Nicknames

1. home.pug에 nickname 입력받을 input 생성
2. app.js에서 nickname을 server로 전송
3. server.js에서 socket에 nickname 저장

## 2.8~2.9 Room Count

1. wsServer.sockets.adapter에는 rooms와 sids 정보가 Map() 형태로 존재
   - sids : socket IDs
   - rooms : private rooms(sids와 동일) & public rooms
2. Room Count를 하기 위해 public room의 key를 추출
   - rooms.forEach()를 통해 sids의 key와 비교
   - room이 생성되고 삭제될 때마다 room list가 필요하므로 함수로 만들어둠
3. server.js에서 enter_room, disconnect 할 때 room_change event를 emit함
   - disconnecting event는 방을 떠나기 직전에 발생되므로 disconnect event로 만듦
4. app.js에서 room_change event 발생 시 roomList가 화면에 나타나도록 함

## 2.10 User Count

1. wsServer.sockets.adapter.rooms에는 room에 접속한 sids 정보가 set() 형태로 존재
   - set()은 중복된 값을 가질 수 없음
2. wsServer.sockets.adapter.rooms.get(roomName)?.size를 통해 room에 접속한 sdis 개수를 가져옴
3. countRoom 값을 enter_room, welcome, disconnecting event에 각각 전송
   - disconnecting event에서는 countRoom 값이 1 줄어들어야 하므로 -1을 전송
   - disconnect event에서는 이미 방을 떠났기 때문에 roomName을 가져올 수 없음
4. app.js에서 countRoom 값을 표기

## 2.11 Admin Panel

1. npm i @socket.io/admin-ui
2. const { instrument } = require("@socket.io/admin-ui");
   = import { instrument } from "@socket.io/admin-ui";
3. const wsServer = new Server(httpServer, {
   cors: {
   origin: ["https://admin.socket.io"],
   credentials: true,
   },
   });
4. instrument(wsServer, {auth: false});
5. https://admin.socket.io/#/ 에서 ServerURL 입력 (http://localhost:3000)

# VIDEO CALL

## 3.0 User Video

1. video 관련 back-end & front-end를 새로 만들어줌
   - videoServer.js , videoApp.js , videoHome.pug
   - 각 파일에서 경로 수정
2. nodemon.json 수정
   - "exec": "babel-node src/videoServer.js"
3. videoHome.pug에서 video 화면 생성
   - video#myFace(autoplay, playsinline, width="400", height="400")
4. videoApp.js에서 video 화면에 video&audio 나오도록 getMedia() 함수 작성
5. videoHome.pug에서 Mute, Camera Off 버튼 생성 후 videoApp.js에서 click event listener 작성

## 3.1 Call Controls

1. mute button, camera button 에 기능 삽입
   - stream.getAudioTracks() , stream.getVideoTracks() 에서 forEach()를 통해 enabled 값을 바꿈
2. navigator.mediaDevices.enumerateDevices(); 를 통해 연결된 device를 모두 가져옴 (devices)
3. device 중에서 kind가 videoinput 인 것들만 가져옴 (cameras)
4. videoHome.pug에서 select 태그 만들어주고 videoApp.js에서 cameras에 있는 목록을 option으로 넣어줌

## 3.2 Camera Switch

1. cameraSelect에 input eventListener 적용
   - 변경된 카메라로 getMedia() 재호출 하기 위해 cameraSelect.value를 인자로 넘김
2. getMedia() 함수에서 최초 실행에서는 cameraSelect.value가 넘어오지 않으므로 조건문 적용
   - deviceId가 없으면 전면 카메라 작동
   - deviceId가 있으면 해당 deviceId와 일치하는 video 작동
3. getCameras() 함수가 카메라 바뀔 때마다 실행되므로 deviceId가 없을 때(최초 실행)만 작동하도록 설정
4. 카메라 선택을 바꾸면 mute와 cameraOff가 풀리는 현상이 발견되어 수정
   - muted 값과 cameraOff 값도 전달받아서 getMedia() 함수 호출될 때마다 mute, cameraOff 설정을 잡아줌
