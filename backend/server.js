const express = require("express");
const WebSocket = require("ws");
const path = require("path");

const app = express();

// Serve static files (frontend)
app.use(express.static(path.join(__dirname, "../frontend")));

const wss = new WebSocket.Server({ noServer: true });

wss.on("connection", (ws) => {
  console.log("Client connected");

  ws.on("message", (message) => {
    console.log("Received:", message);
    ws.send(message);  // Echo the message back to the client
  });
});

app.server = app.listen(process.env.PORT || 8080, () => {
  console.log(`Server started on port 8080`);
});

app.server.on("upgrade", (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit("connection", ws, request);
  });
});
