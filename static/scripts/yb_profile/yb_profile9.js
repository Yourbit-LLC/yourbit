try {
    var profile_custom_info = document.getElementById("profile-custom-info");
    var profile_data = document.getElementById("profile-data");

} catch {
    profile_custom_info = document.getElementById("profile-custom-info");
    profile_data = document.getElementById("profile-data");

}


var base_url = window.location.origin;
var isSwiping = false;

var button_connect = document.getElementById("profile-button-connect");
var button_message = document.getElementById("profile-button-message");
var button_about  = document.getElementById("profile-button-about");

var user_id = yb_getSessionValues("id");
var profile_id = document.getElementById("profile-data").getAttribute
("data-profile-id");
var active_username = document.getElementById("profile-data").getAttribute("data-username");
var active_display_name = document.getElementById("profile-data").getAttribute("data-display-name");

var PROFILE_SPLASH_SCREEN = document.getElementById("profile-page-splash");
var PROFILE_SPLASH_LABEL = document.getElementById("profile-splash-label");
var PROFILE_NAME_HEADER = document.getElementById("profile-name-header");
var PROFILE_HANDLE_LABEL = document.getElementById("profile-handle-label");
var PROFILE_IMAGE_SPLASH = document.getElementById("profile-image-container");
var PROFILE_SPLASH_BIO = document.getElementById("profile-bio-container");
var PROFILE_INTERACTION_CONTAINER = document.getElementById("profile-interaction-container");
var PROFILE_INTERACTION_BUTTONS = document.getElementsByClassName("button-profile-interaction");
var INTERACT_ICONS = document.getElementsByClassName("profile-interact-icon");

var SWIPE_UP_ELEMENT = document.getElementById("swipe-up-element");

var interact_texts = document.getElementsByClassName("profile-interact-text");

function yb_getProfileData(key) {
    let data = profile_data.getAttribute("data-" + key);
    return data;
}

function showProfileImage(){
    $(".large-profile-image").animate({"height": "150px", "width":"150px"}, 'fast');
    
}

function yb_enterProfile() {
    console.log("clicked")
    let profile_splash = document.getElementById("profile-page-splash");
    let image = document.getElementById("profile-image-splash");
    let profile_id = yb_getSessionValues("profile-username");
    
    /* 
        All of the referenced styles below can be found in: 
          -> yb_profile/static/yb_profile/yb_profile.css <-
    */
    PROFILE_SPLASH_SCREEN.classList.add("end");
    PROFILE_SPLASH_LABEL.classList.add("end");
    PROFILE_SPLASH_BIO.classList.add("end");
    PROFILE_NAME_HEADER.classList.add("end");
    PROFILE_HANDLE_LABEL.classList.add("end");

    for (let i = 0; i < PROFILE_INTERACTION_BUTTONS.length; i++) {
        PROFILE_INTERACTION_BUTTONS[i].classList.add("end");
    }

    for (let i = 0; i < INTERACT_ICONS.length; i++) {
        INTERACT_ICONS[i].classList.add("end");
    }

    for (let i = 0; i < interact_texts.length; i++) {
        interact_texts[i].classList.add("end");
    }

    PROFILE_INTERACTION_CONTAINER.classList.add("end");
    
    PROFILE_IMAGE_SPLASH.classList.add("end");

    SWIPE_UP_ELEMENT.classList.add("end");

    MOBILE_HEADER.classList.remove("hide");
    NAV_BAR.classList.remove("hideMobile");
    CREATE_POPOUT.classList.remove("hide");
    SEARCH_POPOUT.classList.remove("hide");

    yb_setSessionValues("fullscreen", "false");
    let profile_bit_container = document.getElementById("profile-bit-container");

    bit_container.classList.add('open');
    // $(bit_container).animate({"top":"0vh"}, "slow");


    // setTimeout(function(){
    //     $('#profile-page-splash').css({"pointer-events":"none"});
    // }, 200);
    // yb_showMiniBar(); 
    // yb_showMenuTask();   
    
}



//Profile Page
function yb_BuildProfile(data){


    let profile_data = data.profile_data;
    let connection_status = data.connection_status;
    
    //Get active user id from session
    let active_id = yb_getSessionValues("id");

    //Get profile user id from data
    let user = profile_data.user

    let profile_id = profile_data.id

    let user_id = user.id
    //Get profile image from data
    let custom = profile_data.custom;
    yb_setProfileUI(custom);
    // swipe_up_element.addEventListener("click", function(){
    //     yb_enterProfile();
    // });

    return {'splash':profile_splash, 'data':data_element}
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


// $('.button-profile-interaction').click(function() {
//     console.log("clicked")
//     let button_name = $(this).attr('name');
//     if (button_name === 'request_friend') {
//         let dropdown = yb_createElement("div", "splash-dropdown", "dropdown-menu");
//         let add_friend = yb_createElement("p", "option-follow", "dropdown-option");
//         let follow = yb_createElement("p", "option-message", "dropdown-option");
        
//         dropdown.appendChild(add_friend);
//         dropdown.appendChild(follow);

//         $(this).append(dropdown)
        
//         let user_id = $(this).attr('data-catid');
//         requestFriend(button_name, user_id);

//     }

//     if (button_name === 'follow') {
//         let user_id = $(this).attr('data-catid');
//         follow(button_name, user_id);
//     }

// });

    // $('.profile-button').click(function() {
    //     let button_name = $(this).attr('name');
    //     if (button_name === 'request_friend') {
    //         let user_id = $(this).attr('data-catid');
    //         requestFriend(button_name, user_id);

    //     }

    // });

function yb_requestFriend() {
    let cookie = document.cookie;
    let csrfToken = getCSRF();
    let user_id = yb_getProfileData("username");


    let this_data = JSON.stringify({
        to_user: user_id
    });


    console.log(user_id)
    $.ajax (
        {
            type: 'POST',
            headers: {
                'X-CSRFToken': csrfToken,
                'Content-Type': 'application/json'
            },
            url: '/profile/api/connect/friend/',
            data: this_data,

            success: function(data) {
                let response = data;
                let to_user = response.name;
                let body = `Friend request sent`;

                showNotification(expandNotification, body);
                yb_closePrompt();
                yb_closeDrawer();
            }
        }
    )
}

function yb_requestFollow() {
    let cookie = document.cookie;
    let csrfToken = getCSRF();
    let user_id = yb_getProfileData("id");
    
    $.ajax(
        {
        type: "POST",
        headers: {
            'X-CSRFToken': csrfToken
        },
        url: `/profile/api/profile/${user_id}/follow/`,

        success: function(data) {
            yb_closePrompt();
            yb_closeDrawer();

        }
    }

    )
}

function yb_requestUnfollow() {
    let cookie = document.cookie;
    let csrfToken = getCSRF();
    let user_id = yb_getProfileData("id");

    $.ajax(
        {
            type: "POST",
            headers: {
                'X-CSRFToken': csrfToken
            },
            url: `/profile/api/profile/${user_id}/unfollow/`,
            success: function(data) {
                yb_closeDrawer();
            }
        }
    )
}


function yb_follow(this_id) {
    
        let actions = {
            "Confirm": {"name":"confirm", "label": "Confirm", "action": yb_requestFollow, "color": "green"},
        }
        let title = "Follow this user?";
        let body = `This will follow ${active_display_name}.`;
        yb_displayPrompt(title, body, actions, this_id);

    
}

function yb_friend(this_id){
   
    let actions = {
        "Confirm":{"name": "confirm", "label": "Confirm", "action": yb_requestFriend, "color": "green"},
    }
    let title = "Send Friend Request?";
    let body = `This will send a friend request to ${active_display_name}`;
    yb_displayPrompt(title, body, actions, this_id);

}
    

function yb_block(user_id) {
    let cookie = document.cookie;
    let csrfToken = getCSRF();
    $.ajax(
        {
        type: "POST",
        headers: {
            'X-CSRFToken': csrfToken
        },
        url: '/profile/block/',
        data: {
            user_id: user_id
        },
        success: function(data) {
            let response = data;
            let from_user = response.from_user
            let to_user = response.to_user;
            let body = `You have blocked ${to_user}`;

            showNotification(expandNotification, body);
            yb_closeSlideUpTemplate();
        }

    })
}

function yb_handleConnectOptionClick(e){
    let this_option = e.currentTarget;
    let this_id = this_option.getAttribute("data-catid");
    let this_option_name = this_option.getAttribute("name");
    
    console.log(this_option_name)

    if (this_option_name === "Follow") {
        let actions = {
            "Cancel": {"name":"cancel", "label":"Cancel", "action":yb_closePrompt, "color": "red"},
            "Confirm": {"name":"confirm", "label": "Confirm", "action": yb_follow, "color": "green"},
        }
        let title = "Follow this user?";
        let body = `This will follow ${active_display_name}.`;
        yb_displayPrompt(title, body, actions, this_id);

        this_option.innerHTML = "Following";
        this_option.style.backgroundColor = "green";
    }
    if (this_option_name === "Block") {
        let actions = {
            "Cancel": {"name":"cancel", "label": "Cancel", "action": yb_closePrompt, "color": "red"},
            "Confirm": {"name": "confirm", "label":"Confirm", "action": yb_block, "color": "green"},
        }
        let title = "Block this user?";
        let body = "This will block this user.";
        yb_displayPrompt(title, body, actions, this_id);
        
        this_option.innerHTML = "Blocked";
        this_option.style.backgroundColor = "red";
    }
    if (this_option_name === "Cancel") {
        yb_closeSlideUpTemplate();
    }

}

function yb_renderConnectOptions(){

    let menu = document.getElementById("yb-slide-up-core");
    
    //Prepare Options
    let these_options = {
        "Request Friend": yb_handleConnectOptionClick, 
        "Follow": yb_handleConnectOptionClick, 
        "Block": yb_handleConnectOptionClick, 
        "Cancel": yb_handleConnectOptionClick
    };

    let this_id = document.getElementById("profile-data").getAttribute("data-profile-id");
    let this_container = yb_createElement("div", "profile-connect-container", "profile-connect-container");

    for (let option in these_options) {
        let this_function = these_options[option];
        let new_option = yb_createElement(
            "div", 
            "profile-connect-option yb-button-threeQuarter border-none squared yb-margin-T10 yb-widthConstraint-600 yb-autoText bg-gray-dark font-heavy pointer-object", 
            `profile-connect-option-${option}`
        );
        new_option.innerHTML = option;
        new_option.setAttribute("data-catid", this_id);
        new_option.setAttribute("name", option);
        new_option.addEventListener("click", this_function);
        this_container.appendChild(new_option);
    }

    return this_container;

}

function yb_assembleConnectMenu() {
    let slide_up_core = document.getElementById("yb-slide-up-core");
    let new_list = yb_renderConnectOptions();
    slide_up_core.appendChild(new_list);

}

function yb_handleConnectClick(e) {
    let action = this.getAttribute("data-action");
    if (action === "edit") {
        yb_navigateTo("content-container", "customize-main");
        MOBILE_HEADER.classList.remove("hide");
    } else {
        var profile_id = yb_getProfileData("id");
        yb_openDrawer("profile-connect", profile_id, false);
    }
}

function yb_handleAboutClick(e){

    let this_button = e.currentTarget;
    let this_username = this_button.getAttribute("data-username");
    
    let container = yb_toggle2WayContainer('about');

    if (container[0] === "closing"){
        history.pushState(null, null, "/");
        container[1].setAttribute("data-state", "empty");
    } else {
        console.log("not closing")
        let container_content = container[1].querySelector(".yb-2Way-content");
        container[1].setAttribute("data-state", "about");
        $(container_content).load(`/profile/templates/about/${this_username}/`)
        history.pushState({}, "", `/profile/about/${this_username}/`);
    }

    //let container_content = container.querySelector(".yb-2way-content");
    
    // let container_content = document.getElementById("yb-2way-content");
    // $(container_content).load("/notifications/")

}

$(document).ready(function() {
    let user_id = yb_getSessionValues("profile-username");
    console.log(user_id)

    yb_setProfileUI();
    PROFILE_SPLASH_SCREEN.classList.add("profile");                                                                                                               
    let swipe_up_element = document.getElementById("swipe-up-element");
    
    button_connect.addEventListener("click", yb_handleConnectClick);
    

    button_message.addEventListener("click", yb_handleMessageClick);

    button_about.addEventListener("click", yb_handleAboutClick);

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
                // Perform actions to exit fullscreen
                // Add your code here to handle fullscreen exit
                yb_enterProfile();
            }
        });
        
    });

    swipe_up_element.addEventListener("click", yb_enterProfile);


    let sort_by = yb_getSessionValues("sort");

    let new_feed = {
        "type": "global",
        "id": active_username,
        "filter":"-fo-fr-me-p-c",
        "sort": sort_by,
    };
    
    // let load_indicator = document.getElementById("yb-loading-core");
    // load_indicator.style.display = "none";

    // yb_getFeed(new_feed, "none", false);

    showProfileImage();
    // yb_setProfileUI();
    // yb_hideUI();

});