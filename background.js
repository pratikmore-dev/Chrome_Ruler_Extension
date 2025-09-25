// Background service worker for message handling
// chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
//   if (request.action === "rotateRuler") {
//     // Forward the message to the content script
//     chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
//       if (tabs[0]) {
//         chrome.tabs.sendMessage(tabs[0].id, {action: "rotateRuler"});
//       }
//     });
//   }
// });

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  debugger;
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (!tabs[0]) return;

    if (request.action === "rotateRuler") {
      chrome.tabs.sendMessage(tabs[0].id, { action: "rotateRuler" });
    } else if (request.action === "toggleRuler") {
      chrome.tabs.sendMessage(tabs[0].id, { action: "toggleRuler" });
    }
     else if (request.action === "showRuler") {
      debugger;
      chrome.tabs.sendMessage(tabs[0].id, { action: "showRuler" });
    } else if (request.action === "hideRuler") {
      debugger;
      chrome.tabs.sendMessage(tabs[0].id, { action: "hideRuler" });
    }
  });
});
