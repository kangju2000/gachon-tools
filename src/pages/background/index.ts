let color = '#3aa757';

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ color });
  console.log('기본 배경색은 %cgreen', `color: ${color}`);
});

export {};
