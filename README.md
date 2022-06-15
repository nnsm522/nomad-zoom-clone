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
