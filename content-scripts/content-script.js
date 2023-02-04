console.log("Hello from the content script!")

document.body.innerHTML += `
<div id="container">
    <h1>This is the content script</h1>
    <button id="btn">Send content script message</button>
`

document.querySelector("#btn").addEventListener('click', () => {
    chrome.runtime.sendMessage( { text: "content script" })
});

chrome.runtime.onMessage.addListener( (msg) => {
    document.querySelector("#container").innerHTML += `<div>${msg.text}</div>`
})