document.addEventListener('DOMContentLoaded', function() {
  const rotateButton = document.getElementById('rotateButton');
    const toggleButton = document.getElementById('toggleButton');


      if (toggleButton) {
    toggleButton.addEventListener('click', function () {
      chrome.runtime.sendMessage({ action: "toggleRuler" });
      window.close();
    });
  }
  
  if (rotateButton) {
    rotateButton.addEventListener('click', function() {
      chrome.runtime.sendMessage({
        action: "rotateRuler"
      });
      window.close();
    });
  }
});