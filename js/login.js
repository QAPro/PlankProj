document
  .getElementById("login-form")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const response = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const result = await response.json();
    if (response.ok) {
      // Save token to local storage
      localStorage.setItem("token", result.token);
      alert("Login successful!");
      window.location.href = "timer.html"; // Redirect to timer page after login
    } else {
      alert(result.msg || "Error during login");
    }
  });
