const game = document.getElementById('game');
const resetButton = document.getElementById('reset');

// Modal elements
const winModal = document.getElementById('winModal');
const nextLevelButton = document.getElementById('nextLevel');

// Define levels: Each level contains tubes with their color configuration
const levels = [
    // Level 1
    [
        ['red', 'blue', 'green', 'yellow'],  // Tube 1
        ['yellow', 'green', 'blue', 'red'], // Tube 2
        ['yellow', 'red', 'green', 'blue'], // Tube 3
        [],                                 // Empty Tube 1
        [],                                 // Empty Tube 2
        []                                  // Empty Tube 3
    ],
    // Level 2
    [
        ['purple', 'orange', 'pink', 'cyan'],
        ['cyan', 'pink', 'orange', 'purple'],
        ['purple', 'cyan', 'pink', 'orange'],
        [], [], []
    ],
    // Add more levels up to Level 50
];

// Current game state
let currentLevel = 0; // Start with Level 1
let tubes = JSON.parse(JSON.stringify(levels[currentLevel]));

// Create tubes in the DOM
function createTubes() {
    game.innerHTML = '';
    tubes.forEach((tube, index) => {
        const tubeDiv = document.createElement('div');
        tubeDiv.classList.add('tube');
        tubeDiv.dataset.index = index;

        tube.forEach(color => {
            const colorDiv = document.createElement('div');
            colorDiv.classList.add('color');
            colorDiv.style.backgroundColor = color;
            tubeDiv.appendChild(colorDiv);
        });

        game.appendChild(tubeDiv);
    });
}

// Handle tube click
let selectedTube = null;
game.addEventListener('click', (e) => {
    if (!e.target.closest('.tube')) return;

    const clickedTubeIndex = parseInt(e.target.closest('.tube').dataset.index);

    if (selectedTube === null) {
        selectedTube = clickedTubeIndex;
        document.querySelector(`[data-index="${clickedTubeIndex}"]`).style.border = '2px solid red';
    } else {
        transferWater(selectedTube, clickedTubeIndex);
        selectedTube = null;
        document.querySelectorAll('.tube').forEach(tube => tube.style.border = '2px solid #333');
        checkWin();
    }
});

// Transfer water from one tube to another
function transferWater(from, to) {
    if (from === to || tubes[from].length === 0) return;

    const fromColor = tubes[from][tubes[from].length - 1];
    const toColor = tubes[to][tubes[to].length - 1];

    // Check if transfer is valid
    if (tubes[to].length < 4 && (toColor === fromColor || tubes[to].length === 0)) {
        // Transfer all consecutive colors
        while (tubes[from].length > 0 &&
               tubes[from][tubes[from].length - 1] === fromColor &&
               tubes[to].length < 4) {
            tubes[to].push(tubes[from].pop());
        }
        createTubes();
    }
}

// Check if the player has won
function checkWin() {
    const isWin = tubes.every(tube => tube.length === 0 || new Set(tube).size === 1);
    if (isWin) {
        setTimeout(() => showWinModal(), 100);
    }
}

// Show the win modal
function showWinModal() {
    winModal.style.display = 'block';
}

// Hide the win modal and load the next level
nextLevelButton.addEventListener('click', () => {
    winModal.style.display = 'none';
    nextLevel();
});

// Load the next level
function nextLevel() {
    currentLevel++;
    if (currentLevel < levels.length) {
        tubes = JSON.parse(JSON.stringify(levels[currentLevel]));
        createTubes();
    } else {
        alert("Congratulations! You completed all levels!");
        resetGame();
    }
}

// Reset the current level
resetButton.addEventListener('click', () => {
    tubes = JSON.parse(JSON.stringify(levels[currentLevel]));
    createTubes();
});

// Reset the game to Level 1
function resetGame() {
    currentLevel = 0;
    tubes = JSON.parse(JSON.stringify(levels[currentLevel]));
    createTubes();
}

// Initialize the game
createTubes();