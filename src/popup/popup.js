chrome.runtime.sendMessage({command: 'GET'})

chrome.runtime.onMessage.addListener((msg) => {
    if (msg.command === 'AMAZON - PRODUCT FOUND') {
        let alert = "Alternative Found!"
        let text = "Try this product instead!"

        document.body.innerHTML = createPopUpHTMLwithProduct(alert, text, msg)

        const image = document.querySelector('.productImage')

        image.addEventListener('click', function (e) {
            chrome.tabs.create({
                    url: `${
                    msg.data.link
                }`
            });
        })
    } else if (msg.command === 'AMAZON - PRODUCT IS ALTERNATIVE') {
        let alert = "Excellent Choice!"
        let text = "This product is sustainable and <br> environmentally-friendly."
        
        document.body.innerHTML = createPopUpHTML(alert, text, false)

    } else if (msg.command === 'AMAZON - PRODUCT NOT FOUND') {
        let alert = "No Alternative Found!"
        let text = "We are adding more products every day, <br> check again soon."
        
        document.body.innerHTML = createPopUpHTML(alert, text, false)

    } else if (msg.command === 'AMAZON - NOT PRODUCT PAGE') {
        let alert = "No Alternative Found!"
        let text = "Open a product to start finding sustainable, <br> environmentally-friendly alternatives!"

        document.body.innerHTML = createPopUpHTML(alert, text, false)

    } else if (msg.command === 'NOT AMAZON SITE') {

        let text = "Start finding sustainable, environmentally-friendly alternatives for products on Amazon."

        document.body.innerHTML = createPopUpHTML(null, text, true)

        const link = document.querySelector('.amazon-link')

        link.addEventListener('click', function (e) {
            chrome.tabs.create({url: `https://www.amazon.com`});
        })
    } else {
        let alert = "Oh snap! Something went wrong!"
        let text = "Try again later."
        
        document.body.innerHTML = createPopUpHTML(alert, text, false)
    }
})

function createPopUpHTML(alert, text, button) {

    let headerHTML = `            
        <div class = "header">
            <h3> 
                <img src="assets/greenicon.png" class="icon">
                Greener Healthier Happier
            </h3>
        </div>
    `

    let messageHTML;
    if (!alert) {
        messageHTML = `<p>${text}</p>`

    } else {
        messageHTML = `
            <p class = "alert">${alert}</p>
            <p>${text}</p>
        `
    }

    let buttonHTML = `
        <div class="button">
            <button class="amazon-link" >Open Amazon</button>
        </div>
    `

    if (button) {
        return `
            <div>
                ${headerHTML}
                <div class = "message">
                    ${messageHTML}
                </div>
                ${buttonHTML}
            </div>
        `
    } else {
        return `
            <div>
                ${headerHTML}
                <div class = "message">
                    ${messageHTML}
                </div>
            </div>
    `   
    }
}

function createPopUpHTMLwithProduct(alert, text, msg) {
    let html = createPopUpHTML(alert, text, false)

    let productHTML = `
        <div class="product">
            <a href="">
                <img 
                    src="https:${msg.data.img}" 
                    alt="${msg.data.name}"
                    class="productImage"
                >
            </a>
        </div>
    `
    return html += productHTML
}



// module.exports = {
//     startPopup
// }
