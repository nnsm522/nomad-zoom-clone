const socket = io();

const welcome = document.getElementById("welcome");
const room = document.getElementById("room");
const form = welcome.querySelector("form");

room.hidden = true;
let roomName;

function addMessage(message) {
  const ul = room.querySelector("ul");
  const li = document.createElement("li");
  li.innerText = message;
  ul.appendChild(li);
}

function handleMessageSubmit(event) {
  event.preventDefault();
  const input = room.querySelector("input");
  socket.emit("new_message", input.value, roomName, () => {
    addMessage(`You: ${input.value}`);
    input.value = "";
  });
}

function showRoom() {
  welcome.hidden = true;
  room.hidden = false;
  const h3 = room.querySelector("h3");
  h3.innerText = `Room ${roomName}`;
  const form = room.querySelector("form");
  form.addEventListener("submit", handleMessageSubmit);
}

function handleRoomSubmit(event) {
  event.preventDefault();
  const input = form.querySelector("input");
  socket.emit("enter_room", input.value, showRoom);
  roomName = input.value;
  input.value = "";
}
form.addEventListener("submit", handleRoomSubmit);

socket.on("welcome", () => {
  addMessage("Someone joined!");
});
socket.on("bye", () => {
  addMessage("Someone left ㅠㅠ");
});
socket.on("new_message", (msg) => {
  addMessage(`Someone: ${msg}`);
});

/* const messageList = document.querySelector("ul");
const messageForm = document.querySelector("#message");
const nickForm = document.querySelector("#nick");

//연결된 서버가 socket에 저장됨
const socket = new WebSocket(`ws://${window.location.host}`);

socket.addEventListener("open", () => {
  console.log("Connected to Server ✅");
});

socket.addEventListener("message", (message) => {
  const li = document.createElement("li");
  li.innerText = message.data;
  messageList.append(li);
});

socket.addEventListener("close", () => {
  console.log("Disconnected from Server ❎");
});

function makeMessage(type, payload) {
  const msg = { type, payload };
  return JSON.stringify(msg);
}

function handleSubmit(event) {
  event.preventDefault();
  const input = messageForm.querySelector("input");
  socket.send(makeMessage("new_message", input.value));
  input.value = "";
}
function handleNickSubmit(event) {
  event.preventDefault();
  const input = nickForm.querySelector("input");
  socket.send(makeMessage("nickname", input.value));
}

messageForm.addEventListener("submit", handleSubmit);
nickForm.addEventListener("submit", handleNickSubmit);
 */
