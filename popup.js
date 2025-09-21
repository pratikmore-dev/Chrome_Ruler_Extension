document.addEventListener('DOMContentLoaded', function() {
  const rotateButton = document.getElementById('rotateButton');
  
  if (rotateButton) {
    rotateButton.addEventListener('click', function() {
      chrome.runtime.sendMessage({
        action: "rotateRuler"
      });
      window.close();
    });
  }
});