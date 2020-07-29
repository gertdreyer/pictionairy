const apiAddress = "http://vacweekapi.gdza.xyz/";

var socket;

function init(){

    initServerConnection();

    var canvas = document.getElementById("Drawing");
    var ctx = canvas.getContext("2d");
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    //attach listener to guess enter event
    var guess = document.getElementById("guessSubmit");
    guess.addEventListener("keyup", function(event) {
        // Number 13 is the "Enter" key on the keyboard
        if (event.keyCode === 13) {
            // Cancel the default action, if needed
            event.preventDefault();
            guess.value = guess.value.trim();
            if(guess.value !== ''){
                document.getElementById('guesses').innerHTML += '&#13;&#10;'+guess.value;
            }
            guess.value = '';
        }
    });
}

function initServerConnection() {
    socket = io.connect(apiAddress, {
        query: `token=${localStorage.getItem('token')}`
    });

    alert("Connection established");

    var isHost = localStorage.getItem('isHost');

    if (isHost === "true") { //Is the host
        ng();

    } else { //Is not the host
        var room_id = localStorage.getItem('roomId');

        jg(room_id);
    }


    //Callback functions for socket communication

    //Callback for when the gamestate changes
    socket.on("gamestate", function(data) {
        console.log(data);

        //setting the room id
        document.getElementById("serverID").innerHTML = '<h3>'+ data.gamestate.gameId +'</h3>';

        //setting the list of players
        clearPlayers();

        for(i = 0; i < data.gamestate.players.length; i++) {
            document.getElementById("players").innerHTML += data.gamestate.players[i].playerUID + '&#13;&#10;';
        }

    });

    //Callback for when there is drawdata
    socket.on("drawdata", function(data) {
        console.log(data);
    });
}

function ng() {
    socket.emit('newgame');
  }
  
function jg(gameid) {
  socket.emit('joingame', {gameid});
}

function clearGuesses(){
    document.getElementById("guesses").innerHTML = 'Your Guesses Are Here:&#13;&#10;';
}

function clearPlayers(){
    document.getElementById('players').innerHTML = 'Players:&#13;&#10;';
}

function updateTimer(time){
    document.getElementById('timer').innerHTML = time;
}
function navBar() {
    var x = document.getElementById("myTopnav");
    if (x.className === "topnav") {
      x.className += " responsive";
    } else {
      x.className = "topnav";
    }
  }
function submitGuess(){
    var guess = document.getElementById("guessSubmit");
    guess.value = guess.value.trim();
    if(guess.value !== ''){
        document.getElementById('guesses').innerHTML += '&#13;&#10;'+guess.value;
    }
    guess.value = '';

    var canvas = document.getElementById("Drawing");
    alert(canvas.width+' '+canvas.height)
}

function startButtonTemp() {
    socket.emit("drawdata", "Hello world");
    alert("Sent hello world to drawdata");
}


function recieveData(){
        // var drawData; //2d array of x,y positions
    // var currentPixel; // display pos
    // var currentLine; // What is the current line
    // var historyPosition; // Last pixel before stopped drawing
    // var draw_function; //3clear, 2undo, 1draw, 0display
    // var lineEnd; //true/false

    // if (draw_function == 3) {
    //     //clear drawData
    // } else if (draw_function == 2) {

    // } else if (draw_function == 1) {
    //     if (!lineEnd) {
    //         lineEnd = true;
    //         currentLine += 1;
    //     }
    //     drawData[currentPixel] = //append data
    //     currentPixel += 1;
    // }
    // else{
    //     if (lineEnd) {
    //         lineEnd = false;
    //         historyPosition[currentLine] = currentPixel;
    //     }
    //     drawData[currentPixel] = //data
    // }
}

function leaveGame(){
    window.location.href = './../index.html';
  }
  
  function logout(){
    localStorage.removeItem('token');
    leaveGame();
  }