var edit_history = [

];

var undo_history = [

];

//Initial values for fields used for reset button
var initial_values = [

];
function yb_undo() {

    // Iterate through the initial settings
    for (let i = 0; i < initial_settings.length; i++) {
        const field = initial_settings[i].field;

        // Check if there's an edit history for this field
        if (edit_history[field] && edit_history[field].length > 1) {
            // Remove the last (current) value from the edit history
            edit_history[field].pop();

            // Update the input field with the previous value
            document.getElementById("master-" + field).value = initial_settings[i].value;

            // Update the preview with the previous value
            document.getElementById(field).innerHTML = initial_settings[i].value;
        }
    }

    if (!redo_button.classList.contains("ready")) {
        redo_button.classList.add("ready");
    }

}

function yb_redo() {
    // Iterate through the initial settings
    for (let i = 0; i < initial_settings.length; i++) {
        const field = initial_settings[i].field;

        // Check if there's an edit history for this field
        if (edit_history[field] && edit_history[field].length > 1) {
            // Remove the last (current) value from the edit history
            edit_history[field].pop();

            // Update the input field with the previous value
            document.getElementById("master-" + field).value = initial_settings[i].value;

            // Update the preview with the previous value
            document.getElementById(field).innerHTML = initial_settings[i].value;
        }
    }

}

function yb_reset() {
    // Iterate through the initial settings
    for (let i = 0; i < initial_settings.length; i++) {
        const field = initial_settings[i].field;
        const value = initial_settings[i].value;

        // Check if there's an edit history for this field
        if (edit_history[field]) {
            // Remove the edit history for this field
            delete edit_history[field];
        }

        // Update the initial settings with the previous value
        initial_settings[i].value = value;
    }

}

function yb_readySaveButton() {
    save_button[0].classList.add("ready");
    undo_button.classList.add("ready");
    reset_button.classList.add("ready");
}
