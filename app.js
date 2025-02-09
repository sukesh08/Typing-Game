const main = document.querySelector(".main");
const typeArea = document.querySelector(".typingArea");
const btn = document.querySelector(".btn");
const timerDisplay = document.createElement("div");
timerDisplay.className = "timer";
document.querySelector(".container").prepend(timerDisplay);

// Define texts for each difficulty level
const easy = [
  "Typing can help save time and is useful for daily tasks.",
  "Good typing skills are essential and improve focus and speed.",
  "Practice makes perfect, especially when typing is needed often.",
  "Quick typing can be learned with effort and practice daily.",
  "Everyone should try to type faster for better productivity."
];

const medium = [
  "Typing is a valuable skill that helps people communicate quickly and efficiently. With good typing skills, tasks are completed faster and with fewer mistakes. It’s important to practice regularly to improve both speed and accuracy. Typing also saves time and is useful for work, school, and communication.",
  "Good typing skills are essential in today’s digital world. The ability to type quickly and accurately can boost productivity and make tasks easier. Practice makes perfect, and with time, anyone can improve their typing speed. Accuracy is just as important, as it ensures clear and effective communication.",
  "Typing fast helps complete tasks quickly and efficiently. Good typing skills save time and reduce errors. Practice helps improve both speed and accuracy. It is a valuable skill for many jobs and schoolwork, and improving typing speed can help increase productivity. It’s an important skill to develop and maintain.",
  "Mastering typing can improve efficiency in both personal and professional tasks. Fast typing helps accomplish work quickly, while accuracy ensures messages are communicated clearly. Typing is a skill that improves with practice. Over time, typing becomes easier, allowing people to focus more on the content rather than the process.",
  "Effective typing skills can make daily tasks easier and more efficient. By practicing typing regularly, anyone can improve their speed and accuracy. Fast typing saves time, and with consistent effort, anyone can master the skill. Typing is useful in many areas, from communication to work and school assignments."
];


const hard = [
  "In the digital age, typing is an essential skill that requires both speed and accuracy. Professional typists must be able to type quickly and make minimal errors. Mastering touch typing is crucial for high efficiency, and it requires consistent practice. Typing is a valuable asset for anyone working in a digital environment, especially for time-sensitive tasks.",
  "Typing proficiency is crucial for tasks requiring fast, precise communication. Touch typing allows typists to type without looking at the keys, increasing speed and efficiency. Skilled typists use muscle memory and proper finger placement to type faster. For professionals, mastering typing can save time and increase productivity, making it an essential skill in today’s workplace.",
  "Achieving professional typing speed requires more than just practice; it demands discipline and focus. Typists must learn to maintain accuracy while typing quickly. For many, touch typing is the key to improving speed and reducing errors. Through consistent practice, typing can become second nature, allowing individuals to handle tasks with ease and efficiency.",
  "Advanced typists have mastered both speed and accuracy, allowing them to perform tasks efficiently. Precision in typing is crucial in professions where errors can lead to significant setbacks. By practicing proper finger placement and focusing on key coordination, typists can maintain high speeds without sacrificing accuracy, making them invaluable in high-pressure environments.",
  "Becoming proficient at typing requires regular practice and attention to detail. Touch typing techniques allow typists to focus on content instead of the keyboard, boosting speed and reducing mistakes. Typing fast and accurately is an asset in both personal and professional environments. With practice, individuals can achieve fluency, allowing them to complete tasks efficiently and effectively.",
  "Typing is more than just a skill; it’s an essential tool in today’s digital world. Skilled typists can accomplish tasks quickly and accurately, which is especially important in high-pressure professions. Mastering touch typing requires time and effort, but it pays off by increasing productivity and improving communication. Accuracy, speed, and proper technique are all vital components of this skill."
];


let words = medium; // Default difficulty level
let timeLimit = 60; // Default time limit (seconds)
const game = {
  start: 0,
  end: 0,
  user: "",
  arrText: "",
  interval: null
};

// Add difficulty level buttons
document.querySelector(".container").insertAdjacentHTML("beforeend", `
  <div class="difficulty-buttons">
    <button id="easy">Easy</button>
    <button id="medium">Medium</button>
    <button id="hard">Hard</button>
  </div>
`);

// Set difficulty and time limit based on the selected button
document.getElementById("easy").addEventListener("click", () => {
  words = easy;
  timeLimit = 30;
});
document.getElementById("medium").addEventListener("click", () => {
  words = medium;
  timeLimit = 60;
});
document.getElementById("hard").addEventListener("click", () => {
  words = hard;
  timeLimit = 60;
});

btn.addEventListener("click", () => {
  if (btn.textContent === "Start") {
    play();
    typeArea.value = "";
    typeArea.disabled = false;
    typeArea.focus();
  } else if (btn.textContent === "Done") {
    endGame();
  }
});

typeArea.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    endGame();
  }
});

function play() {
  // Select a random string from the current difficulty level
  let randText = Math.floor(Math.random() * words.length);
  main.textContent = words[randText];
  game.arrText = words[randText];
  btn.textContent = "Done";
  const duration = new Date();
  game.start = duration.getTime();
  startTimer();
}

function endGame() {
  clearInterval(game.interval); // Stop the timer
  typeArea.disabled = true;
  end();
}

function end() {
  const duration = new Date();
  game.end = duration.getTime();
  const totalTime = (game.end - game.start) / 1000; // seconds
  const totalTimeMinutes = totalTime / 60;
  game.user = typeArea.value;
  const correct = results();

  // Calculate WPM and Accuracy
  const WPM = Math.round(correct.score / totalTimeMinutes);
  const accuracy = Math.round((correct.score / correct.total) * 100);

  // Display WPM, accuracy, and errors
  main.innerHTML = `
    Time: ${totalTime.toFixed(2)}s <br>
    WPM: ${WPM} <br>
    Accuracy: ${accuracy}% <br>
    ${highlightErrors(correct.words)}
  `;
  btn.textContent = "Start";
}

function results() {
  let targetWords = game.arrText.split(" ");
  let userWords = game.user.split(" ");
  let score = 0;
  let words = [];

  targetWords.forEach((word, idx) => {
    if (word === userWords[idx]) {
      score++;
      words.push(`<span style="color: green">${word}</span>`);
    } else {
      words.push(`<span style="color: red">${userWords[idx] || ''}</span>`);
    }
  });

  return { score, total: targetWords.length, words };
}

function highlightErrors(words) {
  return `Typed: ${words.join(" ")}`;
}

function startTimer() {
  let timeLeft = timeLimit;
  timerDisplay.textContent = `Time left: ${timeLeft}s`;
  
  game.interval = setInterval(() => {
    timeLeft--;
    timerDisplay.textContent = `Time left: ${timeLeft}s`;
    
    if (timeLeft <= 0) {
      clearInterval(game.interval);
      endGame();
    }
  }, 1000);
}
