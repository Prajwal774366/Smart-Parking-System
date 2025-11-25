const API_BASE = "http://localhost:9090/api";

const tabLogin = document.getElementById("tab-login");
const tabRegister = document.getElementById("tab-register");
const loginForm = document.getElementById("login-form");
const registerForm = document.getElementById("register-form");
const authMessageEl = document.getElementById("auth-message");

// ----------------- Tab handling -----------------

function activateTab(tab) {
  if (tab === "login") {
    tabLogin.classList.add("active");
    tabRegister.classList.remove("active");
    loginForm.classList.remove("hidden");
    registerForm.classList.add("hidden");
    authMessageEl.textContent = "";
  } else {
    tabRegister.classList.add("active");
    tabLogin.classList.remove("active");
    registerForm.classList.remove("hidden");
    loginForm.classList.add("hidden");
    authMessageEl.textContent = "";
  }
}

tabLogin.addEventListener("click", () => activateTab("login"));
tabRegister.addEventListener("click", () => activateTab("register"));

// ----------------- Login helpers -----------------

function setLoggedIn(username) {
  localStorage.setItem("adminUsername", username);
  authMessageEl.textContent = "Login successful. Redirecting to dashboard...";
  setTimeout(() => {
    window.location.href = "dashboard.html";
  }, 800);
}

// ----------------- Login submit -----------------

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  authMessageEl.textContent = "";

  const username = document.getElementById("login-username").value.trim();
  const password = document.getElementById("login-password").value.trim();

  if (!username || !password) {
    authMessageEl.textContent = "Please enter username and password.";
    return;
  }

  // local username validation: letters + spaces only
  const namePattern = /^[A-Za-z][A-Za-z ]*$/;
  if (!namePattern.test(username)) {
    authMessageEl.textContent = "Username must contain only letters and spaces.";
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/admin/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });

    const data = await res.json();
    authMessageEl.textContent = data.message;
    if (data.success) {
      setLoggedIn(data.username);
    }
  } catch (err) {
    console.error("Login error", err);
    authMessageEl.textContent = "Error during login.";
  }
});

// ----------------- Register submit -----------------

registerForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  authMessageEl.textContent = "";

  const username = document.getElementById("register-username").value.trim();
  const password = document.getElementById("register-password").value.trim();

  if (!username || !password) {
    authMessageEl.textContent = "Please enter username and password.";
    return;
  }

  // username must be only letters + spaces
  const namePattern = /^[A-Za-z][A-Za-z ]*$/;
  if (!namePattern.test(username)) {
    authMessageEl.textContent = "Username must contain only letters and spaces.";
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/admin/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });

    const data = await res.json();
    if (data.success) {
      // ✅ Just registered: show message & switch to login tab.
      authMessageEl.textContent = "Registration successful. Please login with your credentials.";
      // Clear register fields
      document.getElementById("register-username").value = "";
      document.getElementById("register-password").value = "";
      // Switch to Login tab (user must manually login)
      activateTab("login");
    } else {
      authMessageEl.textContent = data.message || "Registration failed.";
    }
  } catch (err) {
    console.error("Register error", err);
    authMessageEl.textContent = "Error during registration.";
  }
});
