(function() {
  'use strict';
  
  let ruler = null;
  let isDragging = false;
  let dragOffset = { x: 0, y: 0 };
  let currentRotation = 0;
  
  // Create and inject the ruler

  function createRuler() {
  if (ruler) return; // Prevent multiple rulers

  ruler = document.createElement("div");
  ruler.id = "page-ruler";
  ruler.className = "page-ruler";
  const marginCm = 0.5; 

  // conversion factor (approx, 96dpi -> 1in=96px, 1cm=37.8px)
  const pxPerCm = 37.8;
  const totalCm = 10;
  const pxPerMm = pxPerCm / 10;

  // Set width of 10 cm + margin on both end
  // ruler.style.width = (totalCm * pxPerCm) + "px";
  ruler.style.width = ((totalCm + marginCm * 2) * pxPerCm) + "px";

  // Add mm marks
  for (let mm = 0; mm <= totalCm * 10; mm++) {
    const mark = document.createElement("div");

    if (mm % 10 === 0) {
      // 1 cm major mark
      mark.className = "ruler-mark major-mark";

      const label = document.createElement("span");
      label.textContent = mm / 10;
      label.className = "ruler-label";
      mark.appendChild(label);

    } else if (mm % 5 === 0) {
      // 5 mm half cm
      mark.className = "ruler-mark half-cm-mark";
    } else {
      // normal mm
      mark.className = "ruler-mark mm-mark";
    }

    // mark.style.left = (mm * pxPerMm) + "px";
    mark.style.left = (marginCm * pxPerCm + mm * pxPerMm) + "px";
    ruler.appendChild(mark);
  }

  // Position ruler initially
  ruler.style.left = "100px";
  ruler.style.top = "100px";

  // Add event listeners
  ruler.addEventListener("mousedown", startDrag);
  ruler.addEventListener("dblclick", rotateRuler);

  document.body.appendChild(ruler);
}

  
  function startDrag(e) {
    e.preventDefault();
    isDragging = true;
    
    const rect = ruler.getBoundingClientRect();
    dragOffset.x = e.clientX - rect.left;
    dragOffset.y = e.clientY - rect.top;
    
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', stopDrag);
    
    ruler.style.cursor = 'grabbing';
  }
  
  function drag(e) {
    if (!isDragging) return;
    
    e.preventDefault();
    const x = e.clientX - dragOffset.x;
    const y = e.clientY - dragOffset.y;
    
    ruler.style.left = x + 'px';
    ruler.style.top = y + 'px';
  }
  
  function stopDrag() {
    isDragging = false;
    document.removeEventListener('mousemove', drag);
    document.removeEventListener('mouseup', stopDrag);
    ruler.style.cursor = 'grab';
  }
  
  function rotateRuler() {
    currentRotation = (currentRotation + 45) % 360;
    ruler.style.transform = `rotate(${currentRotation}deg)`;
  }
  
  // Listen for messages from popup
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "rotateRuler") {
      rotateRuler();
    }
  });
  
  // Initialize ruler when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createRuler);
  } else {
    createRuler();
  }
})();