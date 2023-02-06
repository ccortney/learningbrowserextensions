//This file will be injected before body tag.
//Add file to src or modify path accordingly in manifest.json

import { initializeApp } from "./firebase-app.js";
import { getFirestore, collection, query, where, getDocs, addDoc } from "./firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyAl4KR_9lbCvmUO5wpL3jfjCitNGfQDX7g",
    authDomain: "fir-9intro.firebaseapp.com",
    projectId: "fir-9intro",
    storageBucket: "fir-9intro.appspot.com",
    messagingSenderId: "912650597382",
    appId: "1:912650597382:web:7d1f93ba390fe909c6ff87"
  };

const firebase_app = initializeApp(firebaseConfig);

console.log(firebase_app)

const db = getFirestore(firebase_app);

async function get_database_elements(db_name){
    const q = query(collection(db, db_name));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        console.log(doc.id, " => ", doc.data());
    });
}

//In order to use firebase_app and db inside the injected website
//pass to global scope is needed, because in module it has local scope
globalThis.firebase_app = firebase_app;
globalThis.db = db;
globalThis.get_database_elements = get_database_elements;