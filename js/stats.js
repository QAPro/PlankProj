document.addEventListener("DOMContentLoaded", async function () {
  const token = localStorage.getItem("token"); // Get token from local storage

  const response = await fetch("http://localhost:5000/api/stats/myStats", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`, // Send token with request
    },
  });

  const result = await response.json();

  if (response.ok) {
    document.getElementById("totalWorkouts").textContent = result.totalWorkouts;
    document.getElementById("totalTimeSpent").textContent =
      result.totalTimeSpent;
  } else {
    alert(result.msg || "Error fetching stats");
  }
});
