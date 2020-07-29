import socketioJwt from 'socketio-jwt';
import { v4 as uuidv4 } from 'uuid';
import Game from "../server/game-engine/game.js";
import { GameState, User } from "./db.js";
const JWTSECRET = process.env.JWT_SECRET || "this-should-be-some-super-secret-key";


// Added layer of abstraction... Future implementations
// can change the get procedure.
async function getGameState(gameid) {
    console.log(gameid);
    let { gamestate } = await GameState.findOne({ gameid });
    return gamestate;
}

// Abstraction Layer 
async function updateGameState(updated_gamestate) {
    let state = await GameState.findOne({ gameid: updated_gamestate.gameId });
    // Update 

}

async function broadcastGameState(socket, gamestate) {
    let retobj = { ...gamestate };
    delete retobj.currentWord;
    delete retobj.wordGenerator;
    broadcast(socket, "gamestate", gamestate.gameId, { ...retobj });
}


function broadcast(socket, listener, gameid, payload) {
    socket.emit(listener, { ...payload });
    socket.to(gameid).emit(listener, { ...payload });
}

exports = module.exports = function (io) {
    io.use(socketioJwt.authorize({
        secret: JWTSECRET,
        handshake: true
    }));

    io.on('connection', (socket) => {
        //gameid is also sockets room id to uncomplicate lookups
        let { username, name } = socket.decoded_token;
        console.log(username, " connected");

        socket.on('newgame', async () => {
            let gameid = uuidv4(); //use shorter
            socket.leaveAll(); //leave all rooms

            // Create Game Object
            let gamestate = new Game(gameid);
            // add player
            gamestate.addPlayer(username, name);

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
                broadcastGameState(socket, gamestate);
            } catch (err) {
                socket.emit("gamestate", { error: "Error while creating game", gamestate: null });
            }
            //reply with public gamestate
        });



        socket.on('joingame', async (obj) => {
            try {
                let { gameid } = obj;
                // Find the current game state
                let gamestate = await getGameState(gameid);
                console.log(gamestate)
                // let game = Game()
                //ensure only one socket room and join
                socket.leaveAll();
                socket.join(gameid);

                // Add Player
                //TODO: GameEngine needs constructor overload.
                // gamestate.addPlayer(username,name)

                //Reply and send to entire room.
                broadcastGameState(socket, gamestate);
            } catch (error) {
                console.log(error);
                socket.emit("gamestate", { error: 'Soz...', gamestate: null })
            }
        });


        socket.on('startnewround', () => {
            let gameid = Object.keys(socket.rooms).filter(item => item != socket.id)[0];
            //Host check
            if (!!gameid) {
                //Todo: pull from db
                let game = new Game();
                game.startNewRound()

                // Check that each player has an assigned controller.game
                console.log("startgame in room", gameid);
                broadcastGameState(socket, gamestate)
            }
        });


        socket.on('guess', async (guess) => {
            let gameid = Object.keys(socket.rooms).filter(item => item != socket.id)[0];
            try {
                console.log("guess");
                let gamestate = await getGameState(gameid);

                //TODO change time!!!
                //TODO: GameEngine needs constructor overload.
                // let correct = gamestate.submitGuess(username, guess, 60);

                broadcastGameState(socket, gamestate);
            } catch (error) {

            }
        });

        /// DUMMY ENDPOINTS DONT DELETE
        socket.on('testing', (event) => {
            socket.emit("testing", event)
            console.log(event);
        });

        socket.on('jointestroom', (event) => {
            console.log("joined test")
            socket.leaveAll();
            socket.join('test');
        });

        socket.on('drawdata', (data) => {
            let gameid = Object.keys(socket.rooms).filter(item => item != socket.id)[0];
            //only to others in room
            console.log(gameid);
            socket.to(gameid).emit("drawdata", data);
            console.log("drawdata", data);
        });

        socket.on('broadcast', (event) => {
            let gameid = Object.keys(socket.rooms).filter(item => item != socket.id)[0];
            socket.emit('broadcast', event);
            socket.to(gameid).emit('broadcast', event)
        }
        )
    });

    io.on('disconnect', (socket) => {
        console.log(socket);
        console.log('user disconnected');
    });
}