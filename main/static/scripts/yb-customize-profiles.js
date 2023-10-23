var base_url = window.location.origin;
var isSwiping = false;

var button_connect = document.getElementById("profile-button-connect");
var button_message = document.getElementById("profile-button-message");
var button_about  = document.getElementById("profile-button-about");

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

function yb_handleEditName() {
    let these_options = {
        "name-color": {
            "label": "Name Color",
            "function": updateCustom, 
            "type": "color",
            "position": "horizontal"
        }, 
        "username-color": {
            "label": "Username Color",
            "function": updateCustom, 
            "type": "color",
            "position": "horizontal"
        }, 
        "change-name": {
            "label": "Change Name",
            "function": versatile_test, 
            "type": "button",
            "position": "vertical"
        },
        "change-username": {
            "label": "Change Username",
            "function":versatile_test,
            "type": "button",
            "action": "Change",
            "position": "vertical"
        },
        "cancel": {
            "label": "Cancel",
            "function": versatile_test,
            "type": "button",
            "position": "vertical"
        }
    };

    yb_quarter_card_custom("Edit Name Block", these_options);

}

function yb_handleEditBio() {
    let these_options = {
        "motto-color": {
            "label": "Motto Color",
            "function": versatile_test, 
            "type": "color",
            "position": "horizontal"
        }, 
        "bio-color": {
            "label": "Bio Color",
            "action" : versatile_test, 
            "type": "color",
            "position": "horizontal"
        },
        "change-motto": {
            "label": "Change Motto",
            "function": versatile_test,
            "type": "button",
            "action": "Change",
            "position": "vertical"
        },
        "change-bio": {
            "label": "Change Bio",
            "function": versatile_test,
            "type": "button",
            "action": "Change",
            "position": "vertical"
        },
        "cancel": {
            "label": "Cancel",
            "function": versatile_test,
            "type": "button",
            "action":"",
            "position": "vertical"
        }
    };

    yb_quarter_card_custom("Edit Bio Block", these_options);
    

}

function yb_handleEditProfileImage() {
    let these_options = {
        "Border": {
            "label": "Border Color",
            "function": versatile_test,
            "type": "color",
            "position": "horizontal"
        },
        "Upload": {
            "label": "Upload New",
            "function": versatile_test,
            "type": "button",
            "action": "New",
            "position": "vertical"
        }, 
        "Library": {
            "label": "Choose from Library",
            "function": select_image_grid_url,
            "type": "button",
            "action": "Choose from",
            "position": "vertical"
        }, 
        "Cancel": {
            "label": "Cancel",
            "function": versatile_test,
            "type": "button",
            "action":"",
            "position": "vertical"
        }
    };
    
    yb_quarter_card_custom("Profile Image", these_options);
}

$(document).ready(function() {
    //Initialize Data
    let user_id = yb_getSessionValues("profile-username");
    let logo = document.getElementById('mobile-logo');
    let header = document.getElementById("mobile-header");

    //Hide logo
    $(logo).fadeOut();

    //Build edit mode text
    let edit_header = yb_createElement("h3", "edit-header-text", "edit-header-text");
    edit_header.innerHTML = "Edit Mode";
    header.appendChild(edit_header);

    //Show edit mode text
    $(edit_header).fadeIn();

    //Editing Profile Image
    let profile_image_option = document.getElementById("profile-image-splash");
    //Event Listener for image preview
    profile_image_option.addEventListener("click", yb_handleEditProfileImage);

    console.log(user_id)

    //Editing Profile Name
    let profile_name_option = document.getElementById("profile-name-splash");
    //Event Listener for name preview container
    profile_name_option.addEventListener("click", yb_handleEditName);

    //Editing Profile Buttons
    let profile_button_option = document.getElementById("profile-interaction-container");
    //Event Listener for interaction container
    //profile_button_option.addEventListener("click", yb_handleEditInteractions());
    
    //Editing Profile Bio
    let profile_bio_option = document.getElementById("profile-bio-container");
    //Event listener for profile bio container
    profile_bio_option.addEventListener("click", yb_handleEditBio);

    let add_sticker = document.getElementById("add-sticker");
    //Event listener for add sticker
    add_sticker.addEventListener("click", select_sticker_grid_url);
    
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