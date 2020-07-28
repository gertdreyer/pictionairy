import Player from './player.js'
import Game from './game.js'
// import Word from './word.js'

// Helper functions
export function performUnitTest(itemTested, expected, actual) {
    if (expected == actual)
        console.log("\u2713  " + itemTested + " passed test");
    else
        console.log("\u2718  " + itemTested + " expected to be: " + expected + " but was " + actual);
}

// Player unit tests
export function playerTest() {
    console.log("===== Player unit tests =====\n");
    let player = new Player("nicpym", "Nicholas");
    performUnitTest("Player ID", "nicpym", player.getPlayerUID());
    performUnitTest("Player Name", "Nicholas", player.getPlayerName());
    performUnitTest("Points", 0, player.getPlayerPoints());
    performUnitTest("Draw Turn Count", 0, player.getDrawTurnCount());
    performUnitTest("Player Connection Status", "connected", player.getPlayerConnectionStatus());
    
    if (player.getGuesses().length != 0)
        console.log("Guesses Test Failed");
        
    player.setPlayerPoints(10);
    performUnitTest("Points", 10, player.getPlayerPoints());

    player.incrementDrawTurnCount();
    performUnitTest("Draw Turn Count", 1, player.getDrawTurnCount());

    player.toggleConnection();
    performUnitTest("Player Connection Status", "disconnected", player.getPlayerConnectionStatus());

    player.addGuess("block", true);

    let guesses = player.getGuesses();
    if (guesses.length != 1)
        console.log("Add Guesses Failed");
    else {
        performUnitTest("Guess 1 Word", "block", guesses[0].guessedWord);
        performUnitTest("Guess 1 Correctness", true, guesses[0].guessCorrectness);
    }
    

    console.log("");
}


// Game unit tests

export function gameTest() {
    console.log("===== Game unit tests =====\n");
    let game = new Game("game123");

    // Test Game constructor
    performUnitTest("Game ID", "game123", game.getGameId());
    performUnitTest("Game Ended", false, game.getGameEndedStatus());
    performUnitTest("Round Ended", false, game.checkRoundEndStatus());
    performUnitTest("Round Number", 1, game.getRoundNumber());
    performUnitTest("Current Word", "", game.getWord());
    performUnitTest("Current Player", null, game.getDrawer());
    performUnitTest("Max Time", 60, game.maxTime);
    
    // Test add player functionality
    let addPlayerOne = game.addPlayer('nicpym','Nicholas');
    performUnitTest("Add player one", true, addPlayerOne);

    let PlayerOneExpected = {
          playerUID: 'nicpym',
          playerName: 'Nicholas',
          points: 0,
          drawTurnCount: 0,
          playerConnectionStatus: 'connected',
          guesses: []
        };
    let players = game.getPlayers();
    console.log(players[0]);
}




// Word unit tests
export function wordTest(){
    console.log("===== Word unit tests =====\n");
}