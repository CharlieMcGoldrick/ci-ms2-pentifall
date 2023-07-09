import { startMenu, howToPlayButton, howToPlayScreen, infoArea, gameArea, playWithSoundBtn, playWithoutSoundBtn, playerNameInput, errorMessageElement } from './start_menu.js';
import { pentominoes } from './pentominoes.js';

// Board
const gameCanvas = document.getElementById('board'); // Grab the game canvas
const context = gameCanvas.getContext('2d'); // Get the context of the canvas
const screen = document.getElementById('screen');

// Gameboard 
let gameBoard;
const numberOfRows = 40;
const numberOfColumns = 20;

// Get the width and height of the #screen element
const screenWidth = screen.clientWidth;
const screenHeight = screen.clientHeight - infoArea.offsetHeight;

// Calculate aspect ratio of the game board
const gameBoardAspectRatio = numberOfColumns / numberOfRows;

// Determine the smaller dimension of the screen
const smallerScreenDimension = Math.min(screenWidth, screenHeight);

// Calculate canvas dimensions based on aspect ratio
const gameCanvasWidth = smallerScreenDimension * gameBoardAspectRatio;
const gameCanvasHeight = smallerScreenDimension;

// Set the canvas width and height
gameCanvas.width = gameCanvasWidth;
gameCanvas.height = gameCanvasHeight;

// Cellsize based on width of the canvas
const cellSize = gameCanvas.width / numberOfColumns;

// Game Info
let score = 0;
let level = 1;

// Pentominoes
let currentPentomino;
let pentominoPosition;
let pentominoCurrentColor;
let nextPentomino;
let fallSpeed = 800; // Fall speed in milliseconds. 800 = 0.8 second
let fastFallSpeed = 40; // Fall speed when the down arrow key is down. This is 20 times faster than the normal fall speed.
let currentSpeed = fallSpeed;
let gameLoopInterval;
const cellStrokeColour = 'rgba(15, 56, 15, 0.05)';

// Keys
let isSpacebarKeyDown = false;
let isRotateKeyDown = false;

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
function drawCell(x, y, color, context, cellSize, isPentomino = true) {
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
            drawCell(x, y, gameBoard[y][x] || { main: '#9bbc0f' }, context, cellSize, Boolean(gameBoard[y][x])); // Fill with #9bbc0f because Boolean(gameboard[y][x] will be false else use pentominoCurrentColor (See drawPentomino colour) 
        }
    }

    // Drawing the ghost pentomino
    drawGhostPentomino();

    // Draw the current pentomino
    drawPentomino();
}



/**
 * Draw the current pentomino
 */
function drawPentomino() {
    for (let x = 0; x < currentPentomino[0].length; x++) {
        for (let y = 0; y < currentPentomino.length; y++) {
            if (currentPentomino[y][x]) {
                // The cell is part of the pentomino, so draw it
                drawCell(pentominoPosition.x + x, pentominoPosition.y + y, pentominoCurrentColor, context, cellSize);
            }
        }
    }
}


/**
 * Generates a new random pentomino and sets it as the current one.
 */
function generatePentomino() {
    // If nextPentomino is defined, set it as the current pentomino
    if (nextPentomino) {
        currentPentomino = nextPentomino.shape;
        pentominoCurrentColor = nextPentomino.color;
    } else {
        let newPentomino = pentominoes[Math.floor(Math.random() * pentominoes.length)];
        currentPentomino = newPentomino.shape;
        pentominoCurrentColor = newPentomino.color;
    }

    // Position the pentomino at the top middle of the board and off screen
    pentominoPosition = {
        x: Math.floor(numberOfColumns / 2) - Math.floor(currentPentomino[0].length / 2),
        y: -currentPentomino.length
    };

    // Generate the next pentomino
    nextPentomino = pentominoes[Math.floor(Math.random() * pentominoes.length)];

    // Update the preview canvas
    updateNextPentominoPreview();
}

function drawGhostPentomino() {
    if (!currentPentomino || !pentominoPosition) {
        return; // If either of these is not set yet, we just exit the function
    }

    // Calculate the ghost position
    let ghostY = pentominoPosition.y;
    while (isValidPosition(pentominoPosition.x, ghostY + 1, currentPentomino)) {
        ghostY++;
    }

    // Now draw the ghost pentomino
    for (let x = 0; x < currentPentomino[0].length; x++) {
        for (let y = 0; y < currentPentomino.length; y++) {
            if (currentPentomino[y][x]) {
                // The cell is part of the pentomino, so draw it
                // Use a semi-transparent color for the ghost
                drawCell(pentominoPosition.x + x, ghostY + y, { main: 'rgba(0, 0, 15, 0.1)' }, context, cellSize, false);
                // Also draw the stroke color for the ghost
                context.strokeStyle = cellStrokeColour;
                context.strokeRect((pentominoPosition.x + x) * cellSize, (ghostY + y) * cellSize, cellSize, cellSize);
            }
        }
    }
}

/**
 * Update pentomino preview
 */
function updateNextPentominoPreview() {
    const previewCanvas = document.getElementById('next-pentomino');
    const previewContext = previewCanvas.getContext('2d');

    // Clear the canvas
    previewContext.clearRect(0, 0, previewCanvas.width, previewCanvas.height);

    // Set the cell size based on the canvas size and the pentomino size
    const previewCellSize = Math.min(
        previewCanvas.width / nextPentomino.shape[0].length,
        previewCanvas.height / nextPentomino.shape.length
    );

    // Calculate the starting position to center the pentomino
    const offsetX = (previewCanvas.width - (nextPentomino.shape[0].length * previewCellSize)) / 2;
    const offsetY = (previewCanvas.height - (nextPentomino.shape.length * previewCellSize)) / 2;

    // Draw the pentomino
    for (let y = 0; y < nextPentomino.shape.length; y++) {
        for (let x = 0; x < nextPentomino.shape[0].length; x++) {
            if (nextPentomino.shape[y][x] === 1) {
                drawCell(offsetX / previewCellSize + x, offsetY / previewCellSize + y, nextPentomino.color, previewContext, previewCellSize);
            }
        }
    }
}

/**
 * Place Pentomino and keep the colour
 */
function placePentomino() {
    for (let x = 0; x < currentPentomino[0].length; x++) {
        for (let y = 0; y < currentPentomino.length; y++) {
            if (currentPentomino[y][x]) {
                // Only place the pentomino on the game board if it's on the board
                if (pentominoPosition.y + y >= 0) {
                    gameBoard[pentominoPosition.y + y][pentominoPosition.x + x] = pentominoCurrentColor;
                }
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

    // Generate and position a pentomino at the top-middle of the board
    generatePentomino();

    // Draw Initial Gameboard
    drawBoard();
}

/**
 * Check to see if it's gameover
 */
function checkGameOver() {
    // Check if any block is on the top row of the board
    for (let i = 0; i < numberOfColumns; i++) {
        if (gameBoard[0][i]) {
            return true;
        }
    }

    return false;
}

/**
 * If it's gameover then pause the main theme music
 * Play the gameoverSound
 */
function handleGameOver() {
    clearInterval(gameLoopInterval);
    console.log("Game Over");
    if (isSoundOn) {
        mainThemeMusic.pause();
        gameOverSound.play();
    }
}

/**
 * Increase level for every 1000 points the player earns
 * Speed game up by 90%
 */
function levelUp() {
    if (score >= level * 1000) {
        level++;
        fallSpeed *= 0.9;
    }
}

/**
 * Gameplay loop
 */
function gameStep() {
    currentSpeed = isSpacebarKeyDown ? fastFallSpeed : fallSpeed;

    levelUp();

    if (!movePentomino(0, 1)) {
        placePentomino();
        if (checkGameOver()) {
            handleGameOver();
            return;
        }
        deleteFullRows();
        generatePentomino();

        if (!isValidPosition(pentominoPosition.x, pentominoPosition.y, currentPentomino)) {
            handleGameOver();
            return;
        }
    }

    drawBoard();
    drawPentomino();
    drawGhostPentomino();
    clearInterval(gameLoopInterval);
    gameLoopInterval = setInterval(gameStep, currentSpeed);

    document.getElementById('score').innerText = "Score: " + score;
    document.getElementById('level').innerText = "Level: " + level;
}

/**
 * Start the game with control for sound.
 * @param {boolean} soundStatus
 */
function startGame(soundStatus) {
    isSoundOn = soundStatus;
    const playerName = playerNameInput.value.trim(); // Trim any whitespace 
    let errorMessage = '';

    if (playerName.length < 3) {
        errorMessage = 'Min 3 characters';
    } else if (!/^[A-Za-z]+$/.test(playerName)) {
        errorMessage = 'Only use letters!';
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
    infoArea.style.display = 'flex';
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

// Drop pentomino to the bottom
function dropPentomino() {
    while (isValidPosition(pentominoPosition.x, pentominoPosition.y + 1, currentPentomino)) {
        pentominoPosition.y++;
    }
}

/** Rotate Pentomino clockwise */
function rotatePentominoClockwise() {
    if (!currentPentomino) {
        return;
    }

    // reverse the rows and perform a transpose operation
    const transposedPentomino = currentPentomino[0].map((_, index) => currentPentomino.map(row => row[index]));
    const reversedPentomino = transposedPentomino.map(row => [...row].reverse());

    if (isValidPosition(pentominoPosition.x, pentominoPosition.y, reversedPentomino)) {
        currentPentomino = reversedPentomino;
    }
}

/**
 * Rotate the pentomino counter clockwise
 */
function rotatePentominoCounterClockwise() {
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
            if (pentomino[i][j]) { // If this part of the pentomino exists
                if (y + i < 0) continue; // Skip checking blocks above the board
                if (y + i >= numberOfRows || x + j < 0 || x + j >= numberOfColumns || gameBoard[y + i][x + j]) {
                    return false; // Position is invalid
                }
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
            if (!isRotateKeyDown) {
                rotatePentominoClockwise();
                isRotateKeyDown = true;
                if (isSoundOn && !isRotateSoundPlayed) {
                    movePentominoSound.play();
                    isRotateSoundPlayed = true;
                }
            }
            break;
        case 'ArrowUp':
            if (!isRotateKeyDown) {
                rotatePentominoCounterClockwise();
                isRotateKeyDown = true;
                if (isSoundOn && !isRotateSoundPlayed) {
                    movePentominoSound.play();
                    isRotateSoundPlayed = true;
                }
            }
            break;
        case ' ': //Spacebar
            isSpacebarKeyDown = true;
            break;
        case 'Shift':
            dropPentomino();
            break;
    }
});

// Keyup event listener
document.addEventListener('keyup', function (e) {
    switch (e.key) {
        case 'ArrowDown':
            isRotateKeyDown = false;
            isRotateSoundPlayed = false;
            break;
        case 'ArrowUp':
            isRotateKeyDown = false;
            isRotateSoundPlayed = false;
            break;
        case ' ': //Spacebar
            isSpacebarKeyDown = false;
            break;
    }
});


// Event listener for the "How To Play" button
howToPlayButton.addEventListener('click', function () {
    // Hide start menu
    startMenu.style.display = 'none';

    // Show controls
    howToPlayScreen.style.display = 'block';
});