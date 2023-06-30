// Start Menu
const startMenu = document.getElementById('start-menu');
const gameArea = document.getElementById('game-area');
const playWithSoundBtn = document.getElementById('play-w-sound');
const playWithoutSoundBtn = document.getElementById('play-w/o-sound');
const playerNameInput = document.getElementById('player-name'); // Capture playername for validation & end screen score display
const errorMessageElement = document.getElementById('error-message');

// Pentominoes
const tPentomino = [
    [0, 1, 0],
    [1, 1, 1],
    [0, 1, 0]
];

const uPentomino = [
    [1, 0, 1],
    [1, 1, 1]
];

const vPentomino = [
    [1, 0, 0],
    [1, 0, 0],
    [1, 1, 1]
];

const wPentomino = [
    [1, 0, 0],
    [1, 1, 0],
    [0, 1, 1]
];

const xPentomino = [
    [0, 1, 0],
    [1, 1, 1],
    [0, 1, 0]
];

const yPentomino = [
    [1, 0],
    [1, 1],
    [1, 0],
    [1, 0]
];

const yPentominoFlipped = [
    [0, 1],
    [1, 1],
    [0, 1],
    [0, 1]
];

const zPentomino = [
    [1, 1, 0],
    [0, 1, 0],
    [0, 1, 1]
]
;
const zPentominoFlipped = [
    [0, 1, 1],
    [0, 1, 0],
    [1, 1, 0]
];

const fPentomino = [
    [0, 1, 1],
    [1, 1, 0],
    [0, 1, 0]
];

const fPentominoFlipped = [
    [1, 1, 0],
    [0, 1, 1],
    [0, 1, 0]
];

const iPentomino = [
    [1],
    [1],
    [1],
    [1],
    [1]
];

const lPentomino = [
    [1, 0],
    [1, 0],
    [1, 0],
    [1, 1]
];

const lPentominoFlipped = [
    [0, 1],
    [0, 1],
    [0, 1],
    [1, 1]
];

const pPentomino = [
    [1, 1],
    [1, 1],
    [1, 0]
];

const pPentominoFlipped = [
    [1, 1],
    [1, 1],
    [0, 1]
];

const nPentomino = [
    [1, 0, 0],
    [1, 1, 1],
    [0, 0, 1]
];

const nPentominoFlipped = [
    [0, 0, 1],
    [1, 1, 1],
    [1, 0, 0]
];

/**
 * Start the game when one of the two buttons are clicked.
 * One instance with sound, one without sound.
 */
function startGame() {
    const playerName = playerNameInput.value.trim(); // Trim any whitespace 
    if (playerName.length >= 3 && /^[A-Za-z]+$/.test(playerName)) { // Test name input to be more than 3 characters and using the desired pattern
        // Valid input, hide the start menu and show the game area
        startMenu.style.display = 'none';
        gameArea.style.display = 'flex';

        // Game logic goes here
    } else {
        let errorMessage = '';

        if (playerName.length < 3) {
            errorMessage = 'Please enter 3 characters or more!';
        } else if (!/^[A-Za-z]+$/.test(playerName)) {
            errorMessage = 'Please only use letters!';
        } else {
            errorMessage = 'Please enter a valid name!';
        }
        errorMessageElement.textContent = errorMessage;
    }
}

playWithSoundBtn.addEventListener('click', startGame);
playWithoutSoundBtn.addEventListener('click', startGame);
