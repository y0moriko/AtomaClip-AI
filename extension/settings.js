// AtomaClip Settings Script
document.addEventListener("DOMContentLoaded", () => {
  const apiUrlInput = document.getElementById("apiUrl");
  const authTokenInput = document.getElementById("authToken");
  const saveBtn = document.getElementById("saveBtn");
  const status = document.getElementById("status");

  chrome.storage.sync.get(["apiUrl", "authToken"], (result) => {
    apiUrlInput.value = result.apiUrl || "https://atomaclip-ai-production.up.railway.app";
    authTokenInput.value = result.authToken || "";
  });

  saveBtn.addEventListener("click", () => {
    const apiUrl = apiUrlInput.value.trim();
    const authToken = authTokenInput.value.trim();
    
    if (!authToken) {
      status.textContent = "Please enter your auth token";
      status.className = "status error";
      return;
    }

    chrome.storage.sync.set({ apiUrl, authToken }, () => {
      status.textContent = "Settings saved!";
      status.className = "status success";
      setTimeout(() => {
        status.style.display = "none";
      }, 2000);
    });
  });
});
