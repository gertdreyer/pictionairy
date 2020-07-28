// const { start } = require("repl");

const FULL_DASH_ARRAY = 283;
const WARNING_THRESHOLD = 30;
const ALERT_THRESHOLD = 10;

const COLOR_CODES = {
  info: {
    color: "green"
  },
  warning: {
    color: "orange",
    threshold: WARNING_THRESHOLD
  },
  alert: {
    color: "red",
    threshold: ALERT_THRESHOLD
  }
};

const TIME_LIMIT = 60;
let timePassed = 0;
let timeLeft = TIME_LIMIT;
let timerInterval = null;
let remainingPathColor = COLOR_CODES.info.color;

// startTimer();
let chooseTimer;


function onTimesUp() {
  clearInterval(timerInterval);
  disable();
}

function startTimer() {
  timerInterval = setInterval(() => {
    timePassed = timePassed += 1;
    timeLeft = TIME_LIMIT - timePassed;
    document.getElementById("base-timer-label").innerHTML = formatTime(
      timeLeft
    );
    setCircleDasharray();
    setRemainingPathColor(timeLeft);

    if (timeLeft === 0) {
      onTimesUp();
    }
  }, 1000);
}

function formatTime(time) {
  const minutes = Math.floor(time / 60);
  let seconds = time % 60;

  if (seconds < 10) {
    seconds = `0${seconds}`;
  }

  return `${minutes}:${seconds}`;
}

function setRemainingPathColor(timeLeft) {
  const { alert, warning, info } = COLOR_CODES;
  if (timeLeft <= alert.threshold) {
    document
      .getElementById("base-timer-path-remaining")
      .classList.remove(warning.color);
    document
      .getElementById("base-timer-path-remaining")
      .classList.add(alert.color);
  } else if (timeLeft <= warning.threshold) {
    document
      .getElementById("base-timer-path-remaining")
      .classList.remove(info.color);
    document
      .getElementById("base-timer-path-remaining")
      .classList.add(warning.color);
  } else{
    document
      .getElementById("base-timer-path-remaining")
      .classList.add(info.color);
  }
}

function calculateTimeFraction() {
  const rawTimeFraction = timeLeft / TIME_LIMIT;
  return rawTimeFraction - (1 / TIME_LIMIT) * (1 - rawTimeFraction);
}

function setCircleDasharray() {
  const circleDasharray = `${(
    calculateTimeFraction() * FULL_DASH_ARRAY
  ).toFixed(0)} 283`;
  document
    .getElementById("base-timer-path-remaining")
    .setAttribute("stroke-dasharray", circleDasharray);
}

function disable() {
  document.getElementById("disableOverlay").style.display = "block";
}

function enable() {
  document.getElementById("disableOverlay").style.display = "none";
}

function openChoose() {
  document.getElementById("chooseOverlay").style.display = "block";
}

function closeChoose() {
  document.getElementById("chooseOverlay").style.display = "none";
}

function navBar() {
  var x = document.getElementById("myTopnav");
  if (x.className === "topnav") {
    x.className += " responsive";
  } else {
    x.className = "topnav";
  }
}

function choseOption(id){
  clearInterval(chooseTimer);
  document.getElementById('chosenWord').innerHTML = document.getElementById(id).innerHTML;
  if(id === 'choice-1'){
  
  }else if(id === 'choice-2'){

  }else{

  }
  closeChoose();
  startDrawing();
}

function leaveGame(){
  window.location.href = './../index.html';
}

function logout(){
  localStorage.removeItem('token');
  leaveGame();
}

function startFullRound(){
  enable();
  startChosing();
  // startDrawing();
}

function startDrawing(){
  //start timer, on timer end, disable buttons and whatever
  startTimer();
}

function startChosing(){
  //create overlay, fill buttons, start timer, randomly chose after time, then close overlay
  openChoose();
  document.getElementById('choice-1').innerHTML = 'choice-1';
  document.getElementById('choice-2').innerHTML = 'choice-2';
  document.getElementById('choice-3').innerHTML = 'choice-3';
  var choosingTime = 10;
  chooseTimer = setInterval(function(){
    choosingTime--;
    document.getElementById('chooseTimer').innerHTML =choosingTime;
    if(choosingTime==0){
      var random = Math.floor(Math.random() * 3)+1;
      if(random == '1'){
        choseOption("choice-1")
      }else if(random == '2'){
        choseOption("choice-2")
      }else{
        choseOption("choice-3")
      }
    }
    
  },1000);
}
function sendOption(){
  //use this function to send data to server
}

function canvasDraw(){

}

function canvasClear(){

}