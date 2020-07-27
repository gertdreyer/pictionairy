function init(){
    var canvas = document.getElementById("Drawing");
    var ctx = canvas.getContext("2d");
    ctx.fillStyle = "green";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

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
function clearGuesses(){
    document.getElementById("guesses").innerHTML = 'Your Guesses Are Here:&#13;&#10;';
}

function clearPlayers(){
    document.getElementById('players').innerHTML += 'Players:&#13;&#10;';
}

function updateTimer(time){
    document.getElementById('timer').innerHTML = time;
}