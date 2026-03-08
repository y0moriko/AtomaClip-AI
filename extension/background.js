// AtomaClip AI Background Service Worker

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "atomaclip-capture",
    title: "Capture Insight (AtomaClip)",
    contexts: ["selection"]
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "atomaclip-capture") {
    chrome.tabs.sendMessage(tab.id, { action: "CAPTURE_SELECTION" });
  }
});
