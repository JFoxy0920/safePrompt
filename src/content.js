const host = document.querySelector('some-host-element');
const shadowRoot = host?.shadowRoot;
const inputBox = shadowRoot?.querySelector('textarea');

let detectSensitive;

async function loadModuleAndRun() {
    const DEBUG_MODE = true; // Set to false in production
    try {
        const detectorModule = await import(chrome.runtime.getURL('src/detector.js'));
        console.log("Loaded detector module:", detectorModule);
        const { detectSensitive } = await import(chrome.runtime.getURL('src/detector.js'));
        window.detectSensitive = detectorModule.detectSensitive;
        console.log("Detector module loaded:", detectorModule);
        
        hookPromptBox();
        addDebugToggle();

    } catch (error) {
        console.error("SafePrompt Error: Failed to load detector module:", error);
    }
}

function hookPromptBox() {
    if (!inputBox) {
        console.warn("Input box not found yet. Retrying in 1 second...");
        setTimeout(hookPromptBox, 1000); 
        return;
    }

    inputBox.addEventListener('input', () => {
        const text = inputBox.value;
        if (DEBUG_MODE) console.log(`[DEBUG] Input text: "${text}"`);
            if (!detectSensitive) {
                console.error("Detector function is not yet loaded!");
                    return;}
      const findings = detectSensitive(text);
      if (DEBUG_MODE) console.log(`[DEBUG] Findings:`, findings);
          findings.length > 0 ? showWarning(inputBox, findings) : clearWarning(inputBox);
    });
    console.log("Prompt box hooked successfully.");
    const id = inputBox.id;
    const className = inputBox.className;
    const 
    console.log("Textarea ID:", id);
    console.log("Textarea class:", className);
}

function addDebugToggle() {
  const toggleContainer = document.createElement('div');
  toggleContainer.style.cssText = `
    position: fixed;
    bottom: 12px;
    right: 12px;
    background: #f5f5f5;
    border: 1px solid #ccc;
    padding: 8px 12px;
    border-radius: 6px;
    font-size: 14px;
    z-index: 9999;
  `;

  toggleContainer.innerHTML = `
    <label>
      <input type="checkbox" id="debug-toggle" />
      Debug Mode
    </label>
  `;

  document.body.appendChild(toggleContainer);

  const checkbox = document.getElementById('debug-toggle');
  checkbox.addEventListener('change', (e) => {
    window.DEBUG_MODE = e.target.checked;
    console.log(`[DEBUG] Debug mode is now ${window.DEBUG_MODE ? 'ON' : 'OFF'}`);
  });
}

function showWarning(inputElement, findings) {
    const parent = inputElement.parentNode; 
    let banner = document.getElementById('safeprompt-banner');
    
    if (!banner) {
        banner = document.createElement('div');
        banner.id = 'safeprompt-banner';
        banner.style.cssText = "background: #d32f2f; color: white; padding: 6px 12px; border-radius: 4px; margin-top: 4px; font-weight: bold; font-size: 13px; z-index: 9999;";
        parent.insertBefore(banner, inputElement.nextSibling);
    }
    console.log("Errors:", findings);
    banner.textContent = `⚠️ LEAK ALERT: ${findings.length} issue(s) detected. Details: ${findings.join(' | ')}`;
}

function showDebugBanner(message) {
  if (!DEBUG_MODE) return;

  let banner = document.getElementById('debug-banner');
  if (!banner) {
    banner = document.createElement('div');
    banner.id = 'debug-banner';
    banner.style.cssText = "background: #1976d2; color: white; padding: 4px 8px; font-size: 12px; margin-top: 4px;";
    document.body.appendChild(banner);
  }
  banner.textContent = `DEBUG: ${message}`;
}

function clearWarning(inputElement) {
    const banner = document.getElementById('safeprompt-banner');
    if (banner) {
        banner.remove();
    }
}

loadModuleAndRun();
