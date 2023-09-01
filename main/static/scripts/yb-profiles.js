var base_url = window.location.origin;

$(document).ready(function() {
    let user_id = yb_getSessionValues("profile-username");
    console.log(user_id)
    let url = `${base_url}/api/profiles/${user_id}/`
    fetch(url)
    .then((resp) => resp.json())
    .then(function(data){

        console.log("response: " + data);
        let show_profile = yb_BuildProfile(data);
        
        $("#content-container").append(show_profile.data);
        $("#content-container").append(show_profile.splash);
        yb_setLoaded(false);
        
    });
    yb_hideUI();

});

function yb_setProfileUI(custom) {
    let background_image = document.getElementById("bg-image");
    background_image.setAttribute("src", custom.background_mobile);
    
    background_image.setAttribute("style", `filter: blur(${custom.background_blur}px) brightness(${custom.background_brightness}%); -webkit-filter: blur(${custom.background_blur}px) brightness(${custom.background_brightness}%);`);

    let ui_labels = document.getElementsByClassName("yb-ui-label");
    for (let i = 0; i < ui_labels.length; i++) {
        ui_labels[i].setAttribute("style", `color:${custom.icon_color} !important;`);
    }

    let ui_icons = document.getElementsByClassName("yb-ui-icon");
    for (let i = 0; i < ui_icons.length; i++) {
        $(ui_icons[i]).css({"fill": `${custom.icon_color} !important`});
    }

    let accent_buttons = document.getElementsByClassName("yb-accent-button");
    for (let i = 0; i < accent_buttons.length; i++) {
        $(accent_buttons[i]).css({"border-color": `${custom.icon_color} !important;`});
    }

    let accented_elements = document.getElementsByClassName("yb-element-accent");
    for (let i = 0; i < accented_elements.length; i++) {
        $(ui_icons[i]).css({"fill": `${custom.icon_color} !important`});
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
    $("#profile-page-splash").css({"height":"120px", "pointer-events":"none"});
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
        $(bit_container).css({"pointer-events":"auto"});
    }, 200);
    yb_showMiniBar(); 
    yb_showMenuTask();   
    
}



//Profile Page
function yb_BuildProfile(profile_data){

    //Get active user id from session
    let active_id = yb_getSessionValues("id");

    //Get profile user id from data
    let user = profile_data.user

    let profile_id = profile_data.id

    let user_id = user.id
    //Get profile image from data
    let custom = profile_data.custom;
    yb_setProfileUI(custom);

    let profile_image = custom.image_thumbnail_large;
    let profile_background = custom.background_mobile;


    
    //Get profile name from data 
    let profile_first_name = user.first_name;
    let profile_last_name = user.last_name;
    let profile_name = profile_first_name + " " + profile_last_name
    
    //Get username from data 
    let handle = user.username;

    //Get motto from data
    let motto = profile_data.motto;

    //Get bio from data
    let bio = profile_data.bio;
    
    let data_element = yb_createElement("input", "profile-data", "yb-dat-hidden")
    data_element.setAttribute("type", "hidden");

    let profile_splash = yb_createElement("div", "profile-page-splash", "splash-page");
    profile_splash.setAttribute("data-id", profile_id);

    let profile_info = yb_createElement("div", "profile-splash-label", "space-splash-label profile");
    profile_splash.appendChild(profile_info);

    let profile_image_element = yb_renderImage(profile_image, "large-profile-image", "profile-image-splash");
    profile_image_element.setAttribute("onload", "showProfileImage()");
    profile_image_element.setAttribute("style", `height: 0px; width: 0px; border-color:${custom.accent_color};`);
    profile_info.appendChild(profile_image_element);

    let profile_name_element = yb_createElement("div", "profile-name-splash", "profile-name-splash");
    profile_info.appendChild(profile_name_element);

    let profile_name_header = yb_createElement("h2", "profile-name-header", "profile-name-header");
    profile_name_header.innerHTML = profile_name;
    profile_name_element.appendChild(profile_name_header);

    let profile_handle_label = yb_createElement("b", "profile-handle-label", "profile-handle-label");
    profile_handle_label.setAttribute("style", `color:${custom.text_color} !important;`);
    profile_handle_label.innerHTML = "<small>@" + handle + "</small>";
    profile_name_element.appendChild(profile_handle_label);

    let profile_interaction_container = yb_createElement("div", "profile-interaction-container", "profile-interaction-container");
    profile_info.appendChild(profile_interaction_container);

    
    if (active_id != user_id){
        let profile_button_connect = yb_createElement("div", "profile-button-connect", "button-profile-interaction");
        profile_button_connect.setAttribute("style", `background-color: ${custom.primary_color}; color: ${custom.title_color};`);
        
        profile_button_connect.setAttribute("data-id", user_id);
        profile_button_connect.setAttribute("data-username", handle);
        profile_button_connect.setAttribute("data-name", profile_name);
        profile_button_connect.innerHTML = "Connect";
        profile_interaction_container.appendChild(profile_button_connect);
        
        //Create event listener for profile connect button shows a dropdown box for adding as friends or following
        profile_button_connect.addEventListener("click", function() {
            yb_handleConnectButton(profile_button_connect);
        });

    } else {
        let profile_button_edit = yb_createElement("div", "profile-button-edit", "button-profile-interaction");
        profile_button_edit.setAttribute("style", `background-color: ${custom.primary_color}; color: ${custom.title_color};`);
        
        profile_button_edit.setAttribute("data-id", user_id);
        profile_button_edit.innerHTML = "Customize";
        profile_interaction_container.appendChild(profile_button_edit);

        profile_button_edit.addEventListener("click", function(){
            customize_url();
        });
    }
    


        


    if (active_id != user_id){
        let profile_button_message = yb_createElement("button", "button-profile-interaction", "button-profile-interaction");
        profile_button_message.setAttribute("style", `background-color: ${custom.primary_color}; color: ${custom.title_color}; margin: 0px;`);
        profile_button_message.setAttribute("id", "profile-button-message");
        profile_button_message.setAttribute("data-id", user_id);
        profile_button_message.innerHTML = "Message";
        profile_interaction_container.appendChild(profile_button_message);

        
        profile_button_message.addEventListener("click", function(){
            //call show create bit with the call back function raise create bit
            showCreateBit(raiseCreateBit);
            yb_showMessageForm();
            let hidden_to = document.getElementById("hidden-to");
            let profile_id = $(this).attr("data-id");
            hidden_to.value = profile_id;
        
        });

    } else {
        let profile_button_message = yb_createElement("button", "profile-button-message", "button-profile-interaction");
        profile_button_message.setAttribute("style", `background-color: ${custom.primary_color}; color: ${custom.title_color};`);
        profile_button_message.setAttribute("data-id", user_id);
        profile_button_message.innerHTML = "Messages";
        profile_interaction_container.appendChild(profile_button_message);

        profile_button_message.addEventListener("click", function(){
            messages_inbox_url();
        });
    }

    let profile_button_about = yb_createElement("button", "profile-button-about", "button-profile-interaction");
    profile_button_about.setAttribute("style", `background-color: ${custom.primary_color}; color: ${custom.title_color};`);
    profile_button_about.setAttribute("data-id", user_id);
    profile_button_about.innerHTML = "Info";
    profile_interaction_container.appendChild(profile_button_about);

    let bio_container = yb_createElement("div", "profile-bio-container", "splash-bio-container");
    profile_info.appendChild(bio_container);

    let profile_motto = yb_createElement("h3", "profile-motto", "profile-motto");
    profile_motto.setAttribute("style", `color:${custom.text_color} !important;`);
    profile_motto.innerHTML = motto;
    bio_container.appendChild(profile_motto);

    let profile_bio = yb_createElement("p", "profile-bio", "profile-bio");
    profile_bio.setAttribute("style", `color:${custom.text_color} !important;`);
    if (bio == null || bio == "" || bio == undefined) {
        profile_bio.innerHTML = "No bio";
    } else {
        profile_bio.innerHTML = bio;
    }
    bio_container.appendChild(profile_bio);

    let swipe_up_element = yb_createElement("div", "swipe-up-element", "swipe-up-element bobbing-object");
    swipe_up_element.setAttribute("style", `display:none;`);
    
    profile_splash.appendChild(swipe_up_element);
    
    let load_indicator_container = yb_createElement("div", "load-indicator-container-profile", "detail-load-box");



    let loading_indicator = yb_createElement("div", "profile-loading", "loading-circle detailed");
    loading_indicator.style.borderTop = `4px solid ${custom.text_color}`
    
    load_indicator_container.appendChild(loading_indicator);

    profile_splash.appendChild(load_indicator_container);

    
    let swipe_up_icon = yb_createElement("svg", "swipe-up-icon", "swipe-up-icon");
    swipe_up_icon.innerHTML = `<svg class='swipe-up-icon' xmlns="http://www.w3.org/2000/svg" height="48" width="48"><path style="fill:${custom.text_color}" d="M14.15 30.75 12 28.6l12-12 12 11.95-2.15 2.15L24 20.85Z"/></svg>`;

    swipe_up_element.appendChild(swipe_up_icon);

    let swipe_up_text = yb_createElement("p", "swipe-up-text", "swipe-up-text");
    swipe_up_text.setAttribute("style", `color:${custom.text_color} !important;`);
    swipe_up_text.innerHTML = "Slide Up for Bitstream";
    swipe_up_element.appendChild(swipe_up_text);

    let new_feed = {
        "type": "global",
        "id": handle,
        "filter":"-fo-fr-me-p-c",
        "sort":"chrono",
    };

    yb_getFeed(new_feed, "none", false);
    
    swipe_up_element.addEventListener("touchstart", function(event) {
        var initialY = event.touches[0].clientY;

        // Add an event listener for touchend event
        swipe_up_element.addEventListener("touchend", function(event) {
            var finalY = event.changedTouches[0].clientY;
            var deltaY = finalY - initialY;
    
            // Check if the user has swiped down
            if (deltaY < 0) {
                // Perform actions to exit fullscreen
                // Add your code here to handle fullscreen exit
                yb_enterProfile();
            }
        });
        
    });

    swipe_up_element.addEventListener("click", function(){
        yb_enterProfile();
    });

    return {'splash':profile_splash, 'data':data_element}
}


$('#back-to-home').click(function() {
    window.location.href = `${base_url}/bitstream/home/`
});

function yb_handleConnectButton(profile_button_connect) {
        console.log("clicked")
        let user = profile_button_connect.getAttribute("data-name");
        let handle = profile_button_connect.getAttribute("data-username");
        console.log(handle);
        let user_id = profile_button_connect.getAttribute("data-id");
    
        //Create dropdown

        profile_button_connect.removeEventListener("click", yb_handleConnectButton);
        let dropdown = yb_createElement("div", "add-friend-link", "adaptive-dropdown");
        dropdown.setAttribute("style", `position: absolute; overflow:hidden; top: 45px; left: 0px; border-radius: 20px; background-color:#222222; width: 90px; height: 0px;  box-shadow: 2px 2px 4px black;`);
        profile_button_connect.appendChild(dropdown);
        //Animate dropdown
        $(dropdown).animate({"height": "70px"}, 200);
        
        //Create dropdown items
        let add_friend_button = yb_createElement("p", "adaptive-dropdown-item-add-friend", "adaptive-dropdown-item");
        add_friend_button.setAttribute("style", `color: white; height: 35px; margin-top: 0px; margin-bottom: 0px;`);
        add_friend_button.innerHTML = "Add friend";
        dropdown.appendChild(add_friend_button);
        
        //Create dropdown item click event for add friend
        add_friend_button.addEventListener("click", function(){
            yb_requestFriend(handle);
        });

        let follow_button = yb_createElement("p", "adaptive-dropdown-item-follow", "adaptive-dropdown-item");
        follow_button.setAttribute("style", `color: white; height:35px; margin-top: 0px; margin-bottom: 0px;`);
        follow_button.setAttribute("data-id", user_id);
        follow_button.innerHTML = "Follow";
        dropdown.appendChild(follow_button);
    
        follow_button.addEventListener("click", function(){
            yb_addFollow(user_id);
        });


}



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

function yb_requestFriend(user_id) {
    let cookie = document.cookie;
    let csrfToken = getCSRF();
    let friend_request = new FormData()
    friend_request.append('user_id', user_id)

    console.log(user_id)
    $.ajax (
        {
            type: 'POST',
            contentType: false,
            // The following is necessary so jQuery won't try to convert the object into a string
            processData: false,
            headers: {
                'X-CSRFToken': csrfToken
            },
            url: '/profile/api/connect/friend/',
            data: friend_request,

            success: function(data) {
                let response = data;
                let to_user = response.name;
                let body = `Friend request to ${response.to_user} sent`;
                showNotification(expandNotification, body);
            }
        }
    )
}
function follow() {
    let cookie = document.cookie;
    let csrfToken = getCSRF();
    $.ajax(
        {
        type: "POST",
        headers: {
            'X-CSRFToken': csrfToken
        },
        url: '/profile/follow/',
        data: {
            profile: profile
        },
        success: function(data) {
            let response = data;
            let from_user = response.from_user
            let to_user = response.to_user;

            /*Notify both parties of success*/
            let type = 3;
            Notify(type, from_user, to_user)

        }
    }

    )
}
