
chrome.runtime.sendMessage( { text: '?', command: 'GET' })

chrome.runtime.onMessage.addListener( (msg) => {
    document.body.innerHTML = `
    <div>
        Alternative: ${msg.text.data.name}<br>
        <img src="https:${msg.text.data.img}">
        <button class="product-link">Open Product Page</button>
    </div>
    `
    const link = document.querySelector('.product-link')
    
    link.addEventListener('click', function (e) {
        chrome.tabs.create({
            url:`${msg.text.data.link}`
          });
    })
})
