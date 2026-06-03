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

const difficultyPhrases = {
    easy: "tapez ici pour savoir combien de mots par minute vous pouvez taper",
    medium: "l informatique et la dactylographie demandent de la vitesse et une grande précision au clavier",
    hard: "l environnement de développement exige la configuration simultanée de caractères spéciaux comme { & ou # !"
};

const startTest = () => {
    wordsToType.length = 0;
    wordDisplay.innerHTML = "";
    currentWordIndex = 0;
    startTime = null;
    totalTypedCharacters = 0;
    totalCorrectCharacters = 0;

    inputField.disabled = false;

    const selectedLevel = modeSelect.value || "easy";
    const currentPhrase = difficultyPhrases[selectedLevel];

    currentPhrase.split(" ").forEach(word => {
        wordsToType.push(word);
    });

    wordsToType.forEach((word, index) => {
        const wordSpan = document.createElement("span");
        wordSpan.className = "word inline-block mx-1 my-1 px-1 py-0.5 transition-all duration-150 border-b-2 border-transparent";
        
        if (index === 0) {
            wordSpan.classList.remove("border-transparent");
            wordSpan.classList.add("border-blue-500", "dark:border-blue-400");
        }

        word.split("").forEach(char => {
            const charSpan = document.createElement("span");
            charSpan.textContent = char;
            charSpan.className = "text-slate-400 transition-colors duration-100";
            wordSpan.appendChild(charSpan);
        });

        const spaceSpan = document.createElement("span");
        spaceSpan.textContent = " ";
        spaceSpan.className = "text-slate-400/50";
        wordSpan.appendChild(spaceSpan);

        wordDisplay.appendChild(wordSpan);
    });

    wordDisplay.scrollTo({ top: 0, left: 0, behavior: "smooth" });

    inputField.value = "";
    updateStatsUI(0, 100);
};

const updateStatsUI = (wpm, accuracy) => {
    wpmValue.textContent = Math.round(wpm);
    wpmPercentText.textContent = Math.round(wpm);
    accuracyValue.textContent = Math.round(accuracy);
    accuracyPercentText.textContent = Math.round(accuracy) + "%";

    const wpmDashArray = `${Math.min((wpm / 120) * 100, 100)}, 100`;
    wpmCircle.setAttribute("stroke-dasharray", wpmDashArray);

    const accuracyDashArray = `${accuracy}, 100`;
    accuracyCircle.setAttribute("stroke-dasharray", accuracyDashArray);

    const overallProgress = wordsToType.length > 0 ? (currentWordIndex / wordsToType.length) * 100 : 0;
    progressBar.style.width = `${overallProgress}%`;
    progressText.textContent = `Word ${currentWordIndex}/${wordsToType.length}`;
    progressPercentage.textContent = `${Math.round(overallProgress)}%`;
};

const handleInput = (event) => {
    if (!startTime) startTime = Date.now();

    const currentWord = wordsToType[currentWordIndex];
    const typedValue = inputField.value;
    const wordSpan = wordDisplay.children[currentWordIndex];

    if (!wordSpan) return;

    const charSpans = wordSpan.children;

    for (let i = 0; i < currentWord.length; i++) {
        const charSpan = charSpans[i];
        if (!charSpan) continue;

        if (i < typedValue.length) {
            if (typedValue[i] === currentWord[i]) {
                charSpan.className = "text-blue-600 dark:text-blue-400 font-semibold";
            } else {
                charSpan.className = "text-red-600 dark:text-red-400 font-semibold bg-red-100 dark:bg-red-950/40 rounded-sm";
            }
        } else {
            charSpan.className = "text-slate-400";
        }
    }

    const trailingSpaceSpan = charSpans[currentWord.length];
    if (trailingSpaceSpan) {
        if (typedValue.length > currentWord.length) {
            trailingSpaceSpan.className = "text-red-600 bg-red-100 dark:bg-red-950/40 font-bold";
        } else {
            trailingSpaceSpan.className = "text-slate-400/50";
        }
    }

    if (event.data) {
        totalTypedCharacters++;
        const currentTypedIndex = typedValue.length - 1;
        if (currentTypedIndex < currentWord.length && event.data === currentWord[currentTypedIndex]) {
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

            const currentWordSpan = wordDisplay.children[currentWordIndex];
            
            currentWordSpan.classList.remove("border-blue-500", "dark:border-blue-400");
            currentWordSpan.classList.add("border-transparent");
            Array.from(currentWordSpan.children).forEach(child => {
                child.className = "text-emerald-600 dark:text-emerald-400 font-medium";
            });

            currentWordIndex++;

            if (currentWordIndex < wordsToType.length) {
                const nextWordSpan = wordDisplay.children[currentWordIndex];
                nextWordSpan.classList.remove("border-transparent");
                nextWordSpan.classList.add("border-blue-500", "dark:border-blue-400");
                
                nextWordSpan.scrollIntoView({
                    behavior: "smooth",
                    block: "nearest",
                    inline: "center"
                });

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

const changeDifficulty = (level) => {
    modeSelect.value = level;

    document.querySelectorAll('.diff-btn').forEach(btn => {
        btn.classList.remove('bg-white', 'dark:bg-slate-700', 'text-blue-600', 'dark:text-white', 'shadow-sm', 'font-bold');
        btn.classList.add('text-slate-500', 'dark:text-slate-400', 'font-medium');
    });

    const activeBtn = document.getElementById(`btn-${level}`);
    if (activeBtn) {
        activeBtn.classList.remove('text-slate-500', 'dark:text-slate-400', 'font-medium');
        activeBtn.classList.add('bg-white', 'dark:bg-slate-700', 'text-blue-600', 'dark:text-white', 'shadow-sm', 'font-bold');
    }

    modeSelect.dispatchEvent(new Event('change'));
};

document.addEventListener("click", () => {
    if (!inputField.disabled) inputField.focus();
});

inputField.addEventListener("input", handleInput);
inputField.addEventListener("keydown", checkWordSubmission);
modeSelect.addEventListener("change", () => startTest());

document.querySelectorAll('.diff-btn').forEach(btn => {
    btn.addEventListener('click', (event) => {
        const level = event.currentTarget.id.replace('btn-', '');
        changeDifficulty(level);
    });
});

document.getElementById('theme-toggle').addEventListener('click', () => {
    document.documentElement.classList.toggle('dark');
});

startTest();