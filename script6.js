const emotions = [
    { word: "Happy", video: "videos/happy.mp4" },
    { word: "Sad", video: "videos/sad.mp4" },
    { word: "Angry", video: "videos/angry.mp4" },
    { word: "Excited", video: "videos/excited.mp4" },
    { word: "Scared", video: "videos/scared.mp4" },
    { word: "Surprise", video: "videos/surprised.mp4" },
    { word: "Tired", video: "videos/tired.mp4" },
    { word: "Bored", video: "videos/bored.mp4" },
    { word: "Confused", video: "videos/confused.mp4" },
    { word: "Love", video: "videos/loved.mp4" },
    { word: "Nervous", video: "videos/nervous.mp4" },
    { word: "Proud", video: "videos/proud.mp4" },
    { word: "Jealous", video: "videos/jealous.mp4" },
    { word: "Curious", video: "videos/curious.mp4" }
];

let currentIndex = 0;
let quizQuestions = [];
let currentQuestionIndex = 0;

const wordElement = document.getElementById("word");
const signVideoElement = document.getElementById("sign-video");
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");
const learningMode = document.getElementById("learning-mode");
const quizMode = document.getElementById("quiz-mode");
const quizVideoElement = document.getElementById("quiz-video");
const optionButtons = document.querySelectorAll(".option-btn");
const quizResult = document.getElementById("quiz-result");
const wordDisplay = document.querySelector(".word-display"); // Ensure this exists in your HTML

// Function to update word and video (Learning Mode)
function updateWord() {
    wordElement.style.display = "block"; // Show word in learning mode
    wordElement.textContent = emotions[currentIndex].word;
    signVideoElement.src = emotions[currentIndex].video;
    signVideoElement.load();
}

// Function to generate unique quiz questions
function generateQuizQuestions() {
    let selectedQuestions = [];
    let availableWords = [...emotions]; // Copy array to prevent modification

    while (selectedQuestions.length < 5 && availableWords.length > 0) {
        let randomIndex = Math.floor(Math.random() * availableWords.length);
        selectedQuestions.push(availableWords[randomIndex]);
        availableWords.splice(randomIndex, 1); // Remove selected to avoid repetition
    }

    quizQuestions = selectedQuestions.map(question => {
        let options = [question.word];
        let remainingOptions = emotions
            .map(e => e.word)
            .filter(word => word !== question.word); // Remove correct answer from options pool

        while (options.length < 4) {
            let randomWord = remainingOptions.splice(
                Math.floor(Math.random() * remainingOptions.length), 1
            )[0]; // Pick and remove a random incorrect option
            options.push(randomWord);
        }

        options.sort(() => Math.random() - 0.5); // Shuffle options

        return {
            word: question.word,
            video: question.video,
            options: options
        };
    });
}

// Function to load quiz question
function loadQuizQuestion() {
    if (currentQuestionIndex >= quizQuestions.length) {
        alert("Quiz completed! Restarting...");
        restartQuiz();
        return;
    }

    let question = quizQuestions[currentQuestionIndex];
    quizVideoElement.src = question.video;
    quizVideoElement.load();

    // Hide word display in quiz mode
    wordDisplay.style.display = "none";
    wordElement.style.display = "none";

    optionButtons.forEach((btn, index) => {
        btn.textContent = question.options[index];
    });

    quizResult.textContent = "";
}

// Function to check quiz answer
function checkAnswer(button) {
    let correctWord = quizQuestions[currentQuestionIndex].word;
    if (button.textContent === correctWord) {
        quizResult.textContent = "Correct!";
        quizResult.style.color = "green";
        setTimeout(() => {
            currentQuestionIndex++;
            loadQuizQuestion();
        }, 1000);
    } else {
        quizResult.textContent = "Wrong! Try Again.";
        quizResult.style.color = "red";
    }
}

// Function to restart quiz and return to learning mode
function restartQuiz() {
    currentQuestionIndex = 0;
    learningMode.style.display = "block";
    quizMode.style.display = "none";
    wordDisplay.style.display = "block"; // Show word display again
    wordElement.style.display = "block"; // Show word again
    currentIndex = 0;
    updateWord();
}

// Event listeners for navigation buttons
prevBtn.addEventListener("click", () => {
    if (currentIndex > 0) {
        currentIndex--;
        updateWord();
    }
});

nextBtn.addEventListener("click", () => {
    if (currentIndex < emotions.length - 1) {
        currentIndex++;
        updateWord();
    } else {
        generateQuizQuestions();
        learningMode.style.display = "none";
        quizMode.style.display = "block";
        wordDisplay.style.display = "none"; // Hide words in quiz
        wordElement.style.display = "none";
        currentQuestionIndex = 0;
        loadQuizQuestion();
    }
});

// Keyboard event listener
document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowRight") {
        if (learningMode.style.display !== "none") {
            if (currentIndex < emotions.length - 1) {
                currentIndex++;
                updateWord();
            } else {
                generateQuizQuestions();
                learningMode.style.display = "none";
                quizMode.style.display = "block";
                wordDisplay.style.display = "none";
                wordElement.style.display = "none";
                currentQuestionIndex = 0;
                loadQuizQuestion();
            }
        }
    } else if (event.key === "ArrowLeft") {
        if (currentIndex > 0) {
            currentIndex--;
            updateWord();
        }
    }
});
