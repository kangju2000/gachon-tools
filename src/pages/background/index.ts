chrome.runtime.onInstalled.addListener(async () => {
  for (const cs of chrome.runtime.getManifest().content_scripts) {
    for (const tab of await chrome.tabs.query({ url: cs.matches })) {
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: cs.js,
      });
      cs.css?.forEach(css => {
        chrome.scripting.insertCSS({
          target: { tabId: tab.id },
          files: [css],
        });
      });
    }
  }
});

chrome.storage.onChanged.addListener((changes, areaName) => {
  console.log(changes, areaName);
  if (areaName === 'local') {
    for (const [key, { newValue }] of Object.entries(changes)) {
      console.log(`storage.local.${key} changed from ${newValue}`);
    }
  }
});

export {};
