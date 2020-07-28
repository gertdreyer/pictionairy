import Player from './player.js';
 import Word from './word.js';

export default class Game {
    MIN_PLAYERS = 2;                            // Const variable for minimum number of players allowed 
    MAX_PLAYERS = 4;                            // Const variable for maximum number of players allowed
    MAX_ROUND_NUMBER = 3;

    constructor(gameId) {
        this.gameId = gameId;                   // Used to identify the specific game
        this.difficultyLevel = 0;               // unused variable for now will use the round number for difficulty indication
        this.gameEnded = false;                 // Bool if the game has ended
        this.roundEnded = false;                // Bool if the round has ended
        this.roundNumber = 0;                   // Tracker for current round
        this.currentWord = "";                  // Current turns word
        this.currentPlayer = null;              // Current drawer of the turn
        this.players = [];                      // List of current active players
        this.maxTime = 60;                      // Maximum time allowed to calculating points
        this.wordGenerator = new Word();        // Instance of Word class used to generate words for the game
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
     * @description Sets the correct word for the current turn
     * @param {string} word 
     */
    setWord(newWord){
        this.word = newWord;
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
     * @description Returns a Player object corresponding to the given UID
     * @param {string} uid 
     * @returns The Player object corresponding with the UID if found, null otherwise
     */
    getPlayerByUID(uid){
        let players = this.players.filter(player => player.getPlayerUID == uid);
        return players.length == 0 ? null : players[0];
    }
    
    /**
     * @description Checks to see if the round has ended
     * @returns roundEnded: number
     * @memberof Game
     */
    checkRoundEndStatus() {
        this.roundEnded = this.roundNumber == 0 ? false : this.players.filter(player => player.getDrawTurnCount == this.roundNumber).length == this.players.length;
        return this.roundEnded;
    }

     generateWords(){
        return this.wordGenerator.getWords(this.roundNumber);
    }

    /**
     * @description Updates the involved underlying models to reflect the game state properly upon guessing what has been drawn
     * @param {string} uid 
     * @param {string} guess 
     * @param {number} time 
     * @returns bool determining whether or not the guess was correct
     */
    submitGuess(uid, guess, time){
        let player = getPlayerUID(uid);

        if(player == null)
            return false;
        
        player.addGuess(guess, guess == this.currentWord);
        
        if(guess == this.currentWord){
            player.setPlayerPoints(player.getPlayerPoints() + time/2);
            this.currentPlayer.setPlayerPoints(this.currentPlayer.getPlayerPoints() + time);
            return true;
        }else{
            player.setPlayerPoints(player.getPlayerPoints() > 0 ? player.getPlayerPoints() - 1 : 0);
            return false;
        }
    
    }

    startNewTurn(){
        let playersToDraw = this.players.filter(player => player.getDrawTurnCount() != this.roundNumber);
        if(playersToDraw.length != 0){
            this.currentPlayer = playersToDraw[0];
            this.currentPlayer.incrementDrawTurnCount();
            this.players.forEach(player => player.clearGuesses());
            return true;
        }
        return false;
    }

    startNewRound(){
        if(this.players.length == 0)
            return false;
        if(this.roundNumber < this.MAX_ROUND_NUMBER){
            this.roundNumber++;
            return this.startNewTurn();
        }
        return false;
    }

}