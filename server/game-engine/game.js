import Player from './player.js';
<<<<<<< HEAD
import Word from './word.js';
=======
 import Word from './word.js';
>>>>>>> a8491b47b783eb4dda567c86de37720b581b2dd2

export default class Game {
    MIN_PLAYERS = 2;                        // Const variable for minimum number of players allowed 
    MAX_PLAYERS = 4;                        // Const variable for maximum number of players allowed

    constructor(gameId) {
        this.gameId = gameId;               // Used to identify the specific game
        this.difficultyLevel = 0;           // unused variable for now will use the round number for difficulty indication
        this.gameEnded = false;             // Bool if the game has ended
        this.roundEnded = false;            // Bool if the round has ended
        this.roundNumber = 1;               // Tracker for current round
        this.currentWord = "";              // Current turns word
        this.currentPlayer = null;          // Current drawer of the turn
        this.players = [];                  // List of current active players
        this.maxTime = 60;                  // Maximum time allowed to calculating points
<<<<<<< HEAD
        this.wordGenerator = new Word();    // Instance of Word class used to generate words for the game
=======
         this.wordGenerator = new Word();    // Instance of Word class used to generate words for the game
>>>>>>> a8491b47b783eb4dda567c86de37720b581b2dd2
    }

    /**
     * @description Returns the player whose turn it is to draw
     * @returns currentPlayer: Player
     * @memberof Game
     */
    getDrawer() {
        if (this.currentPlayer != null)
            return this.currentPlayer.getPlayerUID();
        else
            return null;
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
            let newPlayer = new Player(uid, name);
            if (this.players.some(player=>player.getPlayerUID() == uid)) {
                return false;                
            }
            else {
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
    getPlayers(){
        return this.players;
    }
    
    /**
     * @description Checks to see if the round has ended
     * @return roundEnded: number
     * @memberof Game
     */
    checkRoundEndStatus() {
        return this.roundEnded;
    }

    async generateWords(){
        return await this.wordGenerator.getWords(this.roundNumber);
    }
}