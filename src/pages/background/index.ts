chrome.runtime.onInstalled.addListener(async () => {
  for (const cs of chrome.runtime.getManifest().content_scripts) {
    for (const tab of await chrome.tabs.query({ url: cs.matches })) {
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: cs.js,
      })
      cs.css?.forEach(css => {
        chrome.scripting.insertCSS({
          target: { tabId: tab.id },
          files: [css],
        })
      })
    }
  }
})

chrome.runtime.onUpdateAvailable.addListener(() => {
  chrome.runtime.reload()
})

chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName === 'local') {
    for (const key of Object.keys(changes)) {
      console.log(`storage.local.${key} changed`)
    }
  }
})

export {}
