// DECLARING VARIABLES

let timer; //stores our setInterval so we can stop it later
let targetDate; //User's chosen target time in ms

//DOM Elements:

const dateTimeInput = document.getElementById("dateTimeInput");
const startBtn = document.getElementById("startBtn");
const countDownDiv = document.getElementById("countDown");
const alarmSound = document.getElementById("alarmSound");

//LOADING SAVED DATE FROM LOCAL STORAGE

if (localStorage.getItem("savedDate")) {
  dateTimeInput.value = localStorage.getItem("savedDate");
  startCountDown(); // fills the input field and starts the countDown automatically
}

//ADDING EVENT LISTENER START BUTTON TO CLICK EVENTS
startBtn.addEventListener("click", function () {
  //checks if you picked the date/time
  if (!dateTimeInput.value) {
    alert("Please select a preferred date and time!!");
    return;
  }
  alarmSound.load();

  alarmSound
    .play()
    .then(() => {
      alarmSound.pause();
      alarmSound.currentTime = 0;
      console.log("Audio primed successfully.");
    })
    .catch((error) => {
      console.log("Priming error:", error);
    });

  //SAVING CHOSEN DATE TO LOCAL STORAGE:
  localStorage.setItem("savedDate", dateTimeInput.value);
  startCountDown();
});

// FUNCTION TO START THE COUNTDOWN
function startCountDown() {
  //Converting the given input to timeStamp:
  targetDate = new Date(dateTimeInput.value).getTime();

  //Clearing any existing Timer:
  clearInterval(timer); //Clear Interval To Stop Any Old Countdown

  timer = setInterval(function () {
    const now = new Date().getTime(); //Converts the Input to a TimeStamp
    const distance = targetDate - now;

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);
    countDownDiv.textContent = `${days}d ${hours}h ${minutes}m ${seconds}s`;

    if (distance < 0) {
      clearInterval(timer);
      countDownDiv.textContent = "Time's Up!";

      alarmSound.play().catch((error) => {
        console.log("Playback was prevented:", error);
      });

      launchConfetti(); //Shows the Confetti

      // Clear saved date so it doesn't auto-start again
      localStorage.removeItem("savedDate");
    }
  }, 1000);
}
// Confetti function
function launchConfetti() {
  const duration = 15 * 1000; // 5 seconds
  const end = Date.now() + duration;

  (function frame() {
    confetti({
      particleCount: 5,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
    });
    confetti({
      particleCount: 5,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  })();
}
