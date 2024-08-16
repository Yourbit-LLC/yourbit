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

var user_id = yb_getSessionValues("id");

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

function yb_recolorSplashText(value) {
    
    profile_handle.style.color = value;

}

function yb_recolorSplashTitle(value) {
    profile_name.style.color = value;
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
    profile_handle.classList.add("yb-username-size" + value);
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
    profile_name.classList.add("yb-name-size" + value);
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

});