try {
    var preview_icons = document.querySelectorAll('.preview-icon');
    var preview_panels = document.querySelectorAll('.preview-panel');
    var panel_color_input = document.getElementById('ui-panel-color-picker');
    var icon_color_input = document.getElementById('ui-icon-color-picker');
    var preview_buttons = document.querySelectorAll('.preview-ui-button');
    var button_background_input = document.getElementById('ui-button-background-color-picker');
    var button_foreground_input = document.getElementById('ui-button-foreground-color-picker');
    var preview_button_icons = document.querySelectorAll('.preview-button-icon');
} catch (e) {
    preview_icons = document.querySelectorAll('.preview-icon');
    panel_color_input = document.getElementById('ui-panel-color-input');
    icon_color_input = document.getElementById('ui-icon-color-input');
    preview_buttons = document.querySelectorAll('.preview-ui-button');
    preview_panels = document.querySelectorAll('.preview-panel');
    button_background_input = document.getElementById('ui-button-background-color-picker');
    button_foreground_input = document.getElementById('ui-button-foreground-color-picker');
    preview_button_icons = document.querySelectorAll('.preview-button-icon');
}

function change_panel_color() {
    var color = panel_color_input.value;
    document.documentElement.style.setProperty('--panel-color', color);

    for (var i = 0; i < preview_panels.length; i++) {
        preview_panels[i].style.backgroundColor = color;
    }
}

function change_icon_color() {
    var color = icon_color_input.value;
    document.documentElement.style.setProperty('--icon-color', color);

    for (var i = 0; i < preview_icons.length; i++) {
        preview_icons[i].style.fill = color;
    }
}

function change_button_background() {
    var color = button_background_input.value;
    document.documentElement.style.setProperty('--button-background-color', color);

    for (var i = 0; i < preview_buttons.length; i++) {
        preview_buttons[i].style.backgroundColor = color;
    }
}

function change_button_foreground() {
    var color = button_foreground_input.value;
    document.documentElement.style.setProperty('--button-foreground-color', color);

    for (var i = 0; i < preview_buttons.length; i++) {
        preview_buttons[i].style.color = color;
    }

    for (var i = 0; i < preview_button_icons.length; i++) {
        preview_button_icons[i].style.fill = color;
    }
}


$(document).ready(function () {

    panel_color_input.addEventListener('input', change_panel_color);
    icon_color_input.addEventListener('input', change_icon_color);
    button_background_input.addEventListener('input', change_button_background);
    button_foreground_input.addEventListener('input', change_button_foreground);

    
});