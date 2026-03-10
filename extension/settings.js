const SUPABASE_URL = "https://luoayfkneqjudcizrsoo.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx1b2F5ZmtuZXFqdWRjaXpyc29vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI5NTEzMjAsImV4cCI6MjA4ODUyNzMyMH0.pKijxVzN5b7jdL1am3yIAeXezIx8_9NB1bDTzCHQNgY";

document.addEventListener("DOMContentLoaded", () => {
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const loginBtn = document.getElementById("loginBtn");
  const status = document.getElementById("status");

  chrome.storage.sync.get(["email", "accessToken"], (result) => {
    if (result.email) {
      emailInput.value = result.email;
    }
    if (result.accessToken) {
      status.textContent = "Logged in!";
      status.className = "status success";
    }
  });

  loginBtn.addEventListener("click", async () => {
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();
    
    if (!email || !password) {
      status.textContent = "Please enter email and password";
      status.className = "status error";
      return;
    }

    loginBtn.disabled = true;
    loginBtn.textContent = "Logging in...";
    
    try {
      const response = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "apikey": SUPABASE_ANON_KEY,
          "Authorization": `Bearer ${SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({ email, password })
      });
      
      const data = await response.json();
      
      if (response.ok && data.access_token) {
        chrome.storage.sync.set({
          email: email,
          accessToken: data.access_token,
          refreshToken: data.refresh_token
        }, () => {
          status.textContent = "Logged in!";
          status.className = "status success";
          loginBtn.textContent = "Save & Login";
          loginBtn.disabled = false;
        });
      } else {
        throw new Error(data.error_description || data.msg || "Login failed");
      }
    } catch (error) {
      status.textContent = error.message;
      status.className = "status error";
      loginBtn.textContent = "Save & Login";
      loginBtn.disabled = false;
    }
  });
});
