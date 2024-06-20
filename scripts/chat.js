let userName = 'Tú';
let botName = 'Repartidor';
const messagesUrl = 'http://localhost:3000/mensajes';

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

var pedidoId = parseInt(localStorage.getItem('pedidoId'));

async function fetchMessages() {
    const [messageResponse] = await Promise.all([
        fetch(messagesUrl)
    ]);

    try {
        let messages = await messageResponse.json();
        messages = messages.filter(message => message.id_pedido === pedidoId);
        generatePage(messages);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

function generatePage(messages) {
    const messagesDiv = document.getElementById('messages');
    messagesDiv.innerHTML = '';
    messages.forEach(message => {
        const messageDiv = document.createElement('div');
        if (message.enviado_por_cliente){
            messageDiv.classList.add('user-message');
            messageDiv.textContent = `${userName}: ${message.contenido}`;
        } else {
            messageDiv.classList.add('bot-message');
            messageDiv.textContent = `${botName}: ${message.contenido}`;
        }
        messagesDiv.appendChild(messageDiv);
    });
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

// Function to send a message
function sendMessage(sender, messageText) {
    const messagesDiv = document.getElementById('messages');
    const messageDiv = document.createElement('div');
    messageDiv.textContent = `${sender}: ${messageText}`;

    let message = {
        id_pedido: pedidoId,
        contenido: messageText,
        fecha: new Date().toISOString(),
        enviado_por_cliente: sender === userName
    };

    messageDiv.classList.add(sender === userName ? 'user-message' : 'bot-message');

    fetch(messagesUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(message)
    })
        .then(response => response.json())
        .then(data => console.log('Message sent:', data))
        .catch(error => console.error('Error sending message:', error));

    messagesDiv.appendChild(messageDiv);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

document.addEventListener('DOMContentLoaded', () => {
    fetchMessages();

    // Send a message when the send button is clicked
    document.getElementById('sendMessage').addEventListener('click', function (e) {
        e.preventDefault();
        const inputMessage = document.getElementById('inputMessage');
        const message = inputMessage.value;
        inputMessage.value = '';

        // Display the user's message in the chatbox
        sendMessage(userName, message);
    });

    // Send a message when Enter is pressed in the input field
    document.getElementById('inputMessage').addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            const message = e.target.value;
            e.target.value = '';

            // Display the user's message in the chatbox
            sendMessage(userName, message);
        }
    });
});
