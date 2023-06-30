// Start Menu
const startMenu = document.getElementById('start-menu');
const gameArea = document.getElementById('game-area');
const playWithSoundBtn = document.getElementById('play-w-sound');
const playWithoutSoundBtn = document.getElementById('play-w/o-sound');
const playerNameInput = document.getElementById('player-name');

/**
 * Start the game when one of the two buttons are clicked.
 * One instance with sound, one without sound.
 */
function startGame() {
    const playerName = playerNameInput.value.trim(); // Trim any whitespace 
    if (playerName.length >= 3 && /^[A-Za-z]+$/.test(playerName)) {
        // Valid input, hide the start menu and show the game area
        startMenu.style.display = 'none';
        gameArea.style.display = 'flex';

        // Game logic goes here
    } else {
        // Error Message goes here 
    }
}

playWithSoundBtn.addEventListener('click', startGame);
playWithoutSoundBtn.addEventListener('click', startGame);
