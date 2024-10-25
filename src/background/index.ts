chrome.runtime.onInstalled.addListener(async () => {
  for (const cs of chrome.runtime.getManifest().content_scripts ?? []) {
    for (const tab of await chrome.tabs.query({ url: cs.matches ?? [] })) {
      chrome.scripting.executeScript({
        target: { tabId: tab.id ?? 0 },
        files: cs.js ?? [],
      })
      cs.css?.forEach(css => {
        chrome.scripting.insertCSS({
          target: { tabId: tab.id ?? 0 },
          files: [css],
        })
      })
    }
  }
})

chrome.runtime.onUpdateAvailable.addListener(() => {
  chrome.runtime.reload()
})

chrome.runtime.onConnect.addListener(port => {
  console.log('Connected .....', port)

  if (port.name === '@crx/client') {
    port.onMessage.addListener(msg => {
      console.log('message received', msg)
    })
  }
})

chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName === 'local') {
    for (const key of Object.keys(changes)) {
      console.log(`storage.local.${key} changed`)
    }
  }
})

export {}
