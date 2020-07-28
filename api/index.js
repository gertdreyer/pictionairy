const express = require('express')
const app = express()
var server = app.listen(3000)
var io = require('socket.io')(server);
const socketioJwt = require('socketio-jwt');
const { v4: uuidv4 } = require('uuid');
const port = 3000;

const db = require('./db');

app.use(express.static('public'))
app.use(express.json());
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.post('/newSession', (req, res) => {
    if (!!req.body.userId) {
        let session = uuidv4();
        res.json({ "sessionId": session })
        //TODO: Firebase
    } else {
        res.json({ error: "Missing userId" })
    }
})

app.post('/join', (req, res) => {
    if (!!req.body.userId && !!req.body.sessionId) {
        // Mock method
        res.json({ joined: true })
    } else {
        res.json({ joined: false, error: "Missing sessionId or userId" })
    }

    //joinAsUser (session_id, user_id) return bool
    //join as viewer
    //Ensure that once the game is started this function always returns false for this session id
    // joinAsDevice (session_id, user_id) return bool
    //join as device
    //Ensure that once the game is started this function always returns false for this session id
})

app.post('/startGame', (req, res) => {
    if (!!req.body.userId && !!req.body.sessionId) {
        res.json({ started: true });
    } else {
        res.json({ started: false, error: "Missing sessionId or userId" })
    }
    //startGame (session_id) return bool
    //Set round to 0
    //Make sure that all users have both viewing and drawing devices
})

app.post('/guess', (req, res) => {
    if (!!req.body.userId && !!req.body.sessionId && !!req.body.guess) {
        //GE integration
        res.json({ correct: true })
    } else {
        res.json({ correct: false, error: "Missing sessionId or userId of guess" })
    }
})

io.use(socketioJwt.authorize({
    secret: 'verysecretkey',
    handshake: true
}));

io.on('connection', (socket) => {
    console.log('hello!', socket.decoded_token.name);
});

io.on('connection', (socket) => {
    console.log('a user connected');
});


io.on('disconnect', (socket) => {
    console.log('user disconnected');
});

//   io.on('connection', (socket) => {
//     socket.on('chat message', (msg) => {
//       console.log('message: ' + msg);
//     });
//   });
