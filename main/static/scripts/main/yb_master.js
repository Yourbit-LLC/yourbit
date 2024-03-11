//YB Master JS File
//Yourbit, LLC - 2023
//Author: Austin Chaney
//Date: 10/26/2023


//Master contains functions that are used by multiple pages
// as well as any of the 3 core scripts create, events, and master
// This file is at top level of load order

//Define Core UI Constants

const ALL_SPACE_BUTTON = document.getElementById('yb-all-space-button');
const CHAT_SPACE_BUTTON = document.getElementById('yb-chat-space-button');
const PHOTO_SPACE_BUTTON = document.getElementById('yb-photo-space-button');
const VIDEO_SPACE_BUTTON = document.getElementById('yb-video-space-button');

const SEARCH_BUTTON = document.getElementById('search-button');
const SEARCH_FIELD = document.getElementById('desktop-search-bar');
const SEARCH_ICON = document.getElementById('search-icon');
const SEARCH_CONTAINER = document.getElementById('search');

const CREATE_BUTTON = document.getElementById('yb-create-button');
const EXIT_CREATE = document.getElementById('cb-panel-close')
const CREATE_OPTIONS = document.querySelectorAll(".create-option");
const CONTENT_CONTAINER = document.getElementById('content-container');
const MASTHEAD_LOGO = document.getElementById("yb-logo-masthead");
const MOBILE_HEADER = document.querySelector('.yb-header');
const SPOTLIGHT_CONTAINER = document.getElementById('yb-container-spotlight');

const CREATE_POPOUT = document.getElementById("create-button-popout");
const SEARCH_POPOUT = document.getElementById("search-button-popout");

const SLIDE_UP_CORE = document.getElementById("yb-slide-up-core");
const CREATE_MENU = document.getElementById("yb-create-menu");
const CREATE_MENU_BUTTON = document.getElementById("yb-create-menu-button");
const CMENU_CONTENT = document.getElementById("create-menu-content");
const CREATE_DESKTOP = document.getElementById("create-quick");
const MESSAGES_DESKTOP = document.getElementById('messages-quick');
const NOTIFICATIONS_DESKTOP = document.getElementById('notifications-quick');
const NOTIFICATIONS_MOBILE = document.getElementById('button-notifications-mobile-header');
const NAV_BAR = document.querySelector(".yb-navigation");
const SIDE_CONTAINER_A = document.getElementById("yb-dynamic-2way-a");
const SIDE_CONTAINER_B = document.getElementById("yb-dynamic-2way-b");
const SIDE_CONTAINERS = document.querySelectorAll(".yb-2Way-container");

//Prompts
const PROMPT_CONTAINER = document.getElementById("prompt-container");
const PROMPT_TITLE = document.getElementById("prompt-content-a");
const PROMPT_BODY = document.getElementById("prompt-content-b");
const PROMPT_FOOTER = document.getElementById("prompt-content-c");

const TOP_LAYER = document.getElementById("top-layer");

//Remove a snapcard
function yb_removeSnapCard(card) {
    card.remove();
}

//Close a snapcard
function yb_closeSnapCard(card) {
    //Animate away by sliding off the bottom of the screen and then remove
    card.style.animation = "slideOut 0.3s ease-in-out forwards";

    //After completion of the animation (300ms) remove the card
    setTimeout(yb_removeSnapCard, 300, card);

}

/* Function to change title of web page */
function yb_changePageTitle(title){
    document.title = title;
}

/* Function to change the logo in the masthead */
function yb_changeMastheadLogo(type, selection){
    if (type === "style"){
        MASTHEAD_LOGO.src = selection;
    } else if (type === "color"){
        MASTHEAD_LOGO.style.fill = selection;
    }
}

//Hide quarter card
function yb_hideQuartercard() {
    let card_element = document.getElementById('yb-temporary-card');
    card_element.classList.remove('in');
    card_element.classList.add('out');
    setTimeout(function(){card_element.remove()}, 300);

}

/* Function to handle quarter card options */
function yb_handleQuarterCardOption(callback) {
    let card_element = document.getElementById('yb-temporary-card');
    card_element.classList.remove('in');
    card_element.classList.add('out');
    callback();
    setTimeout(function(){card_element.remove()}, 300);
}

//Function to stage files across pages
function yb_stageFile(type, file){
    if (type === "image") {
        IMAGE_STAGE.setAttribute("src", file);
    } else if (type === "video") {
        VIDEO_STAGE.setAttribute("src", file);
    }
}

//Function to clear staged files
function yb_clearStagedFiles(type){
    if (type === "image") {
        IMAGE_STAGE.setAttribute("src", "");
    } else if (type === "video") {
        VIDEO_STAGE.setAttribute("src", "");
    }
}



function yb_loadSlideUpTemplate(type, source) {
    let slide_up_core = document.getElementById("yb-slide-up-core");
    if (type === "url") {
        slide_up_core.classList.add("open");
        $(slide_up_core).load(source);
        //on load of slide up core remove loading-slide-up
        let loadingIndicator = document.getElementById("loading-slide-up");

        // Add an 'onload' event listener to the slide_up_core element
        slide_up_core.onload = function() {
        // Hide the loading indicator

            loadingIndicator.style.display = "none";

        };

    } else if (type === "script") {
        console.log("opening slide up core")
        slide_up_core.classList.add("open");
        source();
    }
}

function yb_updateSlideUpTemplate(template, type, source) {
    if (type === "url") {

        $(template).load(source);

    } else if (type === "script") {

        let this_content = source();
        template.appendChild(this_content);

    }
}

function yb_closeSlideUpTemplate() {
    let template = document.getElementById("yb-slide-up-core");
    template.innerHTML = "";
    template.classList.remove("open");
    template.classList.remove("checked");
    console.log("closing slide up core")
    
}

function yb_loadCreateMenu() {
    CREATE_MENU.classList.remove("closed");
    CREATE_MENU.classList.add("opened");
}

function yb_closeCreateMenu() {
    CREATE_MENU.classList.remove("opened");
    CREATE_MENU.classList.add("closed");
}


function yb_searchMouseOver() {
    SEARCH_ICON.style.transition = "all 0.3s ease-in-out";
    SEARCH_ICON.style.boxShadow = "0px 0px 10px 0px rgba(255,255,255,0.75)";
}

function yb_openBitBuilder() {
    CMENU_CONTENT.classList.add("hideUp");
}

function yb_clear2WayContainer(container){
    
    let container_content = container.querySelector(".yb-2Way-content");
    container_content.innerHTML = "";

}

function yb_toggle2WayContainer(type){
    if (MAIN_MENU.classList.contains('open')){
        MAIN_MENU.classList.toggle('open');
        SIDE_CONTAINER_A.classList.toggle('open');


        return ["switching", SIDE_CONTAINER_A];
    } else {
        let this_id;
        let active_type;
        for (let i = 0; i < SIDE_CONTAINERS.length + 1; i++) {
            if (SIDE_CONTAINERS[i].classList.contains("open")){
                this_id = SIDE_CONTAINERS[i].getAttribute("id");
                console.log(this_id)
                active_type = SIDE_CONTAINERS[i].getAttribute("data-state");
                console.log("container_id = " + this_id);

                console.log(active_type)
                if (active_type === type){
                    console.log("container is already open");
                    
                    
                    
                    SIDE_CONTAINERS[i].classList.toggle("open");
                    yb_clear2WayContainer(SIDE_CONTAINERS[i]);
                    MOBILE_HEADER.classList.toggle("hide");
                    NAV_BAR.classList.toggle("hideMobile");
                    CREATE_POPOUT.classList.toggle("hide");
                    SEARCH_POPOUT.classList.toggle("hide");

                    history.pushState(null, null, "/");
                    return ["closing", SIDE_CONTAINERS[i]];
                } else {
                    if (this_id === 'yb-dynamic-2way-a'){
                        
                        console.log("container_a is open");
                        SIDE_CONTAINER_A.classList.toggle("open");
                        yb_clear2WayContainer(SIDE_CONTAINER_A);
                        
                        SIDE_CONTAINER_B.classList.toggle("open");

                        return ["switching", SIDE_CONTAINER_B];

                    } else {

                        console.log("container_b is open");

                        SIDE_CONTAINER_B.classList.toggle("open");
                        yb_clear2WayContainer(SIDE_CONTAINER_B);
                        
                        SIDE_CONTAINER_A.classList.toggle("open");

                        return ["switching", SIDE_CONTAINER_A];
                    } 
                }
            } else {
                if (i === SIDE_CONTAINERS.length - 1){
                    MOBILE_HEADER.classList.toggle("hide");
                    NAV_BAR.classList.toggle("hideMobile");
                    SIDE_CONTAINER_A.classList.toggle("open");
                    CREATE_POPOUT.classList.toggle("hide");
                    SEARCH_POPOUT.classList.toggle("hide");
                    return ["opening", SIDE_CONTAINER_A];
                }
            }
            
        }
    }
    

}

function yb_close2WayContainer(){
    for (let i = 0; i < SIDE_CONTAINERS.length + 1; i++) {
        this_object = SIDE_CONTAINERS[i];
        if (this_object.classList.contains("open")){
            history.pushState(null, null, "/");
            this_object.classList.toggle("open");
            yb_clear2WayContainer(SIDE_CONTAINERS[i]);
            break;
        }
    }
}


function yb_toggleCreateMenu(){
    let container = yb_toggle2WayContainer('create');
    if (container[0] != "closing"){
        
        let container_content = container[1].querySelector(".yb-2Way-content");
        container[1].setAttribute("data-state", "create");
        $(container_content).load("/core/create-menu/");
        history.pushState({}, "", '/create/');
    } else {
        history.pushState(null, null, "/");
        container[1].setAttribute("data-state", "empty");
    }

}

function getCSRF() {
    let cookie = document.cookie;
    let csrf = document.getElementById('csrf-token').value;
    return csrf
}

function yb_openSpotlight(category=null){
    SPOTLIGHT_CONTAINER.classList.add('open');
    if (category != null){
        let search_cat = document.getElementById(`sFilter-${category}`);
        SEARCH_FILTER_FIELD.value = category;
        search_cat.classList.add('active');

    }
}
function yb_closeSpotlight(){
    SPOTLIGHT_CONTAINER.classList.remove('open');
    SEARCH_FIELD.value = "";
}

function yb_navigateToProfile(e) {
    let username = e.currentTarget.getAttribute("data-username");
    $("#content-container").load(`/profile/user/${username}/`);
    yb_closeSpotlight();
}

function yb_submitQuery(){
    let search_term = SEARCH_FIELD.value;
    let csrf = getCSRF();
    let url = "/search/";
    let data = {
        'search_term': search_term,
        'csrfmiddlewaretoken': csrf
    }
    $.ajax({
        type: "POST",
        url: url,
        data: data,
        success: function(data){
            let results = data['results'];
            let result_count = data['result_count'];
            for (let i = 0; i < result_count; i++){
                let result = results[i];
                let this_result = yb_buildListItem(result);
            }
        }
    })
}

function yb_displayPrompt(title, message, actions, id=null){

    TOP_LAYER.classList.add("open");
    PROMPT_CONTAINER.classList.add("open");

    PROMPT_TITLE.innerHTML = `<h3 style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);">${title}</h3>`;

    PROMPT_BODY.innerHTML = `<p style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);">${message}</p>`;

    for (let key in actions){
        let this_action = actions[key];
        let this_button = yb_createButton(this_action.name, "yb-button-flex squared small-wide font-white", `prompt-action-${key}`, this_action.label);
        this_button.addEventListener("click", this_action.action);
        this_button.setAttribute("style", `background-color: ${this_action.color} !important; `);
        PROMPT_FOOTER.appendChild(this_button);
    }

}

function yb_closePrompt(){
    
    TOP_LAYER.classList.remove("open");
    PROMPT_CONTAINER.classList.remove("open");

    PROMPT_TITLE.innerHTML = "";
    
    PROMPT_BODY.innerHTML = "";

    PROMPT_FOOTER.innerHTML = "";

}

$(document).ready(function() {
    SEARCH_BUTTON.addEventListener('mouseover', yb_searchMouseOver);
    CREATE_DESKTOP.addEventListener('click', yb_toggleCreateMenu);
    // EXIT_CREATE.addEventListener('click', yb_toggleCreateMenu);

    MESSAGES_DESKTOP.addEventListener("click", yb_handleMessageClick);
    NOTIFICATIONS_DESKTOP.addEventListener("click", yb_handleNotificationsClick);
    NOTIFICATIONS_MOBILE.addEventListener("click", yb_handleNotificationsClick);

    CREATE_POPOUT.addEventListener('click', yb_toggleCreateMenu);
    console.log(SEARCH_FIELD);

    yb_updateTimezone();



    // yb_setTimezone();
    /* Code for lottie animation renderer */

    // var animationContainer = document.getElementById('create-lottie');
    // var animationPath = animationContainer.getAttribute("data-path")
    // var animationData = {

    //     container: animationContainer, // The container element
    //     renderer: 'svg', // You can choose 'svg', 'canvas', or 'html' depending on your preferences
    //     loop: true, // Whether the animation should loop
    //     autoplay: true, // Whether the animation should play automatically
    //     path: animationPath, // Path to your JSON animation file
    // };

    // var anim = lottie.loadAnimation(animationData);

    /*End code for lottie animation renderer */

    var menu = document.getElementById('yb-slide-up-core');

    // Function to check if the click is outside the menu
    function handleClickOutside(event) {

        try {
            let menuButton = document.getElementById("profile-button-connect");
            let menuButtonText = document.getElementById("connect-button-text");

          
            if (menu && !menu.contains(event.target) && event.target !== menuButton && event.target !== menuButtonText) {
                // The click is outside the menu, hide it
                if (menu.classList.contains("open") && menu.classList.contains("checked")){
                    yb_closeSlideUpTemplate(menu);
                }
            }  
        }

        catch(err) {
            if (menu && !menu.contains(event.target)) {
                // The click is outside the menu, hide it
                if (menu.classList.contains("open") && menu.classList.contains("checked")){
                    yb_closeSlideUpTemplate(menu);
                }
            }  
        }
    }

    //Hover event function to add check to class list of slide up core
    function yb_handleMenuHover() {
        let menu = document.getElementById('yb-slide-up-core');
        menu.classList.add("checked");
    }
    

    // Add event listener to the document
    document.addEventListener('click', handleClickOutside);

    menu.addEventListener('mouseover', yb_handleMenuHover);

});



function yb_viewBit(bit_id, comment_id = null) {
    let url = `/bits/api/bits/${bit_id}/`;
    $.ajax({
        type: "GET",
        url: url,
        success: function(data){
            try {
                let bit = data
                let bit_container = document.getElementById('bit-container');
                bit_container.style.display = "none";

                let rendered_bit = yb_buildBit(bit);
                CONTENT_CONTAINER.appendChild(rendered_bit.built_bit);

                yb_toggle2WayContainer('notifications');
                yb_closeSlideUpTemplate(SLIDE_UP_CORE);

                built_bit.classList.add("yb-pulseNormal");

            } catch(err) {
                console.log(err);
            }
        }
    })
    
}

function yb_sendThanks(profile_id) {
    
    let csrf = getCSRF();
    let url = `/bits/api/bit/${profile_id}/thanks/`;
    let data = {
        'csrfmiddlewaretoken': csrf
    }
    $.ajax({
        type: "POST",
        url: url,
        data: data,
        success: function(data){
            console.log(data);
        }
    })
}

function yb_acceptRequest() {
    let request_id = this.getAttribute("data-id");
    let csrf = getCSRF();
    let url = `profile/api/friendrequest/${request_id}/accept/`;
    let data = {
        'csrfmiddlewaretoken': csrf
    }
    $.ajax({
        type: "POST",
        url: url,
        data: data,
        success: function(data){
            console.log(data);
            let body = "Friend Request Accepted";
            showNotification(expandNotification, body);
        }
    })
}


function yb_declineRequest() {
    let request_id = this.getAttribute("data-id");
    let csrf = getCSRF();
    let url = `profile/api/friendrequest/${request_id}/accept/`;
    let data = {
        'csrfmiddlewaretoken': csrf
    }
    $.ajax({
        type: "POST",
        url: url,
        data: data,
        success: function(data){
            console.log(data);
            let body = "Friend Request Accepted";
            showNotification(expandNotification, body);
        }
    })
}

function yb_dismissNotification(notification_id) {
    let csrf = getCSRF();
    let url = `/notify/api/notifications/${notification_id}/`;
    let data = {
        'csrfmiddlewaretoken': csrf
    }
    $.ajax({
        type: "DELETE",
        url: url,
        data: data,
        success: function(data){
            console.log(data);
            let notification_element = document.getElementById(`notification-${notification_id}`);
            notification_element.remove();
        }
    })
}






