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
const totalCircleLength = 628.32; // Circumference of the circle (r=100)

// Functions to update the timer display
function updateDisplay() {
  minutesDisplay.textContent = String(minutes).padStart(2, "0");
  secondsDisplay.textContent = String(seconds).padStart(2, "0");
}

// Timer countdown logic
function startTimer() {
  if (isRunning) return; // Prevent multiple intervals
  isRunning = true;

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
  const totalTime = minutes * 60 + seconds;
  const totalSetTime =
    parseInt(minutesDisplay.textContent) * 60 +
    parseInt(secondsDisplay.textContent);
  const progressValue = totalTime / totalSetTime;
  progressCircle.style.strokeDashoffset =
    totalCircleLength * (1 - progressValue); // Reducing the stroke-dashoffset
}

// Timer completion logic
function finishTimer() {
  // Reset the circular progress
  progressCircle.style.strokeDashoffset = totalCircleLength;
  // TODO: Add confetti and cheering sound effects here
  alert("Timer complete! 🎉");
}

// Pause the timer
function pauseTimer() {
  clearInterval(timerInterval);
  isRunning = false;
}

// Reset the timer
function resetTimer() {
  clearInterval(timerInterval);
  isRunning = false;
  minutes = 0;
  seconds = 0;
  updateDisplay();
  progressCircle.style.strokeDashoffset = totalCircleLength; // Reset progress animation
}

// Event listeners for buttons
minIncreaseBtn.addEventListener("click", () => {
  minutes++;
  updateDisplay();
  updateProgress();
});

minDecreaseBtn.addEventListener("click", () => {
  if (minutes > 0) minutes--;
  updateDisplay();
  updateProgress();
});

secIncreaseBtn.addEventListener("click", () => {
  seconds = (seconds + 5) % 60;
  if (seconds === 0 && minutes < 59) minutes++;
  updateDisplay();
  updateProgress();
});

secDecreaseBtn.addEventListener("click", () => {
  if (minutes > 0 || seconds > 0) {
    if (seconds === 0) {
      minutes--;
      seconds = 55;
    } else {
      seconds = (seconds - 5 + 60) % 60;
    }
  }
  updateDisplay();
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
  startPauseBtn.textContent = "Start";
});
