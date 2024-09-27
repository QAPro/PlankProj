document.addEventListener("DOMContentLoaded", function () {
  // DOM elements and initialization logic
  const minIncreaseBtn = document.getElementById("min-increase");
  const minDecreaseBtn = document.getElementById("min-decrease");
  const secIncreaseBtn = document.getElementById("sec-increase");
  const secDecreaseBtn = document.getElementById("sec-decrease");
  const startPauseBtn = document.getElementById("start-pause");
  const resetBtn = document.getElementById("reset");
  const minutesDisplay = document.getElementById("minutes");
  const secondsDisplay = document.getElementById("seconds");
  const progressCircle = document.querySelector(".progress");
  const countdownDisplay = document.getElementById("countdownDisplay"); // For 3-second countdown
  const plankTypeDropdown = document.getElementById("plankType");

  // Increase/decrease minutes and seconds
  minIncreaseBtn.addEventListener("click", () => {
    if (!isRunning) {
      minutes++;
      updateDisplay();
      checkTime(); // Recheck if time was added, to enable Start button
    }
  });

  minDecreaseBtn.addEventListener("click", () => {
    if (!isRunning && minutes > 0) {
      minutes--;
      updateDisplay();
      checkTime(); // Disable Start if time is 0
    }
  });

  secIncreaseBtn.addEventListener("click", () => {
    if (!isRunning && seconds < 55) {
      seconds += 5;
      updateDisplay();
      checkTime();
    } else if (!isRunning && seconds >= 55 && minutes < 99) {
      seconds = 0;
      minutes++;
      updateDisplay();
      checkTime();
    }
  });

  secDecreaseBtn.addEventListener("click", () => {
    if (!isRunning && (minutes > 0 || seconds > 0)) {
      if (seconds >= 5) {
        seconds -= 5;
      } else if (minutes > 0) {
        seconds = 55;
        minutes--;
      }
      updateDisplay();
      checkTime();
    }
  });

  let minutes = 0;
  let seconds = 0;
  let timerInterval = null;
  let isRunning = false;
  let initialTotalTime = 0; // Will be calculated once the timer starts
  const totalCircleLength = 628.32; // Circumference of the circle

  // Functions to update the timer display
  function updateDisplay() {
    minutesDisplay.textContent = String(minutes).padStart(2, "0");
    secondsDisplay.textContent = String(seconds).padStart(2, "0");
  }

  // Disable the Start button if no time is set
  function checkTime() {
    if (minutes === 0 && seconds === 0) {
      startPauseBtn.disabled = true;
    } else {
      startPauseBtn.disabled = false;
    }
  }

  // Timer countdown logic with 3-second countdown
  function startTimer() {
    console.log("Timer started...");

    if (isRunning) return; // Prevent multiple intervals

    // Calculate initial total time when the timer starts
    initialTotalTime = minutes * 60 + seconds;

    // Start the 3-second countdown before the main timer starts
    let countdown = 3;
    countdownDisplay.style.display = "block"; // Show the countdown overlay
    countdownDisplay.textContent = countdown;

    const countdownInterval = setInterval(() => {
      countdown--;
      countdownDisplay.textContent = countdown;

      if (countdown === 0) {
        clearInterval(countdownInterval);
        countdownDisplay.style.display = "none"; // Hide countdown after it finishes
        runMainTimer(); // Start the main timer
      }
    }, 1000);
  }

  // Main timer logic (starts after countdown)
  function runMainTimer() {
    isRunning = true;
    startPauseBtn.textContent = "Pause"; // Change button to "Pause"
    let totalSeconds = minutes * 60 + seconds;

    // Start ticking immediately
    tick(); // Initial tick without delay
    timerInterval = setInterval(tick, 1000);

    function tick() {
      if (totalSeconds <= 0) {
        clearInterval(timerInterval); // Stop timer
        isRunning = false;
        startPauseBtn.textContent = "Start";
        finishTimer(); // Call finish when done
      } else {
        totalSeconds--;
        minutes = Math.floor(totalSeconds / 60);
        seconds = totalSeconds % 60;
        updateDisplay();
        updateProgress(totalSeconds, initialTotalTime); // Update progress circle
      }
    }
  }

  // Progress circle update logic
  function updateProgress(totalSeconds, initialTotalTime) {
    if (initialTotalTime > 0) {
      const progressValue = totalSeconds / initialTotalTime;
      progressCircle.style.strokeDashoffset =
        totalCircleLength * (1 - progressValue);
    }
  }

  // Function to reset the timer UI and state
  function resetTimerUI() {
    progressCircle.style.strokeDashoffset = 0; // Reset progress
    startPauseBtn.textContent = "Start"; // Reset start button text
    isRunning = false;
    initialTotalTime = 0;
  }

  // Confetti and sound functions
  function launchConfetti() {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#ffffff", "#87CEFA", "#1E90FF"],
    });
  }

  function playCheeringSound() {
    const cheerSound = document.getElementById("cheer-sound");
    cheerSound.play();
  }

  // Function triggered when timer ends
  function finishTimer() {
    console.log("Timer finished!");
    resetTimerUI();
    launchConfetti();
    playCheeringSound();
    logWorkout();
  }

  // Log the workout once the timer finishes
  async function logWorkout() {
    const plankType = plankTypeDropdown.value;
    const duration = initialTotalTime;
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        "http://localhost:5000/api/stats/logWorkout",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ plankType, duration }),
        }
      );

      if (response.ok) {
        console.log("Workout logged successfully");
      } else {
        console.error("Error logging workout:", await response.json());
      }
    } catch (error) {
      console.error("Error logging workout:", error.message);
    }
  }

  // Event listeners
  startPauseBtn.addEventListener("click", () => {
    if (isRunning) {
      clearInterval(timerInterval); // Pause the timer
      isRunning = false;
      startPauseBtn.textContent = "Start";
    } else {
      startTimer();
    }
  });

  resetBtn.addEventListener("click", resetTimerUI);
});
