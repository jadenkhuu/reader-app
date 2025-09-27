// Application state
let words = [];
let currentIndex = 0;
let isPlaying = false;
let intervalId = null;
let wpm = 250;

// DOM elements
const textInput = document.getElementById('text-input');
const wordDisplay = document.getElementById('word-display');
const playPauseBtn = document.getElementById('play-pause-btn');
const resetBtn = document.getElementById('reset-btn');
const speedSlider = document.getElementById('speed-slider');
const speedValue = document.getElementById('speed-value');
const progressBar = document.getElementById('progress');
const wordCount = document.getElementById('word-count');
const currentWordStat = document.getElementById('current-word');
const timeLeft = document.getElementById('time-left');

// Get icon elements
const playIcon = playPauseBtn.querySelector('.play-icon');
const pauseIcon = playPauseBtn.querySelector('.pause-icon');

// Event listeners
playPauseBtn.addEventListener('click', togglePlayPause);
resetBtn.addEventListener('click', resetReading);
speedSlider.addEventListener('input', updateSpeed);
textInput.addEventListener('input', handleTextInput);

function handleTextInput() {
    const text = textInput.value.trim();
    if (text) {
        // Split text into words, handling punctuation
        words = text.split(/\s+/).filter(word => word.length > 0);
        wordCount.textContent = words.length;
        resetBtn.disabled = false;
        updateTimeLeft();
    } else {
        words = [];
        wordCount.textContent = 0;
        resetBtn.disabled = true;
    }
}

function togglePlayPause() {
    if (!isPlaying) {
        startReading();
    } else {
        pauseReading();
    }
}

function startReading() {
    const text = textInput.value.trim();

    if (!text) {

        return;
    }

    if (!isPlaying) {
        if (words.length === 0 || currentIndex >= words.length) {
            words = text.split(/\s+/).filter(word => word.length > 0);
            currentIndex = 0;
        }

        isPlaying = true;
        // Switch to pause icon
        playIcon.style.display = 'none';
        pauseIcon.style.display = 'inline';
        resetBtn.disabled = false;
        textInput.disabled = true;

        displayWords();
    }
}

function displayWords() {
    if (currentIndex < words.length) {
        wordDisplay.textContent = words[currentIndex];
        currentIndex++;
        updateProgress();
        updateStats();

        const delay = 60000 / wpm; // Convert WPM to milliseconds per word
        intervalId = setTimeout(() => {
            displayWords();
        }, delay);
    } else {
        // Reading complete
        finishReading();
    }
}

function pauseReading() {
    if (isPlaying) {
        isPlaying = false;
        clearTimeout(intervalId);
        // Switch to play icon
        playIcon.style.display = 'inline';
        pauseIcon.style.display = 'none';
        wordDisplay.textContent = 'Paused';
    }
}

function resetReading() {
    isPlaying = false;
    clearTimeout(intervalId);
    currentIndex = 0;

    wordDisplay.textContent = 'Ready to start';
    // Switch to play icon
    playIcon.style.display = 'inline';
    pauseIcon.style.display = 'none';
    playPauseBtn.disabled = false;
    resetBtn.disabled = true;
    textInput.disabled = false;

    updateProgress();
    updateStats();
}

function finishReading() {
    isPlaying = false;
    wordDisplay.textContent = 'Complete! 🎉';
    // Switch to play icon
    playIcon.style.display = 'inline';
    pauseIcon.style.display = 'none';
    playPauseBtn.disabled = false;
    textInput.disabled = false;
}

function updateSpeed() {
    wpm = parseInt(speedSlider.value);
    speedValue.textContent = `${wpm} WPM`;
    updateTimeLeft();
}

function updateProgress() {
    const percentage = words.length > 0 ? (currentIndex / words.length) * 100 : 0;
    progressBar.style.width = `${percentage}%`;
}

function updateStats() {
    currentWordStat.textContent = currentIndex;
    updateTimeLeft();
}

function updateTimeLeft() {
    const wordsRemaining = words.length - currentIndex;
    const minutesLeft = wordsRemaining / wpm;
    const seconds = Math.round(minutesLeft * 60);
    const displayMinutes = Math.floor(seconds / 60);
    const displaySeconds = seconds % 60;
    timeLeft.textContent = `${displayMinutes}:${displaySeconds.toString().padStart(2, '0')}`;
}

// Initialize
updateSpeed();