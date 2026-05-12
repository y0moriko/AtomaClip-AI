// AtomaClip AI Background Service Worker
const DEFAULT_PRODUCTION_URL = "https://atomaclip-ai.onrender.com";

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

async function getApiUrl() {
  return new Promise((resolve) => {
    chrome.storage.sync.get(["apiUrl"], (result) => {
      resolve(result.apiUrl || DEFAULT_PRODUCTION_URL);
    });
  });
}

async function getAuthToken() {
  const apiUrl = await getApiUrl();
  return new Promise((resolve) => {
    // Try to get cookies from the configured API URL
    chrome.cookies.getAll({ url: apiUrl }, (cookies) => {
      // Supabase cookie patterns: sb-xxx-auth-token, access-token, sb-access-token
      const tokenCookie = cookies.find(c => 
        c.name.includes("auth-token") || 
        c.name === "access-token" || 
        c.name.includes("sb-access")
      );
      
      if (tokenCookie) {
        let rawValue = decodeURIComponent(tokenCookie.value);
        
        if (rawValue.startsWith("base64-")) {
          try {
            rawValue = atob(rawValue.substring(7));
          } catch (e) {
            console.error("Base64 decode failed:", e.message);
          }
        }

        try {
          const tokenData = JSON.parse(rawValue);
          if (tokenData.access_token) {
            resolve(tokenData.access_token);
            return;
          }
        } catch (e) {
          resolve(rawValue);
          return;
        }
      }
      
      // Fallback: Check localhost if we're not already checking it and we're in dev mode
      if (!apiUrl.includes("localhost")) {
        chrome.cookies.getAll({ url: "http://localhost:3000" }, (localCookies) => {
          const localToken = localCookies.find(c => 
            c.name.includes("auth-token") || 
            c.name === "access-token" || 
            c.name.includes("sb-access")
          );
          if (localToken) {
            // ... same logic for localToken
            let val = decodeURIComponent(localToken.value);
            if (val.startsWith("base64-")) {
              try { val = atob(val.substring(7)); } catch(e) {}
            }
            try {
              const data = JSON.parse(val);
              if (data.access_token) { resolve(data.access_token); return; }
            } catch(e) { resolve(val); return; }
          } else {
            resolve(null);
          }
        });
      } else {
        resolve(null);
      }
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
        const apiUrl = await getApiUrl();
        const token = await getAuthToken();
        const headers = { "Content-Type": "application/json" };
        
        if (token) {
          headers["Authorization"] = `Bearer ${token}`;
        }

        const response = await fetch(`${apiUrl}${request.endpoint}`, {
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

  if (request.action === "CAPTURE_FROM_PDF") {
    console.log("CAPTURE_FROM_PDF received:", request.data);
    (async () => {
      try {
        const apiUrl = await getApiUrl();
        const token = await getAuthToken();
        
        if (!token) {
          sendResponse({ success: false, error: "Please login first" });
          return;
        }

        const headers = { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        };

        const response = await fetch(`${apiUrl}/api/insights/capture`, {
          method: "POST",
          headers,
          body: JSON.stringify(request.data)
        });

        const data = await response.json().catch(() => ({}));
        
        if (response.ok) {
          sendResponse({ success: true, data });
        } else {
          sendResponse({ success: false, error: data.error || "Capture failed" });
        }
      } catch (err) {
        console.error("PDF capture error:", err);
        sendResponse({ success: false, error: err.message });
      }
    })();
    return true;
  }
});
