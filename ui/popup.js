const toggleBtn = document.getElementById('toggleBtn');
const statusDiv = document.getElementById('status');

// Load state from browser storage
chrome.storage.local.get(['protectionEnabled'], (result) => {
  const enabled = result.protectionEnabled ?? true;
  updateUI(enabled);
});

toggleBtn.addEventListener('click', () => {
  chrome.storage.local.get(['protectionEnabled'], (result) => {
    const enabled = !(result.protectionEnabled ?? true);
    chrome.storage.local.set({ protectionEnabled: enabled }, () => {
      updateUI(enabled);
      // Notify content scripts (optional)
      chrome.runtime.sendMessage({ action: 'toggleProtection', enabled });
    });
  });
});

function updateUI(enabled) {
  if (enabled) {
    statusDiv.classList.remove('inactive');
    statusDiv.classList.add('active');
    statusDiv.innerHTML = '🟢 Protection: <strong>Active</strong>';
    toggleBtn.textContent = 'Turn Off';
  } else {
    statusDiv.classList.remove('active');
    statusDiv.classList.add('inactive');
    statusDiv.innerHTML = '🔴 Protection: <strong>Disabled</strong>';
    toggleBtn.textContent = 'Turn On';
  }
}
