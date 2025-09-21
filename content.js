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

    for (let mm = 0; mm <= totalCm * 10; mm++) {
      const mark = document.createElement("div");

      if (mm % 10 === 0) {
        mark.className = "ruler-mark major-mark";
        const label = document.createElement("span");
        label.textContent = mm / 10;
        label.className = "ruler-label";
        mark.appendChild(label);
      } else if (mm % 5 === 0) {
        mark.className = "ruler-mark half-cm-mark";
      } else {
        mark.className = "ruler-mark mm-mark";
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
    if (request.action === "rotateRuler") {
      rotateRuler();
    } else if (request.action === "toggleRuler") {
      if (ruler) {
        removeRuler();
      } else {
        createRuler();
      }
    }
  });
})();
