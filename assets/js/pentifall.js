import { startMenu, howToPlayButton, howToPlayScreen, backToStartScreen, infoArea, gameArea, playWithSoundBtn, playWithoutSoundBtn, playerNameInput, errorMessageElement } from './start_menu.js';
import { weightedPentominoSelection } from './pentominoes.js';
import { controls } from './controls.js';

// Board
const gameCanvas = document.getElementById('board'); // Grab the game canvas
const context = gameCanvas.getContext('2d'); // Get the context of the canvas
const myScreen = document.getElementById('screen');

// Gameboard 
let gameBoard;
const numberOfRows = 40;
const numberOfColumns = 20;

// Get the width and height of the #screen element
const screenWidth = myScreen.clientWidth;
const screenHeight = myScreen.clientHeight - infoArea.offsetHeight;

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
let playerName = '';
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
let button = null;
let isSpacebarKeyDown = false;
let isShiftKeyDown = false;
let isRotateKeyDown = false;
let isGamePaused = false;
let isMKeyDown = false;

// Audio
let mainThemeMusic = document.getElementById('mainTheme');

let movePentominoSound = document.getElementById('movePentomino');
movePentominoSound.volume = 0.75; // 75% volume
let placePentominoSound = document.getElementById('placePentomino');
placePentominoSound.volume = 0.5; // 50% volume
let gameOverSound = document.getElementById('gameOver');
gameOverSound.volume = 0.75; // 75% volume

let isSoundOn = false;  // Flag that represents if the game is playing with sound or not
let isRotateSoundPlayed = false;

// "How To Play" button
howToPlayButton.addEventListener('click', function () {
    startMenu.style.display = 'none';
    howToPlayScreen.style.display = 'flex';
});
// Back To Start Screen Button
backToStartScreen.addEventListener('click', function () {
    startMenu.style.display = 'flex';
    howToPlayScreen.style.display = 'none';
});

// Control the game sound
function toggleSound() {
    isSoundOn = !isSoundOn;

    const soundOnIcon = document.getElementById('sound-on');
    const soundOffIcon = document.getElementById('sound-off');

    if (isSoundOn) {
        mainThemeMusic.volume = 0.5;
        // play the music only if the game is not paused
        if (!isGamePaused) {
            mainThemeMusic.play();
        }
        soundOnIcon.classList.add('active');
        soundOffIcon.classList.remove('active');
    } else {
        mainThemeMusic.pause();
        soundOnIcon.classList.remove('active');
        soundOffIcon.classList.add('active');
    }

    setTimeout(() => {
        soundOnIcon.classList.remove('active');
        soundOffIcon.classList.remove('active');
    }, 3000); // Remove the active class after 3 seconds
}

// Ensure input is an active menu item when the page is loaded.
window.addEventListener('DOMContentLoaded', (event) => {
    let inputItem = document.getElementById('player-name');
    inputItem.focus();
    inputItem.classList.add('active-menu-item');
});

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

function generatePentomino() {
    // If nextPentomino is defined, set it as the current pentomino
    if (nextPentomino) {
        currentPentomino = nextPentomino.shape;
        pentominoCurrentColor = nextPentomino.color;
    } else {
        let newPentomino = weightedPentominoSelection();
        currentPentomino = newPentomino.shape;
        pentominoCurrentColor = newPentomino.color;
    }

    // Position the pentomino at the top middle of the board and off screen
    pentominoPosition = {
        x: Math.floor(numberOfColumns / 2) - Math.floor(currentPentomino[0].length / 2),
        y: -1
    };

    // Generate the next pentomino
    nextPentomino = weightedPentominoSelection();

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

    if (isSoundOn) {
        mainThemeMusic.pause();
        gameOverSound.play();
    }

    // Display the final score and level
    document.getElementById('playerNameDisplay').innerText = "GAME OVER: " + playerName;
    document.getElementById('finalScore').innerText = "Final Score: " + score;
    document.getElementById('finalLevel').innerText = "Final Level: " + level;

    // Show the game over screen
    document.getElementById('gameOverScreen').style.display = 'block';

    // Hide info area
    document.getElementById('info-area').style.display = 'none';
}

// Reset game state
document.getElementById('startScreenReset').addEventListener('click', function () {
    score = 0;
    level = 1;

    // Hide the game over screen and show the start menu
    document.getElementById('gameOverScreen').style.display = 'none';
    document.getElementById('game-area').style.display = 'none';
    document.getElementById('start-menu').style.display = 'flex';

    // Clear the player name input
    document.getElementById('player-name').value = '';
});

/**
 * Gameplay loop
 */
function gameStep() {
    // If Left CTRL is pressed then pause game and music
    if (isGamePaused) {
        mainThemeMusic.pause(); // Mute the sound when the game is paused
        return;
    } else {
        if (isSoundOn) {
            mainThemeMusic.play(); // Full volume when the game is running
        } else {
            mainThemeMusic.pause(); // Mute the sound when sound is turned off
        }
    }

    // Current speed is fallSpeed unless isSpacebarKeyDown = true
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
 */
function startGame() {
    playerName = playerNameInput.value.trim(); // Trim any whitespace 
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
    isSoundOn = true;
    startGame();
    document.getElementById('sound-off').classList.remove('active');
});

// Start game without sound
playWithoutSoundBtn.addEventListener('click', function () {
    isSoundOn = false;
    startGame();
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

// Game control functions for button down events:
const gameControlsDown = {
    'ArrowUp': function () {
        if (!isRotateKeyDown) {
            rotatePentominoCounterClockwise();
            isRotateKeyDown = true;
            if (isSoundOn && !isRotateSoundPlayed) {
                movePentominoSound.play();
                isRotateSoundPlayed = true;
            }
        }
    },
    'ArrowDown': function () {
        if (!isRotateKeyDown) {
            rotatePentominoClockwise();
            isRotateKeyDown = true;
            if (isSoundOn && !isRotateSoundPlayed) {
                movePentominoSound.play();
                isRotateSoundPlayed = true;
            }
        }
    },
    'ArrowLeft': function () {
        if (startMenu.style.display !== 'none') return;
        movePentomino(-1, 0);
        if (isSoundOn) movePentominoSound.play();
    },
    'ArrowRight': function () {
        if (startMenu.style.display !== 'none') return;
        movePentomino(1, 0);
        if (isSoundOn) movePentominoSound.play();
    },
    'Spacebar': function () {
        if (startMenu.style.display !== 'none') return;
        if (!isSpacebarKeyDown) {
            isSpacebarKeyDown = true;
            gameStep();
        }
    },
    'Shift': function () {
        if (!isShiftKeyDown) {
            isShiftKeyDown = true;
            dropPentomino();
            gameStep();
        }
    },
    'Select': function () {
        if (startMenu.style.display !== 'none') return;
        if (!isMKeyDown) {
            isMKeyDown = true;
            toggleSound();
        }
    },
    'CTRL': function () {
        if (startMenu.style.display !== 'none') return;
        isGamePaused = !isGamePaused;
        gameStep();
    }
};


// Game control functions for button up events:
const gameControlsUp = {
    'ArrowUp': function () {
        isRotateKeyDown = false;
        isRotateSoundPlayed = false;
    },
    'ArrowDown': function () {
        isRotateKeyDown = false;
        isRotateSoundPlayed = false;
    },
    'Spacebar': function () {
        isSpacebarKeyDown = false;
    },
    'Shift': function () {
        isShiftKeyDown = false;
    },
    'Select': function () {
        isMKeyDown = false;
    },
};

// Button listeners:
Object.keys(controls).forEach(id => {
    const btn = document.getElementById(id);
    if (btn) {
        btn.addEventListener('touchstart', function (e) {
            e.preventDefault();
            console.log(`Button ${id} is pressed. Control is ${controls[id]}.`);
            console.log(`startMenu defined: ${startMenu !== undefined}, startMenu display: ${window.getComputedStyle(startMenu).display}`);

            // If startMenu is displayed then use navigateMenu controls
            if (window.getComputedStyle(startMenu).display !== 'none' && (controls[id] === 'ArrowUp' || controls[id] === 'ArrowDown' || controls[id] === 'Shift')) {
                navigateMenu(controls[id]);
            } else {
                gameControlsDown[controls[id]]();
            }
        });

        btn.addEventListener('touchend', function (e) {
            e.preventDefault();

            if (window.getComputedStyle(startMenu).display === 'none' || !(controls[id] === 'ArrowUp' || controls[id] === 'ArrowDown' || controls[id] === 'Shift')) {
                if (gameControlsUp[controls[id]]) {
                    gameControlsUp[controls[id]]();
                }
            }
        });
    }
});

// Menu navigation function
function navigateMenu(control) {
    let menuItems = Array.prototype.slice.call(document.querySelectorAll('.menu-buttons'));
    let inputItem = document.getElementById('player-name');

    // Insert the input field into the menu items array
    menuItems.unshift(inputItem);

    let activeItem = document.querySelector('.active-menu-item');
    let index = Array.from(menuItems).indexOf(activeItem);

    switch (control) {
        case 'ArrowUp':
        case 'ArrowDown':
            // Remove the active class from the currently active item, if any
            if (activeItem) activeItem.classList.remove('active-menu-item');

            // Calculate the new index
            index = control === 'ArrowUp' ? index <= 0 ? menuItems.length - 1 : index - 1 : index >= menuItems.length - 1 ? 0 : index + 1;

            // Add the active class to the new active item
            activeItem = menuItems[index];
            activeItem.classList.add('active-menu-item');

            // If the new active item is the input field, focus it
            if (activeItem === inputItem) {
                inputItem.focus();
            } else {
                inputItem.blur();
            }
            break;
        // Shift button will click the active menu item if it's not the input field
        case 'Shift':
            if (activeItem !== inputItem) {
                activeItem.click();
            }
            break;
    }
}

// Keyboard
// Keydown event listener
document.addEventListener('keydown', function (e) {

    if (startMenu.style.display !== 'none') {
        let menuItems = Array.prototype.slice.call(document.querySelectorAll('.menu-buttons'));
        let inputItem = document.getElementById('player-name');

        // Insert the input field into the menu items array
        menuItems.unshift(inputItem);

        let activeItem = document.querySelector('.active-menu-item');
        let index = Array.from(menuItems).indexOf(activeItem);

        if (e.key === 'Control' && e.location === 1) { // 1 refers to left CTRL
            button = document.getElementById('start-button');
        } else {
            switch (e.key) {
                case 'ArrowLeft':
                    button = document.getElementById('button-left');
                    break;
                case 'ArrowRight':
                    button = document.getElementById('button-right');
                    break;
                case 'ArrowUp':
                case 'ArrowDown':
                    button = e.key === 'ArrowUp' ? document.getElementById('button-up') : document.getElementById('button-down');

                    // Remove the active class from the currently active item, if any
                    if (activeItem) activeItem.classList.remove('active-menu-item');

                    // Calculate the new index
                    index = e.key === 'ArrowUp' ?
                        (index <= 0 ? menuItems.length - 1 : index - 1) :
                        (index >= menuItems.length - 1 ? 0 : index + 1);

                    // Add the active class to the new active item
                    activeItem = menuItems[index];
                    activeItem.classList.add('active-menu-item');

                    // If the new active item is the input field, focus it
                    if (activeItem === inputItem) {
                        inputItem.focus();
                    } else {
                        inputItem.blur();
                    }
                    break;
                case ' ':
                    button = document.getElementById('y-button');
                    break;
                case 'Shift':
                    button = document.getElementById('x-button');
                    break;
                case 'm':
                    button = document.getElementById('select-button');
                    break;
            }
        }
        if (button) button.classList.add('button-pressed');
    }
    else {
        if (e.key === 'Control' && e.location === 1) { // 1 refers to left CTRL
            button = document.getElementById('start-button');
            isGamePaused = !isGamePaused;
            gameStep();
        } else if (!isGamePaused) {
            switch (e.key) {
                case 'ArrowLeft':
                    movePentomino(-1, 0);
                    button = document.getElementById('button-left');
                    if (isSoundOn) movePentominoSound.play();
                    break;
                case 'ArrowRight':
                    movePentomino(1, 0);
                    button = document.getElementById('button-right');
                    if (isSoundOn) movePentominoSound.play();
                    break;
                case 'ArrowDown':
                    button = document.getElementById('button-down');
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
                    button = document.getElementById('button-up');
                    if (!isRotateKeyDown) {
                        rotatePentominoCounterClockwise();
                        isRotateKeyDown = true;
                        if (isSoundOn && !isRotateSoundPlayed) {
                            movePentominoSound.play();
                            isRotateSoundPlayed = true;
                        }
                    }
                    break;
                case ' ':
                    button = document.getElementById('y-button');
                    if (!isSpacebarKeyDown) {
                        isSpacebarKeyDown = true;
                        gameStep(); // Execute gameStep immediately when spacebar is pressed down
                    }
                    break;
                case 'Shift':
                    button = document.getElementById('x-button');
                    if (!isShiftKeyDown) {
                        isShiftKeyDown = true;
                        dropPentomino();
                        gameStep(); // Execute gameStep immediately when shift is pressed down
                    }
                    break;
                case 'm':
                    button = document.getElementById('select-button');
                    if (!isMKeyDown) {
                        isMKeyDown = true;
                        toggleSound();
                    }
                    break;
            }
        }
        if (button) button.classList.add('button-pressed');
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
        case 'Shift':
            isShiftKeyDown = false;
            break;
        case 'm':
            isMKeyDown = false;
            break;
    }
    if (button) button.classList.remove('button-pressed');
});