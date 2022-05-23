const socket = io(window.location.host);

const welcome = document.getElementById("welcome");
const form = welcome.querySelector("form");
const room = document.getElementById("room");

room.hidden = true;

let roomName;

function handleMessageSubmit(e) {
  e.preventDefault();

  const input = room.querySelector("#message input");

  socket.emit("new_message", input.value, roomName, () => {
    addMessage(`You: ${input.value}`);
    input.value = "";
  });
}

function handleNickNameSubmit(e) {
  e.preventDefault();

  const input = room.querySelector("#name input");

  socket.emit("nickname", input.value, roomName, () => {
    input.value = "";
  });
}

function showRoom() {
  welcome.hidden = true;
  room.hidden = false;

  const h3 = room.querySelector("h3");
  h3.innerText = `Room ${roomName}`;

  const msgForm = room.querySelector("#message");
  msgForm.addEventListener("submit", handleMessageSubmit);

  const nameForm = room.querySelector("#name");
  nameForm.addEventListener("submit", handleNickNameSubmit);
}

function handleSubmit(e) {
  e.preventDefault();

  const input = form.querySelector("input");

  socket.emit("room", input.value, showRoom);
  roomName = input.value;
  input.value = "";
}

form.addEventListener("submit", handleSubmit);

function addMessage(message) {
  const ul = room.querySelector("ul");
  const li = document.createElement("li");

  li.innerText = message;
  ul.appendChild(li);
}

socket.on("welcome", (user) => {
  addMessage(`${user} joined!`);
});

socket.on("bye", (user) => {
  addMessage(`${user} left..`);
});

socket.on("new_message", (msg) => {
  addMessage(msg);
});
