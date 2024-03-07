var base_url = window.location.origin;
var isSwiping = false;

var button_connect = document.getElementById("profile-button-connect");
var button_message = document.getElementById("profile-button-message");
var button_about  = document.getElementById("profile-button-about");

var user_id = yb_getSessionValues("id");
var profile_id = document.getElementById("profile-data").getAttribute("data-profile-id");
var active_username = document.getElementById("profile-data").getAttribute("data-username");

function showProfileImage(){
    $(".large-profile-image").animate({"height": "150px", "width":"150px"}, 'fast');
    
}

function yb_setProfileUI() {
    let background_image = document.getElementById("bg-image");
    
    let flat_mode_on = yb_getUserCustom("flat-mode-on");
    
    if (flat_mode_on == "true") {

        background_image.setAttribute("src", document.getElementById("profile-data").getAttribute("data-background"));
    
        background_image.setAttribute("style", `filter: blur(${document.getElementById('profile-data').getAttribute('data-blur')}px) brightness(${document.getElementById('profile-data').getAttribute('data-brightness')}%); -webkit-filter: blur(${custom.background_blur}px) brightness(${custom.background_brightness}%);`);

    }

    let ui_labels = document.getElementsByClassName("yb-ui-label");
    for (let i = 0; i < ui_labels.length; i++) {
        ui_labels[i].setAttribute("style", `color:${document.getElementById("profile-data").getAttribute("data-icon-color")} !important;`);
    }

    let ui_icons = document.getElementsByClassName("yb-ui-icon");
    for (let i = 0; i < ui_icons.length; i++) {
        $(ui_icons[i]).css({"fill": `${document.getElementById("profile-data").getAttribute("data-icon-color")} !important`});
    }

    let accent_buttons = document.getElementsByClassName("yb-accent-button");
    for (let i = 0; i < accent_buttons.length; i++) {
        $(accent_buttons[i]).css({"border-color": `${document.getElementById("profile-data").getAttribute("data-icon-color")} !important;`});
    }

    let accented_elements = document.getElementsByClassName("yb-element-accent");
    for (let i = 0; i < accented_elements.length; i++) {
        (ui_icons[i]).css({"fill": `${document.getElementById("profile-data").getAttribute("icon-color")} !important`});
    }

    


}

function yb_enterProfile() {
    console.log("clicked")
    let profile_splash = document.getElementById("profile-page-splash");
    let image = document.getElementById("profile-image-splash");
    let profile_id = yb_getSessionValues("profile-username");
    

    $("#profile-splash-label").animate({"height": "80px", "top":"100px", "width": "100%"});
    $("#splash-bio-container").css({"display": "none"});
    $("#profile-splash-label").css({"display": "grid", "text-align":"left", "grid-template-columns":"60px auto 120px"});
    $("#profile-name-header").css({"font-size":"15px", "margin-left":"10px", "margin-top":"10px"});
    $("#profile-handle-label").css({"font-size":"12px", "margin-left":"10px"});

    $(".button-profile-interaction").animate({"height": "35px", "width":"35px"});
    $(".button-profile-interaction").css({"pointer-events":"auto"});

    $("#profile-button-connect").html(`<svg class="profile-interact-icon" xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path style="fill:{{profile.bit_background}};" d="M5 19h1.4l8.625-8.625-1.4-1.4L5 17.6ZM19.3 8.925l-4.25-4.2 1.4-1.4q.575-.575 1.413-.575.837 0 1.412.575l1.4 1.4q.575.575.6 1.388.025.812-.55 1.387ZM17.85 10.4 7.25 21H3v-4.25l10.6-10.6Zm-3.525-.725-.7-.7 1.4 1.4Z"/></svg>`);
    $("#profile-button-edit").html(`<svg class="profile-interact-icon" xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path style="fill:{{profile.bit_background}};" d="M5 19h1.4l8.625-8.625-1.4-1.4L5 17.6ZM19.3 8.925l-4.25-4.2 1.4-1.4q.575-.575 1.413-.575.837 0 1.412.575l1.4 1.4q.575.575.6 1.388.025.812-.55 1.387ZM17.85 10.4 7.25 21H3v-4.25l10.6-10.6Zm-3.525-.725-.7-.7 1.4 1.4Z"/></svg>`);
    $("#profile-button-message").html(`<svg class="profile-interact-icon" xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path style="fill:{{profile.bit_background}};" d="M4 20q-.825 0-1.412-.587Q2 18.825 2 18V6q0-.825.588-1.412Q3.175 4 4 4h16q.825 0 1.413.588Q22 5.175 22 6v12q0 .825-.587 1.413Q20.825 20 20 20Zm8-7L4 8v10h16V8Zm0-2 8-5H4ZM4 8V6v12Z"/></svg>`);
    $("#profile-button-about").html(`<svg class="profile-interact-icon" xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path style="fill:{{profile.bit_background}};" d="M1 20v-4q0-.85.588-1.425Q2.175 14 3 14h3.275q.5 0 .95.25.45.25.725.675.725.975 1.788 1.525Q10.8 17 12 17q1.225 0 2.288-.55 1.062-.55 1.762-1.525.325-.425.762-.675.438-.25.913-.25H21q.85 0 1.425.575Q23 15.15 23 16v4h-7v-2.275q-.875.625-1.887.95Q13.1 19 12 19q-1.075 0-2.1-.337-1.025-.338-1.9-.963V20Zm11-4q-.95 0-1.8-.438-.85-.437-1.425-1.212-.425-.625-1.062-.987Q7.075 13 6.325 13q.55-.925 2.325-1.463Q10.425 11 12 11q1.575 0 3.35.537 1.775.538 2.325 1.463-.725 0-1.375.363-.65.362-1.075.987-.55.8-1.4 1.225Q12.975 16 12 16Zm-8-3q-1.25 0-2.125-.875T1 10q0-1.275.875-2.138Q2.75 7 4 7q1.275 0 2.138.862Q7 8.725 7 10q0 1.25-.862 2.125Q5.275 13 4 13Zm16 0q-1.25 0-2.125-.875T17 10q0-1.275.875-2.138Q18.75 7 20 7q1.275 0 2.138.862Q23 8.725 23 10q0 1.25-.862 2.125Q21.275 13 20 13Zm-8-3q-1.25 0-2.125-.875T9 7q0-1.275.875-2.138Q10.75 4 12 4q1.275 0 2.137.862Q15 5.725 15 7q0 1.25-.863 2.125Q13.275 10 12 10Z"/></svg>`);
    $("#profile-interaction-container").css({"grid-column": "3", "grid-template-columns": "40px 40px 40px", "margin-top":"0px", "text-align":"center", "margin-bottom": "0px", "height":"80px"})

    $(".swipe-up-element").animate({"top": "0", "opacity": "0"}, "fast");
    $(".swipe-up-element").fadeOut("fast");
    
    $("#profile-page-splash").animate({"height":"120px"});
    $("#profile-page-splash").css({"height":"120px"});
    $(".large-profile-image").animate({"height":"50px", "width":"50px", "margin-left":"5px"});

    $(".large-profile-image").css({"grid-column":"1"});
    $("#profile-name-splash").css({"grid-column":"2", "height": "50px"});
    $(".profile-interaction-container").css({"grid-column": "3", "grid-template-columns": "40px 40px 40px", "margin-top":"0px", "text-align":"center", "height":"80px"})
    

    $("#profile-bio-container").remove();

    initUI();
    headerDropIn();

    let bit_container = document.getElementById("bit-container");
    $(bit_container).animate({"top":"0vh"}, "slow");


    setTimeout(function(){
        $('#profile-page-splash').css({"pointer-events":"none"});
    }, 200);
    yb_showMiniBar(); 
    yb_showMenuTask();   
    
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
    let user_id = document.getElementById("profile-data").getAttribute("data-id");

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
                yb_closeSlideUpTemplate();
            }
        }
    )
}
function follow() {
    let cookie = document.cookie;
    let csrfToken = getCSRF();
    let user_id = document.getElementById("profile-data").getAttribute("data-id");
    $.ajax(
        {
        type: "POST",
        headers: {
            'X-CSRFToken': csrfToken
        },
        url: `/profile/api/profile/${user_id}/follow/`,

        success: function(data) {
            alert("Followed");

        }
    }

    )
}

function yb_block() {
    let cookie = document.cookie;
    let profile = document.getElementById("profile-data").getAttribute("data-profile-id");
    let csrfToken = getCSRF();
    $.ajax(
        {
        type: "POST",
        headers: {
            'X-CSRFToken': csrfToken
        },
        url: '/profile/block/',
        data: {
            user_id: profile
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
    if (this_option_name === "Request Friend") {
        let actions = {
            "Cancel": {"name": "cancel", "label": "Cancel", "action": yb_closePrompt, "color": "red"},
            "Confirm":{"name": "confirm", "label": "Confirm", "action": yb_requestFriend, "color": "green"},
        }
        let title = "Send Friend Request?";
        let body = "This will send a friend request to this user.";
        yb_displayPrompt(title, body, actions, this_id);

        this_option.innerHTML = "Requested";
        this_option.style.backgroundColor = "yellow";
    }
    if (this_option_name === "Follow") {
        let actions = {
            "Cancel": {"name":"cancel", "label":"Cancel", "action":yb_closePrompt, "color": "red"},
            "Confirm": {"name":"confirm", "label": "Confirm", "action": follow, "color": "green"},
        }
        let title = "Follow this user?";
        let body = "This will follow this user.";
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
        customize_url("")
    } else {
        yb_loadSlideUpTemplate("script", yb_assembleConnectMenu);
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
        container[1].setAttribute("data-state", "notifications");
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