import admin from 'firebase-admin';


admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    databaseURL: 'https://wordstore-dae44.firebaseio.com'
  });

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
     async getWords(difficultyLevel) {
        
        //make call to firebase and get the word
        let threeWordList = [];
        //check if word exists in the current wordlist

        let docName = '';
        let newWord = '';

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
            
            const cityRef = db.collection('Words').doc(docName);
            const doc = await cityRef.get();
            if (!doc.exists) {
                 console.log('No such document!');
            } 
            else {
                    // console.log('Document data:', doc.data().words);
                     newWord = doc.data().words[Math.floor(Math.random() * doc.data().words.length)]; 
                     
            }


            if (!threeWordList.includes(newWord) )
                threeWordList.push(newWord);
        } while(threeWordList.length != 3);
        
        this.previousChosenWordsList.push(...threeWordList);
        return threeWordList;
    }
    
}

