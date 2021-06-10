// socket.io chat
var socket = io();

var form = document.getElementById('form');
  var input = document.getElementById('input');
  // var roomBtn = document.getElementById('roomBtn');

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    if (input.value) {
      socket.emit('chat message', input.value);
      input.value = '';
    }
  });

  socket.on('chat message', function(msg) {
    var item = document.createElement('li');
    item.textContent = msg;
    messages.appendChild(item);
    window.scrollTo(0, document.body.scrollHeight);
  })

  
  // sentiment analysed community chat
  var val = document.querySelector(".dum").innerHTML;

  if(val > 0)
  {
    document.querySelector(".dum").innerHTML = "Your emotions have been analysed. It seems like you could share your positivity with someone in need!";
    document.querySelector(".convo-btn").style.display = "block";
    document.querySelector(".feel-btn").style.display = "block";
    document.querySelector(".convo-btn").innerHTML = "Help Someone!";
    document.querySelector(".txt-input").style.display = "none";
    document.querySelector(".com-foot").style.display = "block";
  }

  else if(val < 0)
  {
    document.querySelector(".dum").innerHTML = "Your emotions have been analysed. It seems like you'd feel better after talking to one of our kind users.";
    document.querySelector(".convo-btn").style.display = "block";
    document.querySelector(".feel-btn").style.display = "block";
    document.querySelector(".convo-btn").innerHTML = "Seek Help!";
    document.querySelector(".txt-input").style.display = "none";
    document.querySelector(".com-foot").style.display = "block";
  }

  else
  {
    document.querySelector(".txt-input").style.display = "block";
    document.querySelector(".dum").innerHTML = "";
    document.querySelector(".feel-btn").style.display = "none";
    document.querySelector(".convo-btn").innerHTML = "Explore!";
    document.querySelector(".com-foot").style.display = "block";
  }

  function feelbox() {
    document.querySelector(".txt-input").style.display = "block";
    document.querySelector(".dum").style.display = "none";
    document.querySelector(".convo-btn").style.display = "none";
    document.querySelector(".feel-btn").style.display = "none";
    document.querySelector(".com-foot").style.display = "block";
  }

  function openchat() {
    document.querySelector(".join-container").style.display = "block";
    document.querySelector(".convo-btn").style.display = "none";
    document.querySelector(".dum").style.display = "none";
    document.querySelector(".com-foot").style.display = "none";
    document.querySelector(".exp-con").style.display = "none";
  }


// var roomId = document.getElementById('room').value;
function validateForm() {
  var x = document.forms["myForm"]["room"].value;
  const uniqueId = "123";
  if (x != uniqueId) {
    alert("Invalid Room id;");
    return false;
  }
  else window.location.replace('/room');

}

  

 