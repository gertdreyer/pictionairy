export default class Player {
    constructor(uid, name, state) {
        this.playerUID = uid; // uid corresponding to account on firebase
        this.playerName = name; // name corresponding to account on firebase
        this.points = state === undefined ? 0 : state.points; // points associated with this instantiated Player object
        this.drawTurnCount = state === undefined ? 0 : state.drawTurnCount; // counter used to determine whether or not the player has drawn in a given round
        this.playerConnectionStatus = state === undefined ? "connected" : state.playerConnectionStatus; // a string determining whether or not the player has disconnected from the session
        this.guesses = state === undefined ? [] : state.guesses; // an array of objects where each object stores data about a particular guess
        this.controller = state === undefined ? "" : state.controller; // controller id for player
    }

    /**
     * @description Getter for player id
     * @return playerUID: string
     * @readonly
     * @memberof Player
     */
    getPlayerUID() {
        return this.playerUID;
    }
    /**
     * @description Getter for player controller id
     * @returns controller: string
     * @memberof Player
     */
    getPlayerController() {
        return this.controller;
    }
    /**
     * @description Setter for player controller
     * @param {string} controller
     * @memberof Player
     */
    setPlayerController(controller) {
        this.controller = controller;
    }

    /**
     * @description Getter for player name
     * @return playerName: string
     * @readonly
     * @memberof Player
     */
    getPlayerName() {
        return this.playerName;
    }

    /**
     * @description Getter for player points
     * @return points: number
     * @readonly
     * @memberof Player
     */
    getPlayerPoints() {
        return this.points;
    }

    /**
     * @description Setter for player points
     * @memberof Player
     */
    setPlayerPoints(points) {
        this.points = points;
    }

    /**
     * @description Getter for player's last draw round
     * @return drawTurnCount: number
     * @readonly
     * @memberof Player
     */
    getDrawTurnCount() {
        return this.drawTurnCount;
    }

    /**
     * @description Getter for a player's connection status
     * @return playerConnectionStatus: string
     * @readonly
     * @memberof Player
     */
    getPlayerConnectionStatus() {
        return this.playerConnectionStatus;
    }

    /**
     * @description Increments the player's last draw round
     * @memberof Player
     */
    incrementDrawTurnCount() {
        this.drawTurnCount++;
    }

    /**
     * @description Toggles a Player object's connection status when the player disconnects/reconnects
     *
     * @memberof Player
     */
    toggleConnection() {
        this.playerConnectionStatus =
            this.playerConnectionStatus == "connected" ?
            "disconnected" :
            "connected";
    }

    /**
     * @correct determines whether or not the guess was correct
     */
    addGuess(word, correct) {
        let guess = {
            guessedWord: word,
            guessCorrectness: correct,
        };
        this.guesses.push(guess);
    }

    /**
     * @description Returns the guesses made by a player in a given turn
     */
    getGuesses() {
        return this.guesses;
    }

    getIncorrectGuessesAmount() {
        return this.guesses.filter((guess) => !guess.guessCorrectness).length;
    }

    clearGuesses() {
        this.guesses = [];
    }
}
