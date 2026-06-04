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
    easy: [
        "type right here to find out exactly how many words per minute you can comfortably manage when typing on this keyboard the bright yellow sun is shining incredibly beautifully down from a completely clear and wide blue sky today afternoon",
        "several happy children are playing quietly together on the green grass in the lovely backyard of their old family house taking a peaceful morning walk is a truly wonderful way to start your busy day with a fresh mind and positive energy",
        "reading interesting books on a regular basis will naturally improve your vocabulary and overall reading comprehension skills over time beautiful wild birds are singing sweet melodies very softly just outside my bedroom window as the early morning dawn begins to break",
        "a freshly brewed hot cup of delicious coffee or warm tea usually accompanies the very first productive hours of a working day practicing your typing skills every single day with consistency is guaranteed to help you make rapid and noticeable progress the fluffy little cat is sleeping completely peacefully on the warm rug right next to the large open living room window",
        "every single bit of honest and constant effort you put into your work will eventually produce highly visible and rewarding results learning challenging new digital skills always requires a significant amount of your personal time, dedicated focus, and endless patience"
    ],

    medium: [
        "computer science and touch typing require a great balance of raw speed and precise accuracy across the entire standard keyboard layout modern software engineering and application programming require a deep, thorough understanding of highly complex algorithmic logic professional software developers constantly use a wide variety of advanced digital tools to maximize their daily workflow and productivity",
        "mastering proper fluid touch typing techniques will significantly reduce the total amount of time you spend on manual data entry tasks global computer networks allow for an incredibly rapid and completely seamless exchange of critical information between cloud servers possessing excellent organizational skills makes it much easier to successfully manage large, complex software engineering projects",
        "modern digital environments are constantly evolving alongside breakthrough technological developments and framework updates ensuring robust cyber data security has quickly become an absolute top priority for major contemporary international business operations everyday internet users highly appreciate desktop applications that feature a beautifully clean and efficient interface design",
        "seamless communication and collaboration between remote teams drastically improves the final quality of the product development lifecycle running extensive automated tests allows engineering teams to easily detect and quickly resolve frustrating software bugs early"
    ],

    hard: [
        "your local system development environment will frequently require configuring special characters like curly braces, ampersands, or hashtags advanced javascript functions and commands regularly utilize syntax symbols such as parentheses, brackets, and semicolons directly in code writing complex regular expressions for string matching often involves confusing characters like carets, dollar signs, asterisks, and pipes",
        "creating a highly secure and robust user password combines lowercase and uppercase letters with special symbols like at signs and percentages basic local network engineering configurations sometimes require typing manual numerical IP addresses such as 192.168.1.1 or 10.0.0.1 with care experienced software engineers must frequently manipulate sensitive string variables containing complex single and double quotation marks",
        "writing advanced mathematical formulas inside your code often requires deep nested loops alongside arithmetic symbols and equations standard software configuration files rely heavily on exact syntax formatting, including equals signs, colons, forward slashes, and backslashes modern programming language syntax heavily relies on complex nested array structures including less than, greater than, and question marks",
        "executing terminal commands via the command line interface requires combining multiple strict flags and dashes like double hyphens implementing proper runtime error handling always involves the structured use of try catch blocks alongside underscore or tilde variables network engineering configurations sometimes require typing manual numerical IP addresses structures including less than"
    ]
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

    const phrases = difficultyPhrases[selectedLevel];
    const randomIndex = Math.floor(Math.random() * phrases.length);
    const currentPhrase = phrases[randomIndex];

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
    if (event.key === "Enter" && inputField.disabled) {
        startTest();
        return;

    }
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
                progressText.textContent = "Terminé ! cliquez sur ↻ pour recommencer";
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
document.getElementById("restart-btn").addEventListener("click", startTest);
