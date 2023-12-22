var store = {};

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'from_content_script') {
        store = message.content;
    } else if (message.type === 'from_popup') {
        sendResponse(store);
    }
});
