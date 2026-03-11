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
    console.log("Background - GET_SESSION request received");
    
    chrome.cookies.getAll({ url: PRODUCTION_URL }, (cookies) => {
      console.log(`Background - Found ${cookies.length} cookies for ${PRODUCTION_URL}`);
      
      // Find the auth token cookie (Supabase SSR format)
      const tokenCookie = cookies.find(c => c.name.includes("auth-token"));
      
      if (tokenCookie) {
        console.log("Background - Found auth-token cookie:", tokenCookie.name);
        let rawValue = decodeURIComponent(tokenCookie.value);
        
        // Supabase SSR often prefixes base64-encoded JSON objects with "base64-"
        if (rawValue.startsWith("base64-")) {
          try {
            console.log("Background - Decoding base64 cookie...");
            rawValue = atob(rawValue.substring(7));
          } catch (e) {
            console.error("Background - Base64 decode failed:", e.message);
          }
        }

        try {
          const tokenData = JSON.parse(rawValue);
          if (tokenData.access_token) {
            console.log("Background - Successfully extracted access_token JWT");
            sendResponse({ accessToken: tokenData.access_token });
            return;
          }
        } catch (e) {
          console.log("Background - Cookie not JSON, using raw value as token");
          sendResponse({ accessToken: rawValue });
          return;
        }
      }
      
      console.warn("Background - No auth-token cookie found");
      sendResponse({ error: "No session found in cookies" });
    });
    return true; 
  }
});
