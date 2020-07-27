import './player';
import './word';

export default class Game {
    MIN_PLAYERS = 2;                // Const variable for minimum number of players allowed 
    MAX_PLAYERS = 4;                // Const variable for maximum number of players allowed

    constructor(gameId) {
        this.gameId = gameId;       // Used to identify the specific game
        this.difficultyLevel = 0;   // unused variable for now will use the round number for difficulty indication
        this.gameEnded = false;     // Bool if the game has ended
        this.roundEnded = false;    // Bool if the round has ended
        this.roundNumber = 1;       // Tracker for current round
        this.currentWord = "";      // Current turns word
        this.currentPlayer = null;  // Current drawer of the turn
        this.players = [];          // List of current active players
        this.maxTime = 60;          // Maximum time allowed to calculating points
    }

    /**
     * @description Returns the player whose turn it is to draw
     * @returns currentPlayer: Player
     * @memberof Game
     */
    getDrawer() {
        return this.currentPlayer.uid;
    }
    
    /**
     * @description Returns the game ID of the curretn game
     * @returns gameId
     * @memberof Game
     */
    getGameId() {
        return this.gameId
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
        //TODO get currentWord from Word
        return this.currentWord;
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
            this.players.push(new Player(uid, name));
            return true;
        }
        return false;
    }

    /**
     * @description Player's guess compared to the word to determine its correctness
     * @param {string} uid
     * @param {string} wordGuess
     * @returns bool
     * @memberof Game
     */
    submitGuess(uid, wordGuess) {
        //TODO if guess is incorrect add to incorrect list in player
        if (this.currentDrawer.uid == uid)
            return wordGuess.toLowerCase() == this.currentWord.toLowerCase();
        return false;
    }

    /**
     * @description This is used to start a new round once all players have had a turn
     * @returns roundNumber: number
     * @memberof Game
     */
    startNewRound() {
        //do whatever when new round starts.
        this.roundEnded = false;
        this.roundNumber++;
        return this.roundNumber;
    }

    /**
     * @description Checks to see if the round has ended
     * @return roundEnded: number
     * @memberof Game
     */
    checkRoundEndStatus() {
        return this.roundEnded;
    }
}