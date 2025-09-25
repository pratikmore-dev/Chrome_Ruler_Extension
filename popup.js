document.addEventListener('DOMContentLoaded', function() {
  const rotateButton = document.getElementById('rotateButton');
    const toggleButton = document.getElementById('toggleButton');
      const showHideSwitch = document.getElementById('showHideSwitch');



      if (toggleButton) {
    toggleButton.addEventListener('click', function () {
      chrome.runtime.sendMessage({ action: "toggleRuler" });
      // window.close();
    });
  }

    if (showHideSwitch) {
      debugger;
    showHideSwitch.addEventListener('change', function () {
      if (showHideSwitch.checked) {
        chrome.runtime.sendMessage({ action: "showRuler" });
      } else {
        chrome.runtime.sendMessage({ action: "hideRuler" });
      }
      // popup stays open
    });
  }
  
  if (rotateButton) {
    rotateButton.addEventListener('click', function() {
      chrome.runtime.sendMessage({
        action: "rotateRuler"
      });
      // window.close();
    });
  }
});