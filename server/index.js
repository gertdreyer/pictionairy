import { createRequire } from "module";
const require = createRequire(import.meta.url);
require("dotenv").config();
import { test } from "./game-engine/test.js";
import uploadWords from "./game-engine/upload_words.js";
//  uploadWords();   //T upload words to the Google Firestore

test();
