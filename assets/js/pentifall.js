/**
 * Change default error messages for input fields.
 * Anonymous function to change default error message when nothing is entered into field.
 */
function handleInput () {
    let inputElement = document.getElementById('player-name');

    inputElement.oninvalid = function () {
        if (this.validity.valueMissing) {
            this.setCustomValidity('Please enter your name.');
        }
    };
};

window.onload = handleInput;