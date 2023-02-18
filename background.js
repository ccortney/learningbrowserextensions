// I am still getting an import error, but everything is working. Look into this.
import { initializeApp } from "./js/firebase/firebase-app.js"
import {    getFirestore, 
            collection, 
            query, 
            where, 
            getDocs, 
            addDoc, 
            doc 
        } from "./js/firebase/firebase-firestore.js"

const firebaseConfig = {
    apiKey: 'AIzaSyCUOWLQzjGuHfsd0Ih6MmEiOwcdoLYWyUM',
    authDomain: 'greener-80296.firebaseapp.com',
    databaseURL:
      'https://greener-80296-default-rtdb.europe-west1.firebasedatabase.app',
    projectId: 'greener-80296',
    storageBucket: 'greener-80296.appspot.com',
    messagingSenderId: '976797593748',
    appId: '1:976797593748:web:abbdaa9c42e1101af3c481',
    measurementId: 'G-QTMCMYZHKN',
  };

const firebase_app = initializeApp(firebaseConfig);
const db = getFirestore(firebase_app)

async function getTab(query) {
    let result = await chrome.tabs.query(query)
    console.log(result[0])
    return result[0].title
}

async function get_database_elements(db_name){
    const q = query(collection(db, db_name));
    const querySnapshot = await getDocs(q);
    return querySnapshot
}

function send_data(snapshot, webTitle) {
    // we are sending a message back to popup.js with data
    chrome.runtime.sendMessage( { text: {
        data: snapshot.docs[0].data(), 
        webTitle: webTitle[0].title
    }, command: 'GET' });
}

chrome.runtime.onMessage.addListener( async (msg) => {
    // this will return the title of the tab, which gives the current amazon product
    let webTitle = await getTab({active: true, lastFocusedWindow: true})
    console.log(webTitle)

    // I am not sure if we will be sending other commands other than GET from popup.js
    // If not, we can end up removing this if statement
    if (msg.command === 'GET') {
        // This allows me to see in the service worker, what data I am retrieving from Firestore
        // This won't stay long term
        let products = [];

        get_database_elements('products')
            .then((snapshot) => {
                send_data(snapshot, webTitle)
                // Do I need a .then, .catch?
                snapshot.docs.forEach((doc) => {
                    products.push(doc.data())
                })
            console.log(products)
            })
            .catch(err => {
            console.log(err.message)
            })
    }
})