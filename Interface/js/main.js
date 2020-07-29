function init(){
    if(!localStorage.getItem('token')){
        $('#myModal').modal('show');
    }else{
        replaceLogin();
    }
}

function createRoom(){
    //TODO create room and all that
    window.location.href = './html/lobby.html'
}

function joinRoom(){

    // var session_id = $("#joinRoom").val();
    // localStorage.setItem("token", session_id);

    window.location.href = './html/lobby.html'
}

function connectDevice(){
    
    // var session_id = $("#connectDevice").val();

    // localStorage.setItem("token", session_id);

    window.location.href = './html/controller.html'
}

function onJoinRoomText() {
    var text = $("#joinRoom").val();
    if(localStorage.getItem('token'))
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

    //Send data to socket


    //Receive data from server (sucess/fail)
    var object;
    var success = true;
    if(success){
        localStorage.setItem('token',object);
        document.getElementById('createRoom').disabled = false;
        $('#myModal').modal('hide');
        replaceLogin();
    }else{
        alert('Something went wrong in login, please try again');
    }
}

function signup(){
    var email = document.getElementById('emailSignup').value.trim();
    var username = document.getElementById('usernameSignup').value.trim();
    var password = document.getElementById('passwordSignup').value.trim();
    var confirm = document.getElementById('confirmPasswordSignup').value.trim();

    if(password !== confirm){
        alert('Passwords dont match!');
        document.getElementById('passwordSignup').value = '';
        document.getElementById('confirmPasswordSignup').value ='';
        return;
    }

    //Send data to socket


    //Receive data from server (sucess/fail)
    var object;
    var success;
    if(success){
        localStorage.setItem('token',object);
        document.getElementById('createRoom').disabled = false;
        $('#myModal').modal('hide');
        replaceLogin();
    }else{
        alert('Something went wrong in signup, please try again');
    }
}

function replaceLogin(){
    var p = document.getElementById('right');
    p.innerHTML='<a style="float: right;" href="" id=""onclick="logout()">Logout</a>';
    var elem = document.getElementById('loginSignup');
    elem.parentNode.removeChild(elem);
}

function replaceLogout(){
    var p = document.getElementById('right');
    p.innerHTML='<a style="float: right;" href="" id="loginSignup" data-toggle="modal" data-target="#myModal" >Login/Signup</a>';
    var elem = document.getElementById('logout');
    elem.parentNode.removeChild(elem);
}

function logout(){
    localStorage.removeItem('token');
    document.getElementById('createRoom').disabled = true;
    document.getElementById('joinRoom').disabled = true;
}