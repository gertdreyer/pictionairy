import fs from 'fs';
import admin from 'firebase-admin';

export default async function uploadWords() {
    admin.initializeApp({
        credential: admin.credential.applicationDefault(),
        databaseURL: 'https://wordstore-dae44.firebaseio.com'
      });

    let db = admin.firestore();
    let files = ["easy", "medium", "hard"];

    let wordsToAdd = [];

    files.forEach(function (fileName) {
        wordsToAdd = [];
        wordsToAdd = fs.readFileSync(`${process.env.word_file_dir}${fileName}.txt`, 'utf8').split('\n');

        db.collection('Words').doc(fileName)
            .set({
                words: wordsToAdd
            }).then(() => console.log("Added words to", fileName, "document."));
    });
}