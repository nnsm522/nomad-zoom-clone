#Noom

Zoom Clone using NodeJS, WebRTC and Websockets.

# 0 INTRODUCTION

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

## 1.2 WebSockets in Node JS

1. "npm i ws"
2. server.js 파일에서 http.createServer(app)을 통해 http 서버를 만들고
3. new WebSocket.Server({server})을 통해 http 서버 위에 websocket 서버를 만듦
4. 이제 동일한 포트에서 http 서버와 ws 서버를 모두 사용 가능

# 1.3 WebSocket Events

1. wss(web socket server)에 "connection" 에 대한 event listener를 달아줌.
   - wss.on("connection", callbackFn) 형태
2. app.js 에서 new WebSocket("경로")을 통해 서버와 연결
   - 경로는 http protocol이 아닌 ws protocol을 사용해야 함.
   - window.location.host를 통해 현재 브라우저의 위치를 받아옴.
