// I am still getting an import error, but everything is working. Look into this.
import {initializeApp} from "../firebase/firebase-app.js"
import {
    getFirestore,
    collection,
    query,
    where,
    getDocs,
    addDoc,
    doc
} from "../firebase/firebase-firestore.js"

const firebaseConfig = {
    apiKey: 'AIzaSyCUOWLQzjGuHfsd0Ih6MmEiOwcdoLYWyUM',
    authDomain: 'greener-80296.firebaseapp.com',
    databaseURL: 'https://greener-80296-default-rtdb.europe-west1.firebasedatabase.app',
    projectId: 'greener-80296',
    storageBucket: 'greener-80296.appspot.com',
    messagingSenderId: '976797593748',
    appId: '1:976797593748:web:abbdaa9c42e1101af3c481',
    measurementId: 'G-QTMCMYZHKN'
};

const firebase_app = initializeApp(firebaseConfig);
const db = getFirestore(firebase_app)

async function getTab(query) {
    let result = await chrome.tabs.query(query)
    let domain = getDomain(result[0].url)
    let productPage = checkUrl(result[0].url)
    return {tabName: result[0].title, domain: domain, url: result[0].url, productPage: productPage}
}

function getDomain(url) {
    let domain = url;
    domain = domain.replace('http://', '').replace('https://', '').replace('www.', '').split(/[/?#]/)[0];
    return domain
}

function checkUrl(url) {
    const substrings = ["/dp", "/gp/product", "s?k="]
    const result = substrings.some(str => url.includes(str))
    return result
}

async function get_database_elements(db_name) {
    const q = query(collection(db, db_name));
    const querySnapshot = await getDocs(q);
    return querySnapshot
}

function send_data(snapshot, tabInfo) { // we are sending a message back to popup.js with data
    chrome.runtime.sendMessage({data: snapshot.docs[0].data(), domain: tabInfo.domain, tabName: tabInfo.tabName, command: 'AMAZON - PRODUCT'});
}

chrome.runtime.onMessage.addListener(async (msg) => {
    let tabInfo = await getTab({active: true, lastFocusedWindow: true})
    if (tabInfo.domain === "amazon.com" && tabInfo.productPage) {
        // This allows me to see in the service worker,
        // what data I am retrieving from Firestore
        // This won't stay long term
        let products = [];

        get_database_elements('products').then((snapshot) => {
            send_data(snapshot, tabInfo)
            snapshot.docs.forEach((doc) => {
                products.push(doc.data())
            })
            console.log(products)
        }).catch(err => {
            console.log(err.message)
        })
    } else if (tabInfo.domain === 'amazon.com') {
        chrome.runtime.sendMessage({command: 'AMAZON - NOT PRODUCT'})
    } else {
        chrome.runtime.sendMessage({command: 'NOT AMAZON'})
    }
})
