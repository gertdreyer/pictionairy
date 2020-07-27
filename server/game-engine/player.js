export default class Player{
    constructor(uid, name){
        this.playerUID = uid;                       //uid corresponding to account on firebase
        this.playerName = name;                     //name corresponding to account on firebase
        this.points = 0;                            //points associated with this instantiated Player object
        this.drawTurnCount = 0;                     //counter used to determine whether or not the player has drawn in a given round
        this.playerConnectionStatus = "connected";  //a string determining whether or not the player has disconnected from the session
        this.guesses = [];                          //an array of objects where each object stores data about a particular guess
    }

    /**
     * @description Getter for player id
     * @return playerUID: string
     * @readonly
     * @memberof Player
     */
    get getPlayerUID(){
        return this.playerUID;
    }

    /**
     * @description Getter for player name
     * @return playerName: string
     * @readonly
     * @memberof Player
     */
    get getPlayerName(){
        return this.playerName;
    }

    /**
     * @description Getter for player points
     * @return points: number
     * @readonly
     * @memberof Player
     */
    get getPlayerPoints(){
        return this.points;
    }

    /**
     * @description Setter for player points
     * @memberof Player
     */
    set setPlayerPoints(points){
        this.points = points;
    }

    /**
     * @description Getter for player's last draw round
     * @return drawTurnCount: number
     * @readonly
     * @memberof Player
     */
    get getDrawTurnCount(){
        return this.drawTurnCount;
    }

    /**
     * @description Getter for a player's connection status
     * @return playerConnectionStatus: string
     * @readonly
     * @memberof Player
     */
    get getPlayerConnectionStatus(){
        return this.playerConnectionStatus;
    }

    /**
     * @description Increments the player's last draw round
     * @memberof Player
     */
    incrementDrawTurnCount(){
        this.points++;
    }

    /**
     * @description 
     *
     * @memberof Player
     */
    toggleConnection(){
        this.playerConnectionStatus = this.playerConnectionStatus == "connected" ? "disconnected" : "connected";
    }

    /**
     * @correct determines whether or not the guess was correct
     */
    addGuess(word, correct){
        this.guesses.push(
            guess = {
                guessedWord : word,
                guessCorrectness : correct,
                roundNumber : this.drawTurnCount
            }
        );
    }
    
    get getGuesses(){
        return this.guesses;
    }

    get getGuesses(round){
        return this.guesses.filter(guess => guess.roundNumber == round);
    }

    get getIncorrectGuessesAmount(){
        return this.guesses.length;
    }

}