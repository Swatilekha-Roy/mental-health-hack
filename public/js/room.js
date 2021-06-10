const chatForm = document.getElementById('com-chat');
const chatMessages = document.querySelector('.com-chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');


const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true
  
});

const socket = io(); 


// Join chatroom
socket.emit('joinRoom', { username, room });

// Get room and users
socket.on('roomUsers', ({ room, users }) => {
  outputRoomName(room);
  // outputUsers(users);
});

// Message from server
socket.on('message', (message) => {
  outputMessage(message);

  chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Message submit
chatForm.addEventListener('submit', (e) => {
  e.preventDefault();

  // Get message text from form
  const msg = e.target.elements.msg.value;

  // Emit message to server
  socket.emit('chatMessage', msg);

  e.target.elements.msg.value = '';
  e.target.elements.msg.focus();
});

// Output message to DOM

function outputMessage(message) {
  const div = document.createElement('div');
  div.classList.add('message');
  div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text">
      ${message.text}
    </p>`;
  document.querySelector('.com-chat-messages').appendChild(div);
}

// Add room name to DOM

function outputRoomName(room) {
  roomName.innerText = "Room: 123";
}

function giveFeedback() {
  window.location.replace('/feedback');
}
