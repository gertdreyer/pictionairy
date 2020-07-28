import admin from "firebase-admin";

admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    databaseURL: "https://wordstore-dae44.firebaseio.com",
});

let db = admin.firestore();

export default class Word {
    constructor() {
        this.previousChosenWordsList = [];
    }

    /**
     * @description Returns the list of words to choose from
     * @returns new word list of 3 options
     * @memberof word
     */
    async getWords(difficultyLevel) {
        //make call to firebase and get the word
        let threeWordList = [];
        //check if word exists in the current wordlist

        let docName = "";
        let newWord = "";

        switch (difficultyLevel) {
            case 1:
                docName = "easy";
                break;
            case 2:
                docName = "medium";
                break;
            case 3:
                docName = "hard";
                break;
            default:
                docName = "medium";
        }

        try {
            const cityRef = db.collection("Words").doc(docName);
            const doc =  await cityRef.get();
            let words = doc.data().words;

            do {
                newWord = words[Math.floor(Math.random() * words.length)];
    
                if (!threeWordList.includes(newWord)) 
                    threeWordList.push(newWord);
            } while (threeWordList.length != 3);
    
            this.previousChosenWordsList.push(...threeWordList);
            return threeWordList;
        }
        catch(err) {
            console.log("Error retrieving words from DB");
        }
    }
}
