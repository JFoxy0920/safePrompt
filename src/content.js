console.log("SafePrompt content script active!");

const inputSelector = 'textarea';

let detectSensitive;

async function loadModuleAndRun() {
    try {
        const detectorURL = chrome.runtime.getURL('src/detector.js');
        const moduleScript = document.createElement('script');
        moduleScript.type = 'module';
        moduleScript.textContent = `
            import { detectSensitive as ds } from "${detectorURL}";
            window.__safePromptDetector = ds;        
            console.log("Detector module loaded and attached to window.");
        `;
        (document.head || document.documentElement).appendChild(moduleScript);

        await new Promise(resolve => {
            const check = setInterval(() => {
                if (window.__safePromptDetector) {
                    detectSensitive = window.__safePromptDetector;
                    clearInterval(check);
                    resolve();
                }
            }, 50);
        });
        
        hookPromptBox();

    } catch (error) {
        console.error("SafePrompt Error: Failed to load detector module or run logic:", error);
    }
}

function hookPromptBox() {
    const inputBox = document.querySelector(inputSelector);
    if (!inputBox) {
        console.warn("Input box not found yet. Retrying in 1 second...");
        setTimeout(hookPromptBox, 1000); 
        return;
    }

    inputBox.addEventListener('input', () => {
        const text = inputBox.value;
        
        // Ensure detectSensitive is loaded before calling it
        if (!detectSensitive) {
            console.error("Detector function is not yet loaded!");
            return;
        }
        
        const findings = detectSensitive(text);
        if (findings.length > 0) {
            showWarning(inputBox, findings);
        } else {
            clearWarning(inputBox);
        }
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
    
    banner.textContent = `⚠️ LEAK ALERT: ${findings.length} issue(s) detected. Details: ${findings.join(' | ')}`;
}

function clearWarning(inputElement) {
    const banner = document.getElementById('safeprompt-banner');
    if (banner) {
        banner.remove();
    }
}

loadModuleAndRun();
