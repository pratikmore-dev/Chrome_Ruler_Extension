(function () {
  'use strict';

  let ruler = null;
  let isDragging = false;
  let dragOffset = { x: 0, y: 0 };
  let currentRotation = 0;

  function createRuler() {
    if (ruler) return; // already exists

    ruler = document.createElement("div");
    ruler.id = "page-ruler";
    ruler.className = "page-ruler";

    const marginCm = 0.5;
    const pxPerCm = 37.8;
    const totalCm = 10;
    const pxPerMm = pxPerCm / 10;

    ruler.style.width = ((totalCm + marginCm * 2) * pxPerCm) + "px";

    // Add basic styling since CSS might not be loaded
    ruler.style.cssText += `
      position: fixed;
      height: 40px;
      background: rgba(255, 255, 255, 0.9);
      border: 1px solid #ccc;
      border-radius: 4px;
      cursor: grab;
      z-index: 10000;
      box-shadow: 0 2px 8px rgba(0,0,0,0.2);
    `;

    for (let mm = 0; mm <= totalCm * 10; mm++) {
      const mark = document.createElement("div");

      if (mm % 10 === 0) {
        mark.className = "ruler-mark major-mark";
        mark.style.cssText = `
          position: absolute;
          top: 0;
          width: 2px;
          height: 30px;
          background: #333;
        `;
        const label = document.createElement("span");
        label.textContent = mm / 10;
        label.className = "ruler-label";
        label.style.cssText = `
          position: absolute;
          top: 32px;
          left: -5px;
          font-size: 10px;
          color: #333;
          font-family: Arial, sans-serif;
        `;
        mark.appendChild(label);
      } else if (mm % 5 === 0) {
        mark.className = "ruler-mark half-cm-mark";
        mark.style.cssText = `
          position: absolute;
          top: 5px;
          width: 1px;
          height: 20px;
          background: #666;
        `;
      } else {
        mark.className = "ruler-mark mm-mark";
        mark.style.cssText = `
          position: absolute;
          top: 10px;
          width: 1px;
          height: 15px;
          background: #999;
        `;
      }

      mark.style.left = (marginCm * pxPerCm + mm * pxPerMm) + "px";
      ruler.appendChild(mark);
    }

    ruler.style.left = "100px";
    ruler.style.top = "100px";

    ruler.addEventListener("mousedown", startDrag);
    ruler.addEventListener("dblclick", rotateRuler);

    document.body.appendChild(ruler);
  }

  function removeRuler() {
    if (ruler) {
      ruler.remove();
      ruler = null;
    }
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
    ruler.style.left = (e.clientX - dragOffset.x) + 'px';
    ruler.style.top = (e.clientY - dragOffset.y) + 'px';
  }

  function stopDrag() {
    isDragging = false;
    document.removeEventListener('mousemove', drag);
    document.removeEventListener('mouseup', stopDrag);
    ruler.style.cursor = 'grab';
  }

  function rotateRuler() {
    if (!ruler) return;
    currentRotation = (currentRotation + 45) % 360;
    ruler.style.transform = `rotate(${currentRotation}deg)`;
  }

  // Listen for messages
  chrome.runtime.onMessage.addListener((request) => {
    console.log('Content script received message:', request.action);
    
    if (request.action === "rotateRuler") {
      rotateRuler();
    } else if (request.action === "toggleRuler") {
      if (ruler) {
        removeRuler();
      } else {
        createRuler();
      }
    } else if (request.action === "showRuler") {
      createRuler();
    } else if (request.action === "hideRuler") {
      removeRuler();
    }
  });
})();