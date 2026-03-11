// AtomaClip AI Background Service Worker
const PRODUCTION_URL = "https://atomaclip-ai-production.up.railway.app";

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

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "GET_SESSION") {
    // Try to get Supabase session from cookies for the production app
    // Supabase uses cookies starting with sb-
    chrome.cookies.getAll({ url: PRODUCTION_URL }, (cookies) => {
      // Find the access token cookie. It usually looks like sb-YOURPROJECTID-auth-token
      const tokenCookie = cookies.find(c => c.name.includes("auth-token"));
      
      if (tokenCookie) {
        try {
          // Supabase token cookies are often JSON encoded
          const tokenData = JSON.parse(decodeURIComponent(tokenCookie.value));
          if (tokenData.access_token) {
            sendResponse({ accessToken: tokenData.access_token });
            return;
          }
        } catch (e) {
          // If not JSON, it might just be the token itself
          sendResponse({ accessToken: tokenCookie.value });
          return;
        }
      }
      sendResponse({ error: "No session found in cookies" });
    });
    return true; // Keep message channel open for async response
  }
});
