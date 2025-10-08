import { detectSensitive } from './detector.js'; 

function monitorPrompts() {
    console.log("Leak monitoring started. Looking for text areas...");

    const selectors = ['textarea', '[contenteditable="true"]'];
    selectors.forEach(selector => {
        document.querySelectorAll(selector).forEach(inputElement => {
            inputElement.addEventListener('input', handlePromptInput);
        });
    });
}

function removeExistingWarning(inputElement) {
    const container = inputElement.parentElement; 
    if (existingWarning) {
        container.removeChild(existingWarning);
}

function displayWarning(inputElement, warnings) {
    removeExistingWarning(inputElement);
    const warningDiv = document.createElement('div');
    warningDiv.className = 'safePrompt-warning-extension';

    warningDiv.style.cssText = 
      `
          position: absolute;
          bottom: 5px; 
          right: 5px;  
          z-index: 20000; 
          background-color: #d32f2f; 
          color: white;
          padding: 5px 10px;
          border-radius: 4px;
          font-family: sans-serif;
          font-size: 12px;
          font-weight: bold;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
          cursor: pointer;
      `;

    const joinedWarnings = warnings.join(' | ');
    warningDiv.textContent = `⚠️ LEAK ALERT: ${joinedWarnings}`;

    let container = inputElement.parentElement;

    if (window.getComputedStyle(container).position === 'static') {
        container.style.position = 'relative';
    }

    container.appendChild(warningDiv);
}

  function handlePromptInput(event) {
    const promptText = event.target.value || event.target.innerText;
    const warnings = detectSensitive(promptText); // <-- Use the imported function!
    removeExistingWarning(event.target);
    if (warnings.length > 0) {
        console.warn("Critical Leak Warning:", warnings);
        displayWarning(event.target, warnings);
    }
}

export { monitorPrompts }; 
