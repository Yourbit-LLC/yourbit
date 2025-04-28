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
    var core_panels = document.querySelectorAll('.yb-panel');
    var core_paths = document.querySelectorAll('.yb-path');
    var core_heads = document.querySelectorAll('.yb-pHead');
    var core_texts = document.querySelectorAll('.yb-pText');
    var custom_ui_toggle = document.getElementById('custom-ui-toggle');
    var save_button = document.getElementById('save-ui');
    var set_buttons = document.querySelectorAll('.ui-set-button');
    var color_circles = document.querySelectorAll('.color-circle');
    var panel_color_circle = document.getElementById('ui-panel-color-circle');
    var color_inputs = document.querySelectorAll('.color-input');
    var core_stylesheet = document.getElementById('yb-stylesheet-core');
    var button_stylesheet = document.getElementById('yb-stylesheet-button');
    var container_stylesheet = document.getElementById('yb-stylesheet-container');
    var modifier_stylesheet = document.getElementById('yb-stylesheet-modifier');


    
} catch (e) {

    core_panels = document.querySelectorAll('.yb-panel');
    core_paths = document.querySelectorAll('.yb-path');
    core_heads = document.querySelectorAll('.yb-pHead');
    core_texts = document.querySelectorAll('.yb-pText');
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
    custom_ui_toggle = document.getElementById('custom-ui-toggle');
    save_button = document.getElementById('save-ui');
    set_buttons = document.querySelectorAll('.ui-set-button');
    color_circles = document.querySelectorAll('.color-circle');
    panel_color_circle = document.getElementById('ui-panel-color-circle');
    color_inputs = document.querySelectorAll('.color-input');
    core_stylesheet = document.getElementById('yb-stylesheet-core');
    button_stylesheet = document.getElementById('yb-stylesheet-button');
    container_stylesheet = document.getElementById('yb-stylesheet-container');
    modifier_stylesheet = document.getElementById('yb-stylesheet-modifier');
}


function activateSetButtons() {
    set_buttons.forEach(function (element) {
        if (!element.classList.contains('active')) {
            element.classList.add('active');
        }
    });
}

function toggleUICustomizations() {
    if (custom_ui_toggle.classList.contains('active')) {
        custom_ui_toggle.classList.remove('active');
        custom_ui_toggle.classList.remove('green');
        custom_ui_toggle.classList.add('yb-red');
        custom_ui_toggle.innerHTML = 'Custom UI: <b>OFF</b>';
        custom_ui_toggle.classList.add("fast");
        custom_ui_toggle.classList.add("yb-bounceDown-once");
        yb_changeUIState('default');
        setTimeout(function () {
            custom_ui_toggle.classList.remove("yb-bounceDown-once");
            custom_ui_toggle.classList.remove("fast");
        }
            , 1000);
        sendUIToggle();
        for (var i = 0; i < LOGO_PATHS.length; i++) {
            LOGO_PATHS[i].style.fill = 'gray';
        }
    } else {
        custom_ui_toggle.classList.remove('yb-red');
        custom_ui_toggle.classList.add('active');
        custom_ui_toggle.classList.add('green');
        custom_ui_toggle.innerHTML = 'Custom UI: <b>ON</b>';
        custom_ui_toggle.classList.add("fast");
        custom_ui_toggle.classList.add("yb-bounceDown-once");
        yb_changeUIState('modded');
        setTimeout(function () {
            custom_ui_toggle.classList.remove("yb-bounceDown-once");
            custom_ui_toggle.classList.remove("fast");
        }
            , 1000);

        sendUIToggle();
        for (var i = 0; i < LOGO_PATHS.length; i++) {
            LOGO_PATHS[i].style.fill = 'var(--yb-icon-color)';
        }
    }
}

function updateUIToggle() {
    if (!custom_ui_toggle.classList.contains('active')) {
        toggleUICustomizations();
    };
};

function updateColorCircle(name, color) {
    let this_circle = document.getElementById(name + '-color-circle');
    this_circle.style.backgroundColor = color;

}



function change_panel_color() {
    var color = panel_color_input.value;
    document.documentElement.style.setProperty('--ui-panel-color', color);
    
    updateUIToggle();
    activateSetButtons();

    for (var i = 0; i < preview_panels.length; i++) {
        preview_panels[i].style.backgroundColor = color;
    }

    for (var i = 0; i < core_panels.length; i++) {
        core_panels[i].style.backgroundColor = color;
    }

    updateColorCircle('ui-panel', color);

    
}

function change_icon_color() {
    var color = icon_color_input.value;
    document.documentElement.style.setProperty('--ui-icon-color', color);

    updateUIToggle();
    activateSetButtons();

    for (var i = 0; i < preview_icons.length; i++) {
        preview_icons[i].style.fill = color;
    }

    for (var i = 0; i < core_paths.length; i++) {
        core_paths[i].style.fill = color;
    }

    updateColorCircle('ui-icon', color);

    
}

function change_title_color() {
    var color = header_color_input.value;
    document.documentElement.style.setProperty('--ui-title-color', color);

    updateUIToggle();
    activateSetButtons();

    for (var i = 0; i < core_heads.length; i++) {
        core_heads[i].style.color = color;
    }

    updateColorCircle('ui-title', color);

}

function change_text_color() {
    var color = text_color_input.value;
    document.documentElement.style.setProperty('--ui-text-color', color);

    updateUIToggle();
    activateSetButtons();

    for (var i = 0; i < core_texts.length; i++) {
        core_texts[i].style.color = color;
    }

    updateColorCircle('ui-text', color);
}
function change_button_background() {
    var color = button_background_input.value;
    document.documentElement.style.setProperty('--ui-button-bkgd-color', color);

    updateUIToggle();
    activateSetButtons();

    for (var i = 0; i < preview_buttons.length; i++) {
        preview_buttons[i].style.backgroundColor = color;
    }

    updateColorCircle('ui-button-background', color);
}

function change_button_foreground() {
    var color = button_foreground_input.value;
    document.documentElement.style.setProperty('--ui-button-frgd-color', color);

    updateUIToggle();
    activateSetButtons();

    for (var i = 0; i < preview_buttons.length; i++) {
        preview_buttons[i].style.color = color;
    }

    for (var i = 0; i < preview_button_icons.length; i++) {
        preview_button_icons[i].style.fill = color;
    }

    updateColorCircle('ui-button-foreground', color);
}


function saveUIEdits() {
    let panel_color = document.getElementById('ui-panel-color-picker').value;
    let text_color = document.getElementById('ui-text-color-picker').value;
    let title_color = document.getElementById('ui-title-color-picker').value;
    let icon_color = document.getElementById('ui-icon-color-picker').value;
    let button_color = document.getElementById('ui-button-background-color-picker').value;
    let button_text_color = document.getElementById('ui-button-foreground-color-picker').value;
    let csrf_token = getCSRF();
    let data = {
        'primary_color': panel_color,
        'text_color': text_color,
        'title_color': title_color,
        'button_color': button_color, // 'bit-button-color-picker'
        'button_text_color': button_text_color,
        'icon_color': icon_color
    };

    changeColor('--yb-panel-color', panel_color);
    changeColor('--yb-text-color', text_color);
    changeColor('--yb-title-color', title_color);
    changeColor('--yb-button-color', button_color);
    changeColor('--yb-button-text-color', button_text_color);
    changeColor('--yb-icon-color', icon_color);

    $.ajax({
        type: 'POST',
        url: '/customize/ui/',
        data: data,
        headers: {
            'X-CSRFToken': csrf_token
        },
        success: function (response) {
            console.log(response);
            showNotification(expandNotification, "UI Edits Saved");
        },
        error: function (response) {
            console.log(response);
        }
    });

}


$(document).ready(function () {

    panel_color_input.addEventListener('input', change_panel_color);
    icon_color_input.addEventListener('input', change_icon_color);
    button_background_input.addEventListener('input', change_button_background);
    button_foreground_input.addEventListener('input', change_button_foreground);
    header_color_input.addEventListener('input', change_title_color);
    text_color_input.addEventListener('input', change_text_color);
    custom_ui_toggle.addEventListener('click', toggleUICustomizations);
    

    //COlor Circles
    color_circles.forEach(function (element) {
        element.addEventListener('click', function () {
            let this_input = document.getElementById(this.getAttribute('name') + `-color-picker`);
            this_input.click();

        });
    });

    for (var i = 0; i < color_inputs.length; i++) {
        color_inputs[i].addEventListener('click', function (event) {
            event.preventDefault();
        });
    }
});