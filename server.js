const socket = io("http://localhost:3000");
const chatContainer = document.getElementById("chat-container");
const chatForm = document.getElementById("chat-form");
const chatMessages = document.querySelector(".chat-messages");
const roomName = document.getElementById("room-name");
const userList = document.getElementById("users");

socket.on("create", function (room) {
  console.log("room", room);
  appendMessage(`${room}is created`);
});

socket.on("user-join-room", (name) => {
  appendMessage(`${name} connected`);
});

socket.on("room-message", (data) => {
  console.log(data);
  appendMessage(`${data.name}`);
});

chatForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const message = chatMessages.value;
  appendMessage(`You: ${message}`);
  socket.emit("send-room-message", message);
  chatMessages.value = "";
});

function appendMessage(message) {
  const messageElement = document.createElement("div");
  messageElement.innerText = message;
  chatContainer.append(messageElement);
}
