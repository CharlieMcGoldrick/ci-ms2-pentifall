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

// Board
const gameCanvas = document.getElementById('board'); // Grab the game canvas
const context = gameCanvas.getContext('2d'); // Get the context of the canvas
let gameBoard;
let boardWidth = 260;
let boardHeight = 520;
const numberOfRows = 40;
const numberOfColumns = 20;
const cellSize = boardWidth / numberOfColumns;
let currentPentomino;
let pentominoPosition;
let fallSpeed = 1000; // Fall speed in milliseconds. 1000 = 1 second
let fastFallSpeed = 250; // Fall speed when the down arrow key is pressed
let gameLoopInterval;

/**
 * Draw a cell.
 */
function drawCell(x, y, color) {
    context.fillStyle = color;
    context.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
    context.strokeStyle = 'rgba(15, 56, 15, 0.05)'; // Cell stroke Colour
    context.strokeRect(x * cellSize, y * cellSize, cellSize, cellSize);
}

/**
 * Draw Initial Gameboard.
 */
function drawBoard() {
    for (let x = 0; x < numberOfColumns; x++) {
        for (let y = 0; y < numberOfRows; y++) {
            drawCell(x, y, gameBoard[y][x] ? 'black' : '#8bac0f'); // Fill & Empty Board Colour
        }
    }
}

/**
 * Draw the current pentomino
 */
function drawPentomino() {
    for (let x = 0; x < currentPentomino[0].length; x++) {
        for (let y = 0; y < currentPentomino.length; y++) {
            if (currentPentomino[y][x]) {
                // The cell is part of the pentomino, so draw it
                drawCell(pentominoPosition.x + x, pentominoPosition.y + y, 'black'); // PLACEHOLDER Pentomino colour
            }
        }
    }
}

/**
 * Generates a new random pentomino and sets it as the current one.
 */
function generatePentomino() {
    // Array of pentominoes
    const pentominoes = [tPentomino, uPentomino, vPentomino, wPentomino, xPentomino, yPentomino, zPentomino, fPentomino, iPentomino, lPentomino, pPentomino, nPentomino];
    currentPentomino = pentominoes[Math.floor(Math.random() * pentominoes.length)];

    // Position the pentomino at the top middle of the board
    pentominoPosition = { x: Math.floor(numberOfColumns / 2) - Math.floor(currentPentomino[0].length / 2), y: 0 };
}

/**
 * Initialise the game
 */
function initialiseGame() {
    // Create the game board as a 2D array
    gameBoard = new Array(numberOfRows);
    for (let i = 0; i < numberOfRows; i++) {
        gameBoard[i] = new Array(numberOfColumns).fill(0);
    }
    // Draw Initial Gameboard
    drawBoard();
    // Generate and position a pentomino at the top-middle of the board
    generatePentomino();
}

/**
 * Moves the current pentomino down and generates a new one if necessary
 */
function gameStep() {
    // Try to move the pentomino down
    if (!movePentomino(0, 1)) { // If it cannot move down
        // Add the current pentomino to the game board
        for (let i = 0; i < currentPentomino.length; i++) {
            for (let j = 0; j < currentPentomino[i].length; j++) {
                if (currentPentomino[i][j]) {
                    gameBoard[pentominoPosition.y + i][pentominoPosition.x + j] = 1;
                }
            }
        }
        // Generate a new pentomino
        generatePentomino();

        // If the new piece cannot move down, then the game is over
        if (!isValidPosition(pentominoPosition.x, pentominoPosition.y + 1, currentPentomino)) {
            clearInterval(gameLoopInterval);
            console.log("Game Over");  // Game Over logic should be implemented here.
            return;
        }
    }
    drawBoard();
    drawPentomino();

    // Restart the game loop with the new fall speed
    clearInterval(gameLoopInterval); // Clear existing interval
    gameLoopInterval = setInterval(gameStep, fallSpeed);
}



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

        // Initialise the game
        initialiseGame();

        // Start the game loop
        clearInterval(gameLoopInterval); // Clear exisiting interval if any
        gameLoopInterval = setInterval(gameStep, fallSpeed);
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

// START GAME WHEN BUTTON WITH OR WITHOUT SOUND IS CLICKED
playWithSoundBtn.addEventListener('click', startGame);
playWithoutSoundBtn.addEventListener('click', startGame);

// MOVEMENT
/**
 * Move the pentomino by the given deltas (dx and dy)
 * First, check if the new position would be valid
 */
function movePentomino(dx, dy) {
    if (isValidPosition(pentominoPosition.x + dx, pentominoPosition.y + dy, currentPentomino)) {
        pentominoPosition.x += dx;
        pentominoPosition.y += dy;
        drawBoard();
        drawPentomino();
    }
}

/**
 * // This function checks if a given position is valid (i.e., within the game board and not overlapping with any settled cells)
 */
function isValidPosition(x, y, pentomino) {
    for (let i = 0; i < pentomino.length; i++) {
        for (let j = 0; j < pentomino[i].length; j++) {
            if (pentomino[i][j] && // if this part of the pentomino exists
                (y + i < 0 || y + i >= numberOfRows || x + j < 0 || x + j >= numberOfColumns || gameBoard[y + i][x + j])) {
                return false; // position is invalid
            }
        }
    }
    return true; // position is valid
}


// Core Controls
document.addEventListener('keydown', function (e) {
    switch (e.key) {
        case 'ArrowLeft': // Left Arrow Key
            movePentomino(-1, 0); // Move Left
            break;
        case 'ArrowRight': // Right Arrow Key
            movePentomino(1, 0); // Move Right
            break;
        case 'ArrowDown': // Down Arrow Key
            fallSpeed = fastFallSpeed; // Move Down Faster
            break;
        case ' ': // Spacebar
            rotatePentomino(); // Rotate
            break;
    }
});

// Event listener for fastFallSpeed reset
document.addEventListener('keyup', function (e) {
    if (e.key === 'ArrowDown') { // Down Arrow Key
        fallSpeed = 1000;
    }
});
