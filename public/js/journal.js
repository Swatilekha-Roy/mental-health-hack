/* Journal taking */

showNotes();

let addBtn = document.getElementById('addBtn');

// add notes to localstorage
addBtn.addEventListener("click", function(e) {
    let addTxt = document.getElementById("addTxt");
    let addTitle = document.getElementById("addTitle");
    let notes = localStorage.getItem("notes");

    if(notes == null) 
    {
        notesObj = [];
    }
    else
    {
        notesObj = JSON.parse(notes);
    }
    let myObj = {
        title: addTitle.value,
        text: addTxt.value
    }
    notesObj.push(myObj);
    localStorage.setItem("notes", JSON.stringify(notesObj));
    addTxt.value = "";
    console.log(notesObj);
    
    showNotes();
})


// function to show elements from localstorage
function showNotes() {
    let notes = localStorage.getItem("notes");

    if(notes == null) 
    {
        notesObj = [];
    }
    else
    {
        notesObj = JSON.parse(notes);
    }
    
    let html = "";
    notesObj.forEach(function(element, index) {
        html += `
            <div class="card noteCard my-3" style="width: 275px; margin-right: 2rem; margin-bottom: 3rem; background-color:#c8f57c; border-color:transparent">
                <div class="card-body">
                    <h4 class="card-title">${element.title}</h4>
                    <p class="card-text"> ${element.text}</p>
                    <button id="${index}" onClick="deleteNote(this.id)" class="btn btn-sm btn-outline-success">Forget this.</button>
                </div>
            </div>
            `;
    });

    let notesElm = document.getElementById('notes');
    if(notesObj.length != 0)
    {
        notesElm.innerHTML = html;
    }
    else{
        notesElm.innerHTML = `This is your safe space, feel free to write and connect to your inner self and its complaints and gratitude. You got this!`;
    }
}


// function to delete note
function deleteNote(index)
{
    let notes = localStorage.getItem("notes");

    if(notes == null) 
    {
        notesObj = [];
    }
    else
    {
        notesObj = JSON.parse(notes);
    }

    notesObj.splice(index, 1);

    localStorage.setItem("notes", JSON.stringify(notesObj));

    showNotes();
}


// search functionality 
let search = document.getElementById('searchTxt');
searchTxt.addEventListener("input", function() {
    let inputVal = search.value.toLowerCase();
    let noteCards = document.getElementsByClassName('noteCard');
    Array.from(noteCards).forEach(function(element) {
        let cardTxt = element.getElementsByTagName("p")[0].innerText;
        if(cardTxt.includes(inputVal))
        {
            element.style.display = "block";
        }
        else
        {
            element.style.display = "none";
        }
    })
})


//speech to text api
var speechRecognition=window.SpeechRecognition || window.webkitSpeechRecognition
var recognition=new speechRecognition()
var textbox=$("#addTxt")
var instructions=$("#instructions")
var playbutton=$("#start-btn")
var content=''
recognition.continuous=true

//recognition is started
recognition.onstart=function(){
    instructions.text("Voice recogntion is on")
  playbutton.text("Listening...")

}
recognition.onspeechend=function(){
    instructions.text("Press above button to convert your speech to text.")
    playbutton.text("Listen Again")
}
recognition.onresult=function(event){
    var current=event.resultIndex;
    var transcript=event.results[current][0].transcript
    content+=transcript
    textbox.val(content)
}
$("#start-btn").click(function(event){
    if(content.length){
        content+=''
    }
    recognition.start()
})
