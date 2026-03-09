// AtomaClip Settings Script
document.addEventListener("DOMContentLoaded", () => {
  const apiUrlInput = document.getElementById("apiUrl");
  const saveBtn = document.getElementById("saveBtn");
  const status = document.getElementById("status");

  chrome.storage.sync.get(["apiUrl"], (result) => {
    apiUrlInput.value = result.apiUrl || "https://atomaclip.vercel.app";
  });

  saveBtn.addEventListener("click", () => {
    const apiUrl = apiUrlInput.value.trim();
    
    if (!apiUrl) {
      status.textContent = "Please enter an API URL";
      status.className = "status error";
      return;
    }

    chrome.storage.sync.set({ apiUrl }, () => {
      status.textContent = "Settings saved!";
      status.className = "status success";
      setTimeout(() => {
        status.style.display = "none";
      }, 2000);
    });
  });
});
