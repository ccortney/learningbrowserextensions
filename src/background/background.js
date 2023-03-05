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
    let urlResults = checkUrl(result[0].url)
    return {
        tabName: result[0].title,
        domain: domain,
        url: result[0].url,
        ... urlResults
    }
}

function getDomain(url) {
    let domain = url;
    domain = domain.replace('http://', '').replace('https://', '').replace('www.', '').split(/[/?#]/)[0];
    return domain
}

function checkUrl(url) {
    const productStrs = ["/dp", "/gp/product"]
    const searchStr = "s?k="
    const productResult = productStrs.some(str => url.includes(str))
    const searchResult = url.includes(searchStr)
    return {productPage: productResult, searchPage: searchResult}
}

async function getDatabaseElements(db_name) {
    const q = query(collection(db, db_name));
    const querySnapshot = await getDocs(q);
    return querySnapshot
}

async function searchData(snapshot, tabInfo) {
    const tab = tabInfo.tabName.replace('Amazon.com : ', '').toLowerCase();
    for (let doc of snapshot.docs) {
        if (tabInfo.productPage) {
            if (tab.includes(doc.data().name.toLowerCase())) {
                return doc.data()
            }
        } else {
            if (doc.data().name.toLowerCase().includes(tab)) {
                return doc.data()
            }
        }
    }
}

function sendData(doc, tabInfo) { // we are sending a message back to popup.js with data
    if (! doc) {
        chrome.runtime.sendMessage({domain: tabInfo.domain, tabName: tabInfo.tabName, command: 'AMAZON - PRODUCT NOT FOUND'});
    } else {
        chrome.runtime.sendMessage({data: doc, domain: tabInfo.domain, tabName: tabInfo.tabName, command: 'AMAZON - PRODUCT FOUND'});
    }
}

chrome.runtime.onMessage.addListener(async (msg) => {
    let tabInfo = await getTab({active: true, lastFocusedWindow: true})
    if (tabInfo.domain === "amazon.com" && (tabInfo.productPage || tabInfo.searchPage)) {

        getDatabaseElements('products').then((snapshot) => {
            return searchData(snapshot, tabInfo)

        }).then((doc) => {
            sendData(doc, tabInfo)
        }).catch(err => {
            console.log(`Error: ${
                err.message
            }`)
        })
    } else if (tabInfo.domain === 'amazon.com') {
        chrome.runtime.sendMessage({command: 'AMAZON - NOT PRODUCT PAGE'})
    } else {
        chrome.runtime.sendMessage({command: 'NOT AMAZON SITE'})
    }
})
