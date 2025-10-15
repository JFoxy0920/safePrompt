//I know this textarea works, I changed it and the whole thing broke
const inputSelector = 'textarea';

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

    } catch (error) {
        console.error("SafePrompt Error: Failed to load detector module:", error);
    }
}

function hookPromptBox() {
    const inputBox = document.querySelector(inputSelector);
    if (!inputBox) {
        console.warn("Input box not found yet. Retrying in 1 second...");
        setTimeout(hookPromptBox, 1000); 
        return;
    }

    ['input', 'change', 'keyup'].forEach(event => {
      inputBox.addEventListener(event, () => {
        const text = inputBox.value;
        if (!detectSensitive){
            return;
        }
        const findings = detectSensitive(text);
        findings.length > 0 ? showWarning(inputBox, findings) : clearWarning(inputBox);
      });
    });
    console.log("Prompt box hooked successfully.");
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

function clearWarning(inputElement) {
    const banner = document.getElementById('safeprompt-banner');
    if (banner) {
        banner.remove();
    }
}

loadModuleAndRun();
