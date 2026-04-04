// AtomaClip AI Background Service Worker
const PRODUCTION_URL = "https://atomaclip-ai.onrender.com";

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

async function getAuthToken() {
  return new Promise((resolve) => {
    chrome.cookies.getAll({ url: PRODUCTION_URL }, (cookies) => {
      console.log("AtomaClip: Found cookies:", cookies.map(c => c.name));
      
      // Try multiple cookie name patterns for Supabase
      const tokenCookie = cookies.find(c => 
        c.name.includes("auth-token") || 
        c.name.includes("sb-access") ||
        c.name.includes("access-token")
      );
      
      if (tokenCookie) {
        console.log("AtomaClip: Found token cookie:", tokenCookie.name);
        let rawValue = decodeURIComponent(tokenCookie.value);
        
        if (rawValue.startsWith("base64-")) {
          try {
            rawValue = atob(rawValue.substring(7));
          } catch (e) {
            console.error("AtomaClip: Base64 decode failed:", e.message);
          }
        }

        try {
          const tokenData = JSON.parse(rawValue);
          if (tokenData.access_token) {
            console.log("AtomaClip: Successfully extracted access_token from cookie");
            resolve(tokenData.access_token);
            return;
          }
        } catch (e) {
          console.log("AtomaClip: Using raw token value");
          resolve(rawValue);
          return;
        }
      }
      
      console.warn("AtomaClip: No valid token cookie found");
      resolve(null);
    });
  });
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "GET_SESSION") {
    getAuthToken().then(token => {
      if (token) {
        sendResponse({ accessToken: token });
      } else {
        sendResponse({ error: "No session found" });
      }
    });
    return true; 
  }

  if (request.action === "API_REQUEST") {
    console.log("API_REQUEST received:", request.endpoint);
    (async () => {
      try {
        const token = await getAuthToken();
        const headers = { "Content-Type": "application/json" };
        
        if (token) {
          headers["Authorization"] = `Bearer ${token}`;
        }

        const response = await fetch(`${PRODUCTION_URL}${request.endpoint}`, {
          method: request.method || "GET",
          headers,
          body: request.body ? JSON.stringify(request.body) : undefined
        });

        const data = await response.json().catch(() => ({}));
        
        if (response.ok) {
          sendResponse({ success: true, data });
        } else {
          sendResponse({ success: false, error: data.error || "API Error", status: response.status });
        }
      } catch (err) {
        sendResponse({ success: false, error: err.message });
      }
    })();
    return true;
  }
});
