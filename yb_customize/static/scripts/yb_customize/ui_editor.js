try {
    var preview_icons = document.querySelectorAll('.preview-icon');
    var preview_panels = document.querySelectorAll('.preview-panel');
    var panel_color_input = document.getElementById('ui-panel-color-picker');
    var icon_color_input = document.getElementById('ui-icon-color-picker');
    var preview_buttons = document.querySelectorAll('.preview-ui-button');
    var button_background_input = document.getElementById('ui-button-background-color-picker');
    var button_foreground_input = document.getElementById('ui-button-foreground-color-picker');
    var preview_button_icons = document.querySelectorAll('.preview-button-icon');
    var text_color_input = document.getElementById('ui-text-color-picker');
    var header_color_input = document.getElementById('ui-title-color-picker');
    var preview_text = document.getElementById('preview-ui-text');
    var preview_header = document.getElementById('preview-ui-header');

    
} catch (e) {
    preview_icons = document.querySelectorAll('.preview-icon');
    panel_color_input = document.getElementById('ui-panel-color-input');
    icon_color_input = document.getElementById('ui-icon-color-input');
    preview_buttons = document.querySelectorAll('.preview-ui-button');
    preview_panels = document.querySelectorAll('.preview-panel');
    button_background_input = document.getElementById('ui-button-background-color-picker');
    button_foreground_input = document.getElementById('ui-button-foreground-color-picker');
    preview_button_icons = document.querySelectorAll('.preview-button-icon');
    text_color_input = document.getElementById('ui-text-color-picker');
    header_color_input = document.getElementById('ui-title-color-picker');
    preview_text = document.getElementById('preview-ui-text');
    preview_header = document.getElementById('preview-ui-header');
}

function change_panel_color() {
    var color = panel_color_input.value;
    document.documentElement.style.setProperty('--ui-panel-color', color);

    for (var i = 0; i < preview_panels.length; i++) {
        preview_panels[i].style.backgroundColor = color;
    }
}

function change_icon_color() {
    var color = icon_color_input.value;
    document.documentElement.style.setProperty('--ui-icon-color', color);

    for (var i = 0; i < preview_icons.length; i++) {
        preview_icons[i].style.fill = color;
    }
}

function change_title_color() {
    var color = header_color_input.value;
    document.documentElement.style.setProperty('--ui-title-color', color);

    preview_header.style.color = color;
}

function change_text_color() {
    var color = text_color_input.value;
    document.documentElement.style.setProperty('--ui-text-color', color);

   preview_text.style.color = color;
}
function change_button_background() {
    var color = button_background_input.value;
    document.documentElement.style.setProperty('--ui-button-bkgd-color', color);

    for (var i = 0; i < preview_buttons.length; i++) {
        preview_buttons[i].style.backgroundColor = color;
    }
}

function change_button_foreground() {
    var color = button_foreground_input.value;
    document.documentElement.style.setProperty('--ui-button-frgd-color', color);

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
    header_color_input.addEventListener('input', change_title_color);
    text_color_input.addEventListener('input', change_text_color);

    
});