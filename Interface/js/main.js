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