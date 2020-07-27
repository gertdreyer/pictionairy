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
        threeWordList = [];
        //check if word exists in the current wordlist

        do {
            switch(difficultyLevel) {
                case 1:
                    newWord = ''; // word recieved from the database new call for a new word FROM EASY
                  break;
                case 2:
                    newWord = ''; // word recieved from the database new call for a new word FROM MEDIUM
                  break;
                case 3:
                    newWord = ''; // word recieved from the database new call for a new word FROM HARD
                  break;
                default:
                    newWord = ''; // word recieved from the database new call for a new word FROM MEDIUM
            }

            if (!threeWordList.includes(newWord) && !this.previousChosenWordsList.includes(newWord))
                threeWordList.push(newWord);
        } while(threeWordList.length != 3);
        
        this.previousChosenWordsList.push(...threeWordList);
        return threeWordList;
    }
    // TODO WHEN MAKING DATABASE CALLS REMEMBER THE CREDINTIALS SHOULD BE ENCRYPTED OR IN ENVIRONEMNT VARIABLES
}

