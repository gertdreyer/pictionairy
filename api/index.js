import express from 'express'
const app = express()
import bcrypt from 'bcrypt';
var server = app.listen(3000)
var io = require('socket.io')(server);
import jwt from "jsonwebtoken";
import cors from 'cors';
import socketioJwt from 'socketio-jwt';
import { v4 as uuidv4 } from 'uuid';
import mongoose from 'mongoose';
import Game from "../server/game-engine/game.js";
const port = 3000;
const saltRounds = 10;

const db_link = process.env.DB_HOST || "mongodb://vacweekapi.gdza.xyz:27017/db_test";
// const JWTSECRET = process.env.JWT_SECRET || "this-should-be-some-super-secret-key";
const JWTSECRET = "this-should-be-some-super-secret-key";

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

const GameSchema = new mongoose.Schema({
    gameid: String,
    iat: Date,
    gamestate: Object
})

const UserSchema = new mongoose.Schema({
    username: String,
    name: String,
    passwordHash: String,
    previousGames: Object
})

const User = mongoose.model('User', UserSchema);
const GameState = mongoose.model('GameState', GameSchema);

app.use(express.static('public'))
app.use(express.json());
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});
app.options('*', cors())

/// Registration Endpoint
app.post('/register', async (req, res) => {
    try {
        if (!!req.body.username && !!req.body.password && !!req.body.name) {
            // Register new User...
            if (await User.exists({ username: req.body.username })) {
                console.log("Existing User")
                res.json({ error: "Username already exists" })
            } else {
                bcrypt.hash(req.body.password, saltRounds, async function (err, hash) {
                    // Store hash in your password DB.
                    const user = new User({
                        name: req.body.name,
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
    let gameid = Object.keys(socket.rooms).filter(item => item != socket.id)[0];
    let { username, name } = socket.decoded_token;
    console.log(username, " connected");

    socket.on('newgame', async () => {
        console.log(gameid);
        gameid = uuidv4(); //use shorter
        socket.leaveAll(); //leave all rooms

        // Create Game Object
        let gamestate = new Game(gameid);
        // add player
        gamestate.addPlayer(username, name);
        let retobj = { ...gamestate };
        delete retobj.currentWord;
        delete retobj.wordGenerator;

        //join socket room
        socket.join(gameid);

        // Save Game instance
        const newgamestate = new GameState({
            gameid: gameid,
            iat: new Date(),
            gamestate: gamestate,
        });


        try {
            await newgamestate.save();
            socket.emit("gamestate", { gamestate: retobj });
        } catch (err) {
            socket.emit("gamestate", { error: "Error while creating game", gamestate: null });
        }
        //reply with public gamestate
    });



    socket.on('joingame', async (obj) => {
        try {
            let { gameid } = obj;
            console.log(gameid);
            // Find the current game state
            let { gamestate } = await GameState.findOne({ gameid: gameid });

            //ensure only one socket room and join
            socket.leaveAll();
            socket.join(gameid)

            // Add Player
            //TODO: GameEngine needs constructor overload.
            // gamestate.addPlayer(username,name)
            console.log(gamestate);

            socket.to(gameid).emit("gamestate", { gamestate: gamestate })
        } catch (error) {
            console.log(error);
            socket.emit("gamestate", { error: 'Soz...', gamestate: null })
        }
    });


    socket.on('startnewround', () => {
        //Host check
        if (!!gameid) {
            let game = new Game(); 
            game.startNewRound()
            // Check that each player has an assigned controller.game
            console.log("startgame in room", gameid);
            socket.to(gameid).emit("startgame", { started: true })
        }
    });


    socket.on('guess', (guess) => {
        console.log("guess");
        socket.to(gameid).emit({ username: "user", guess: "someguess", correct: false });
    });

    socket.on('newround', () => {
        socket.to(gameid).emit({ newround: true })

    });

    socket.on('startround', (chosenword) => {
        console.log(chosenword)
    });

    socket.on('testing', (event) => {
        socket.emit("testing", event)
        console.log(event);
    });

    socket.on('jointestroom', (event) => {
        socket.join('test');
    })
    socket.on('drawdata', (data) => {
        socket.to(gameid).emit("drawdata", data);
        console.log("drawdata", data);
    });
    socket.on('broadcast', (event) => {
        socket.to(gameid).emit({ success: true })
    }
    )
});

io.on('disconnect', (socket) => {
    console.log('user disconnected');
});
