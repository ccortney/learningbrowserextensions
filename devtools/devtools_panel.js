const req = require("express/lib/request");

console.log("hello from the devtools panel");

chrome.devtools.network.onRequestFinish.addListener(
    (request) => {
        document.body.innerHTML +=
            `<div>${request.request.url}</div>`
    }
)