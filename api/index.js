const express = require('express')
const app = express()
const bcrypt = require('bcrypt');
var server = app.listen(3000)
var io = require('socket.io')(server);
const jwt = require("jsonwebtoken")
const socketioJwt = require('socketio-jwt');
const { v4: uuidv4 } = require('uuid');
const port = 3000;
const saltRounds = 10;

const mongoose = require('mongoose');
const db_link = process.env.DB_HOST || "mongodb://vacweekapi.gdza.xyz:27017/db_test";

const JWTSECRET = process.env.JWTSECRET || "this-should-be-some-super-secret-key";

mongoose.connect(db_link, (err) => {
    if (err)
        console.log("Error");
    else
        console.log("Db Success");
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log("DB connected")
});

const UserSchema = new mongoose.Schema({
    username: String,
    passwordHash: String,
    previousGames: Object
})

const User = mongoose.model('User', UserSchema)


app.use(express.static('public'))
app.use(express.json());
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});


/// Registration Endpoint
app.post('/register', async (req, res) => {
    try {
        if (!!req.body.username && !!req.body.password) {
            // Register new User...
            if (await User.exists({ username: req.body.username })) {
                console.log("Existing User")
                res.json({ error: "Username already exists" })
            } else {
                bcrypt.hash(req.body.password, saltRounds, async function (err, hash) {
                    // Store hash in your password DB.
                    const user = new User({
                        username: req.body.username,
                        passwordHash: hash,
                        previousGames: {},
                    });

                    try {
                        const newUser = await user.save();
                        return res.status(200).json({ success: true });
                    }
                    catch (err) {
                        return res.status(500).json({ error: "This shouldn't happen: DB error" })
                    }
                    // Need....
                });
            }
        }
    } catch (err) {
        return res.json({ error: "body not defined..." })
    }
});


/// Authentication Endpoint
app.post('/auth', async (req, res) => {
    if (!!req.body.username && !!req.body.password) {
        // Load hash from your password DB.
        let user;
        try {
            user = await User.findOne({ username: req.body.username });
            if (user == null) {
                return res.json({ jwt: null, error: "Username and/or Password is not associated with an account (Err-FCK-210)" });
            }

            let hash = user.passwordHash;
            bcrypt.compare(req.body.password, hash, (err, result) => {
                // result == true
                console.log(JSON.parse(JSON.stringify(user)));
                if (result) {
                    delete user.passwordHash;
                    return res.json({ jwt: jwt.sign({ username: user.username }, JWTSECRET, { expiresIn: "2 days" }) });
                } else {
                    return res.json({ jwt: null, error: "Username and/or Password is not associated with an account (Err-222)" });
                }
            });
        } catch (err) {
            return res.status(500).json({ error: err.msg });
        }
    }
});

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
        socket.emit("roomid", { roomid: roomid }); //reply with roomid
        socket.join(roomid);
    });
    socket.on('joinroom', (roomid) => {
        console.log("joinroom", roomid);
        socket.leaveAll(); //ensure only one room
        socket.join(roomid)
        socket.emit("joinroom", { roomid: roomid, joined: true })
    });
    socket.on('startgame', () => {
        console.log("startgame in room", roomid);
        socket.to(roomid).emit("startgame", { started: true })
    });
    socket.on('drawdata', (data) => {
        socket.to(roomid).emit(data);
        console.log("drawdata")
    });
    socket.on('guess', (guess) => {
        console.log("guess");
        socket.to(roomid).emit({ username: "user", guess: "someguess", correct: false });
    });

    socket.on('newround', () => {
        socket.to(roomid).emit({ newround: true })

    });

    socket.on('startround', (chosenword) => {
        console.log(chosenword)
    });

    socket.on('testing', (event) => {
        socket.emit("testing", event)
        console.log(event);
    });
    socket.on('broadcast', (event) => {
        socket.to(roomid).emit({ success: true })
    }
    )
});


io.on('disconnect', (socket) => {
    console.log('user disconnected');
});
