document.addEventListener("DOMContentLoaded", async function () {
  const token = localStorage.getItem("token");

  try {
    const response = await fetch("http://localhost:5000/api/stats/myStats", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const stats = await response.json();

      // Update the stats in the HTML
      document.getElementById("totalWorkouts").textContent =
        stats.totalWorkouts;
      document.getElementById("totalTimeSpent").textContent = `${Math.floor(
        stats.totalTimeSpent / 60
      )} minutes`;
      document.getElementById(
        "currentStreak"
      ).textContent = `${stats.currentStreak} days`;
    } else {
      console.error("Failed to fetch stats");
    }
  } catch (error) {
    console.error("Error:", error.message);
  }
});
