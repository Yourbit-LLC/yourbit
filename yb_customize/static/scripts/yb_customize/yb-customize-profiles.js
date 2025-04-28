var base_url = window.location.origin;
var isSwiping = false;

var button_connect = document.getElementById("profile-button-connect");
var button_message = document.getElementById("profile-button-message");
var button_about  = document.getElementById("profile-button-about");
var profile_image_button_temp = document.getElementById("change-avatar");
var profile_name = document.getElementById("profile-name-header");
var profile_handle = document.getElementById("profile-handle-label");
var wallpaper_button_temp = document.getElementById("change-wallpaper");
var sticker_button_temp = document.getElementById("add-stickers");
var splash_screen = document.getElementById("profile-page-splash");
var master_form = document.getElementById("splash-master-form");
var master_name_color = document.getElementById("master-name-font-color");
var master_username_color = document.getElementById("master-username-font-color");
var master_name_size = document.getElementById("master-name-font-size");
var master_username_size = document.getElementById("master-username-font-size");
var master_button_color = document.getElementById("master-button-color");
var master_button_text_color = document.getElementById("master-button-text-color");
var master_button_text_size = document.getElementById("master-button-size");
var master_button_shape = document.getElementById("master-button-shape");
var master_panel_color = document.getElementById("master-splash-panel-color");
var splash_panel_color_trigger = document.getElementById("splash-panel-color-circle");
var splash_panel_color_input = document.getElementById("splash-panel-color-picker");

var splash_buttons = document.getElementsByClassName("button-profile-interaction");

var undo_button = document.getElementById("yb-tb-button-undo");
var redo_button = document.getElementById("yb-tb-button-redo");
var reset_button = document.getElementById("yb-tb-button-reset");

var save_button = document.getElementsByClassName("yb-tb-button-save");

var user_id = yb_getSessionValues("id");

//Edit history {"field" : "value"} for change over time and undo functionality

function yb_changePanelColor(value) {
    //Update Input Trigger
    let color_circle = document.getElementById("splash-panel-color-circle");
    color_circle.style.backgroundColor = value;

    //Change appearance
    splash_screen.style.backgroundColor = value;

    //Push to master form
    master_panel_color.value = value;

    yb_readySaveButton();
}


function preventScroll(event) {
    if (isSwiping) {
        event.preventDefault(); // Prevent default scroll behavior
        // Your swipe logic here
      }
}

$('#back-to-home').click(function() {
    window.location.href = `${base_url}/bitstream/home/`
});

function yb_hideEditableSplash() {
    $(splash_screen).fadeOut('fast');
}

function yb_showEditableSplash() {
    $(splash_screen).fadeIn('fast');
}


function yb_handleEditProfileImage() {
    yb_launch2WayContainer("profile-image-upload");
    
}

function yb_handleEditWallpaper() {
    yb_launch2WayContainer("background-image-upload");
    yb_hideEditableSplash();
    yb_resize2Way(3);

}

function yb_pushToHistory(field_name, value) {
    let field_string = field_name;
    edit_history.push({[field_string] : value});
    console.log(edit_history);
}

function yb_recolorSplashText(value) {
    
    //Update Input Trigger
    let color_circle = document.getElementById("username-font-color-circle");
    color_circle.style.backgroundColor = value;

    //Change appearance
    profile_handle.style.color = value;

    //Push to master form
    master_username_color.value = value;

    yb_readySaveButton();


}

function yb_recolorSplashTitle(value) {
    
    //Update Input Trigger
    let color_circle = document.getElementById("name-font-color-circle");
    color_circle.style.backgroundColor = value;

    //Change appearance
    profile_name.style.color = value;
    master_name_color.value = value;

    yb_readySaveButton();

}

function yb_resizeSplashText(value) {
    for (let i=0; i < 5; i++) {
        for (let i = 0; i < profile_handle.classList.length; i++) {
            if (profile_handle.classList[i].includes("yb-username-size")) {
                profile_handle.classList.remove(profile_handle.classList[i]);
                break;
            }
        }
    }
    master_username_size.value = value;
    profile_handle.classList.add("yb-username-size" + value);

    yb_readySaveButton();

}

function yb_resizeSplashTitle(value) {
    for (let i=0; i < 5; i++) {
        for (let i = 0; i < profile_name.classList.length; i++) {
            if (profile_name.classList[i].includes("yb-name-size")) {
                profile_name.classList.remove(profile_name.classList[i]);
                break;
            }
        }
    }
    master_name_size.value = value;
    profile_name.classList.add("yb-name-size" + value);

    yb_readySaveButton();

    
}

function yb_recolorSplashButton(value) {
    
    //Update Input Trigger
    let color_circle = document.getElementById("button-color-circle");
    color_circle.style.backgroundColor = value;
    
    //Change appearance
    button_connect.style.backgroundColor = value;
    button_message.style.backgroundColor = value;
    button_about.style.backgroundColor = value;

    //Push to master form
    master_button_color.value = value;

    yb_readySaveButton();

}

function yb_recolorSplashButtonText(value) {
    //Update Input Trigger
    let color_circle = document.getElementById("button-text-color-circle");
    color_circle.style.backgroundColor = value;

    //Change appearance
    button_connect.style.color = value;
    button_message.style.color = value;
    button_about.style.color = value;

    //Push to master form
    master_button_text_color.value = value;

    yb_readySaveButton();
    
}

function yb_submitSplashChanges() {
    //Submit changes
    master_form_instance = $(master_form);
    let csrf_token = getCSRF();
    $.ajax({
        url: `${base_url}/customize/templates/profile-splash/`,
        type: 'POST',
        data: master_form_instance.serialize(),
        headers: {
            "X-CSRFToken": csrf_token
        },
        success: function(data) {
            showNotification(expandNotification, "Changes saved successfully!")
            console.log(data);
        },
        error: function(data) {
            console.log(data);
            showNotification(expandNotification, "Oops, something went wrong...")
        }
    });
}

function yb_changeButtonShape(value) {
    if (value === '0') {
        for (var i = 0; i < splash_buttons.length; i++) {
            splash_buttons[i].classList.remove('squared');
            splash_buttons[i].classList.add('rounded');
        }
    } else {
        for (var i = 0; i < splash_buttons.length; i++) {
            splash_buttons[i].classList.remove('rounded');
            splash_buttons[i].classList.add('squared');
        }
    }
}
    
function yb_showMobilePreview(type="profile") {
    let csrf_token = getCSRF();
    let master_form_instance = $(master_form);
    $.ajax({
        url: `/customize/templates/profile/preview/mobile/`,
        type: 'POST',
        data: master_form_instance.serialize(),
        
        headers: {
            "X-CSRFToken": csrf_token
        },
        success: function(data) {
            console.log(data);
            let preview_window = document.getElementById("mobile-preview");
            let iframeDocument = preview_window.contentDocument || preview_window.contentWindow.document;
            iframeDocument.body.innerHTML = data;
            MOBILE_IFRAME.style.display = "block";
        }
    });
}

$(document).ready(function() {
    //Initialize Data
    let user_id = yb_getSessionValues("profile-username");
    let logo = document.getElementById('mobile-logo');
    let header = document.getElementById("mobile-header");

    sticker_button_temp.addEventListener("click", function() {
        yb_openDrawer("browse-stickers");
    });

    splash_screen.addEventListener('dragover', (e) => {
        e.preventDefault();
    });

    splash_screen.addEventListener('drop', (e) => {
        e.preventDefault();
        const data = e.dataTransfer.getData('text/html');
        const stickerElement = document.createElement('div');
        stickerElement.innerHTML = data;
        stickerElement.style.position = 'absolute';
        stickerElement.style.left = `${e.clientX - profile.offsetLeft}px`;
        stickerElement.style.top = `${e.clientY - profile.offsetTop}px`;
        profile.appendChild(stickerElement);
    });

    splash_panel_color_trigger.addEventListener("click", function() {
        splash_panel_color_input.click();
    });

    splash_panel_color_input.addEventListener("input", function() {
        var value = this.value;
        yb_changePanelColor(value);
    });

    splash_panel_color_input.addEventListener("change", function() {
        yb_pushToHistory('splash-panel-color', this.value);
    });

    // //Hide logo
    // $(logo).fadeOut();

    // //Build edit mode text
    // let edit_header = yb_createElement("h3", "edit-header-text", "edit-header-text");
    // edit_header.innerHTML = "Edit Mode";
    // header.appendChild(edit_header);

    //Show edit mode text
    // $(edit_header).fadeIn();

    //Editing Profile Image
    let profile_image_option = document.getElementById("profile-image-splash");
    //Event Listener for image preview
    profile_image_option.addEventListener("click", yb_handleEditProfileImage);
    profile_image_button_temp.addEventListener("click", yb_handleEditProfileImage);

    console.log(user_id)
    wallpaper_button_temp.addEventListener("click", yb_handleEditWallpaper);

    //Editing Profile Name
    let profile_name_option = document.getElementById("profile-name-splash");
    

    //Editing Profile Buttons
    let profile_button_option = document.getElementById("profile-interaction-container");
    //Event Listener for interaction container
    //profile_button_option.addEventListener("click", yb_handleEditInteractions());
    
    // //Editing Profile Bio
    // let profile_bio_option = document.getElementById("profile-bio-container");
    // //Event listener for profile bio container
    // profile_bio_option.addEventListener("click", yb_handleEditBio);

    let add_sticker = document.getElementById("add-sticker");
    //Event listener for add sticker
    // add_sticker.addEventListener("click", select_sticker_grid_url);
    
    //Set swipe up element
    let swipe_up_element = document.getElementById("swipe-up-element");

    swipe_up_element.addEventListener("touchstart", function(event) {
        var initialY = event.touches[0].clientY;
        isSwiping = true;

        // Add an event listener for touchend event
        swipe_up_element.addEventListener("touchend", function(event) {
            var finalY = event.changedTouches[0].clientY;
            var deltaY = finalY - initialY;
            isSwiping = false;
            // Check if the user has swiped down
            if (deltaY < 0) {
                //Route to customize page
                customize_profile_url();

                //Open UI
                initUI();
            }
        });
        
    });

    save_button[0].addEventListener("click", yb_submitSplashChanges);

});