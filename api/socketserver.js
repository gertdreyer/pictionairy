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
    return new Game(gameid, gamestate);
}

// Abstraction Layer 
async function updateGameState(updated_gamestate) {
    GameState.updateOne(
        { gameid: updated_gamestate.gameid },
        // New Fields..
        {
            gamestate: updateGameState
        },
    );
}

/**
 OrganizationModel.update(
     {name: 'Koka'}, 
    {'address.street': 'new street name'}, 
    callback);
 
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
            let gameid = uuidv4(); //use shorter
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
                    gamestate.getPlayerByUID(username).controller = socket.id;
                }
                else {
                    // Add Player
                    gamestate.addPlayer(username, name)
                }


                //Save gamestate again
                updateGameState(gamestate);

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
                    if (gamestate.checkControllers()) { // changed from true
                        gamestate.startNewRound()
                        console.log("startgame in room", gameid);
                        updateGameState(gamestate);
                        broadcastGameState(socket, gamestate)
                    } else {
                        broadcastGameState(socket, gamestate)
                    }
                    // Check that each player has an assigned controller.game

                }
            }
        });

        socket.on('startnewturn', async () => {
            let gameid = Object.keys(socket.rooms).filter(item => item != socket.id)[0];
            // Get game state
            let gamestate = await getGameState(gameid);
            if (username == gamestate.currentPlayer) {
                gamestate.startNewTurn();
                updateGameState(gamestate);
                broadcastGameState(gamestate);
            }
        });
        socket.on('getwordoptions', async (dataobj) => {
            let gamestate = await getGameState(gameid);
            if (username = gamestate.currentPlayer){
                wordopts = await gamestate.generateWords(gamestate.roundNumber);
                socket.emit('wordoptions', {options: wordopts})
            }else{
                socket.emit('error', {error: "You are not the drawing user"})
            }
        });

        socket.on('makechoice', async (dataobj) => {
            let { choice } = dataobj;
            let gamestate = await getGameState(gameid);
            if (username = gamestate.currentPlayer){
                gamestate.setWord(choice);
                updateGameState(gamestate);
            }else{
                socket.emit('error', {error: "You are not the drawing user"})
            }
        });

        socket.on('guess', async (dataobj) => {
            let gameid = Object.keys(socket.rooms).filter(item => item != socket.id)[0];
            let { guess } = dataobj;
            try {
                console.log("guess");
                let gamestate = await getGameState(gameid);
                let correct = gamestate.submitGuess(username, guess);
                updateGameState(gamestate);
                broadcastGameState(socket, gamestate);
            } catch (error) {
                console.log(error);
                socket.emit('error', {error})
            }
        });

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

        socket.on('drawdata', async (data) => {
            let gameid = Object.keys(socket.rooms).filter(item => item != socket.id)[0];
            // Check that the person SHOULD be drawing.            
            // Emit draw data to everyone             
            console.log(gameid);
            socket.to(gameid).emit("drawdata", data);
            console.log("drawdata", data);
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