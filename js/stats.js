document.addEventListener("DOMContentLoaded", async function () {
  const token = localStorage.getItem("token");

  const response = await fetch("http://localhost:5000/api/stats/myStats", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`, // Token sent with Bearer scheme
    },
  });

  const result = await response.json();

  if (response.ok) {
    document.getElementById("totalWorkouts").textContent = result.totalWorkouts;
    document.getElementById(
      "totalTimeSpent"
    ).textContent = `${result.totalTimeSpent} minutes`;
    document.getElementById(
      "currentStreak"
    ).textContent = `${result.currentStreak} days`;
    document.getElementById(
      "improvementPercent"
    ).textContent = `${result.improvementPercent}%`;
  } else {
    alert(result.msg || "Error fetching stats");
  }
});
