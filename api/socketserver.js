import socketioJwt from 'socketio-jwt';
import Game from "./server/game-engine/game.js";
import { GameState, User } from "./db.js";
const JWTSECRET = process.env.JWT_SECRET || "this-should-be-some-super-secret-key";


// Generate UID used for gameid... 
function generateGameId(){
    return Math.round(new Date().getTime()/100).toString().slice(4)   
} 

// Added layer of abstraction... Future implementations
// can change the get procedure.
async function getGameState(gameid) {
    console.log(gameid);
    let { gamestate } = await GameState.findOne({ gameid });
    console.log(gamestate);
    return new Game(gameid, gamestate);
}

// Abstraction Layer 
async function updateGameState(updated_gamestate) {
    try {
        var result = await GameState.updateOne(
            { gameid: updated_gamestate.gameId },
            {
                gamestate: updated_gamestate
            },
        );
    } catch (error) {
        console.log("Error SHT420");
        console.log(error);
    }
}

/**
 OrganizationModel.update(
     {name: 'Koka'}, 
    {'address.street': 'new street name'}, 
    callback);
 
 */

/**Broadcast GameState
 * Broadcasts GameState to clients without the current word or word generator
 */
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
            let gameid = generateGameId();
            socket.leaveAll(); //leave all rooms

            // Create Game Object
            let gamestate = new Game(gameid);
            // add player
            gamestate.addPlayer(username, name);
            gamestate.hostId = username;

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
                socket.emit("error", { error: "Error while creating game" });
            }
            //reply with public gamestate
        });



        socket.on('joingame', async (obj) => {
            try {
                //devicetype = {controller , client}
                let { gameid, devicetype } = obj;
                if (!(devicetype == 'controller' || devicetype == 'client')) {
                    throw "Incorrect device type"
                }
                // Find the current game state
                let gamestate = await getGameState(gameid);
                console.log(gamestate)

                //ensure only one socket room and join
                socket.leaveAll();
                socket.join(gameid);

                if (devicetype == "controller") {
                    // add controller to username
                    let tmp = gamestate.getPlayerByUID(username);
                    if (tmp == null) {
                        throw "Cant find this user to add his controller.";
                    } else {
                        tmp.controller = socket.id;
                    }
                    console.log("Players at this point: -");
                    console.log(gamestate.players);
                }
                else {
                    // Add Player
                    gamestate.addPlayer(username, name)
                }


                //Save gamestate again
                await updateGameState(gamestate);

                //Reply and send to entire room.
                broadcastGameState(socket, gamestate);
            } catch (err) {
                console.log(err);
                socket.emit("error", { error: err })
            }
        });

        socket.on('startnewround', async () => {
            let gameid = Object.keys(socket.rooms).filter(item => item != socket.id)[0];
            // Get game state
            if (!!gameid) {
                let gamestate = await getGameState(gameid);

                // Host check            
                if (username == gamestate.hostId) {
                    //only starts game if everyone has a controller connected
                    gamestate.startNewRound()
                    console.log("startgame in room", gameid);
                    await updateGameState(gamestate);
                    broadcastGameState(socket, gamestate)
                } else {
                    socket.emit("error", { error: "You are not the host" });
                }
            }
        });

        socket.on('startnewturn', async () => {
            let gameid = Object.keys(socket.rooms).filter(item => item != socket.id)[0];
            // Get game state
            let gamestate = await getGameState(gameid);
            if (username == gamestate.currentPlayer) {
                gamestate.startNewTurn();
                await updateGameState(gamestate);
                broadcastGameState(gamestate);
            }
        });
        socket.on('getwordoptions', async (dataobj) => {
            let gameid = Object.keys(socket.rooms).filter(item => item != socket.id)[0];
            let gamestate = await getGameState(gameid);
            if (username == gamestate.currentPlayer.playerUID) {
                let wordopts = await gamestate.generateWords(gamestate.roundNumber);
                socket.emit('wordoptions', { options: wordopts })
            } else {
                socket.emit('error', { error: "You are not the drawing user" })
            }
        });

        socket.on('makechoice', async (dataobj) => {
            let { choice } = dataobj;
            let gameid = Object.keys(socket.rooms).filter(item => item != socket.id)[0];
            console.log("makechoice", choice);
            let gamestate = await getGameState(gameid);
            if (username == gamestate.currentPlayplayerUID) {
                gamestate.setWord(choice);
                await updateGameState(gamestate);
                broadcastGameState(socket, gamestate);
            } else {
                socket.emit('error', { error: "You are not the drawing user" })
            }
        });

        socket.on('guess', async (dataobj) => {
            let gameid = Object.keys(socket.rooms).filter(item => item != socket.id)[0];
            let { guess } = dataobj;
            try {
                console.log("guess: ");
                console.log(guess);
                let gamestate = await getGameState(gameid);
                let correct = gamestate.submitGuess(username, guess);
                await updateGameState(gamestate);
                broadcastGameState(socket, gamestate);
            } catch (error) {
                console.log(error);
                socket.emit('error', { error })
            }
        });
        socket.on('getgamestate', async () => {
            let gameid = Object.keys(socket.rooms).filter(item => item != socket.id)[0];
            try {
                let gamestate = await getGameState(gameid);
                socket.emit('gamestate', gamestate);
            } catch (err) {
                socket.emit('error', { error: "Could not retrieve gamestate" })
            }
        });
        socket.on('drawdata', async (data) => {
            let gameid = Object.keys(socket.rooms).filter(item => item != socket.id)[0];
            // Check that the person SHOULD be drawing.            
            // Emit draw data to everyone             
            // console.log(gameid);
            socket.to(gameid).emit("drawdata", data);
            // console.log("drawdata", data);
        });

        socket.on('timerexpired', async ()=> {
            let gameid = Object.keys(socket.rooms).filter(item => item != socket.id)[0];
            try {
                let gamestate = await getGameState(gameid);
                gamestate.startNewRoundOrTurn();
                await updateGameState(gamestate);
                broadcastGameState(gamestate);
            }catch (err) {
                socket.emit("error", err)
            }
        })

        /// DUMMY ENDPOINTS DONT DELETE
        socket.on('testing', async (event) => {
            socket.emit("testing", event)
            console.log(event);
        });

        socket.on('jointestroom', async (event) => {
            console.log("joined test")
            socket.leaveAll();
            socket.join('test');
        });

        socket.on('broadcast', async (event) => {
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