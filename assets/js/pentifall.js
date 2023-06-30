// Start Menu
const startMenu = document.getElementById('start-menu');
const gameArea = document.getElementById('game-area');
const playWithSoundBtn = document.getElementById('play-w-sound');
const playWithoutSoundBtn = document.getElementById('play-w/o-sound');

/**
 * Start the game when one of the two buttons are clicked.
 * One instance with sound, one without sound.
 */
function startGame() {
    startMenu.style.display = 'none';
    gameArea.style.display = 'flex';
}

playWithSoundBtn.addEventListener('click', startGame);
playWithoutSoundBtn.addEventListener('click', startGame);