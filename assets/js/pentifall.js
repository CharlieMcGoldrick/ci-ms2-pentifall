// Start Menu
const startMenu = document.getElementById('start-menu');
const gameArea = document.getElementById('game-area');
const playWithSoundBtn = document.getElementById('play-w-sound');
const playWithoutSoundBtn = document.getElementById('play-w/o-sound');
const playerNameInput = document.getElementById('player-name'); // Capture playername for validation & end screen score display 

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
        console.log(errorMessage);
    }
}

playWithSoundBtn.addEventListener('click', startGame);
playWithoutSoundBtn.addEventListener('click', startGame);
