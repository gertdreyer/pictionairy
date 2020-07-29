var mongoose = require('mongoose')
// Models
const GameSchema = new mongoose.Schema({
    gameid: String,
    iat: Date,
    gamestate: Object
})

const UserSchema = new mongoose.Schema({
    username: String,
    name: String,
    passwordHash: String,
    previousGames: Object
})

const User = mongoose.model('User', UserSchema);
const GameState = mongoose.model('GameeState', GameSchema);

export {GameSchema, UserSchema, User, GameState}



