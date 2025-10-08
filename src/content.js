console.log("SafePrompt content script active!");

const inputSelector = 'textarea'; // ChatGPT text area

async function loadModuleAndRun() {
  try {
    const { monitorPrompts } = await import(chrome.runtime.getURL('src/detector.js'))
  

function hookPromptBox() {
  const inputBox = document.querySelector(inputSelector);
  if (!inputBox) return;

  inputBox.addEventListener('input', () => {
    const text = inputBox.value;
    const findings = detectSensitive(text);
    if (findings.length > 0) {
      showWarning(findings);
    } else {
      clearWarning();
    }
  });
}

function showWarning(findings) {
  // Simple inline banner
  let banner = document.getElementById('safeprompt-banner');
  if (!banner) {
    banner = document.createElement('div');
    banner.id = 'safeprompt-banner';
    banner.style = "background: #ffefc4; color: #222; padding: 8px; border-radius: 6px; margin-top: 4px;";
    inputBox.parentNode.appendChild(banner);
  }
  banner.textContent = `⚠️ ${findings.length} potential issue(s) detected.`;
}

function clearWarning() {
  const banner = document.getElementById('safeprompt-banner');
  if (banner) banner.remove();
}

hookPromptBox();
