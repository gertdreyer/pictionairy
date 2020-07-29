import Player from "./player.js";
import Word from "./word.js";

export default class Game {
    MIN_PLAYERS = 2;        // Const variable for minimum number of players allowed
    MAX_PLAYERS = 4;        // Const variable for maximum number of players allowed
    MAX_ROUND_NUMBER = 3;   // Const variable for maximum number of rounds allowed

    constructor(gameId, state) {
            this.gameId = gameId;                                                            // Used to identify the specific game
            this.difficultyLevel = state === undefined ? 0 : state.difficultyLevel;         // unused variable for now will use the round number for difficulty indication
            this.gameEnded = state === undefined ? false : state.gameEnded;                 // Bool if the game has ended
            this.roundEnded = state === undefined ? false : state.roundEnded;               // Bool if the round has ended
            this.roundNumber = state === undefined ? 0 : state.roundNumber;                 // Tracker for current round
            this.currentWord = state === undefined ? "" : state.currentWord;                // Current turns word
            this.currentPlayer = state === undefined ?                                      // Current player drawing
                null : state.currentPlayer !== null ? 
                new Player(
                    state.currentPlayer.playerUID, 
                    state.currentPlayer.playerName, 
                    state.currentPlayer) : null;      
            this.players = [];                                                              // List of current active players
            if(state !== undefined)
                state.players.forEach(player => this.players.push(new Player(player.playerUID, player.playerName, player)));
            this.maxTime = state === undefined ? 60 : state.maxTime;                        // Maximum time allowed to calculating points
            this.wordGenerator = state === undefined ? new Word() :                         // Instance of Word class used to generate words for the game
                new Word(state.wordGenerator);                      
            this.hostId = state === undefined ? "" : state.hostId;                          // UID of user hosting game session
            this.lastGuess = state === undefined ? {
                playerUID: "",
                guessMade: ""
            } : state.lastGuess;                     // Last guess made by a player

            this.turnStartTime = state === undefined ? null : state.turnStartTime;
    }

    /**
     * @description Returns the player whose turn it is to draw
     * @returns currentPlayer: Player
     * @memberof Game
     */
    getDrawer() {
        if (this.currentPlayer != null)
            return this.currentPlayer.getPlayerUID();
        else return null;
    }
    /**
     * @description Returns the roundStatus
     * @returns roundEnded
     * @memberof Game
     */
    getRoundEnded()
    {
        return this.roundEnded;

    }
    
    /**
     * @description Set the round status
     * @memberof Game
     */
    setRoundEnded(status)
    {
        this.roundEnded = status;

    }

    /**
     * @description Returns the game ID of the curretn game
     * @returns gameId
     * @memberof Game
     */
    getGameId() {
        return this.gameId;
    }

    /**
     * @description Returns the current round number
     * @returns roundNumber: number
     * @memberof Game
     */
    getRoundNumber() {
        return this.roundNumber;
    }

    /**
     * @description Returns whether or not the game has ended
     * @returns gameEnded: bool
     * @memberof Game
     */
    getGameEndedStatus() {
        return this.gameEnded;
    }

    /**
     * @description Returns the current round's word
     * @returns currentWord: Word
     * @memberof Game
     */
    getWord() {
        return this.currentWord;
    }

    /**
     * @description Sets the correct word for the current turn
     * @param {string} word
     */
    setWord(newWord) {
        this.currentWord = newWord;
        this.turnStartTime = new Date();
    }

    /**
     * @description Adds a new player to the game
     * @param {string} uid
     * @param {string} name
     * @returns bool whether player was added or not
     * @memberof Game
     */
    addPlayer(uid, name) {
        if (this.players.length < this.MAX_PLAYERS) {
            let newPlayer = new Player(uid, name);
            if (this.players.some((player) => player.getPlayerUID() == uid)) {
                return false;
            } else {
                this.players.push(newPlayer);
                return true;
            }
        }
        return false;
    }

    /**
     * @description Return the current players in the game
     * @returns players: array
     */
    getPlayers() {
        return this.players;
    }

    /**
     * @description Returns a Player object corresponding to the given UID
     * @param {string} uid
     * @returns The Player object corresponding with the UID if found, null otherwise
     */
    getPlayerByUID(uid) {
        let players = this.players.filter(
            (player) => player.getPlayerUID == uid
        );
        return players.length == 0 ? null : players[0];
    }

    /**
     * @description Checks to see if the round has ended
     * @returns roundEnded: number
     * @memberof Game
     */
    checkRoundEndStatus() {
        this.roundEnded =
            this.roundNumber == 0
                ? false
                : this.players.filter(
                      (player) => player.getDrawTurnCount == this.roundNumber
                  ).length == this.players.length;
        return this.roundEnded;
    }

    generateWords() {
        return this.wordGenerator.getWords(this.roundNumber);
    }

    /**
     * @description Updates the involved underlying models to reflect the game state properly upon guessing what has been drawn
     * @param {string} uid
     * @param {string} guess
     * @param {number} time
     * @returns bool determining whether or not the guess was correct
     */
    submitGuess(uid, guess) {
        if (this.currentWord == "")
            throw("Word not chosen yet");

        let player = this.getPlayerByUID(uid);
        let time = parseInt(((new Date()) - this.turnStartTime) / 1000);

        if (time > this.maxTime)
            throw("Time expired.");

        if (uid === this.currentPlayer.getPlayerUID())
            throw("Current drawer can't guess");
        
        this.lastGuess = {
            playerUID: uid,
            guessMade: guess
        };

        if (player == null) return false;

        player.addGuess(guess, guess == this.currentWord);

        if (guess == this.currentWord) {
            player.setPlayerPoints(player.getPlayerPoints() + time / 2);
            this.currentPlayer.setPlayerPoints(
                this.currentPlayer.getPlayerPoints() + time
            );
            if(this.checkRoundEndStatus()){
                this.startNewRound();
            }else{
                this.startNewTurn();
            }
            return true;
        } else {
            player.setPlayerPoints(
                player.getPlayerPoints() > 0 ? player.getPlayerPoints() - 1 : 0
            );
            return false;
        }
    }
    /**
     * @description Starts new turn in a given round
     * @returns bool for turn started
     */
    startNewTurn() {
        this.currentWord = "";
        let playersToDraw = this.players.filter(
            (player) => player.getDrawTurnCount() != this.roundNumber
        );
        if (playersToDraw.length != 0) {
            this.currentPlayer = playersToDraw[0];
            this.currentPlayer.incrementDrawTurnCount();
            this.players.forEach((player) => player.clearGuesses());
            return true;
        }
        return false;
    }
    /**
     * @description Starts new Round in a given round
     * @returns bool for turn started
     */
    startNewRound() {
        if (!this.checkGameReadiness()) return false;
        if (this.roundNumber < this.MAX_ROUND_NUMBER) {
            this.roundNumber++;
            this.roundEnded = false;
            return this.startNewTurn();
        }else{
            this.gameEnded = true;
            return false;
        }
    }

    /**
     * @description Checks whether all players have connected controllers
     * @returns bool for turn started
     */
    checkGameReadiness()
    {
        if(this.gameEnded) return false;
        if(this.players.length < this.MIN_PLAYERS){
            return false;
        }
        return this.players.filter((player) => {
            return player.controller == "";
        }).length == 0;
    }
}
