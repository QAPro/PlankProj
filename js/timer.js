// DOM elements
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

// Initial state
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
  if (isRunning) return; // Prevent multiple intervals

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

  // Trigger the first countdown immediately
  tick(); // Call the first tick immediately without waiting for the interval

  // Then start the interval for subsequent seconds
  timerInterval = setInterval(tick, 1000);

  function tick() {
    if (totalSeconds <= 0) {
      clearInterval(timerInterval);
      isRunning = false;
      startPauseBtn.textContent = "Start"; // Reset button to "Start"
      finishTimer(); // Trigger celebration or completion action
    } else {
      totalSeconds--;

      const minutes = Math.floor(totalSeconds / 60);
      const seconds = totalSeconds % 60;

      minutesDisplay.textContent = minutes.toString().padStart(2, "0");
      secondsDisplay.textContent = seconds.toString().padStart(2, "0");

      // Update the circular progress animation
      updateProgress(totalSeconds, initialTotalTime); // Pass remaining time and total time
    }
  }
}

// Update the circular progress animation
function updateProgress(totalSeconds, initialTotalTime) {
  if (initialTotalTime > 0) {
    const progressValue = totalSeconds / initialTotalTime;
    progressCircle.style.strokeDashoffset =
      totalCircleLength * (1 - progressValue); // Animate counterclockwise
  }
}

// Trigger confetti animation
function launchConfetti() {
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 }, // Confetti will appear from the middle of the screen
    colors: ["#ffffff", "#87CEFA", "#1E90FF"], // Match the page color scheme
  });
}

// Function to play cheering sound
function playCheeringSound() {
  const cheerSound = document.getElementById("cheer-sound");
  cheerSound.play();
}

// Timer completion logic
function finishTimer() {
  // Reset the circular progress and button states
  resetTimerUI();

  // Launch confetti
  launchConfetti();

  // Play cheering sound
  playCheeringSound();
}

// Reset the timer UI
function resetTimerUI() {
  progressCircle.style.strokeDashoffset = 0; // Full circle visible again
  startPauseBtn.textContent = "Start"; // Reset button text
  isRunning = false;
  initialTotalTime = 0;
}

// Pause the timer
function pauseTimer() {
  clearInterval(timerInterval);
  isRunning = false;
}

// Reset the timer to initial state
function resetTimer() {
  clearInterval(timerInterval);
  isRunning = false;
  minutes = 0;
  seconds = 0;
  updateDisplay();
  progressCircle.style.strokeDashoffset = 0; // Reset circle
  startPauseBtn.textContent = "Start"; // Reset button text
  initialTotalTime = 0; // Reset total time
  checkTime(); // Recheck if Start button should be enabled
}

// Event listeners for buttons
minIncreaseBtn.addEventListener("click", () => {
  resetProgressCircle();
  minutes++;
  updateDisplay();
  recalculateTotalTime();
  updateProgress();
  checkTime(); // Check if Start button should be enabled
});

minDecreaseBtn.addEventListener("click", () => {
  if (minutes > 0) {
    resetProgressCircle();
    minutes--;
    updateDisplay();
    recalculateTotalTime();
    updateProgress();
    checkTime(); // Check if Start button should be enabled
  }
});

secIncreaseBtn.addEventListener("click", () => {
  resetProgressCircle();
  seconds = (seconds + 5) % 60;
  if (seconds === 0 && minutes < 59) minutes++;
  updateDisplay();
  recalculateTotalTime();
  updateProgress();
  checkTime(); // Check if Start button should be enabled
});

secDecreaseBtn.addEventListener("click", () => {
  if (minutes > 0 || seconds > 0) {
    resetProgressCircle();
    if (seconds === 0) {
      minutes--;
      seconds = 55;
    } else {
      seconds = (seconds - 5 + 60) % 60;
    }
    updateDisplay();
    recalculateTotalTime();
    updateProgress();
    checkTime(); // Check if Start button should be enabled
  }
});

startPauseBtn.addEventListener("click", () => {
  if (isRunning) {
    pauseTimer();
    startPauseBtn.textContent = "Start";
  } else {
    startTimer();
    startPauseBtn.textContent = "Pause";
  }
});

resetBtn.addEventListener("click", () => {
  resetTimer();
});

// Helper functions
function resetProgressCircle() {
  progressCircle.style.strokeDashoffset = 0; // Full circle visible
}

function recalculateTotalTime() {
  initialTotalTime = minutes * 60 + seconds;
}
