function createRoom(){
    //TODO create room and all that
    window.location.href = './html/lobby.html'
}

function joinRoom(){

    var session_id = $("#joinRoom").val();
    localStorage.setItem("session_id", session_id);

    window.location.href = './html/lobby.html'
}

function connectDevice(){
    
    var session_id = $("#connectDevice").val();

    localStorage.setItem("session_id", session_id);

    window.location.href = './html/controller.html'
}

function onJoinRoomText() {
    var text = $("#joinRoom").val();

    $("#joinRoomBtn").attr("disabled", (text === ""));
}

function onConnectDeviceText() {
    var text = $("#connectDevice").val();

    $("#connectDeviceBtn").attr("disabled", (text === ""));
}

function navBar() {
    var x = document.getElementById("myTopnav");
    if (x.className === "topnav") {
      x.className += " responsive";
    } else {
      x.className = "topnav";
    }
  }

function openLogin(){
    $('#signupSection').collapse('hide');
    document.getElementById('emailLogin').value = '';
    document.getElementById('passwordLogin').value = '';
}

function openSignup(){
    $('#loginSection').collapse('hide');
    document.getElementById('emailSignup').value = '';
    document.getElementById('usernameSignup').value = '';
    document.getElementById('passwordSignup').value = '';
    document.getElementById('confirmPasswordSignup').value = '';
}

function login(){
    var email = document.getElementById('emailLogin').value.trim();
    var password = document.getElementById('passwordLogin').value.trim();
}

function signup(){
    var email = document.getElementById('emailSignup').value.trim();
    var username = document.getElementById('usernameSignup').value.trim();
    var password = document.getElementById('passwordSignup').value.trim();
    var confirm = document.getElementById('confirmPasswordSignup').value.trim();
}