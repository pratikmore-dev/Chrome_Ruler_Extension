// Background service worker for message handling
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "rotateRuler") {
    // Forward the message to the content script
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
      if (tabs[0]) {
        chrome.tabs.sendMessage(tabs[0].id, {action: "rotateRuler"});
      }
    });
  }
});