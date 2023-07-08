import { startMenu, gameArea, playWithSoundBtn, playWithoutSoundBtn, playerNameInput, errorMessageElement } from './start_menu.js';
import { pentominoes } from './pentominoes.js';

// Board
const gameCanvas = document.getElementById('board'); // Grab the game canvas
const context = gameCanvas.getContext('2d'); // Get the context of the canvas
let gameBoard;
let boardWidth = 260;
let boardHeight = 520;
const numberOfRows = 40;
const numberOfColumns = 20;
const cellSize = boardWidth / numberOfColumns;
let score = 0;
let level = 1;


// Pentominoes
let currentPentomino;
let pentominoPosition;
let pentominoCurrentColor;
let fallSpeed = 800; // Fall speed in milliseconds. 800 = 0.8 second
let fastFallSpeed = 40; // Fall speed when the down arrow key is down. This is 20 times faster than the normal fall speed.
let currentSpeed = fallSpeed;
let gameLoopInterval;
const cellStrokeColour = 'rgba(15, 56, 15, 0.05)';

// Keys
let isDownArrowKeyDown = false;
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
let isRotateSoundPlayed = false;


/**
 * Draw a cell with shading.
 */
function drawCell(x, y, color, isPentomino = true) {
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

    context.strokeStyle = cellStrokeColour;
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
                drawCell(pentominoPosition.x + x, pentominoPosition.y + y, pentominoCurrentColor); // isPentomino is set to always be true so that they are shaded
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
    let rowsDeleted = 0;
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
            rowsDeleted++;
        }
    }

    switch (rowsDeleted) {
        case 1: score += 100; break;
        case 2: score += 250; break;
        case 3: score += 400; break;
        case 4: score += 600; break;
        case 5: score += 800; break;
        default: break;
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
    currentSpeed = isDownArrowKeyDown ? fastFallSpeed : fallSpeed;

    // Level up if score is high enough
    if (score >= level * 1000) {
        level++;
        fallSpeed *= 0.9;  // Speed up by 10%
    }

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

    document.getElementById('score').innerText = "Score: " + score;
    document.getElementById('level').innerText = "Level: " + level;
}

/**
 * Start the game with control for sound.
 * @param {boolean} isSoundOn
 */
function startGame(isSoundOn) {
    const playerName = playerNameInput.value.trim(); // Trim any whitespace 
    let errorMessage = '';

    if (playerName.length < 3) {
        errorMessage = 'Please enter 3 characters or more!';
    } else if (!/^[A-Za-z]+$/.test(playerName)) {
        errorMessage = 'Please only use letters!';
    }

    if (errorMessage) {
        errorMessageElement.textContent = errorMessage;
        return;
    }

    // Control the game sound
    if (isSoundOn) {
        mainThemeMusic.play();
    } else {
        mainThemeMusic.pause();
    }

    // Valid input, hide the start menu and show the game area
    startMenu.style.display = 'none';
    gameArea.style.display = 'flex';

    // Initialise the game
    initialiseGame();

    // Start the game loop
    clearInterval(gameLoopInterval); // Clear existing interval if any
    gameLoopInterval = setInterval(gameStep, currentSpeed);
}

// Start game with sound
playWithSoundBtn.addEventListener('click', function () {
    startGame(true);
});

// Start game without sound
playWithoutSoundBtn.addEventListener('click', function () {
    startGame(false);
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
        case 'ArrowLeft':
            movePentomino(-1, 0);
            if (isSoundOn) movePentominoSound.play();
            break;
        case 'ArrowRight':
            movePentomino(1, 0);
            if (isSoundOn) movePentominoSound.play();
            break;
        case 'ArrowDown':
            isDownArrowKeyDown = true;
            break;
        case ' ': //Spacebar
            if (!isSpaceBarDown) {
                rotatePentomino();
                isSpaceBarDown = true;
                if (isSoundOn && !isRotateSoundPlayed) {
                    movePentominoSound.play();
                    isRotateSoundPlayed = true;
                }
            }
            break;
    }
});

// Keyup event listener
document.addEventListener('keyup', function (e) {
    switch (e.key) {
        case 'ArrowDown':
            isDownArrowKeyDown = false;
            break;
        case ' ': //Spacebar
            isSpaceBarDown = false;
            isRotateSoundPlayed = false;
            break;
    }
});
