import admin from "firebase-admin";

admin.initializeApp({
    credential: {
        "type": "service_account",
        "project_id": "wordstore-dae44",
        "private_key_id": "5352fabfc2bbfd12f8ff4efc0ae20a6cb591deed",
        "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCsTwtyDkDUabdy\nQxTv2cs9oxxTd3LarZrrgkUZ6Ro2OTeIYDuzkEcOeQdcP/P6mezxHjp2xRPPJ6pF\nBLlVfNTz+LV+xveFFTXp93FoUTOmSbwcQB6JRwcnTeCZSXDeeuk8uNd5YAa03axv\nrbE3UxyD8JIEf58vZVRhILfqMIrMnY7N+rX/L/qa2PkDexoSAnGDMTk7mtvpbSBK\nckuxdg1KSyu2BPvvk0URqKzhIhTFOei0KhmdaltakHnisTH/ow/727PfMVSwFV+O\naINrOhh+K/gUfNaGvKx/ZtLSuOzbxgW2FvD97aQLOO/TEO9s45e6zh0JaoL1Hy2p\nwLfYrwabAgMBAAECggEAP10B9HtRU8tcbmREur74gj4NGJSAY/IbWieZiaGyxeXc\nigX5blrMBoJzNnU+HxWjkDdxgGOQmUkY0DCghtNU7DK1a113gDUAkn0v8xCJUckj\np6/citbXxphY04WyP94rDu1aL4QkczZhRuA0nwetIMfCqmzT+PXmRaFmgHRBVmSv\nuceWgVdQKxwYBELLoeeUw4PTaaEohJE9uCZmZJ0OrT1rw0EIPCK5exjR//gCMY01\nUFc7dYWxzpWNNlhUm0ud1CdnOY/Owo/CrqS4clrZrZJYwZ+zgZknbBF/Kbq0wuzS\nRJfGIA3N4E34rp49qQv7Skn6+q35BPKAuCELhwiDYQKBgQDTsW2TrgTkKCaNHzM2\nRJYXNhyiDDTtd+636e53fq6d4HiFx9VSz37sPob0LJRZ6MI9yTlaUHWepxptqqzT\ntl26ZTS8jAABl1r9g69cWT6LaYCexibodnSyklEfmN0Y+DaafTUcwkMObqWiset4\ngIbUZ/nsn3dkGm5ibzU+RoelrwKBgQDQX2UQNOS1dgIkKlvccb0uoaDnF7myuiHi\nLhQYvp5FMl9yuSaSw2uwP8DVYJ2DWmm+O+t7DeOe9I/iMprADw7EBX6biYEzoQzt\nVv+cLnVIlT4gM0PRPehy4Y9w6G3AyzJleJhLCTB9wKaUwr7vIk6GfyyueTxgNvuv\ndHtf/ceU1QKBgQC1qZ0PDlbENHBgylV4TINAh/8qUK9a2YDR8r3hbaULdoX2x/YY\nilexBDdrcpYcUdHek7/T8Rf+fgf/9Gc7h1QHkLIg20NmGizLQSZLaYpyuKbXmdPp\nyT17wHQ9WUDjHJ4/FRNvCoXg7LLXWzdmwWTzAgdHN9GM5eG0NxrJxlzBoQKBgFyN\nEoGJTNCAkuDnY5fdeQ7eQW6DbjrBS81/c/OtrvTDM/vr2wMzA4DsQEVGPZAbN36E\ndMpaV/DBZastmOiXh5JvclW5VIbPEMPWcYA4bmWHzGlW+9dTbQyhvSmEQ0NvvXmu\nf85MTZp9WEAY49+pWEGK+Rihxrxhj5bV4Pq46M3lAoGAQJnnNqIK4VckI8H3ChKl\njcdw+RYApjkU3sP9xou00L3H/Lmrrol7ghIAgmYbZsCgivJIGeefeUNYlsSXAY7Z\n40EavaP7fBt+6SJp72GN9bmZIPvYA7xLytbNWqpW6hNOheYZQP2BY+yo0rjdc97s\nPwIPGv68/M1CdFO1Ov8E+60=\n-----END PRIVATE KEY-----\n",
        "client_email": "firebase-adminsdk-epin8@wordstore-dae44.iam.gserviceaccount.com",
        "client_id": "104135635748924664787",
        "auth_uri": "https://accounts.google.com/o/oauth2/auth",
        "token_uri": "https://oauth2.googleapis.com/token",
        "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
        "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-epin8%40wordstore-dae44.iam.gserviceaccount.com"
      }
      ,
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
