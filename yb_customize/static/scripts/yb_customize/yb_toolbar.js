try {
    var yb_toolbar = document.getElementById("yb-toolbar");
    var save_button = document.getElementsByClassName("yb-save-button");
    var undo_button = document.getElementsByClassName("yb-undo-button")[0];
    var redo_button = document.getElementsByClassName("yb-redo-button")[0];
    var reset_button = document.getElementsByClassName("yb-reset-button")[0];
    var toolbar_config = document.getElementById("yb-toolbar-config");
} catch (e) {
    console.log(e);
    yb_toolbar = document.getElementById("yb-toolbar");
    save_button = document.getElementsByClassName("yb-save-button");
    undo_button = document.getElementsByClassName("yb-undo-button")[0];
    redo_button = document.getElementsByClassName("yb-redo-button")[0];
    reset_button = document.getElementsByClassName("yb-reset-button")[0];
    toolbar_config = document.getElementById("yb-toolbar-config");
}

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

function yb_addHistory(field, value) {
    // Check if the field already has an edit history
    if (!edit_history[field]) {
        edit_history[field] = [];
    }

    // Add the new value to the edit history
    edit_history[field].push(value);

    // Update the initial settings with the new value
    for (let i = 0; i < initial_settings.length; i++) {
        if (initial_settings[i].field === field) {
            initial_settings[i].value = value;
            break;
        }
    }

    // Update the undo button state
    if (!undo_button.classList.contains("ready")) {
        undo_button.classList.add("ready");
    }
}
function yb_removeHistory(field) {
    // Check if the field has an edit history
    if (edit_history[field]) {
        // Remove the last value from the edit history
        edit_history[field].pop();

        // Update the initial settings with the previous value
        for (let i = 0; i < initial_settings.length; i++) {
            if (initial_settings[i].field === field) {
                initial_settings[i].value = edit_history[field][edit_history[field].length - 1];
                break;
            }
        }
    }

    // Update the redo button state
    if (!redo_button.classList.contains("ready")) {
        redo_button.classList.add("ready");
    }
}

function yb_readySaveButton() {
    save_button[0].classList.add("ready");
    undo_button.classList.add("ready");
    reset_button.classList.add("ready");
}
