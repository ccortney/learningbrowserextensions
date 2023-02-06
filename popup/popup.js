// import {get_database_elements} from "./js/firebase/firebase_config.js"

console.log("Hello from the popup!")

document.querySelector("#btn").addEventListener('click', () => {
    chrome.runtime.sendMessage( { text: "Popup" })
    // get_database_elements('books')
});

chrome.tabs.query({
    active: true, 
    currentWindow: true
}, (tabs) => {
    chrome.tabs.sendMessage(
        tabs[0]?.id, 
        {text: "Popup"}
    )
})

chrome.runtime.onMessage.addListener( (msg) => {
    document.body.innerHTML += `<div>${msg.text}</div>`
})