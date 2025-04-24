try {
    var preview_shell = document.getElementById('bit-preview');
    var preview_buttons = document.querySelectorAll('.yb-button-feedback');
    var preview_title = document.getElementById('bit-titleText-preview');
    var preview_text = document.getElementById('bit-bodyText-preview');
    var bit_icons = document.querySelectorAll('.feedback-icon-source');
    var name_preview = document.getElementById('bit-name-preview');
    var username_preview = document.getElementById('bit-username-preview');
    var pfp_preview = document.getElementById('bit-image-preview');
    var color_selectors = document.querySelectorAll('.color-circle');
    var color_inputs = document.querySelectorAll('.color-input');
    var customization_toggle = document.getElementById('custom-bit-toggle');
    var set_buttons = document.querySelectorAll('.be-set-button');
    var isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

} catch (e) {
    console.log(e);
    preview_shell = document.getElementById('bit-preview');
    preview_buttons = document.querySelectorAll('.yb-button-feedback');
    preview_title = document.getElementById('title-bit-preview');
    preview_text = document.getElementById('body-bit-preview');
    bit_icons = document.querySelectorAll('.feedback-icon-source');
    name_preview = document.getElementById('bit-name-preview');
    username_preview = document.getElementById('bit-username-preview');
    pfp_preview = document.getElementById('bit-image-preview');
    color_selectors = document.querySelectorAll('.yb-color-circle');
    color_inputs = document.querySelectorAll('.color-input');
    customization_toggle = document.getElementById('custom-bit-toggle');
    set_buttons = document.querySelectorAll('.be-set-button');
    isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
}


function saveBitEdits() {
    let shell_color = document.getElementById('bit-shell-color-picker').value;
    let text_color = document.getElementById('bit-text-color-picker').value;
    let title_color = document.getElementById('bit-title-color-picker').value;
    let button_color = document.getElementById('bit-button-color-picker').value;
    let icon_color = document.getElementById('bit-feedback-icon-color-picker').value;
    let csrf_token = getCSRF();
    let data = {
        'primary_color': shell_color,
        'text_color': text_color,
        'title_color': title_color,
        'button_color': button_color,
        'icon_color': icon_color
    };

    changeColor('--yb-bit-color', shell_color);
    changeColor('--yb-text-color', text_color);
    changeColor('--yb-title-color', title_color);
    changeColor('--yb-button-color', button_color);
    changeColor('--yb-icon-color', icon_color);

    $.ajax({
        type: 'POST',
        url: '/customize/bit/',
        data: data,
        headers: {
            'X-CSRFToken': csrf_token
        },
        success: function (response) {
            console.log(response);
            showNotification(expandNotification, "Bit Edits Saved");
        },
        error: function (response) {
            console.log(response);
        }
    });

}


function activateSetButtons() {
    set_buttons.forEach(function (element) {
        if (!element.classList.contains('active')) {
            element.classList.add('active');
        }
    });
}

function toggleBitCustomizations() {
    if (customization_toggle.classList.contains('active')) {
        customization_toggle.classList.remove('active');
        customization_toggle.classList.remove('green');
        customization_toggle.classList.add('yb-red');
        customization_toggle.innerHTML = 'Custom Bits: <b>OFF</b>';
        customization_toggle.classList.add("fast");
        customization_toggle.classList.add("yb-bounceDown-once");
        
        setTimeout(function () {
            customization_toggle.classList.remove("yb-bounceDown-once");
            customization_toggle.classList.remove("fast");
        }
            , 1000);

        yb_sendBitToggle("Off");
    } else {
        customization_toggle.classList.remove('yb-red');
        customization_toggle.classList.add('active');
        customization_toggle.classList.add('green');
        customization_toggle.innerHTML = 'Custom Bits: <b>ON</b>';
        customization_toggle.classList.add("fast");
        customization_toggle.classList.add("yb-bounceDown-once");
        
        setTimeout(function () {
            customization_toggle.classList.remove("yb-bounceDown-once");
            customization_toggle.classList.remove("fast");
        }
            , 1000);

        yb_sendBitToggle("On");
    }

}


function updateColorPreview(e) {
    let this_input = e.currentTarget;
    let this_color = this_input.getAttribute('name');
    console.log(this_color);
    activateSetButtons();
    if (!customization_toggle.classList.contains('active')) {
        toggleBitCustomizations();
    }
    if (this_color == 'bit-shell') {
        preview_shell.style.backgroundColor = this_input.value;
    } else if (this_color == 'bit-text') {
        preview_text.style.color = this_input.value;
    } else if (this_color == 'bit-title') {
        preview_title.style.color = this_input.value;
    } else if (this_color == 'name') {
        name_preview.style.color = this_input.value;
    } else if (this_color == 'username') {
        username_preview.style.color = this_input.value;
    } else if (this_color == 'bit-button') {
        preview_buttons.forEach(function (element) {
            element.style.backgroundColor = this_input.value;
        });
    } else if (this_color == 'bit-feedback-icon') {
        bit_icons.forEach(function (element) {
            element.style.fill = this_input.value;
        });
    }

    

}

$(document).ready(function () {

    color_inputs.forEach(function (element) {
        console.log(element.getAttribute('name') + "-color-picker");
        element.addEventListener('input', updateColorPreview);
    });

    color_selectors.forEach(function (element) {
        element.addEventListener('click', function (e) {
            let this_input = e.currentTarget;
            let color_option = this_input.getAttribute('name');
            $(`#${color_option}-color-picker`).click();
        });
    });


    customization_toggle.addEventListener('click', toggleBitCustomizations);
    customization_toggle.classList.add("yb-bounceDown-1");
    setTimeout(function () {
        customization_toggle.classList.remove("yb-bounceDown-1");
    }, 1000);


});