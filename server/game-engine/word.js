import admin from 'firebase-admin';

let db = admin.firestore();

export default class Word{

    constructor() {
        this.previousChosenWordsList = [];    
    }

    /**
     * @description Returns the list of words to choose from
     * @returns new word list of 3 options
     * @memberof word
     */
    getWords(difficultyLevel) {
        //make call to firebase and get the word
        let threeWordList = [];
        //check if word exists in the current wordlist

        let docName = '';

        do {
            switch(difficultyLevel) {
                case 1:
                    docName = 'easy';
                  break;
                case 2:
                    docName = 'medium';
                  break;
                case 3:
                    docName = 'hard';
                  break;
                default:
                    docName = 'medium';
            }

            db.collection('Words').doc(docName).get().then(function(doc){
                if(doc.exists){
                    docWords = doc.data().words;
                    newWord = docWords[Math.floor(Math.random() * docWords.length)];      
                }else{
                    console.log("doc not found");
                }
            }).catch(function(err){
                console.log(err);
            }); 

            if (!threeWordList.includes(newWord) && !this.previousChosenWordsList.includes(newWord))
                threeWordList.push(newWord);
        } while(threeWordList.length != 3);
        
        this.previousChosenWordsList.push(...threeWordList);
        return threeWordList;
    }
    
}

