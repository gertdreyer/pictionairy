const apiAddress = "http://vacweekapi.gdza.xyz/";
var socket;

let fullPath = [];
let penColor = "#cf060a"; 
let canvas;
let ctx;

function init(){

    canvas = document.getElementById("Drawing");
    ctx = canvas.getContext("2d");
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    initServerConnection();

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
        document.getElementById("serverID").innerHTML = '<h3>'+ data.gameId +'</h3>';

        //setting the list of players
        clearPlayers();

        for(i = 0; i < data.players.length; i++) {
            document.getElementById("players").innerHTML += data.players[i].playerUID + '&#13;&#10;';
        }

    });

    //Callback for when there is drawdata
    socket.on("drawdata", function(data) {
        console.log(data);
    });
}

function ng() {
    socket.emit('newgame');    
    alert("Emitted new game");
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


function receiveData(data_in){
    
    // let data_out = [dist[0], dist[1], pen, penColour];
    let dist = [data_in[0], data_in[1]];
    let pen = data_in[2];
    penColor = data_in[3];

    if(pen == true){
        draw(dist);
    }else{
        laser(dist);
    }


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


function laser(dist_data){
  
    if(fullPath.length != 0)
    {
       draw(dist_data);
    }else{
     ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  
    let x = dist_data[0] + window.innerWidth/2;
    let y = dist_data[1] + window.innerHeight/2;
  
    ctx.beginPath();
    ctx.arc(x, y, 20, 0, 2 * Math.PI);
    ctx.fillStyle = penColor;
    ctx.fill();
    ctx.closePath(); 
    
    
     
  }
  
function draw(dist_data){
    //Add new Coordinates to path only if current action is to draw
    //Else it is laser() calling draw and therefore the new coordinates should not be added to the draw path
    if(pen)
    {
      fullPath.push( [dist_data[0], dist_data[1], penColor] );
    }
    
    
    //Clear Canvas and Set Pen Size
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.lineWidth = 7;
    
    //Flag for start new Path  ( Pen Lift Indicator -> [-9999, -9999] )
    let breakPath = false;
  
    //Start Drawing Path
    ctx.beginPath();
    let x = fullPath[0][0] + window.innerWidth/2;
    let y = fullPath[0][1] + window.innerHeight/2;
    ctx.moveTo(x, y);
  
    for(var i =1  ; i < fullPath.length; i++){
        //Test for Pen Lifted
        if(fullPath[i][0] != -9999 && fullPath[i][1] != -9999) 
        {
            //Setup pen Color for the specific line
            ctx.strokeStyle = fullPath[i][2];

            if(breakPath)
            {
                //Pen was Lifted -> Start of new Path
                ctx.beginPath();
                let x = fullPath[i][0] + window.innerWidth/2;
                let y = fullPath[i][1] + window.innerHeight/2;
                ctx.moveTo(x, y);
            }else{
                //Pen not Lifted -> Continue current path
                x = fullPath[i][0] + window.innerWidth/2;
                y = fullPath[i][1] + window.innerHeight/2;
                ctx.lineTo(x, y);
            }

            //reset breakPath
            breakPath= false;
    
        }else{
            //Pen Lifted -> Set Flag & Close current Path
            breakPath = true;
            ctx.stroke();
            ctx.closePath();
        }
       
    }
    
    //Only if last action wasn't a pen penlift -> Close path
    //If last action was penlift -> Path already closed in for loop
    if(!breakPath)
    {
       ctx.stroke();
       ctx.closePath(); 
    }
   
   
  }
function leaveGame(){
    window.location.href = './../index.html';
  }
  
  function logout(){
    localStorage.removeItem('token');
    leaveGame();
  }