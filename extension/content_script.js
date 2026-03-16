// AtomaClip AI Content Script - Professional Nova Style
console.log("AtomaClip content script loaded");
const DEFAULT_API_URL = "https://atomaclip-ai-production.up.railway.app";
const SUPABASE_URL = "https://luoayfkneqjudcizrsoo.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx1b2F5ZmtuZXFqdWRjaXpyc29vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI5NTEzMjAsImV4cCI6MjA4ODUyNzMyMH0.pKijxVzN5b7jdL1am3yIAeXezIx8_9NB1bDTzCHQNgY";

async function getApiUrl() {
  return new Promise((resolve) => {
    chrome.storage.sync.get(["apiUrl"], (result) => {
      resolve(result.apiUrl || DEFAULT_API_URL);
    });
  });
}

async function getAuthHeader() {
  return new Promise((resolve) => {
    // 1. Try Extension Storage first (Manual login)
    chrome.storage.sync.get(["accessToken"], (result) => {
      if (result.accessToken) {
        console.log("getAuthHeader - Using storage token");
        resolve({ Authorization: `Bearer ${result.accessToken}` });
      } else {
        // 2. Try Background Cookie sync (Web Dashboard login)
        console.log("getAuthHeader - No storage token, checking cookies...");
        chrome.runtime.sendMessage({ action: "GET_SESSION" }, (response) => {
          if (response && response.accessToken) {
            console.log("getAuthHeader - Using cookie token from background");
            resolve({ Authorization: `Bearer ${response.accessToken}` });
          } else {
            console.warn("getAuthHeader - No token found anywhere");
            resolve({});
          }
        });
      }
    });
  })
}

async function apiRequest(endpoint, method = "GET", body = null) {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage({
      action: "API_REQUEST",
      endpoint,
      method,
      body
    }, (response) => {
      resolve(response);
    });
  });
}
  const selection = window.getSelection();
  if (selection.rangeCount === 0) return { before: "", after: "" };
  const range = selection.getRangeAt(0);
  const container = range.commonAncestorContainer;
  const fullContent = container.textContent || "";
  const selectedText = selection.toString();
  const startOffset = fullContent.indexOf(selectedText);
  const before = fullContent.substring(Math.max(0, startOffset - 300), startOffset).trim();
  const after = fullContent.substring(startOffset + selectedText.length, startOffset + selectedText.length + 300).trim();
  return { before, after };
}

function showWhyPopup(data) {
  const popup = document.createElement("div");
  popup.id = "atomaclip-popup";
  popup.innerHTML = `
    <div class="atomaclip-container">
      <div class="atomaclip-header">
        <div class="atomaclip-brand">AtomaClip AI</div>
        <div id="atomaclip-status"></div>
      </div>
      
      <div class="atomaclip-field">
        <label>Destination Collection</label>
        <select id="atomaclip-project" class="atomaclip-select">
          <option value="">Library (General)</option>
        </select>
      </div>

      <div class="atomaclip-field">
        <label>Personal Insight</label>
        <input type="text" id="atomaclip-note" class="atomaclip-input" placeholder="Optional: Why are you clipping this?" autofocus>
      </div>

      <button id="atomaclip-save" class="atomaclip-save-btn">Capture Atom</button>
      
      <div id="atomaclip-ai-state" class="atomaclip-footer">
        <div class="atomaclip-ai-badge">
          <div class="atomaclip-shimmer"></div>
          AI will auto-tag & summarize
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(popup);
  const input = popup.querySelector("#atomaclip-note");
  const projectSelect = popup.querySelector("#atomaclip-project");
  const saveBtn = popup.querySelector("#atomaclip-save");
  const aiState = popup.querySelector("#atomaclip-ai-state");
  input.focus();

  // Load projects
  (async () => {
    try {
      const response = await apiRequest("/api/workspaces");
      if (response.success) {
        response.data.forEach(ws => {
          const group = document.createElement("optgroup");
          group.label = ws.name;
          ws.projects.forEach(p => {
            const opt = document.createElement("option");
            opt.value = p.id;
            opt.textContent = p.name;
            group.appendChild(opt);
          });
          if (ws.projects.length > 0) {
            projectSelect.appendChild(group);
          }
        });
      }
    } catch (err) {
      console.error("Failed to load projects in popup", err);
    }
  })();

  async function finishCapture() {
    console.log("finishCapture called");
    const userNote = input.value;
    const projectId = projectSelect.value;
    
    input.disabled = true;
    projectSelect.disabled = true;
    saveBtn.disabled = true;
    input.style.opacity = "0.5";
    
    const finalData = {
      ...data,
      user_note: userNote,
      project_id: projectId || undefined,
      page_title: document.title,
      source_url: window.location.href
    };

    console.log("Final data:", finalData);
    
    try {
      const response = await apiRequest("/api/insights/capture", "POST", finalData);
      
      if (response.success) {
        aiState.innerHTML = `
          <div class="atomaclip-success-check">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
            Atomized Successfully
          </div>
        `;
        setTimeout(() => popup.remove(), 1500);
      } else {
        const errorMsg = response.error || "API Error";
        throw new Error(`${errorMsg}`);
      }
    } catch (err) {
      console.log("Error details:", err);
      aiState.innerHTML = `<span style="color: #ef4444; font-size: 10px; font-weight: 600;">${err.message}</span>`;
      setTimeout(() => {
        popup.remove();
      }, 3500);
    }
  }

  saveBtn.addEventListener("click", finishCapture);
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") finishCapture();
    if (e.key === "Escape") popup.remove();
  });
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log("Message received:", request);
  if (request.action === "CAPTURE_SELECTION") {
    const selection = window.getSelection().toString();
    console.log("Selection:", selection);
    if (selection) {
      const { before, after } = getGhostParagraphs();
      showWhyPopup({
        content: selection,
        context_before: before,
        context_after: after
      });
    }
  }
});
