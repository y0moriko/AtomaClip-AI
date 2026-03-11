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
      
      // Log cookie names for debugging (don't log values!)
      cookies.forEach(c => console.log("Background - Cookie name:", c.name));

      // Supabase cookies usually look like: sb-[project-id]-auth-token
      // Or sb-[project-id]-auth-token.0 (chunked)
      const tokenCookie = cookies.find(c => c.name.includes("auth-token"));
      
      if (tokenCookie) {
        console.log("Background - Found auth-token cookie:", tokenCookie.name);
        try {
          const tokenData = JSON.parse(decodeURIComponent(tokenCookie.value));
          if (tokenData.access_token) {
            console.log("Background - Successfully extracted access_token");
            sendResponse({ accessToken: tokenData.access_token });
            return;
          }
        } catch (e) {
          console.log("Background - Cookie not JSON, sending raw value");
          sendResponse({ accessToken: tokenCookie.value });
          return;
        }
      }
      
      console.warn("Background - No auth-token cookie found among cookies");
      sendResponse({ error: "No session found in cookies" });
    });
    return true; 
  }
});
