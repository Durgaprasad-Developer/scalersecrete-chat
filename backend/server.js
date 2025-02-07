const express = require("express");
const WebSocket = require("ws");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
const wss = new WebSocket.Server({ server });
let clinetCount = 0;
wss.on("connection", (ws) => {
    clinetCount++;
    console.log(`${clinetCount} online`)
    console.log("New client connected");

    ws.on("message", (message) => {
        console.log(`Received: ${message}`);
        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(message); 
            }
        });
    });

    ws.on("close", () => {
        console.log("Client disconnected");
    });
});
