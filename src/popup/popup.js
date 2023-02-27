// Retrieve webpage data
chrome.runtime.sendMessage({command: 'GET'})

chrome.runtime.onMessage.addListener((msg) => {
    if (msg.command === 'AMAZON - PRODUCT') {
        document.body.innerHTML = `
    <div>
        Alternative: ${
            msg.data.name
        }<br>
        <img src="https:${
            msg.data.img
        }">
        <button class="product-link">Open Product Page</button>
    </div>
    `
        const link = document.querySelector('.product-link')

        link.addEventListener('click', function (e) {
            chrome.tabs.create({
                    url: `${
                    msg.data.link
                }`
            });
        })
    } else if (msg.command === 'AMAZON - NOT PRODUCT') {
        document.body.innerHTML = `
            <div>
                Click on a product to start finding alternatives!
            </div>
        `
    } else {
        document.body.innerHTML = `
    <div>
        Go to Amazon to start shopping
    <br>
        <button class="amazon-link">Open Amazon</button>
    </div>
    `
        const link = document.querySelector('.amazon-link')

        link.addEventListener('click', function (e) {
            chrome.tabs.create({url: `https://www.amazon.com`});
        })

    }
})
