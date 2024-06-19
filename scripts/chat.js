let userName = 'You';
let botName = 'Repartidor';

// Check if user info is stored in localStorage
var user = localStorage.getItem('userInfo');
if (user) {
    var userInfo = JSON.parse(user);
    userName = userInfo.nombre;
}

// Check if repartidor info is stored in localStorage
var repartidor = localStorage.getItem('repartidorInfo');
if (repartidor) {
    var repartidorInfo = JSON.parse(repartidor);
    botName = repartidorInfo.nombre;
}

// Fetch messages from chat.json and display them
fetch('chat.json')
    .then(response => response.json())
    .then(data => {
        const messagesDiv = document.getElementById('messages');
        data.messages.forEach(message => {
            const messageDiv = document.createElement('div');
            messageDiv.textContent = `${message.sender}: ${message.text}`;
            messagesDiv.appendChild(messageDiv);
        });
        // Scroll to the end of the messages div
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
    });

// Function to send a message
function sendMessage(sender, messageText) {
    const messagesDiv = document.getElementById('messages');
    const messageDiv = document.createElement('div');
    messageDiv.textContent = `${sender}: ${messageText}`;

    // Add a class based on who the sender is
    if (sender === userName) {
        messageDiv.classList.add('user-message');
    } else {
        messageDiv.classList.add('bot-message');
    }

    messagesDiv.appendChild(messageDiv);

    // Scroll to the end of the messages div
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}
// Function to get bot response
function getResponse(message) {
    message = message.toLowerCase();
    if (message.includes('donde') && message.includes('estas')) {
        return 'A 3 cuadras de tu casa';
    } else if (message === 'hola') {
        return 'Saludos, cómo estás?';
    } else if (message.includes('bien')) {
        return 'Que bueno, ya estoy cerca de tu ubicación';
    } else {
        return 'Ok';
    }
}

// Send a message when the send button is clicked
document.getElementById('sendMessage').addEventListener('click', () => {
    const inputMessage = document.getElementById('inputMessage');
    const message = inputMessage.value;
    inputMessage.value = '';

    // Display the user's message in the chatbox
    sendMessage(userName, message);

    // Bot responds
    setTimeout(() => {
        const botResponse = getResponse(message);
        sendMessage(botName, botResponse);
    }, 2000);
});

// Send a message when Enter is pressed in the input field
document.getElementById('inputMessage').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        const message = e.target.value;
        e.target.value = '';

        // Display the user's message in the chatbox
        sendMessage(userName, message);

        // Bot responds
        setTimeout(() => {
            const botResponse = getResponse(message);
            sendMessage(botName, botResponse);
        }, 1000);
    }
});