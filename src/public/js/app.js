const ul = document.querySelector("ul");
const nickForm = document.querySelector("#nick");
const meesageForm = document.querySelector("#message");

const socket = new WebSocket(`ws://${window.location.host}`);

// -- 웹 소켓 통신을 성공했을 경우 작동 --
socket.addEventListener("open", () => {
  console.log("Conneted to Server");
});

// -- 서버에서 메세지가 왔을 때 작동 --
socket.addEventListener("message", (message) => {
  //   console.log("message : ", message);

  const li = document.createElement("li");

  li.innerHTML = message.data;

  ul.append(li);
});

// -- 웹 소켓과 연결이 끊어졌을 때 작동
socket.addEventListener("close", () => {
  console.log("Disconneted to Server");
});

// setTimeout(() => {
//   socket.send("hello from the browser!");
// }, 10000);

function makeMessage(type, payload) {
  const msg = { type, payload };

  return JSON.stringify(msg);
}

function handleSubmit(event) {
  event.preventDefault();

  const input = meesageForm.querySelector("input");

  socket.send(makeMessage("new_message", input.value));
  input.value = "";
}

function handleNickSumit(event) {
  event.preventDefault();

  const input = nickForm.querySelector("input");

  socket.send(makeMessage("nickname", input.value));
  input.value = "";
}

meesageForm.addEventListener("submit", handleSubmit);
nickForm.addEventListener("submit", handleNickSumit);
