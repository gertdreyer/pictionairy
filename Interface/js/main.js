function createRoom(){
    //TODO create room and all that
    window.location.href = './html/lobby.html'
}

function joinRoom(){

    var session_id = $("#joinServer").val();
    var username = $("#username").val();

    localStorage.setItem("session_id", session_id);
    localStorage.setItem("username", username);

    window.location.href = './html/lobby.html'
}

function connectDevice(){
    
    var session_id = $("#connectDevice").val();
    var username = $("#username").val();

    localStorage.setItem("session_id", session_id);
    localStorage.setItem("username", username);

    window.location.href = './html/controller.html'
}

function hideOthers(self) {

    if (self == "join") {
        $("#connect").collapse('hide');
    } else if (self == "connect") {
        $("#join").collapse('hide');
    }
}