import admin from "firebase-admin";

admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    databaseURL: "https://wordstore-dae44.firebaseio.com",
});

let db = admin.firestore();

export default class Word {
    constructor(state) {
        if(state !== undefined)
        {
            this.previousChosenWordsList = state.previousChosenWordsList;
            this.words = state.words;
        }
        else
        {
            this.previousChosenWordsList = [];// Previous words that were drawn 
            this.words = null;  // Words of various difficulties
        }
        
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

        try {
            let docNames = ["easy", "medium", "hard"];

            if (this.words == null) {
                this.words = {
                    easy: [],
                    medium: [],
                    hard: [],
                };

                let docs = [];

                docNames.forEach((docName) => {
                    const cityRef = db.collection("Words").doc(docName);
                    docs.push(cityRef.get());
                });

                (await Promise.all(docs)).forEach((doc, idx) => {
                    this.words[docNames[idx]] = doc.data().words;
                });
            }

            let difficulty = docNames[difficultyLevel - 1];
            let newWord = "";

            do {
                newWord = this.words[difficulty][
                    Math.floor(Math.random() * this.words[difficulty].length)
                ];

                if (!threeWordList.includes(newWord))
                    threeWordList.push(newWord);
            } while (threeWordList.length != 3);

            this.previousChosenWordsList.push(...threeWordList);
            return threeWordList;
        } catch (err) {
            console.log(err);
        }
    }
}
