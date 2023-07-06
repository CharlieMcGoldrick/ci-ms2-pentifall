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

// Pentomino Colours
// Main = main colour
// Dark = left and top edge colour
// Light = right and bottom edge colour
const colors = [
    { main: "#333333", dark: "#005500", light: "#BDBDBD" },
    { main: "#2E2E2E", dark: "#005500", light: "#BDBDBD" },
    { main: "#292929", dark: "#005500", light: "#BDBDBD" },
    { main: "#242424", dark: "#005500", light: "#BDBDBD" },
    { main: "#1F1F1F", dark: "#005500", light: "#BDBDBD" },
    { main: "#1A1A1A", dark: "#005500", light: "#BDBDBD" },
    { main: "#151515", dark: "#005500", light: "#BDBDBD" },
    { main: "#101010", dark: "#005500", light: "#BDBDBD" },
    { main: "#0B0B0B", dark: "#005500", light: "#BDBDBD" },
    { main: "#060606", dark: "#005500", light: "#BDBDBD" },
    { main: "#202020", dark: "#005500", light: "#BDBDBD" },
    { main: "#252525", dark: "#005500", light: "#BDBDBD" },
    { main: "#2A2A2A", dark: "#005500", light: "#BDBDBD" },
    { main: "#2F2F2F", dark: "#005500", light: "#BDBDBD" },
    { main: "#343434", dark: "#005500", light: "#BDBDBD" },
    { main: "#393939", dark: "#005500", light: "#BDBDBD" },
    { main: "#3E3E3E", dark: "#005500", light: "#BDBDBD" },
    { main: "#434343", dark: "#005500", light: "#BDBDBD" }
];

// Assign color sets to the pentominoes
const pentominoes = [
    { shape: tPentomino, color: colors[0] },
    { shape: uPentomino, color: colors[1] },
    { shape: vPentomino, color: colors[2] },
    { shape: wPentomino, color: colors[3] },
    { shape: xPentomino, color: colors[4] },
    { shape: yPentomino, color: colors[5] },
    { shape: yPentominoFlipped, color: colors[6] },
    { shape: zPentomino, color: colors[7] },
    { shape: zPentominoFlipped, color: colors[8] },
    { shape: fPentomino, color: colors[9] },
    { shape: fPentominoFlipped, color: colors[10] },
    { shape: iPentomino, color: colors[11] },
    { shape: lPentomino, color: colors[12] },
    { shape: lPentominoFlipped, color: colors[13] },
    { shape: pPentomino, color: colors[14] },
    { shape: pPentominoFlipped, color: colors[15] },
    { shape: nPentomino, color: colors[16] },
    { shape: nPentominoFlipped, color: colors[17] }
];

let pentominoCurrentColor;

// Board
const gameCanvas = document.getElementById('board'); // Grab the game canvas
const context = gameCanvas.getContext('2d'); // Get the context of the canvas
let gameBoard;
let boardWidth = 260;
let boardHeight = 520;
const numberOfRows = 30;
const numberOfColumns = 15;
const cellSize = boardWidth / numberOfColumns;
let currentPentomino;
let pentominoPosition;
let fallSpeed = 800; // Fall speed in milliseconds. 800 = 0.8 second
let fastFallSpeed = fallSpeed / 20; // Fall speed when the down arrow key is pressed. This is still 20 times faster than the normal fall speed.
let currentSpeed = fallSpeed;
let gameLoopInterval;

// Keys
let isDownArrowKeyPressed = false;
let isSpaceBarDown = false;

// Audio
let mainThemeMusic = document.getElementById('mainTheme');
mainThemeMusic.volume = 0.10; // 10% volume

let movePentominoSound = document.getElementById('movePentomino');
movePentominoSound.volume = 0.75; // 75% volume
let placePentominoSound = document.getElementById('placePentomino');
placePentominoSound.volume = 0.5; // 50% volume
let gameOverSound = document.getElementById('gameOver');
gameOverSound.volume = 0.75; // 75% volume

let isSoundOn = false;  // Flag that represents if the game is playing with sound or not


/**
 * Draw a cell with shading.
 */
function drawCell(x, y, color, isPentomino) {
    const shadingWidth = cellSize * 0.1; // The width of the shading

    context.fillStyle = color.main;
    context.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);

    // Add shading only if the cell is part of a pentomino
    if (isPentomino) {
        context.fillStyle = color.light;
        context.fillRect((x * cellSize) + cellSize - shadingWidth, y * cellSize, shadingWidth, cellSize);
        context.fillRect(x * cellSize, (y * cellSize) + cellSize - shadingWidth, cellSize, shadingWidth);

        context.fillStyle = color.dark;
        context.fillRect(x * cellSize, y * cellSize, shadingWidth, cellSize);
        context.fillRect(x * cellSize, y * cellSize, cellSize, shadingWidth);
    }

    context.strokeStyle = 'rgba(15, 56, 15, 0.05)'; // Cell stroke Colour
    context.strokeRect(x * cellSize, y * cellSize, cellSize, cellSize);
}

/**
 * Draw Initial Gameboard.
 */
function drawBoard() {
    for (let x = 0; x < numberOfColumns; x++) {
        for (let y = 0; y < numberOfRows; y++) {
            drawCell(x, y, gameBoard[y][x] || { main: '#9bbc0f' }, Boolean(gameBoard[y][x])); // Fill with #9bbc0f because Boolean(gameboard[y][x] will be false else use pentominoCurrentColor (See drawPentomino colour) 
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
                drawCell(pentominoPosition.x + x, pentominoPosition.y + y, pentominoCurrentColor, true); // isPentomino is set to always be true so that they are shaded
            }
        }
    }
}

/**
 * Generates a new random pentomino and sets it as the current one.
 */
function generatePentomino() {
    let newPentomino = pentominoes[Math.floor(Math.random() * pentominoes.length)];
    currentPentomino = newPentomino.shape;
    pentominoCurrentColor = newPentomino.color; // Set color of current pentomino here

    // Position the pentomino at the top middle of the board
    pentominoPosition = { x: Math.floor(numberOfColumns / 2) - Math.floor(currentPentomino[0].length / 2), y: 0 };
}

/**
 * Place Pentomino and keep the colour
 */
function placePentomino() {
    for (let x = 0; x < currentPentomino[0].length; x++) {
        for (let y = 0; y < currentPentomino.length; y++) {
            if (currentPentomino[y][x]) {
                // Place the pentomino on the game board
                gameBoard[pentominoPosition.y + y][pentominoPosition.x + x] = pentominoCurrentColor;
            }
        }
    }

    if (isSoundOn) {
        placePentominoSound.play(); // Play placePentominoSound only if isSoundOn is true and the block is placed
    }
}

/**
 * Delete rows when they are filled
 */
function deleteFullRows() {
    for (let y = 0; y < numberOfRows; y++) {
        let rowFilled = true;
        for (let x = 0; x < numberOfColumns; x++) {
            if (gameBoard[y][x] === 0) {
                rowFilled = false;
                break;
            }
        }
        if (rowFilled) {
            // Remove the row and add a new row at the top
            gameBoard.splice(y, 1);
            gameBoard.unshift(new Array(numberOfColumns).fill(0));
        }
    }
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
    currentSpeed = isDownArrowKeyPressed ? fastFallSpeed : fallSpeed;
    // Try to move the pentomino down
    if (!movePentomino(0, 1)) { // If it cannot move down
        // Add the current pentomino to the game board
        placePentomino();  // Use placePentomino function to ensure color is stored

        // Delete row(s) if full
        deleteFullRows();

        // Generate a new pentomino
        generatePentomino();

        // If the new piece cannot move, then the game is over
        if (!isValidPosition(pentominoPosition.x, pentominoPosition.y, currentPentomino)) {
            clearInterval(gameLoopInterval);
            console.log("Game Over");  // Game Over logic should be implemented here.
            if (isSoundOn) {
                mainThemeMusic.pause(); // Pause mainThemeMusic only if isSoundOn is true and it's game-over
                gameOverSound.play(); // Play gameOverSound only if isSoundOn is true and it's game-over
            }
            return;
        }
    }
    drawBoard();
    drawPentomino();
    // Clear the current game step and set a new one with the current speed
    clearInterval(gameLoopInterval);
    gameLoopInterval = setInterval(gameStep, currentSpeed);
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
        gameLoopInterval = setInterval(gameStep, currentSpeed);
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

/**
 * Start the game with sound
 */
function startGameWithSound() {
    // Start the game as usual...
    startGame();
    // ... and play the music if sound is on
    if (isSoundOn) {
        mainThemeMusic.play(); // Play mainThemeMusic only if isSoundOn is true
    }
}

/**
 * Start the game without sound
 */
function startGameWithoutSound() {
    // Start the game as usual...
    startGame();
    // ... and stop the music if sound is off
    if (!isSoundOn) {
        mainThemeMusic.pause(); // Don't play mainThemeMusic only if isSoundOn is false
    }
}

// START GAME WHEN BUTTON WITH OR WITHOUT SOUND IS CLICKED
playWithSoundBtn.addEventListener('click', function () {
    isSoundOn = true;  // Set the flag to true
    startGameWithSound(); // Call startGameWithSound function
});

// Start game without sound
playWithoutSoundBtn.addEventListener('click', function () {
    isSoundOn = false;  // Set the flag to false
    startGameWithoutSound(); // Call startGameWithoutSound function
});

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
        return true;
    }
    return false;
}

/**
 * Rotate the pentomino
 */
function rotatePentomino() {
    if (!currentPentomino) {
        return;
    }

    const reversedPentomino = currentPentomino.map(row => [...row].reverse()); // [...row] is a spread operator to create a shallow copy of the original array
    const rotatedPentomino = reversedPentomino[0].map((_, index) => // Underscore indicates I'm not using that parameter
        reversedPentomino.map(row => row[index])
    );

    if (isValidPosition(pentominoPosition.x, pentominoPosition.y, rotatedPentomino)) {
        currentPentomino = rotatedPentomino;
    }
}

/**
 * // This function checks if a given position is valid (i.e., within the game board and not overlapping with any settled cells)
 */
function isValidPosition(x, y, pentomino) {
    for (let i = 0; i < pentomino.length; i++) {
        for (let j = 0; j < pentomino[i].length; j++) {
            if (pentomino[i][j] && // If this part of the pentomino exists
                (y + i < 0 || y + i >= numberOfRows || x + j < 0 || x + j >= numberOfColumns || gameBoard[y + i][x + j])) {
                return false; // Position is invalid
            }
        }
    }
    return true; // Position is valid
}

// Core Controls
// Keydown event listener
document.addEventListener('keydown', function (e) {
    switch (e.key) {
        case 'ArrowLeft': // Left Arrow Key
            movePentomino(-1, 0); // Move Left
            if (isSoundOn) movePentominoSound.play();  // Play movePentominoSound only if isSoundOn is true and it's moved left
            break;
        case 'ArrowRight': // Right Arrow Key
            movePentomino(1, 0); // Move Right
            if (isSoundOn) movePentominoSound.play();  // Play movePentominoSound only if isSoundOn is true and it's moved right
            break;
        case 'ArrowDown': // Down Arrow Key
            isDownArrowKeyPressed = true; // Set down arrow key state to 'down'
            break;
        case ' ': //Spacebar
            if (!isSpaceBarDown) {
                rotatePentomino();
                isSpaceBarDown = true;  // Set spacebar key state to 'down'
                if (isSoundOn && !isRotateSoundPlayed) {
                    movePentominoSound.play(); // Play movePentominoSound only if isSoundOn is true, it's rotated, and the rotate sound has not been played for this key press
                    isRotateSoundPlayed = true;  // Set rotate sound played flag to 'true' (Stops the sound from looping when the spacebar is held down)
                }
            }
            break;
    }
});

// Keyup event listener
document.addEventListener('keyup', function (e) {
    switch (e.key) {
        case 'ArrowDown': // Down Arrow Key
            isDownArrowKeyPressed = false; // Set down arrow key state to 'up'
            break;
        case ' ': //Spacebar
            isSpaceBarDown = false;  // Set spacebar key state to 'up'
            isRotateSoundPlayed = false;  // Reset rotate sound played flag to 'false'
            break;
    }
});
