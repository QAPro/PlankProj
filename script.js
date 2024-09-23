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

// Timer countdown logic
function startTimer() {
  if (isRunning) return; // Prevent multiple intervals
  isRunning = true;

  // Recalculate the total time when the timer starts
  initialTotalTime = minutes * 60 + seconds;

  timerInterval = setInterval(() => {
    if (minutes === 0 && seconds === 0) {
      clearInterval(timerInterval);
      isRunning = false;
      finishTimer();
    } else {
      if (seconds === 0) {
        minutes--;
        seconds = 59;
      } else {
        seconds--;
      }
      updateDisplay();
      updateProgress();
    }
  }, 1000);
}

// Update the circular progress animation
function updateProgress() {
  const currentTotalTime = minutes * 60 + seconds;

  if (initialTotalTime > 0) {
    const progressValue = currentTotalTime / initialTotalTime;
    progressCircle.style.strokeDashoffset =
      totalCircleLength * (1 - progressValue); // Decreasing the stroke-dashoffset as the time runs down
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

  // alert("Timer complete! 🎉");
}

// New function to reset the entire UI after timer finishes
function resetTimerUI() {
  // Reset the progress circle to its full white state
  progressCircle.style.strokeDashoffset = 0; // Full circle visible again

  // Reset the button text back to 'Start'
  startPauseBtn.textContent = "Start";

  // Ensure the timer isn't running anymore
  isRunning = false;

  // Also reset the initialTotalTime to prevent leftover values
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
  progressCircle.style.strokeDashoffset = 0; // Full circle visible (white)
  startPauseBtn.textContent = "Start"; // Reset the button to "Start" after reset

  // Important: Reset initialTotalTime after resetting the timer
  initialTotalTime = 0;
}

// Event listeners for buttons
minIncreaseBtn.addEventListener("click", () => {
  resetProgressCircle(); // Ensure progress circle is reset before setting new time
  minutes++;
  updateDisplay();
  recalculateTotalTime();
  updateProgress();
});

minDecreaseBtn.addEventListener("click", () => {
  if (minutes > 0) {
    resetProgressCircle(); // Ensure progress circle is reset before setting new time
    minutes--;
    updateDisplay();
    recalculateTotalTime();
    updateProgress();
  }
});

secIncreaseBtn.addEventListener("click", () => {
  resetProgressCircle(); // Ensure progress circle is reset before setting new time
  seconds = (seconds + 5) % 60;
  if (seconds === 0 && minutes < 59) minutes++;
  updateDisplay();
  recalculateTotalTime();
  updateProgress();
});

secDecreaseBtn.addEventListener("click", () => {
  if (minutes > 0 || seconds > 0) {
    resetProgressCircle(); // Ensure progress circle is reset before setting new time
    if (seconds === 0) {
      minutes--;
      seconds = 55;
    } else {
      seconds = (seconds - 5 + 60) % 60;
    }
  }
  updateDisplay();
  recalculateTotalTime();
  updateProgress();
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

// New helper function to reset the circle progress before adjusting time
function resetProgressCircle() {
  // Reset the progress circle to full white (no animation)
  progressCircle.style.strokeDashoffset = 0;
}

// Helper function to recalculate total time when adjusting minutes/seconds
function recalculateTotalTime() {
  initialTotalTime = minutes * 60 + seconds;
}
