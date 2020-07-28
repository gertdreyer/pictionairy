import { createRequire } from "module";
const require = createRequire(import.meta.url);
require("dotenv").config();

import Player from "./player.js";
import Game from "./game.js";
import Word from "./word.js";

test();

async function test() {
    playerTest();
    await gameTest();
    await getWordsTest();
}

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
}

// Word unit tests
async function getWordsTest() {
    console.log("\n===== Words unit tests =====\n");
    let word = new Word();
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