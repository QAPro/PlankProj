document
  .getElementById("signup-form")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    const response = await fetch("http://localhost:5000/api/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, username, password }),
    });

    const result = await response.json();
    if (response.ok) {
      alert("Signup successful!");
      window.location.href = "login.html"; // Redirect to login after signup
    } else {
      alert(result.msg || "Error during signup");
    }
  });
