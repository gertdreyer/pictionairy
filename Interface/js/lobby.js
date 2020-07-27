function init(){
    var canvas = document.getElementById("Drawing");
    var ctx = canvas.getContext("2d");
    ctx.fillStyle = "green";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}