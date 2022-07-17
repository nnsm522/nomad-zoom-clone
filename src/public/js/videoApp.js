const socket = io();

const myFace = document.getElementById("myFace");
const muteBtn = document.getElementById("mute");
const cameraBtn = document.getElementById("camera");
const cameraSelect = document.getElementById("cameras");
const peerFace = document.getElementById("peerFace");
const leave = document.getElementById("leave");

const chat = document.getElementById("chat");
const call = document.getElementById("call");
call.hidden = true;

let roomName;

let muted = false;
let cameraOff = false;

//Stream은 video&audio 결합된 것
let myStream;
let myPeerConnection;
let myDataChennel;

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
  if (myPeerConnection) {
    const videoTrack = myStream.getVideoTracks()[0];
    const videoSender = myPeerConnection
      .getSenders()
      .find((sender) => sender.track.kind === "video");
    videoSender.replaceTrack(videoTrack);
  }
});

// welcome form
const welcome = document.getElementById("welcome");

const welcomeForm = welcome.querySelector("form");
welcomeForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const input = welcomeForm.querySelector("input");
  await initCall();
  socket.emit("join_room", input.value);
  roomName = input.value;
  input.value = "";

  //chat
  const msgForm = chat.querySelector("#msg");
  msgForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const msg = chat.querySelector("#msg input");
    addMessage(`Me: ${msg.value}`);
    if (myDataChennel.readyState !== "open") {
      addMessage("Failed to send message because there is no one");
    } else {
      myDataChennel.send(msg.value);
    }
    msg.value = "";
  });
});

function addMessage(message) {
  const ul = chat.querySelector("ul");
  const li = document.createElement("li");
  li.innerText = message;
  ul.appendChild(li);
}

async function initCall() {
  welcome.hidden = true;
  call.hidden = false;
  await getMedia();
  makeConnection();
}

//leave
leave.addEventListener("click", (event) => {
  socket.emit("leave", roomName, () => {
    myPeerConnection.close();
    window.location.reload();
  });
});
socket.on("leave", () => {
  peerFace.srcObject = null;
});

//Socket Code
//peer A
socket.on("welcome", async () => {
  myDataChennel = myPeerConnection.createDataChannel("chat");
  myDataChennel.addEventListener("message", (event) => {
    addMessage(`other: ${event.data}`);
  });
  const offer = await myPeerConnection.createOffer();
  myPeerConnection.setLocalDescription(offer);
  socket.emit("offer", offer, roomName);
});
//peer B
socket.on("offer", async (offer) => {
  myPeerConnection.addEventListener("datachannel", (event) => {
    myDataChennel = event.channel;
    myDataChennel.addEventListener("message", (event) => {
      addMessage(`other: ${event.data}`);
    });
  });
  myPeerConnection.setRemoteDescription(offer);
  const answer = await myPeerConnection.createAnswer();
  myPeerConnection.setLocalDescription(answer);
  socket.emit("answer", answer, roomName);
});
//peer A
socket.on("answer", (answer) => {
  myPeerConnection.setRemoteDescription(answer);
});

socket.on("ice", (ice) => {
  myPeerConnection.addIceCandidate(ice);
});

// RTC Code
function makeConnection() {
  myPeerConnection = new RTCPeerConnection({
    iceServers: [
      {
        urls: [
          "stun:stun.l.google.com:19302",
          "stun:stun1.l.google.com:19302",
          "stun:stun2.l.google.com:19302",
          "stun:stun3.l.google.com:19302",
          "stun:stun4.l.google.com:19302",
        ],
      },
    ],
  });
  myPeerConnection.addEventListener("icecandidate", (data) => {
    socket.emit("ice", data.candidate, roomName);
  });
  myPeerConnection.addEventListener("addstream", (data) => {
    peerFace.srcObject = data.stream;
  });
  myStream
    .getTracks()
    .forEach((track) => myPeerConnection.addTrack(track, myStream));
}
