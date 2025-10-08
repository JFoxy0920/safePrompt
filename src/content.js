console.log("SafePrompt content script active!");

const inputSelector = 'textarea'; 

async function loadModuleAndRun() {
    try {
        const { detectSensitive } = await import(chrome.runtime.getURL('src/detector.js'));
        function hookPromptBox() {
            const inputBox = document.querySelector(inputSelector);
            if (!inputBox) {
                console.warn("Input box not found yet. Retrying in 1 second...");
                setTimeout(hookPromptBox, 1000); // Simple retry mechanism
                return;
            }

            inputBox.addEventListener('input', () => {
                const text = inputBox.value;
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
        hookPromptBox();
    } catch (error) {
        console.error("SafePrompt Error: Failed to load detector module or run logic:", error);
    }
}
loadModuleAndRun();
