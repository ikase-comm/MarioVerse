// --- WHAT HAPPENS NEXT? MARIO QUIZ ---
// Add a new quiz level with scenario-based questions

function showFooterQUIZ() {
  var f = document.getElementById("gameFooter");
  if (f) f.style.display = "";
}


// --- NEW LOGIC FOR MULTI-LEVEL QUIZ, THEMES, AND MODAL SHOP ---

let currentLevel = 0;
let currentQuestion = 0;

// Stars and theme unlock logic removed
let unlockedThemes = ["mario"];
let selectedTheme = "mario";

// --- RANDOMIZE QUIZ ORDER ---
// Shuffle function (Fisher-Yates)
function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

// Deep clone and shuffle quizLevels on load, and randomize answers
let originalQuizLevels = typeof quizLevels !== 'undefined' ? JSON.parse(JSON.stringify(quizLevels)) : [];
let randomizedQuizLevels = [];
function shuffleQuizLevelsAndAnswers(levels) {
  // Flatten all questions into one array for full randomization
  let allQuestions = [];
  levels.forEach(level => {
    allQuestions = allQuestions.concat(level);
  });
  shuffleArray(allQuestions);
  // Optionally, split into levels of same size as original
  let levelSizes = levels.map(level => level.length);
  let newLevels = [];
  let idx = 0;
  for (let size of levelSizes) {
    let level = [];
    for (let i = 0; i < size; i++) {
      // Deep clone question and randomize answers
      let q = JSON.parse(JSON.stringify(allQuestions[idx++]));
      if (q.answers && Array.isArray(q.answers)) {
        let answerObjs = q.answers.map((ans, i) => ({ans, i}));
        shuffleArray(answerObjs);
        let newAnswers = answerObjs.map(obj => obj.ans);
        let newCorrect = answerObjs.findIndex(obj => obj.i === q.correct);
        q.answers = newAnswers;
        q.correct = newCorrect;
      }
      level.push(q);
    }
    newLevels.push(level);
  }
  return newLevels;
}
if (typeof quizLevels !== 'undefined') {
  randomizedQuizLevels = shuffleQuizLevelsAndAnswers(quizLevels);
}

// Use randomizedQuizLevels in place of quizLevels
function getQuizLevels() {
  return randomizedQuizLevels.length ? randomizedQuizLevels : quizLevels;
}

function showQuestion() {
  // End of all levels
  const quizContainer = document.getElementById("quizContainer");
  const quizLevelsToUse = getQuizLevels();
  if (currentLevel >= quizLevelsToUse.length) {
    quizContainer.innerHTML = `
            <div class="quiz-theme-bg" style="width:100vw;min-height:100vh;display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:center;">
                <div style='background:linear-gradient(135deg,#e63946 60%,#ff1744 100%);border-radius:2.5em;box-shadow:0 8px 32px 0 rgba(31,38,135,0.18);padding:3vw 3vw 2vw 3vw;max-width:900px;min-height:60vh;display:flex;flex-direction:column;align-items:center;justify-content:center;'>
                    <h2 style="font-size:2.7em;letter-spacing:2px;color:#fff;text-shadow:2px 2px 0 #fff176;margin-bottom:0.5em;">🎉 Quiz Complete!</h2>
                    <button onclick='restartQuiz()' style="margin-top:2em;padding:1.1em 2.8em;font-size:1.3em;border-radius:1.5em;background:linear-gradient(90deg,#ffd600,#ff5252);color:#fff;font-weight:bold;box-shadow:0 2px 8px #0002;border:none;cursor:pointer;transition:background 0.2s;">Restart</button>
                </div>
            </div>
        `;
    return;
  }
  const level = quizLevelsToUse[currentLevel];
  const q = level[currentQuestion];
  // Theme support: get theme from body class
  let theme = "default";
  if (document.body.classList.contains("theme-luigi")) theme = "luigi";
  else if (document.body.classList.contains("theme-rosalina"))
    theme = "rosalina";
  // Theme color map, with navbar text color for visibility, no gradients, soft backgrounds
  const themeStyles = {
    default: {
      bg: "#f7f6f2", // softer, warm light background
      card: "#fff",
      btn: "#ffd600",
      btnText: "#222",
      text: "#226ac8",
      shadow: "#226ac820",
      tip: "#226ac8",
      tipText: "#333",
      navbarText: "#226ac8",
      navbarShadow: "#fff",
    },
    luigi: {
      bg: "#d2f5d2", // slightly darker, soft green
      card: "#f6fff6",
      btn: "#3ad029",
      btnText: "#fff",
      text: "#217a1a",
      shadow: "#217a1a20",
      tip: "#217a1a",
      tipText: "#222",
      navbarText: "#217a1a",
      navbarShadow: "#fff",
    },
    rosalina: {
      bg: "#f2fbff", // soft blue
      card: "#ffffff",
      btn: "#bae1f2",
      btnText: "#1565c0",
      text: "#1565c0",
      shadow: "#1565c020",
      tip: "#1565c0",
      tipText: "#222",
      navbarText: "#1565c0",
      navbarShadow: "#fff",
    },
  };
  // Use 'default' if no theme class, else match theme
  let t = themeStyles[theme];
  if (!t) t = themeStyles.default;
  // Change quiz container background to match theme and set body class for global background
  const quizBg = document.getElementById("quizContainer");
  if (quizBg) quizBg.style.background = t.bg;
  // Set body class for theme background
  document.body.classList.remove(
    "theme-default",
    "theme-luigi",
    "theme-rosalina"
  );
  document.body.classList.add("theme-" + theme);
  // Update navbar text color for visibility
  const navbar = document.getElementById("mainNavbar");
  if (navbar) {
    const title = navbar.querySelector(".title");
    if (title) {
      title.style.color = t.navbarText;
      title.style.textShadow = `2px 2px 0 ${t.navbarShadow}`;
      title.style.webkitTextFillColor = "";
      title.style.webkitBackgroundClip = "";
      title.style.background = "";
    }
  }
  let html = `<div class="quiz-theme-bg" style="width:100vw;min-height:100vh;display:flex;flex-direction:column;align-items:center;position:relative;background:${
    t.bg
  };overflow-x:hidden;">
      <div class="quiz-container" id="quizStyled" style="display:flex;flex-direction:column;align-items:center;width:100vw;min-height:100vh;background:rgba(255,255,255,0.22);border-radius:0;box-shadow:none;padding:1.5em 0 2em 0;backdrop-filter:blur(18px);-webkit-backdrop-filter:blur(18px);border:none;margin-top:0;">
        <div style="width:100%;display:flex;justify-content:space-between;align-items:center;padding:1.2em 2em 0.5em 2em;max-width:700px;">
          <button onclick=\"goBackToMenu()\" style=\"padding:0.6em 1.5em;border-radius:1.5em;background:${t.btn};color:${t.btnText};font-weight:bold;box-shadow:0 2px 8px #0002;border:none;cursor:pointer;font-size:1em;\">← Home</button>
          <span style="display:inline-block;padding:0.6em 1.5em;border-radius:1.5em;background:${t.btn};color:${t.btnText};font-weight:bold;box-shadow:0 2px 8px #0002;border:none;font-size:1.1em;min-width:90px;text-align:center;letter-spacing:0.5px;">Q${currentQuestion + 1} <span style='font-size:0.9em;'>/ ${level.length}</span></span>
        </div>
        <h2 style="font-size:2.3em;color:${
          t.text
        };text-shadow:1px 1px 0 #fff176;margin-bottom:1em;margin-top:0.5em;">Mario Quiz</h2>
        ${
          q.silhouette
            ? ""
            : `<div class='question-text' style='font-size:1.3em;margin-bottom:1.2em;color:#222;text-shadow:0 1px 8px #fff8;text-align:center;'>${q.question}</div>`
        }
`;
  if (q.silhouette) {
    html += `<div style='display:flex;flex-direction:column;align-items:center;margin-bottom:1.2em;'>
            <img src='img/silhouette-1.png' alt='Silhouette' style='display:block;margin:0 auto 0.5em auto;width:180px; height:180px;filter:drop-shadow(0 4px 16px #0003);border-radius:1em;background:#fff;'>
            <div style='font-size:1.2em;color:#222;background:rgba(255,255,255,0.85);border-radius:1em;padding:0.5em 1.2em;box-shadow:0 2px 8px #0001;margin-top:0.5em;text-align:center;'>Who is this character?</div>
        </div>`;
  }
  html += `<div class='answers' style='width:100%;display:flex;flex-direction:column;align-items:center;'>`;
  q.answers.forEach((ans, i) => {
    html += `<button class='answer-btn' onclick='answerQuestion(${i})' style='display:block;margin:0.7em 0;padding:0.9em 1.2em;border:none;border-radius:1.5em;background:#fff;color:${t.text};font-size:1.1em;cursor:pointer;box-shadow:0 2px 8px #0001;transition:background 0.2s,transform 0.2s;width:100%;max-width:500px;'>${ans}</button>`;
  });
  html += `</div>`;
  // (Mario tips/facts now appear in the navbar, not in the quiz)
  html += `</div></div></div>`;
  quizContainer.innerHTML = html;
}

// Back button handler for quiz
function goBackToMenu() {
  // Hide quiz, show menu (assuming menu is #mainMenu)
  const quizContainer = document.getElementById("quizContainer");
  const mainMenu = document.getElementById("homeContainer");
  if (quizContainer) {
    quizContainer.style.display = "none";
    // Reset quizContainer background and styles
    quizContainer.style.background = "";
    quizContainer.innerHTML = "";
  }
  if (mainMenu) {
    mainMenu.style.display = "flex";
    // Reset homeContainer styles if any were changed
    mainMenu.style.background = "";
    mainMenu.style.padding = "";
    mainMenu.style.marginTop = "";
  }
  // Always set Mario theme on home return
  if (typeof setTheme === "function") {
    setTheme("default");
  }
  // Restore navbar title color and text shadow
  const navbar = document.getElementById("mainNavbar");
  if (navbar) {
    const title = navbar.querySelector(".title");
    if (title) {
      title.style.color = "";
      title.style.textShadow = "";
      title.style.webkitTextFillColor = "";
      title.style.webkitBackgroundClip = "";
      title.style.background = "";
    }
  }
  showFooterQUIZ();
  // Optionally reset quiz state
  currentLevel = 0;
  currentQuestion = 0;
}

let quizScore = 0;
window.answerQuestion = function (idx) {
  const quizLevelsToUse = getQuizLevels();
  const level = quizLevelsToUse[currentLevel];
  const q = level[currentQuestion];
  const answerBtns = document.querySelectorAll(".answer-btn");
  answerBtns.forEach((btn, i) => {
    btn.disabled = true;
    btn.style.position = "relative";
    btn.style.transition = "background 0.2s, color 0.2s, border 0.2s";
  });
  if (idx === q.correct) {
    answerBtns[idx].classList.add("correct");
    answerBtns[idx].style.background = "#39e66d";
    answerBtns[idx].style.color = "#fff";
    // Add checkmark
    let check = document.createElement("span");
    check.textContent = "✔";
    check.style.position = "absolute";
    check.style.right = "18px";
    check.style.top = "50%";
    check.style.transform = "translateY(-50%)";
    check.style.fontSize = "1.3em";
    check.style.color = "#fff";
    answerBtns[idx].appendChild(check);
    quizScore++;
  } else {
    answerBtns[idx].classList.add("wrong");
    answerBtns[idx].style.background = "#e63946";
    answerBtns[idx].style.color = "#fff";
    // Add X
    let x = document.createElement("span");
    x.textContent = "✖";
    x.style.position = "absolute";
    x.style.right = "18px";
    x.style.top = "50%";
    x.style.transform = "translateY(-50%)";
    x.style.fontSize = "1.3em";
    x.style.color = "#fff";
    answerBtns[idx].appendChild(x);
    // Show correct
    answerBtns[q.correct].classList.add("correct");
    answerBtns[q.correct].style.background = "#39e66d";
    answerBtns[q.correct].style.color = "#fff";
    let check = document.createElement("span");
    check.textContent = "✔";
    check.style.position = "absolute";
    check.style.right = "18px";
    check.style.top = "50%";
    check.style.transform = "translateY(-50%)";
    check.style.fontSize = "1.3em";
    check.style.color = "#fff";
    answerBtns[q.correct].appendChild(check);
  }
  setTimeout(() => {
    currentQuestion++;
    if (currentQuestion >= level.length) {
      currentLevel++;
      currentQuestion = 0;
      if (currentLevel >= quizLevels.length) {
        showQuizScoreModal();
        return;
      }
    }
    showQuestion();
  }, 1200);
};

function showQuizScoreModal() {
  // Create modal overlay
  let modal = document.createElement("div");
  modal.id = "quizScoreModal";
  modal.style.position = "fixed";
  modal.style.top = "0";
  modal.style.left = "0";
  modal.style.width = "100vw";
  modal.style.height = "100vh";
  modal.style.background = "rgba(30,30,60,0.25)";
  modal.style.zIndex = "99999";
  modal.style.display = "flex";
  modal.style.alignItems = "center";
  modal.style.justifyContent = "center";
  modal.innerHTML = `
      <div style="background:linear-gradient(135deg,#e63946 60%,#ff1744 100%);border-radius:2.5em;box-shadow:0 8px 32px 0 rgba(31,38,135,0.18);padding:3vw 3vw 2vw 3vw;max-width:90vw;min-width:320px;min-height:30vh;display:flex;flex-direction:column;align-items:center;justify-content:center;">
        <h2 style='font-size:2.3em;color:#fff;text-shadow:2px 2px 0 #fff176;margin-bottom:0.7em;'>Quiz Complete!</h2>
        <div style='font-size:1.5em;color:#fff;margin-bottom:1.2em;'>Your Score: <b>${quizScore}</b> / <b>${getTotalQuizQuestions()}</b></div>
        <div style='display:flex;gap:1.5em;'>
          <button id='quizExitBtn' style='padding:0.9em 2.2em;font-size:1.1em;border-radius:1.5em;background:#ffd600;color:#222;font-weight:bold;box-shadow:0 2px 8px #0002;border:none;cursor:pointer;transition:background 0.2s;'>Exit Game</button>
          <button id='quizRestartBtn' style='padding:0.9em 2.2em;font-size:1.1em;border-radius:1.5em;background:#39e66d;color:#fff;font-weight:bold;box-shadow:0 2px 8px #0002;border:none;cursor:pointer;transition:background 0.2s;'>Restart</button>
        </div>
      </div>
    `;
  document.body.appendChild(modal);
  document.getElementById("quizExitBtn").onclick = function () {
    // Hide quiz, show menu
    let quizContainer = document.getElementById("quizContainer");
    let mainMenu = document.getElementById("homeContainer");
    if (quizContainer) {
      quizContainer.style.display = "none";
      quizContainer.style.background = "";
      quizContainer.innerHTML = "";
    }
    if (mainMenu) {
      mainMenu.style.display = "flex";
      mainMenu.style.background = "";
      mainMenu.style.padding = "";
      mainMenu.style.marginTop = "";
    }
    // Always set Mario theme on home return
    if (typeof setTheme === "function") {
      setTheme("mario");
    }
    const navbar = document.getElementById("mainNavbar");
    if (navbar) {
      const title = navbar.querySelector(".title");
      if (title) {
        title.style.color = "";
        title.style.textShadow = "";
        title.style.webkitTextFillColor = "";
        title.style.webkitBackgroundClip = "";
        title.style.background = "";
      }
    }
    showFooterQUIZ();
    quizScore = 0;
    currentLevel = 0;
    currentQuestion = 0;
    document.body.removeChild(modal);
  };
  document.getElementById("quizRestartBtn").onclick = function () {
    quizScore = 0;
    currentLevel = 0;
    currentQuestion = 0;
    document.body.removeChild(modal);
    showQuestion();
  };
}

function getTotalQuizQuestions() {
  let total = 0;
  const quizLevelsToUse = getQuizLevels();
  for (let i = 0; i < quizLevelsToUse.length; i++) {
    total += quizLevelsToUse[i].length;
  }
  return total;
}

function restartQuiz() {
  // Re-shuffle on restart
  if (typeof originalQuizLevels !== 'undefined' && originalQuizLevels.length) {
    randomizedQuizLevels = shuffleQuizLevelsAndAnswers(originalQuizLevels);
  }
// --- WHAT HAPPENS NEXT? & WORD SCRAMBLE RANDOMIZATION ---
// What Happens Next: randomize question order on each start
if (window.whatNextQuestions && Array.isArray(window.whatNextQuestions)) {
  window._originalWhatNextQuestions = JSON.parse(JSON.stringify(window.whatNextQuestions));
  function shuffleWhatNextQuestions() {
    let arr = JSON.parse(JSON.stringify(window._originalWhatNextQuestions));
    shuffleArray(arr);
    window._randomizedWhatNextQuestions = arr;
  }
  shuffleWhatNextQuestions();
  window.getWhatNextQuestions = function() {
    return window._randomizedWhatNextQuestions || window.whatNextQuestions;
  };
  // Call shuffle on restart or play again
  window.restartWhatNextQuiz = function() {
    shuffleWhatNextQuestions();
    if (typeof window._restartWhatNextQuizImpl === 'function') {
      window._restartWhatNextQuizImpl();
    }
  };
}

// Word Scramble: randomize word order on each start
if (window.scrambleWords && Array.isArray(window.scrambleWords)) {
  window._originalScrambleWords = JSON.parse(JSON.stringify(window.scrambleWords));
  function shuffleScrambleWords() {
    let arr = JSON.parse(JSON.stringify(window._originalScrambleWords));
    shuffleArray(arr);
    window._randomizedScrambleWords = arr;
  }
  shuffleScrambleWords();
  window.getScrambleWords = function() {
    return window._randomizedScrambleWords || window.scrambleWords;
  };
  // Call shuffle on restart or play again
  window.restartScrambleGame = function() {
    shuffleScrambleWords();
    if (typeof window._restartScrambleGameImpl === 'function') {
      window._restartScrambleGameImpl();
    }
  };
}
  currentLevel = 0;
  currentQuestion = 0;
  showQuestion();
}

// THEME SHOP MODAL
// Theme Shop Modal logic (fix for modal content)
function renderThemeShop() {
  const shop = document.getElementById("themeShop");
  if (!shop) return;
  let html = `<h3 style="font-family:'Fredoka One', 'Comic Sans MS',cursive,sans-serif;font-size:2em;color:#ff5252;letter-spacing:2px;text-shadow:0 2px 8px #fff8;">Theme Shop</h3>`;
  html += `<div style="display:flex;flex-wrap:wrap;gap:1.2em;justify-content:center;">`;
  Object.entries(themes).forEach(([key, theme]) => {
    html += `<button class='theme-btn${selectedTheme === key ? " active" : ""}' 
            style='background:${theme.primary};color:${
      theme.text
    };border:3px solid ${
      selectedTheme === key ? theme.accent : "transparent"
    };border-radius:2em;padding:1.1em 2em;font-size:1.2em;box-shadow:0 4px 16px #0002;transition:transform 0.2s;cursor:pointer;outline:none;position:relative;overflow:hidden;' 
            onclick='window.selectTheme("${key}")'>
            <b>${theme.name}</b>
            ${
              selectedTheme === key
                ? '<span style="position:absolute;top:8px;right:12px;font-size:1.2em;">✔️</span>'
                : ""
            }
        </button>`;
  });
  html += `</div>`;
  shop.innerHTML = html;
}

function selectTheme(key) {
  selectedTheme = key;
  applyTheme();
  renderThemeShop();
}

// Modal open/close logic handled in index.html script
window.renderThemeShop = renderThemeShop;
window.selectTheme = selectTheme;

// Apply theme on load
applyTheme(selectedTheme);

window.restartQuiz = restartQuiz;
