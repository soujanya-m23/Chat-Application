const socket = io('http://localhost:8000');
//Get DOM elements in respective JS variables
const form = document.getElementById('send-container');
const messageInput = document.getElementById('messageInput');
const messageContainer = document.querySelector('.container');

//Audio that will play on receiving msgs
var audio = new Audio('ting.mp3');

//Function which will append event info to the container
const append = (message, position) => {
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    messageContainer.append(messageElement);
    if (position == 'left') {
        audio.play();
    }
}

//Ask new user for his/her name
const userName = prompt("Enter your name to join");
socket.emit('new-user-joined', userName);

//If a new user joins ,receive the event from the server
socket.on('user-joined', user => {
    append(`${user} joined the chat`, 'right');
})

//If the server sends the msg ,receive it 
socket.on('receive', data => {
    append(`${data.userName}:${data.message}`, 'left')   //This is for the one who receives message ,displays on the right
})

//If a user leaves the chat ,append the info to the container
socket.on('left', userName => {
    append(`${userName} left the chat`, 'right')   //This is for the one who receives message ,displays on the right
})

//If the form gets submitted,send server the message
form.addEventListener('submit', (e) => {
    e.preventDefault();  //Prevent from relaod
    const message = messageInput.value;
    append(`You: ${message}`, 'right') //Message that "we" send
    socket.emit('send', message);
    messageInput.value = '';
})
