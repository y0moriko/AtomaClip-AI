// AtomaClip AI Content Script - Professional Nova Style
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
  try {
    const apiUrl = await getApiUrl();
    const response = await fetch(`${apiUrl}/api/session`, {
      method: "GET",
      credentials: "include"
    });
    if (response.ok) {
      const data = await response.json();
      if (data.session) {
        return { Authorization: `Bearer ${data.session.access_token}` };
      }
    }
  } catch (e) {
    console.log("Failed to get session:", e);
  }
  return {};
}

function getGhostParagraphs() {
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
      
      <input type="text" id="atomaclip-note" class="atomaclip-input" placeholder="What's the 'Why' for this clip?" autofocus>

      <div id="atomaclip-ai-state" class="atomaclip-footer">
        <div class="atomaclip-ai-badge">
          <div class="atomaclip-shimmer"></div>
          AI Contextualizing...
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(popup);
  const input = popup.querySelector("#atomaclip-note");
  const aiState = popup.querySelector("#atomaclip-ai-state");
  const statusIcon = popup.querySelector("#atomaclip-status");
  input.focus();

async function getAuthHeader() {
  return new Promise((resolve) => {
    chrome.cookies.get({ url: 'https://atomaclip-ai-production.up.railway.app', name: 'sb-access-token' }, (cookie) => {
      if (cookie) {
        resolve({ Authorization: `Bearer ${cookie.value}` })
      } else {
        resolve({})
      }
    })
  })
}

async function finishCapture() {
  const userNote = input.value;
  input.disabled = true;
  input.style.opacity = "0.5";
  
  const finalData = {
    ...data,
    user_note: userNote,
    page_title: document.title,
    source_url: window.location.href
  };

    try {
      const apiUrl = await getApiUrl();
      const authHeader = await getAuthHeader();
      console.log("Auth header:", authHeader);
      const response = await fetch(`${apiUrl}/api/insights/capture`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          ...authHeader
        },
        body: JSON.stringify(finalData),
        credentials: "include"
      });
      
      console.log("Response status:", response.status);
      console.log("Response:", await response.text());
      
      if (response.ok) {
        aiState.innerHTML = `
          <div class="atomaclip-success-check">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
            Atomized Successfully
          </div>
        `;
        setTimeout(() => popup.remove(), 1500);
      } else {
        throw new Error("API Error");
      }
    } catch (err) {
      aiState.innerHTML = `<span style="color: #ef4444; font-size: 10px; font-weight: 600;">Connection Failed</span>`;
      setTimeout(() => popup.remove(), 2500);
    }
  }

  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") finishCapture();
    if (e.key === "Escape") popup.remove();
  });
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "CAPTURE_SELECTION") {
    const selection = window.getSelection().toString();
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
