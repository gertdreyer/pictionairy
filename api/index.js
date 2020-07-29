import express from 'express'
import bcrypt from 'bcrypt';

import jwt from "jsonwebtoken";
import cors from 'cors';
import mongoose from 'mongoose';
import { User } from './db.js';
const db_link = process.env.DB_HOST || "mongodb://vacweekapi.gdza.xyz:27017/db_test";
// App Config.
const port = 3000;
const saltRounds = 10;
const JWTSECRET = process.env.JWT_SECRET || "this-should-be-some-super-secret-key";

const app = express()
var server = app.listen(port)
var io = require('socket.io')(server, { 'pingInterval': 1000, 'maxHttpBufferSize': "10e7" });
const socketserver = require('./socketserver.js')(io);

app.use(cors())
app.use(express.static('./../Interface'))
app.use(express.json());

// Database Initiation
mongoose.connect(db_link, (err) => {
    if (err)
        console.log("Error");
    else
        console.log("Db Success");
});
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log("DB connected")
});

// TODO: Move endpoints to routes...
app.get('/', (req, res) => {
    res.sendFile(__dirname + "../Interface" + '/index.html');
});

/// Registration Endpoint
/**
 * @param newUsername the entered new username
 * @param newPassword the entered new password
 * @param newName the entered new name
 */

app.post('/register', async (req, res) => {
    try {
        let newUsername = req.body.username;
        let newPassword = req.body.password;
        let newName = req.body.name;

        if (!!newUsername && !!newPassword && !!newName) {
            // Register new User...
            if (await User.exists({ username: newUsername })) { // the user already exists
                console.log("Existing User")
                res.json({ error: "Username already exists" })
            } else {
                bcrypt.hash(newPassword, saltRounds, async function (err, hash) {
                    // Store hash in your password DB.
                    const user = new User({
                        name: newName,
                        username: newUsername,
                        passwordHash: hash,
                        previousGames: {},
                    });

                    try {
                        const newUser = await user.save();
                        return res.status(200).json({ success: true });
                    }
                    catch (err) {
                        return res.status(500).json({ error: "This shouldn't happen: DB error" })
                    }
                    // Need....
                });
            }
        }
    } catch (err) {
        return res.json({ error: "body not defined..." })
    }
});


/// Authentication Endpoint
/**
 * @param authUsername the username that needs to be authenticated
 * @param authPassword the password that needs to be authenticated
 */
app.post('/auth', async (req, res) => {
    let authUsername = req.body.username;
    let authPassword = req.body.password;

    if (!!authUsername && !!authPassword) {
        // Load hash from your password DB.
        let user;
        try {
            user = await User.findOne({ username: authUsername });

            //if the user does not exist
            if (user == null) {
                return res.json({ jwt: null, error: "Username and/or Password is not associated with an account." });
            }

            let hash = user.passwordHash;
            bcrypt.compare(req.body.password, hash, (err, result) => {
                // result == true
                console.log(JSON.parse(JSON.stringify(user)));
                if (result) {
                    delete user.passwordHash;
                    return res.json({ jwt: jwt.sign({ username: user.username }, JWTSECRET, { expiresIn: "2 days" }) });
                } else {
                    return res.json({ jwt: null, error: "Username and/or Password is not associated with an account" });
                }
            });
        } catch (err) {
            return res.status(500).json({ error: err.msg });
        }
    }
});

export default server