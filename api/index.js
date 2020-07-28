const express = require('express')
const app = express()
var server = app.listen(3000)
var io = require('socket.io')(server);
const jwt = require("jsonwebtoken")
const socketioJwt = require('socketio-jwt');
const { v4: uuidv4 } = require('uuid');
const port = 3000;

const mongoose = require('mongoose');
const db_link = "mongodb://vacweekapi.gdza.xyz:27017/db_test";

const JWTSECRET = "this-should-be-some-super-secret-key";

mongoose.connect(db_link, (err) => {
    if (err)
        console.log("Error");
    else
        console.log("Db Success");
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("DB connected")
});

const UserSchema = new mongoose.Schema({
    username: String,
    passwordHash: String,
    previousGames: Object
})

const User = mongoose.model('User',UserSchema)

app.use(express.static('public'))
app.use(express.json());
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.post('/register', (req, res) => {
    if (!!req.body.username && !!req.body.password) {
        return res.json({ registered: true })
    }
});

app.post('/auth', (req, res) => {
    if (!!req.body.username && !!req.body.password) {
        return res.json({ jwt: jwt.sign({ username: "test", name: "NameOfUser" }, JWTSECRET, { expiresIn: "2 days" }) });
    }
});
// #region oldrestapi
// app.post('/newSession', (req, res) => {
//     if (!!req.body.userId) {
//         let session = uuidv4();
//         res.json({ "sessionId": session })
//         //TODO: Firebase
//     } else {
//         res.json({ error: "Missing userId" })
//     }
// })

// app.post('/join', (req, res) => {
//     if (!!req.body.userId && !!req.body.sessionId) {
//         // Mock method
//         res.json({ joined: true })
//     } else {
//         res.json({ joined: false, error: "Missing sessionId or userId" })
//     }

//     //joinAsUser (session_id, user_id) return bool
//     //join as viewer
//     //Ensure that once the game is started this function always returns false for this session id
//     // joinAsDevice (session_id, user_id) return bool
//     //join as device
//     //Ensure that once the game is started this function always returns false for this session id
// })

// app.post('/startGame', (req, res) => {
//     if (!!req.body.userId && !!req.body.sessionId) {
//         res.json({ started: true });
//     } else {
//         res.json({ started: false, error: "Missing sessionId or userId" })
//     }
//     //startGame (session_id) return bool
//     //Set round to 0
//     //Make sure that all users have both viewing and drawing devices
// })

// app.post('/guess', (req, res) => {
//     if (!!req.body.userId && !!req.body.sessionId && !!req.body.guess) {
//         //GE integration
//         res.json({ correct: true })
//     } else {
//         res.json({ correct: false, error: "Missing sessionId or userId of guess" })
//     }
// })

//#endregion
io.use(socketioJwt.authorize({
    secret: JWTSECRET,
    handshake: true
}));

io.on('connection', (socket) => {
    let roomid = Object.keys(socket.rooms).filter(item => item != socket.id)[0];
    console.log('hello!', socket.decoded_token.name);
    socket.on('createroom', () => {
        roomid = uuidv4()
        console.log("createroom", roomid);
        socket.leaveAll(); //leave all rooms
        socket.emit("roomid",{roomid: roomid}); //reply with roomid
        socket.join(roomid);
    });
    socket.on('joinroom', (roomid) => {
        console.log("joinroom", roomid);
        socket.leaveAll(); //ensure only one room
        socket.join(roomid)
        socket.emit("joinroom", {roomid: roomid, joined: true})
    });
    socket.on('startgame', () => {
        console.log("startgame in room", roomid);
        socket.to(roomid).emit("startgame", {started: true})
    });
    socket.on('drawdata', (data) => {
        socket.to(roomid).emit(data);
        console.log("drawdata")
    });
    socket.on('guess', (guess) => {
        console.log("guess");
        socket.to(roomid).emit({username: "user",guess: "someguess", correct: false});
    });

    socket.on('newround', ()=> {
        socket.to(roomid).emit({newround: true})
        
    });

    socket.on('startround', (chosenword)=> {
        console.log(chosenword)
    });

    socket.on('testing', (event)=> {
        socket.emit("testing", event)
        console.log(event);
    });    
    socket.on('broadcast', (event)=> {
        socket.to(roomid).emit({success:true})
    }
    )
});


io.on('disconnect', (socket) => {
    console.log('user disconnected');
});

//   io.on('connection', (socket) => {
//     socket.on('chat message', (msg) => {
//       console.log('message: ' + msg);
//     });
//   });
