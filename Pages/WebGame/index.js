// Game state variables
let team1Score = 0;
let team2Score = 0;
let isTeam1Turn = true;
let currentRound = -1; // Start with -1 to trigger the theme menu
let currentTurnInRound = 0;
let currentAnswer = [];
let timerInterval;
let timeLeft;
let pointsPerCorrect = 0;
let isColorblindMode = false;

// Sound effects using Tone.js
const correctSound = new Tone.Synth().toDestination();
const incorrectSound = new Tone.Synth().toDestination();

const playCorrectSound = () => {
  correctSound.triggerAttackRelease("C4", "8n");
  correctSound.triggerAttackRelease("E4", "8n", "+0.1");
  correctSound.triggerAttackRelease("G4", "8n", "+0.2");
};

const playIncorrectSound = () => {
  incorrectSound.triggerAttackRelease("F#3", "8n");
  incorrectSound.triggerAttackRelease("C3", "8n", "+0.1");
};

// Colorblind symbols mapping
const colorSymbols = {
  red: "▲",
  orange: "■",
  green: "●",
  yellow: "★",
  blue: "◆",
  purple: "◓",
};

// Helper function to shuffle an array
const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

// Game data
const gameData = [
  {
    name: "Planets",
    question: "Sort the planets from the closest to the sun to the furthest.",
    colors: ["red", "orange", "green", "yellow", "blue", "purple"],
    colorMap: {
      red: "Mercury",
      orange: "Venus",
      green: "Earth",
      yellow: "Mars",
      blue: "Jupiter",
      purple: "Saturn",
    },
    correctAnswer: ["red", "orange", "green", "yellow", "blue", "purple"],
    turnTimes: [60, 45, 30, 30],
    turnPoints: [2, 2, 1, 1],
    played: false,
  },
  {
    name: "Video Games",
    question: "Sort these video games by all-time sales, from most to least.",
    colors: ["red", "orange", "green", "yellow", "blue", "purple"],
    colorMap: {
      red: "Grand Theft Auto V",
      orange: "PUBG: Battlegrounds",
      green: "Minecraft",
      yellow: "Wii Sports",
      blue: "Tetris",
      purple: "Super Mario Bros.",
    },
    correctAnswer: ["green", "blue", "orange", "yellow", "red", "purple"],
    turnTimes: [60, 45, 30, 30],
    turnPoints: [2, 2, 1, 1],
    played: false,
  },
  {
    name: "US Presidents",
    question: "Sort US presidents by their term of service, chronologically.",
    colors: ["red", "orange", "green", "yellow", "blue", "purple"],
    colorMap: {
      red: "George Washington",
      orange: "Abraham Lincoln",
      green: "Theodore Roosevelt",
      yellow: "Franklin D. Roosevelt",
      blue: "John F. Kennedy",
      purple: "Donald Trump",
    },
    correctAnswer: ["red", "orange", "green", "yellow", "blue", "purple"],
    turnTimes: [60, 45, 30, 30],
    turnPoints: [2, 2, 1, 1],
    played: false,
  },
  {
    name: "Ancient Wonders",
    question:
      "Sort these Seven Wonders of the Ancient World by construction date, earliest to latest.",
    colors: ["red", "orange", "green", "yellow", "blue", "purple"],
    colorMap: {
      red: "Great Pyramid of Giza",
      orange: "Hanging Gardens of Babylon",
      green: "Statue of Zeus at Olympia",
      yellow: "Temple of Artemis at Ephesus",
      blue: "Mausoleum at Halicarnassus",
      purple: "Colossus of Rhodes",
    },
    correctAnswer: ["red", "orange", "green", "yellow", "blue", "purple"],
    turnTimes: [60, 45, 30, 30],
    turnPoints: [2, 2, 1, 1],
    played: false,
  },
  {
    name: "Animal Speed",
    question: "Sort these animals from fastest to slowest.",
    colors: ["red", "orange", "green", "yellow", "blue", "purple"],
    colorMap: {
      red: "Cheetah",
      orange: "Ostrich",
      green: "Lion",
      yellow: "Grizzly Bear",
      blue: "Horse",
      purple: "Domestic Cat",
    },
    correctAnswer: ["red", "orange", "green", "blue", "yellow", "purple"],
    turnTimes: [60, 45, 30, 30],
    turnPoints: [2, 2, 1, 1],
    played: false,
  },
  {
    name: "Global Landmarks",
    question: "Sort these global landmarks by height, tallest to shortest.",
    colors: ["red", "orange", "green", "yellow", "blue", "purple"],
    colorMap: {
      red: "Burj Khalifa",
      orange: "Tokyo Skytree",
      green: "Shanghai Tower",
      yellow: "CN Tower",
      blue: "Eiffel Tower",
      purple: "Statue of Liberty",
    },
    correctAnswer: ["red", "green", "orange", "yellow", "blue", "purple"],
    turnTimes: [60, 45, 30, 30],
    turnPoints: [2, 2, 1, 1],
    played: false,
  },
  {
    name: "Music Albums",
    question:
      "Sort these popular music albums by their release year, earliest to latest.",
    colors: ["red", "orange", "green", "yellow", "blue", "purple"],
    colorMap: {
      red: "The Dark Side of the Moon",
      orange: "Thriller",
      green: "Nevermind",
      yellow: "Jagged Little Pill",
      blue: "The Marshall Mathers LP",
      purple: "21",
    },
    correctAnswer: ["red", "orange", "green", "yellow", "blue", "purple"],
    turnTimes: [60, 45, 30, 30],
    turnPoints: [2, 2, 1, 1],
    played: false,
  },
];

// DOM elements
const gameContainer = document.getElementById("game-container");
const themeMenuModal = document.getElementById("theme-menu-modal");
const themeButtonsEl = document.getElementById("theme-buttons");
const team1ScoreEl = document.getElementById("team1-score");
const team2ScoreEl = document.getElementById("team2-score");
const timerEl = document.getElementById("timer");
const turnInfoEl = document.getElementById("turn-info");
const questionEl = document.getElementById("question");
const colorMappingsEl = document.getElementById("color-mappings");
const answerSlotsEl = document.getElementById("answer-slots");
const colorOptionsEl = document.getElementById("color-options");
const submitBtn = document.getElementById("submit-btn");
const messageContainer = document.getElementById("message-container");
const turnStartModal = document.getElementById("turn-start-modal");
const modalTitle = document.getElementById("modal-title");
const modalMessage = document.getElementById("modal-message");
const startTurnBtn = document.getElementById("start-turn-btn");
const colorblindModeBtn = document.getElementById("colorblind-mode-btn");

// Functions
const initGame = () => {
  team1Score = 0;
  team2Score = 0;
  isTeam1Turn = true;
  updateScores();
  displayThemeMenu();
};

const updateScores = () => {
  team1ScoreEl.textContent = team1Score;
  team2ScoreEl.textContent = team2Score;
};

const updateColorblindButton = () => {
  colorblindModeBtn.textContent = `Colorblind Mode: ${
    isColorblindMode ? "On" : "Off"
  }`;
};

const displayThemeMenu = () => {
  gameContainer.style.display = "none";
  themeMenuModal.style.display = "flex";
  themeButtonsEl.innerHTML = "";

  gameData.forEach((theme, index) => {
    const themeBtn = document.createElement("button");
    themeBtn.className = "theme-btn";
    if (theme.played) {
      themeBtn.disabled = true;
    }
    themeBtn.textContent = theme.name;
    themeBtn.addEventListener("click", () => {
      if (!theme.played) {
        loadRound(index);
      }
    });
    themeButtonsEl.appendChild(themeBtn);
  });
};

const loadRound = (roundIndex) => {
  currentRound = roundIndex;
  gameData[currentRound].played = true; // Mark this theme as played
  themeMenuModal.style.display = "none";
  gameContainer.style.display = "flex";
  currentTurnInRound = 0;
  currentAnswer = [];

  const round = gameData[currentRound];
  questionEl.textContent = `Trivia: ${round.question}`;

  // Display shuffled color mappings
  colorMappingsEl.innerHTML = "";
  const colorMapEntries = Object.entries(round.colorMap);
  const shuffledColorMap = shuffleArray(colorMapEntries);

  shuffledColorMap.forEach(([color, name]) => {
    const mappingDiv = document.createElement("div");
    mappingDiv.className = "flex items-center gap-2";
    const colorCircle = document.createElement("div");
    colorCircle.className = `w-6 h-6 rounded-full border-2 border-gray-400 relative`;
    colorCircle.style.backgroundColor = color;
    if (isColorblindMode) {
      const symbolSpan = document.createElement("span");
      symbolSpan.className =
        "color-symbol absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2";
      symbolSpan.textContent = colorSymbols[color];
      colorCircle.appendChild(symbolSpan);
    }
    const textSpan = document.createElement("span");
    textSpan.textContent = name;
    mappingDiv.append(colorCircle, textSpan);
    colorMappingsEl.appendChild(mappingDiv);
  });

  showTurnStartConfirmation();
};

const showTurnStartConfirmation = () => {
  clearInterval(timerInterval);
  currentAnswer = [];
  renderAnswerSlots();
  submitBtn.disabled = true;
  messageContainer.textContent = "";

  const round = gameData[currentRound];
  const teamName = isTeam1Turn ? "Team 1" : "Team 2";

  modalTitle.textContent = `${teamName}'s Turn`;
  modalMessage.textContent = `You have ${round.turnTimes[currentTurnInRound]} seconds and get ${round.turnPoints[currentTurnInRound]} points per correct color.`;
  turnStartModal.style.display = "flex";
};

const runTurnLogic = () => {
  turnStartModal.style.display = "none";
  submitBtn.disabled = false; // Enable submit button for new turn

  const round = gameData[currentRound];
  timeLeft = round.turnTimes[currentTurnInRound];
  pointsPerCorrect = round.turnPoints[currentTurnInRound];

  const teamName = isTeam1Turn ? "Team 1" : "Team 2";
  turnInfoEl.textContent = `${teamName}'s Turn`;

  updateTimerDisplay();
  timerInterval = setInterval(updateTimer, 1000);

  // Display shuffled color options with symbols if in colorblind mode
  colorOptionsEl.innerHTML = "";
  const shuffledColors = shuffleArray([...round.colors]);
  shuffledColors.forEach((color) => {
    const colorDiv = document.createElement("div");
    colorDiv.className = `color-circle ${color}`;
    colorDiv.style.backgroundColor = color;
    if (isColorblindMode) {
      const symbolSpan = document.createElement("span");
      symbolSpan.className = "color-symbol";
      symbolSpan.textContent = colorSymbols[color];
      colorDiv.appendChild(symbolSpan);
    }
    colorDiv.addEventListener("click", () => selectColor(color));
    colorOptionsEl.appendChild(colorDiv);
  });
};

const updateTimerDisplay = () => {
  timerEl.textContent = timeLeft > 9 ? timeLeft : `0${timeLeft}`;
};

const updateTimer = () => {
  timeLeft--;
  updateTimerDisplay();
  if (timeLeft <= 0) {
    clearInterval(timerInterval);
    submitAnswer();
  }
};

const renderAnswerSlots = () => {
  answerSlotsEl.innerHTML = "";
  for (let i = 0; i < 6; i++) {
    const slot = document.createElement("div");
    slot.className = `color-slot ${currentAnswer[i] ? "filled" : "empty-slot"}`;
    if (currentAnswer[i]) {
      slot.style.backgroundColor = currentAnswer[i];
      slot.classList.add("color-circle");
      if (isColorblindMode) {
        const symbolSpan = document.createElement("span");
        symbolSpan.className = "color-symbol";
        symbolSpan.textContent = colorSymbols[currentAnswer[i]];
        slot.appendChild(symbolSpan);
      }
      slot.addEventListener("click", () => removeColor(i));
    }
    answerSlotsEl.appendChild(slot);
  }

  submitBtn.disabled = currentAnswer.length < 6;
};

const selectColor = (color) => {
  if (currentAnswer.length < 6) {
    if (!currentAnswer.includes(color)) {
      currentAnswer.push(color);
      renderAnswerSlots();
    } else {
      messageContainer.textContent = "Color already selected!";
      setTimeout(() => (messageContainer.textContent = ""), 1000);
    }
  }
};

const removeColor = (index) => {
  currentAnswer.splice(index, 1);
  renderAnswerSlots();
};

const submitAnswer = () => {
  submitBtn.disabled = true; // Block button to prevent double-clicks
  clearInterval(timerInterval);
  let correctCount = 0;
  const round = gameData[currentRound];

  // Add visual feedback to answer slots
  const slots = answerSlotsEl.querySelectorAll(".color-slot");
  for (let i = 0; i < 6; i++) {
    if (currentAnswer[i] && currentAnswer[i] === round.correctAnswer[i]) {
      slots[i].classList.add("correct-slot");
      correctCount++;
    } else {
      slots[i].classList.add("incorrect-slot");
    }
  }

  const pointsGained = correctCount * pointsPerCorrect;

  if (isTeam1Turn) {
    team1Score += pointsGained;
  } else {
    team2Score += pointsGained;
  }

  updateScores();

  if (correctCount === 6) {
    messageContainer.textContent = `Perfect! Team ${
      isTeam1Turn ? "1" : "2"
    } gets ${pointsGained} points.`;
    playCorrectSound();
    setTimeout(() => {
      displayThemeMenu();
    }, 3000);
  } else {
    messageContainer.textContent = `Correct: ${correctCount}/6. Team ${
      isTeam1Turn ? "1" : "2"
    } gets ${pointsGained} points.`;
    if (correctCount > 0) {
      playCorrectSound();
    } else {
      playIncorrectSound();
    }

    currentTurnInRound++;
    if (currentTurnInRound >= 4) {
      messageContainer.textContent += ` Round Over! The correct answer was:`;
      // Reveal the correct answer at the end of the round
      const correctAnswersContainer = document.createElement("div");
      correctAnswersContainer.className =
        "flex justify-center flex-wrap gap-2 mt-4";
      round.correctAnswer.forEach((color) => {
        const answerDiv = document.createElement("div");
        answerDiv.className = `color-circle`;
        answerDiv.style.backgroundColor = color;
        if (isColorblindMode) {
          const symbolSpan = document.createElement("span");
          symbolSpan.className = "color-symbol";
          symbolSpan.textContent = colorSymbols[color];
          answerDiv.appendChild(symbolSpan);
        }
        correctAnswersContainer.appendChild(answerDiv);
      });
      messageContainer.appendChild(correctAnswersContainer);

      setTimeout(() => {
        displayThemeMenu();
      }, 5000);
    } else {
      isTeam1Turn = !isTeam1Turn;
      setTimeout(showTurnStartConfirmation, 3000);
    }
  }
};

// Event listeners
submitBtn.addEventListener("click", submitAnswer);
startTurnBtn.addEventListener("click", runTurnLogic);
colorblindModeBtn.addEventListener("click", () => {
  isColorblindMode = !isColorblindMode;
  updateColorblindButton();
  if (currentRound > -1) {
    loadRound(currentRound); // Reload the current round to apply symbol changes
  }
});

// Start the game on window load
window.onload = function () {
  initGame();
};
