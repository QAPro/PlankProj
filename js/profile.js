// Edit Username
document.getElementById("editUsername").addEventListener("click", function () {
  toggleEdit(
    "usernameDisplay",
    "usernameInput",
    "saveUsername",
    "cancelUsername"
  );
});

// Save Username
document
  .getElementById("saveUsername")
  .addEventListener("click", async function () {
    const username = document.getElementById("usernameInput").value;
    if (username) {
      updateField("usernameDisplay", username);
      await saveProfileData({ username });
    }
  });

// Cancel Username Edit
document
  .getElementById("cancelUsername")
  .addEventListener("click", function () {
    cancelEdit(
      "usernameDisplay",
      "usernameInput",
      "saveUsername",
      "cancelUsername"
    );
  });

// Edit Email
document.getElementById("editEmail").addEventListener("click", function () {
  toggleEdit("emailDisplay", "emailInput", "saveEmail", "cancelEmail");
});

// Save Email
document
  .getElementById("saveEmail")
  .addEventListener("click", async function () {
    const email = document.getElementById("emailInput").value;
    if (email) {
      updateField("emailDisplay", email);
      await saveProfileData({ email });
    }
  });

// Cancel Email Edit
document.getElementById("cancelEmail").addEventListener("click", function () {
  cancelEdit("emailDisplay", "emailInput", "saveEmail", "cancelEmail");
});

// Edit Password
document.getElementById("editPassword").addEventListener("click", function () {
  document.getElementById("passwordFields").style.display = "block";
  document.getElementById("savePassword").style.display = "block";
  document.getElementById("cancelPassword").style.display = "block";
});

// Save Password
document
  .getElementById("savePassword")
  .addEventListener("click", async function () {
    const currentPassword = document.getElementById("currentPassword").value;
    const newPassword = document.getElementById("newPassword").value;
    const confirmNewPassword =
      document.getElementById("confirmNewPassword").value;

    if (newPassword && newPassword === confirmNewPassword) {
      await saveProfileData({ currentPassword, newPassword });
    } else {
      alert("New passwords do not match!");
    }
  });

// Cancel Password Edit
document
  .getElementById("cancelPassword")
  .addEventListener("click", function () {
    document.getElementById("passwordFields").style.display = "none";
    document.getElementById("savePassword").style.display = "none";
    document.getElementById("cancelPassword").style.display = "none";
  });

// Helper function to toggle edit fields
function toggleEdit(displayId, inputId, saveButtonId, cancelButtonId) {
  document.getElementById(displayId).style.display = "none";
  document.getElementById(inputId).style.display = "block";
  document.getElementById(saveButtonId).style.display = "block";
  document.getElementById(cancelButtonId).style.display = "block";
}

// Helper function to cancel edit and revert changes
function cancelEdit(displayId, inputId, saveButtonId, cancelButtonId) {
  document.getElementById(displayId).style.display = "block";
  document.getElementById(inputId).style.display = "none";
  document.getElementById(saveButtonId).style.display = "none";
  document.getElementById(cancelButtonId).style.display = "none";
}

// Helper function to update field display
function updateField(displayId, newValue) {
  document.getElementById(displayId).textContent = newValue;
  cancelEdit(
    displayId,
    displayId.replace("Display", "Input"),
    displayId.replace("Display", "save"),
    displayId.replace("Display", "cancel")
  );
}

// Send updated data to backend
async function saveProfileData(data) {
  const token = localStorage.getItem("token");
  try {
    const response = await fetch(
      "http://localhost:5000/api/auth/updateProfile",
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      }
    );

    const result = await response.json();
    if (!response.ok) {
      alert(result.msg || "Error updating profile");
    }
  } catch (error) {
    console.error("Error saving profile:", error);
    alert("Failed to save profile data.");
  }
}
