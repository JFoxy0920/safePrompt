async function loadModuleAndRun() {
  window.DEBUG_MODE = true; // Set to false in production
  try {
    const detectorModule = await import(chrome.runtime.getURL('src/detector.js'));
    console.log("Loaded detector module:", detectorModule);
    window.detectSensitive = detectorModule.detectSensitive;

    hookEditableElement();
    addDebugToggle();
  } catch (error) {
    console.error("SafePrompt Error: Failed to load detector module:", error);
  }
}

function findEditableElement() {
  const candidates = Array.from(document.querySelectorAll('textarea, input[type="text"], input[type="search"], [contenteditable="true"]'));

  for (const el of candidates) {
    const isVisible = el.offsetParent !== null;
    const isEditable = el.tagName === 'TEXTAREA' || el.tagName === 'INPUT' || el.isContentEditable;

    if (isVisible && isEditable) {
      return el;
    }
  }

  return null;
}

function hookEditableElement() {
  const inputBox = findEditableElement();

  if (!inputBox) {
    console.warn("Editable input not found yet. Retrying in 1 second...");
    setTimeout(hookEditableElement, 1000);
    return;
  }

  const getText = () => inputBox.isContentEditable ? inputBox.innerText : inputBox.value;

  inputBox.addEventListener('input', () => {
    const text = getText();
    if (DEBUG_MODE) console.log(`[DEBUG] Input text: "${text}"`);

    if (!detectSensitive) {
      console.error("Detector function is not yet loaded!");
      return;
    }

    const findings = window.detectSensitive(text);
    if (DEBUG_MODE) console.log(`[DEBUG] Findings:`, findings);

    findings.length > 0 ? showWarning(inputBox, findings) : clearWarning(inputBox);
  });

  console.log("Hooked editable element:", inputBox);
  showDebugBanner("Editable input hooked");

  console.log("Element ID:", inputBox.id);
  console.log("Element class:", inputBox.className);
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
