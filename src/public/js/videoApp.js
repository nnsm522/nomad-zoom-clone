const socket = io();

const myFace = document.getElementById("myFace");
const muteBtn = document.getElementById("mute");
const cameraBtn = document.getElementById("camera");
const cameraSelect = document.getElementById("cameras");

const call = document.getElementById("call");
call.hidden = true;

let roomName;

let muted = false;
let cameraOff = false;

//Stream은 video&audio 결합된 것
let myStream;
let myPeerConnection;

async function getMedia(deviceId, muted, cameraOff) {
  const initialConstrains = {
    audio: true,
    video: { facingMode: "user" },
  };
  const cameraConstrains = {
    audio: true,
    video: { deviceId: { exact: deviceId } },
  };
  try {
    myStream = await navigator.mediaDevices.getUserMedia(
      deviceId ? cameraConstrains : initialConstrains
    );
    myStream.getAudioTracks().forEach((track) => (track.enabled = !muted));
    myStream.getVideoTracks().forEach((track) => (track.enabled = !cameraOff));
    myFace.srcObject = myStream;
    if (!deviceId) {
      await getCameras();
    }
  } catch (e) {
    console.log(e);
  }
}

async function getCameras() {
  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const cameras = devices.filter((device) => device.kind === "videoinput");
    const currentCamera = myStream.getVideoTracks()[0];
    cameras.forEach((camera) => {
      const option = document.createElement("option");
      option.value = camera.deviceId;
      option.innerText = camera.label;
      if (currentCamera.label == camera.label) {
        option.selected = true;
      }
      cameraSelect.appendChild(option);
    });
  } catch (e) {
    console.log(e);
  }
}

muteBtn.addEventListener("click", () => {
  if (!muted) {
    muteBtn.innerText = "UnMute";
    muted = true;
  } else {
    muteBtn.innerText = "Mute";
    muted = false;
  }
  myStream.getAudioTracks().forEach((track) => (track.enabled = !muted));
});
cameraBtn.addEventListener("click", () => {
  if (!cameraOff) {
    cameraBtn.innerText = "Turn Camera On";
    cameraOff = true;
  } else {
    cameraBtn.innerText = "Turn Camera Off";
    cameraOff = false;
  }
  myStream.getVideoTracks().forEach((track) => (track.enabled = !cameraOff));
});
cameraSelect.addEventListener("input", async () => {
  await getMedia(cameraSelect.value, muted, cameraOff);
});

// welcome form
const welcome = document.getElementById("welcome");

welcomeForm = welcome.querySelector("form");
welcomeForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const input = welcomeForm.querySelector("input");
  socket.emit("join_room", input.value, startMedia);
  roomName = input.value;
  input.value = "";
});

async function startMedia() {
  welcome.hidden = true;
  call.hidden = false;
  await getMedia();
  makeConnection();
}

//Socket Code
//peer A
socket.on("welcome", async () => {
  const offer = await myPeerConnection.createOffer();
  myPeerConnection.setLocalDescription(offer);
  socket.emit("offer", offer, roomName);
});
//peer B
socket.on("offer", (offer) => {
  console.log(`peer B : ${offer}`);
});

// RTC Code
function makeConnection() {
  myPeerConnection = new RTCPeerConnection();
  myStream
    .getTracks()
    .forEach((track) => myPeerConnection.addTrack(track, myStream));
}
