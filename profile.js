document
  .getElementById("profile-form")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    const token = localStorage.getItem("token"); // Get token from local storage

    const response = await fetch(
      "http://localhost:5000/api/auth/updateProfile",
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Send token with request
        },
        body: JSON.stringify({ email, username, password }),
      }
    );

    const result = await response.json();
    if (response.ok) {
      alert("Profile updated successfully!");
    } else {
      alert(result.msg || "Error updating profile");
    }
  });
