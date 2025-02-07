const socket = new WebSocket("ws://localhost:5000"); // Use deployed URL when live

const messagesDiv = document.getElementById("messages");
const messageInput = document.getElementById("messageInput");
const sendButton = document.getElementById("sendButton");

let lastMessageTime = 0; // Store last message timestamp
const SPAM_TIMEOUT = 60000; // 1-minute timeout (in milliseconds)

socket.onopen = () => console.log("Connected to server");

socket.onmessage = (event) => {
    // If the server sends a Blob, we convert it to text
    if (event.data instanceof Blob) {
        const reader = new FileReader();
        reader.onload = () => {
            const messageText = reader.result;
            displayMessage(messageText);
        };
        reader.readAsText(event.data);
    } else {
        // If the message is already a string, directly display it
        displayMessage(event.data);
    }
};

sendButton.addEventListener("click", () => {
    const currentTime = Date.now();
    if (currentTime - lastMessageTime < SPAM_TIMEOUT) {
        alert("You can only send a message every 1 minute!");
        return;
    }

    const message = messageInput.value.trim();
    if (message) {
        socket.send(message);
        messageInput.value = "";
        lastMessageTime = currentTime; // Update last sent time
        localStorage.setItem("lastMessageTime", lastMessageTime);
    }
});

// Display message in the chat container
function displayMessage(messageText) {
    const message = document.createElement("p");
    message.textContent = messageText;
    messagesDiv.appendChild(message);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

// Load last message time from localStorage
window.onload = () => {
    lastMessageTime = parseInt(localStorage.getItem("lastMessageTime")) || 0;
};
