// var roomId = document.getElementById('room').value;
function validateForm() {
    var x = document.forms["myForm"]["room"].value;
    const uniqueId = "123";
    if (x != uniqueId) {
      alert("Invalid Room id;");
      return false;
    }
  }