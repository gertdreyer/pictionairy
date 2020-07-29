import { createRequire } from "module";
const require = createRequire(import.meta.url);
require("dotenv").config();

import Player from "./player.js";
import Game from "./game.js";
import Word from "./word.js";

test();

// async function test() {
//     playerTest();
//     await gameTest();
//     await getWordsTest();
// }

// Helper functions
function performUnitTest(itemTested, expected, actual) {
    if (expected == actual)
        console.log("\u2713  " + itemTested + " passed test");
    else
        console.log(
            "\u2718  " +
                itemTested +
                " expected to be: " +
                expected +
                " but was " +
                actual
        );
}

// Player unit tests
function playerTest() {
    console.log("===== Player unit tests =====\n");
    let player = new Player("nicpym", "Nicholas");
    performUnitTest("Player ID", "nicpym", player.getPlayerUID());
    performUnitTest("Player Name", "Nicholas", player.getPlayerName());
    performUnitTest("Points", 0, player.getPlayerPoints());
    performUnitTest("Draw Turn Count", 0, player.getDrawTurnCount());
    performUnitTest(
        "Player Connection Status",
        "connected",
        player.getPlayerConnectionStatus()
    );

    if (player.getGuesses().length != 0) console.log("Guesses Test Failed");

    player.setPlayerPoints(10);
    performUnitTest("Points", 10, player.getPlayerPoints());

    player.incrementDrawTurnCount();
    performUnitTest("Draw Turn Count", 1, player.getDrawTurnCount());
    player.setPlayerController("abcd");
    performUnitTest("Player Controller", "abcd", player.getPlayerController());

    player.toggleConnection();
    performUnitTest(
        "Player Connection Status",
        "disconnected",
        player.getPlayerConnectionStatus()
    );

    player.addGuess("block", true);

    let guesses = player.getGuesses();
    if (guesses.length != 1) console.log("Add Guesses Failed");
    else {
        performUnitTest("Guess 1 Word", "block", guesses[0].guessedWord);
        performUnitTest(
            "Guess 1 Correctness",
            true,
            guesses[0].guessCorrectness
        );
    }

    let playerCopy = new Player(player.playerUID, player.playerName, player);
    performUnitTest("Player Copy Constructor ID", player.playerUID, playerCopy.playerUID);
    performUnitTest("Player Copy Constructor Name", player.playerName, playerCopy.playerName);
    performUnitTest("Player Copy Constructor Points", player.points, playerCopy.points);
    performUnitTest("Player Copy Constructor drawTurnCount", player.drawTurnCount, playerCopy.drawTurnCount);
    performUnitTest("Player Copy Constructor Connection Status", player.playerConnectionStatus, playerCopy.playerConnectionStatus);
    performUnitTest("Player Copy Constructor Controller", player.controller, playerCopy.controller);

    console.log("");
}

// Game unit tests

async function gameTest() {
    console.log("===== Game unit tests =====\n");
    let game = new Game("game123");

    // Test Game constructor
    performUnitTest("Game ID", "game123", game.getGameId());
    performUnitTest("Game Ended", false, game.getGameEndedStatus());
    performUnitTest("Round Ended", false, game.checkRoundEndStatus());
    performUnitTest("Round Number", 0, game.getRoundNumber());
    performUnitTest("Current Word", "", game.getWord());
    performUnitTest("Current Player", null, game.getDrawer());
    performUnitTest("Max Time", 60, game.maxTime);
    performUnitTest("Game round ended status", false, game.getRoundEnded());
    performUnitTest("Game Last guess object player id", "", game.lastGuess.playerUID);
    performUnitTest("Game Last guess object player guess", "", game.lastGuess.guessMade);

    let copyGame = new Game(game.getGameId(), game);
    performUnitTest("Game Copy Constructor ID", game.getGameId(), copyGame.getGameId());
    performUnitTest("Game Copy Constructor DifficultyLevel", game.difficultyLevel, copyGame.difficultyLevel);
    performUnitTest("Game Copy Constructor Game Ended", game.gameEnded, copyGame.gameEnded);
    performUnitTest("Game Copy Constructor Round Ended", game.roundEnded, copyGame.roundEnded);
    performUnitTest("Game Copy Constructor Round Number", game.roundNumber, copyGame.roundNumber);
    performUnitTest("Game Copy Constructor Current Word", game.currentWord, copyGame.currentWord);
    performUnitTest("Game Copy Constructor Current Player", game.currentPlayer, copyGame.currentPlayer);
    performUnitTest("Game Copy Constructor Max Time", game.maxTime, copyGame.maxTime);
    performUnitTest("Game Copy Constructor Host ID", game.hostId, copyGame.hostId);
    performUnitTest("Game Copy Last guess object player id",copyGame.lastGuess.playerUID, game.lastGuess.playerUID);
    performUnitTest("Game Copy Last guess object player guess", copyGame.lastGuess.guessMade, game.lastGuess.guessMade);

    

    // Test add player functionality
    let addPlayerOne = game.addPlayer("nicpym", "Nicholas");
    performUnitTest("Add player one", true, addPlayerOne);
    let addDuplicatePlayerOne = game.addPlayer("nicpym", "Nicholas");
    performUnitTest(
        "Don't add duplicate player one",
        false,
        addDuplicatePlayerOne
    );

    // Test start new round and start new turn functionality
    game = new Game("game123");
    performUnitTest("Start Round Without Players", false, game.startNewRound());
    performUnitTest("Start Turn Without Players", false, game.startNewTurn());
    for (let i = 0; i < 4; i++) {
        game.addPlayer(new Player(String(i), String(i)));
    }
    performUnitTest("Start Round With Players", true, game.startNewRound());
    performUnitTest("Start Turn With Players", true, game.startNewTurn());
    performUnitTest(
        "Current Player Properly Assigned",
        true,
        game.getDrawer() != null
    );
    performUnitTest("Start Round 2", true, game.startNewRound());
    performUnitTest("Start Round 3", true, game.startNewRound());
    performUnitTest(
        "Attempt To Start Another Round After Max Round Reached",
        false,
        game.startNewRound()
    );

    let words = await game.generateWords();
    if (words.length == 3) {
        performUnitTest("Words generated", 0, 0);
    }

    //Test to see if current drawer can't make a guess.
    game = new Game("game123");
    game.addPlayer("nicpym1", "Nicholas1");
    game.addPlayer("nicpym2", "Nicholas2");
    game.addPlayer("nicpym3", "Nicholas3");
    game.addPlayer("nicpym4", "Nicholas4");
    game.players[0].controller ="0";
    game.players[1].controller ="1";
    game.players[2].controller ="2";
    game.players[3].controller ="3";
    // game.setWord('test');
    performUnitTest("Game check controllers", true, game.checkControllers());
    game.startNewRound();
    
    let currentPlayerUID = game.getDrawer();

    try {
        game.submitGuess(currentPlayerUID, "test",60);
        performUnitTest("Don't let drawer guess", "", "Current drawer can't guess");
    }
    catch(err) {
        performUnitTest("Don't let drawer guess", err, "Current drawer can't guess");
    }
}

// Word unit tests
async function getWordsTest() {
    console.log("\n===== Words unit tests =====\n");
     let previousChosenWordsList1 = [];
    let state={
        previousChosenWordsList: previousChosenWordsList1,
        words : null

    }

    let wordsCopy = new Word(state);
    let word = new Word();

    performUnitTest("Word Copy Constructor previousChosenWordsList", word.previousChosenWordsList.length, wordsCopy.previousChosenWordsList.length);
    performUnitTest("Word Copy Constructor words", word.words, wordsCopy.words);

    let ExpectedWordsEasy = await word
        .getWords(1)
        .then()
        .catch((err) => {
            console.log(err);
        });
    if (ExpectedWordsEasy.length != 3) {
        console.log(
            "\u2718  " +
                " Easy words get" +
                " expected to be: 3 but was " +
                ExpectedWordsEasy.length
        );
    } else {
        console.log("\u2713  " + "Easy words get passed test");
    }

    let ExpectedWordsMedium = await word
        .getWords(2)
        .then()
        .catch((err) => {
            console.log(err);
        });

    if (ExpectedWordsMedium.length != 3) {
        console.log(
            "\u2718  " +
                " Medium words get" +
                " expected to be: 3 but was " +
                ExpectedWordsMedium.length
        );
    } else {
        console.log("\u2713  " + "Medium words get passed test");
    }

    let ExpectedWordsHard = await word
        .getWords(3)
        .then()
        .catch((err) => {
            console.log(err);
        });
    if (ExpectedWordsHard.length != 3) {
        console.log(
            "\u2718  " +
                " Hard words get" +
                " expected to be: 3 but was " +
                ExpectedWordsHard.length
        );
    } else {
        console.log("\u2713  " + "Hard words get passed test");
    }
}

export async function test() {
    playerTest();
    await gameTest();
    await getWordsTest();
}
