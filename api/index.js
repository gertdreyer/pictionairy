const express = require('express')
const app = express()
const { v4: uuidv4 } = require('uuid');
const port = 3000

app.use(express.json());   
app.get('/', (req, res) => res.send('Hello World!'))

app.post('/newSession', (req,res) => {
    if (!!req.body.userId){
        let session = uuidv4();
        res.json({"sessionId": session})
        //TODO: Firebase
    }else{
        res.json({error: "Missing userId"})
    }    
})

app.post('/join', (req,res) => {
    if (!!req.body.userId && !!req.body.sessionId){
        // Mock method
        res.json({joined: true})
    }else{
        res.json({joined: false, error: "Missing sessionId or userId"})
    }  
    //joinAsUser (session_id, user_id) return bool
//join as viewer
//Ensure that once the game is started this function always returns false for this session id
// joinAsDevice (session_id, user_id) return bool
//join as device
//Ensure that once the game is started this function always returns false for this session id
})

app.post('/startGame', (req,res) => {
    if (!!req.body.userId && !!req.body.sessionId){
        res.json({started: true});
    }else{
        res.json({started: false, error: "Missing sessionId or userId"})
    }  
    //startGame (session_id) return bool
    //Set round to 0
    //Make sure that all users have both viewing and drawing devices
})

app.post('/guess', (req,res) => {
    if (!!req.body.userId && !!req.body.sessionId && !!req.body.guess){
    //GE integration
        res.json({correct: true})
    }else{
        res.json({correct: false, error: "Missing sessionId or userId of guess"})
    }  
})


app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))