const messageInput = document.getElementById("message-input");
const sendButton = document.getElementById("send-message");

const socket = new WebSocket("ws://localhost:8080");

sendButton.addEventListener("click", () => {
  const message = messageInput.value;
  socket.send(message);
  messageInput.value = "";
});

socket.onmessage = (event) => {
  const message = event.data;
  console.log("Received:", message);
};
