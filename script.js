const TIMEZONE = "Asia/Dhaka";

// Daily schedule: 1 PM to 4 PM Bangladesh time
const START_HOUR = 13;
const END_HOUR = 16;

const TOTAL_DURATION = (END_HOUR - START_HOUR) * 60 * 60;

const hoursEl = document.getElementById("hours");
const minutesEl = document.getElementById("minutes");
const secondsEl = document.getElementById("seconds");
const statusEl = document.getElementById("status");
const progressBar = document.getElementById("progressBar");
const popup = document.getElementById("popup");
const todayEl = document.getElementById("today");

const pad = (value) => String(value).padStart(2, "0");

function getDhakaTime() {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date());

  return Object.fromEntries(
    parts
      .filter((p) => p.type !== "literal")
      .map((p) => [p.type, Number(p.value)]),
  );
}

function showTime(totalSeconds) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  hoursEl.textContent = pad(hours);
  minutesEl.textContent = pad(minutes);
  secondsEl.textContent = pad(seconds);
}

function updateTimer() {
  const now = getDhakaTime();

  todayEl.textContent = `${pad(now.day)}/${pad(now.month)}/${now.year}`;

  const currentSeconds = now.hour * 3600 + now.minute * 60 + now.second;

  const startSeconds = START_HOUR * 3600;
  const endSeconds = END_HOUR * 3600;

  if (currentSeconds < startSeconds) {
    const remaining = startSeconds - currentSeconds;

    showTime(TOTAL_DURATION);

    statusEl.textContent = `● STARTS AT ${START_HOUR}:00 PM`;

    statusEl.style.color = "#ffb52e";
    progressBar.style.width = "100%";
    return;
  }

  if (currentSeconds >= endSeconds) {
    showTime(0);
    progressBar.style.width = "0%";
    statusEl.textContent = "● COUNTDOWN COMPLETED";
    statusEl.style.color = "#ff4d6d";
    popup.classList.add("show");
    clearInterval(timer);
    return;
  }

  const remaining = endSeconds - currentSeconds;
  showTime(remaining);

  const progress = (remaining / TOTAL_DURATION) * 100;

  progressBar.style.width = progress + "%";

  statusEl.textContent = "● COUNTDOWN RUNNING";
  statusEl.style.color = "#00ff95";
}

updateTimer();

const timer = setInterval(updateTimer, 250);
