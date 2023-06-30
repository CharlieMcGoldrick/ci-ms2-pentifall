/**
 * Change default error messages for input fields.
 * Anonymous function to change default error message when nothing is entered into field.
 * Anonymous function to change default error message when less than 3 characters have been entered.
 * Anonymous function to change default error message on pattern mismatch.
 */
function handleInput() {
    let inputElement = document.getElementById('player-name');

    inputElement.oninvalid = function () {
        if (this.validity.valueMissing) {
            this.setCustomValidity('Please enter your name.');
        } else if (this.validity.tooShort) {
            this.setCustomValidity('Please enter 3 characters of more.');
        } else if (this.validity.patternMismatch) {
            this.setCustomValidity('Please only use letters!');
        } else {
            this.setCustomValidity('');
        }
    };
};

window.onload = handleInput;