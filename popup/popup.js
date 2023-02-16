
chrome.runtime.sendMessage( { text: '?', command: 'GET' })

chrome.runtime.onMessage.addListener( (msg) => {
    document.body.innerHTML = `
    <div>
        Alternative: ${msg.text.data.name}<br>
        <img src=${msg.text.data.img}>
        <a href=${msg.text.data.link}>Go to Product</a>
    </div>
    `
})

// I need to use browserAction somehow to get new tabs (links) to work
// chrome.browserAction.onClicked.addListener(function(tab) {
//     chrome.tabs.create({ url: "http://www.google.com" });
// });