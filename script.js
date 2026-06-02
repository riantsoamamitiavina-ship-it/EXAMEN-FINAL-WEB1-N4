let startTime = null;
let currentWordIndex = 0;
let totalTypedCharacters = 0;
let totalCorrectCharacters = 0;

const wordsToType = [];
const modeSelect = document.getElementById("mode");
const wordDisplay = document.getElementById("word-display");
const inputField = document.getElementById("input-field");
const wpmValue = document.getElementById("wpm-value");
const wpmCircle = document.getElementById("wpm-circle");
const wpmPercentText = document.getElementById("wpm-percent");
const accuracyValue = document.getElementById("accuracy-value");
const accuracyCircle = document.getElementById("accuracy-circle");
const accuracyPercentText = document.getElementById("accuracy-percent");
const progressBar = document.getElementById("progress-bar");
const progressText = document.getElementById("progress-text");
const progressPercentage = document.getElementById("progress-percentage");
const customPhrase = "tapez ici pour savoir combien de mots par minute vous pouvez taper";
const startTest = () => {
    wordsToType.length = 0;
    wordDisplay.innerHTML = "";
    currentWordIndex = 0;
    startTime = null;
    totalTypedCharacters = 0;
    totalCorrectCharacters = 0;

    customPhrase.split(" ").forEach(word => {
        wordsToType.push(word);
    });

    wordsToType.forEach((word, index) => {
        const span = document.createElement("span");
        span.textContent = word + " ";
        span.className = "text-slate-400 transition-colors duration-150 rounded px-1";
        if (index === 0) {
            span.className = "text-blue-600 font-bold bg-blue-50 dark:bg-slate-800 border-b-2 border-blue-500 rounded px-1";
        }
        wordDisplay.appendChild(span);
    });

    inputField.value = "";
    updateStatsUI(0, 100);
};

document.addEventListener("click", () => {
    inputField.focus();
});

const updateStatsUI = (wpm, accuracy) => {
    wpmValue.textContent = Math.round(wpm);
    wpmPercentText.textContent = Math.round(wpm);
    accuracyValue.textContent = Math.round(accuracy);
    accuracyPercentText.textContent = Math.round(accuracy) + "%";

    const wpmDashArray = `${Math.min((wpm / 120) * 100, 100)}, 100`;
    wpmCircle.setAttribute("stroke-dasharray", wpmDashArray);

    const accuracyDashArray = `${accuracy}, 100`;
    accuracyCircle.setAttribute("stroke-dasharray", accuracyDashArray);

    const overallProgress = (currentWordIndex / wordsToType.length) * 100;
    progressBar.style.width = `${overallProgress}%`;
    progressText.textContent = `Word ${currentWordIndex}/${wordsToType.length}`;
    progressPercentage.textContent = `${Math.round(overallProgress)}%`;
};

const handleInput = (event) => {
    if (!startTime) startTime = Date.now();

    const currentWord = wordsToType[currentWordIndex];
    const typedValue = inputField.value;
    const targetSpan = wordDisplay.children[currentWordIndex];

    let isCorrectSoFar = true;
    for (let i = 0; i < typedValue.length; i++) {
        if (typedValue[i] !== currentWord[i]) {
            isCorrectSoFar = false;
            break;
        }
    }

    if (isCorrectSoFar) {
        targetSpan.className = "text-blue-600 bg-blue-50 dark:bg-slate-800 font-semibold border-b-2 border-blue-400 px-1";
    } else {
        targetSpan.className = "text-red-600 bg-red-100 dark:bg-red-950/50 font-semibold border-b-2 border-red-400 px-1";
    }

    if (event.data) {
        totalTypedCharacters++;
        if (event.data === currentWord[typedValue.length - 1]) {
            totalCorrectCharacters++;
        }
        calculateLiveStats();
    }
};

const calculateLiveStats = () => {
    if (!startTime) return;
    const elapsedTimeMin = (Date.now() - startTime) / 60000;
    if (elapsedTimeMin <= 0) return;

    const wpm = (totalCorrectCharacters / 5) / elapsedTimeMin;
    const accuracy = totalTypedCharacters > 0 ? (totalCorrectCharacters / totalTypedCharacters) * 100 : 100;

    updateStatsUI(wpm, accuracy);
};

const checkWordSubmission = (event) => {
    let pressedKey = event.key.toLowerCase();
    if (event.key === "Backspace") pressedKey = "backspace";
    if (event.key === "Enter") pressedKey = "enter";

    const virtualKeyNode = document.querySelector(`.key[data-key="${pressedKey}"]`);
    if (virtualKeyNode) {
        virtualKeyNode.classList.add("bg-slate-500", "text-white", "scale-95");
        setTimeout(() => {
            virtualKeyNode.classList.remove("bg-slate-500", "text-white", "scale-95");
        }, 100);
    }

    if (event.key === " ") {
        const typedValue = inputField.value.trim();
        const targetWord = wordsToType[currentWordIndex];

        if (typedValue === targetWord) {
            totalTypedCharacters++;
            totalCorrectCharacters++;

            wordDisplay.children[currentWordIndex].className = "text-emerald-600 dark:text-emerald-400 font-medium px-1";
            currentWordIndex++;

            if (currentWordIndex < wordsToType.length) {
                wordDisplay.children[currentWordIndex].className = "text-blue-600 font-bold bg-blue-50 dark:bg-slate-800 border-b-2 border-blue-500 rounded px-1";
            } else {
                inputField.disabled = true;
                progressBar.style.width = "100%";
                progressText.textContent = "Terminé !";
                progressPercentage.textContent = "100%";
                return;
            }

            inputField.value = "";
            calculateLiveStats();
            event.preventDefault();
        }
    }
};

inputField.addEventListener("input", handleInput);
inputField.addEventListener("keydown", checkWordSubmission);
modeSelect.addEventListener("change", () => startTest());

document.getElementById('theme-toggle').addEventListener('click', () => {

    document.documentElement.classList.toggle('dark');
});

startTest();