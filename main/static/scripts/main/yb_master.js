//YB Master JS File
//Yourbit, LLC - 2023
//Author: Austin Chaney
//Date: 10/26/2023


//Master contains functions that are used by multiple pages
// as well as any of the 3 core scripts create, events, and master
// This file is at top level of load order

//Define Core UI Constants

const SPACE_BUTTONS = document.querySelectorAll(".space-button");

const ALL_SPACE_BUTTON = document.getElementById('global-space-button');
const CHAT_SPACE_BUTTON = document.getElementById('chat-space-button');
const PHOTO_SPACE_BUTTON = document.getElementById('photo-space-button');
const VIDEO_SPACE_BUTTON = document.getElementById('video-space-button');

const SEARCH_BUTTON = document.getElementById('search-button');
const SEARCH_FIELD = document.getElementById('desktop-search-bar');
const SEARCH_ICON = document.getElementById('search-icon');
const SEARCH_CONTAINER = document.getElementById('search');

const CREATE_BUTTON = document.getElementById('yb-create-button');
const EXIT_CREATE = document.getElementById('cb-panel-close')
const CREATE_OPTIONS = document.querySelectorAll(".create-option");
const CONTENT_CONTAINER = document.getElementById('content-container');
const MASTHEAD_LOGOS = document.querySelectorAll(".yb-logo-masthead");
const MOBILE_HEADER = document.querySelector('.yb-header');
const SPOTLIGHT_CONTAINER = document.getElementById('yb-container-spotlight');
const SPOTLIGHT_CONTENT =  document.getElementById('spotlight-content');
const CARD_CONTAINER = document.getElementById("yb-card")

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
const FOCUS_CONTAINER = document.getElementById("core-focus-container");
const MESSAGE_BUTTON_MOBILE = document.getElementById("button-message-mobile-header");

//Prompts
const PROMPT_CONTAINER = document.getElementById("prompt-container");
const PROMPT_TITLE = document.getElementById("prompt-content-a");
const PROMPT_BODY = document.getElementById("prompt-content-b");
const PROMPT_FOOTER = document.getElementById("prompt-content-c");

const TOP_LAYER = document.getElementById("top-layer");
const FLOATING_TEXT_CONTAINER = document.getElementById("floating-text");
const FLOATING_TEXT_INPUT = document.getElementById("input-floating-text");

const MAIN_LOADING_SCREEN = document.getElementById("yb-loading-main");
const SUBSCRIPTION_BANNER = document.getElementById("notification-permission-banner");

const VAPID_PUBLIC_KEY = "BDAIHj_HT2qvxVsrE-pvZOGc2TcJeMKUIM0LxStPASodefcu9fucQndG9XSONnd04finmXAueTLmxqBjv9q6H7g";


const TIME_KEEPER = document.getElementById("time-keeper-node");
var clock_isTicking = false;

// Get the current date
const currentDate = new Date();

// Define months array for converting month number to month name
const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

// Get the month, day, and year from the current date
const month = months[currentDate.getMonth()];
const day = String(currentDate.getDate()).padStart(2, '0'); // Ensure 2-digit day
const year = currentDate.getFullYear();

// Format the date as "MonthName day, year"
const formattedDate = `${month} ${day}, ${year}`;

function yb_setTimezone(){
    let csrfToken = getCSRF();
    let user_tz = Intl.DateTimeFormat().resolvedOptions().timeZone
    let url = `/systems/update/timezone/`
    fetch(url,
        {
            method: "POST",
            headers: {
                'Content-type' : 'application/json',
                'X-CSRFToken' : csrfToken
            },
            body: JSON.stringify({"user_tz":user_tz})
            
        })
    .then((resp) => resp.json())
    .then(function(data){
        console.log(data)
    });

    console.log(user_tz)
}

function yb_timeConvert(hours){
    //get am or pm
    let abbreviation = "AM";

    if (hours > 12) {
        hours = hours - 12;
        abbreviation = "PM";
    } else if (hours == 12) {
        abbreviation = "PM";
    } else if (hours == 0) {
        hours = 12;
    }
    return [hours, abbreviation];
}

var time_step = 0;

function yb_getTimeString(type){
    let now = new Date();
    let month = now.getMonth().toString().padStart(2, '0');
    let day = now.getDate().toString().padStart(2, '0');
    let hours = now.getHours().toString().padStart(2, '0');
    let minutes = now.getMinutes().toString().padStart(2, '0');
    let seconds = now.getSeconds().toString().padStart(2, '0');

    let timeString = ""

    

    if (type === "decorated-time"){ 
        let converted_hours = yb_timeConvert(hours);
        if (time_step === 0){
            time_step = 1;
            timeString = `@${converted_hours[0]}:${minutes} ${converted_hours[1]}`;

        } else {
            time_step = 0;
            timeString = `@${converted_hours[0]} ${minutes} ${converted_hours[1]}`;
            
        }

        

    } else if (type === "time"){

        timeString = `${hours}:${minutes}`;

    } else if (type==="raw-date"){
        timeString = {
            "month": month,
            "day": day,
            "hours": hours,
            "minutes": minutes,
            "seconds": seconds
        }
    
    } else {
        console.log("Error: Invalid time type");
    }

    return timeString;
}

// Variable to store the interval ID
let clockInterval;

// Function to update the time on a timekeeping element
function yb_updateClock(clock_element_id, type) {
    // get current time

    let timeString = yb_getTimeString(type);
    if (type === "raw-date") {
        TIME_KEEPER_NODE.setAttribute("data-month", timeString.month);
        TIME_KEEPER_NODE.setAttribute("data-day", timeString.day);
        TIME_KEEPER_NODE.setAttribute("data-hours", timeString.hours);
        TIME_KEEPER_NODE.setAttribute("data-minutes", timeString.minutes);
        TIME_KEEPER_NODE.setAttribute("data-seconds", timeString.seconds);

    } else {
        try {
            let clock = document.getElementById(clock_element_id);
            clock.textContent = timeString;
        } catch (error) {
            console.log("stopClock()");
            clearInterval(clockInterval); // Use the correct interval ID
        }
    }
}

// Function to start the clock on a timekeeping element
function yb_startClock(clock_element_id) {
    // Initial call to display the time immediately
    yb_updateClock(clock_element_id, "decorated-time");

    // Update the clock every second (1000 milliseconds)
    clockInterval = setInterval(yb_updateClock, 1000, clock_element_id, "decorated-time");
}

// Function to stop the clock
function yb_stopClock() {
    clearInterval(clockInterval);
}

//Time since function to be ran on timestamp received from objects in the database
function yb_formatTimeAgo(timestamp) {
    const currentTime = new Date().getTime();
    const postTime = new Date(timestamp).getTime();
    const timeDifference = currentTime - postTime;
    const minutes = Math.floor(timeDifference / 60000); // 1 minute = 60000 milliseconds
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) {
        return "Just now";
    } else if (minutes < 60) {
        return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
    } else if (hours < 24) {
        return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
    } else if (days <= 7) {
        return `${days} ${days === 1 ? 'day' : 'days'} ago`;
    } else {
        // After 7 days, display the full date and time
        return new Date(timestamp).toLocaleString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            hour12: true
        });
    }
}


// Get a reference to the DOM element where you want to display the timer
var timer = 0;

let startTime; // Timestamp when the timer started

function yb_updateTimer(timestamp) {
  if (!startTime) {
    startTime = timestamp;
  }

  let elapsedTime = timestamp - startTime;

  // Calculate the time in seconds
  let seconds = Math.floor(elapsedTime / 1000);

  // Update the timer element with the elapsed time
  timer = seconds;

  // Request the next animation frame
  setInterval(updateTimer, 1000, timestamp);
}

function yb_startTimer() {
    let timestamp = new Date();
    // Start the timer by requesting the first animation frame
    updateTimer(timestamp);
}

// Start the timer by requesting the first animation frame



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

// /* Function to change the logo in the masthead */
// function yb_changeMastheadLogo(type, selection){
//     if (type === "style"){
//         MASTHEAD_LOGO.src = selection;
//     } else if (type === "color"){
//         MASTHEAD_LOGO.style.fill = selection;
//     }
// }

//Hide quarter card
function yb_hideQuartercard() {
    let card_element = document.getElementById('yb-temporary-card');
    card_element.classList.remove('in');
    card_element.classList.add('out');
    setTimeout(function(){card_element.remove()}, 300);

}

function yb_hideSpaceBar() {
    NAV_BAR.classList.add("hideMobile");
    CREATE_POPOUT.classList.add("hide");
    SEARCH_POPOUT.classList.add("hide");
    yb_setSessionValues("fullscreen", "true");
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
    let page_scripts = container.querySelectorAll(".page-script");
    for (i = 0; i < page_scripts.length; i++){
        page_scripts[i].remove()
    }
    
    let container_content = container.querySelector(".yb-2Way-content");
    container_content.innerHTML = "";

}
function yb_startBitStream() {
    $(CONTENT_CONTAINER).html("");
    if (yb_getSessionValues("fullscreen") === "true"){
        MOBILE_HEADER.classList.remove("hide");
        NAV_BAR.classList.remove("hideMobile");
        CREATE_POPOUT.classList.remove("hide");
        SEARCH_POPOUT.classList.remove("hide");
        yb_setSessionValues("fullscreen", "false");
    }   
    yb_setSessionValues("location", "home")
    $(CONTENT_CONTAINER).load('/bits/templates/bitstream/');
}

const START_BITSTREAM = yb_startBitStream();

function yb_openCard(content) {
    $(CARD_CONTAINER).load(content);
    CARD_CONTAINER.classList.add("open");
}

function yb_closeCard() {
    CARD_CONTAINER.innerHTML = '';
    CARD_CONTAINER.classList.remove("open")
}

function yb_toggle2WayContainer(type, scroll=false){

    console.log(scroll)
    if (MAIN_MENU.classList.contains('open')){
        MAIN_MENU.classList.toggle('open');
        SIDE_CONTAINER_A.classList.toggle('open');

        if (scroll) {
            if (SIDE_CONTAINER_A.classList.contains('yb-lockScroll-y')){
                SIDE_CONTAINER_A.classList.remove('yb-lockScroll-y');
                SIDE_CONTAINER_A.classList.add('vScroll');
            } else {
                SIDE_CONTAINER_A.classList.add('vScroll');
            } 
        } else {
            if (SIDE_CONTAINER_A.classList.contains('vScroll')){
                SIDE_CONTAINER_A.classList.remove('vScroll');
                SIDE_CONTAINER_A.classList.add('yb-lockScroll-y');
            } else {
                SIDE_CONTAINER_A.classList.add('yb-lockScroll-y');
            }
        }


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

                    if (yb_getSessionValues('fullscreen') == "false"){
                        MOBILE_HEADER.classList.remove("hide");
                        NAV_BAR.classList.remove("hideMobile");
                        CREATE_POPOUT.classList.remove("hide");
                        SEARCH_POPOUT.classList.remove("hide");
                    }

                    history.pushState(null, null, "/");
                    return ["closing", SIDE_CONTAINERS[i]];
                } else {
                    if (this_id === 'yb-dynamic-2way-a'){
                        
                        console.log("container_a is open");
                        SIDE_CONTAINER_A.classList.toggle("open");
                        yb_clear2WayContainer(SIDE_CONTAINER_A);
                        
                        SIDE_CONTAINER_B.classList.toggle("open");

                        if (scroll) {
                            if (SIDE_CONTAINER_B.classList.contains('yb-lockScroll-y')){
                                SIDE_CONTAINER_B.classList.remove('yb-lockScroll-y');
                                SIDE_CONTAINER_B.classList.add('vScroll');
                            } else {
                                SIDE_CONTAINER_B.classList.add('vScroll');
                            } 
                        } else {
                            if (SIDE_CONTAINER_B.classList.contains('vScroll')){
                                SIDE_CONTAINER_B.classList.remove('vScroll');
                                SIDE_CONTAINER_B.classList.add('yb-lockScroll-y');
                            } else {
                                SIDE_CONTAINER_B.classList.add('yb-lockScroll-y');
                            }
                        }

                        return ["switching", SIDE_CONTAINER_B];

                    } else {

                        console.log("container_b is open");

                        SIDE_CONTAINER_B.classList.toggle("open");
                        yb_clear2WayContainer(SIDE_CONTAINER_B);
                        
                        SIDE_CONTAINER_A.classList.toggle("open");

                        if (scroll) {
                            if (SIDE_CONTAINER_A.classList.contains('yb-lockScroll-y')){
                                SIDE_CONTAINER_A.classList.remove('yb-lockScroll-y');
                                SIDE_CONTAINER_A.classList.add('vScroll');
                            } else {
                                SIDE_CONTAINER_A.classList.add('vScroll');
                            } 
                        } else {
                            if (SIDE_CONTAINER_A.classList.contains('vScroll')){
                                SIDE_CONTAINER_A.classList.remove('vScroll');
                                SIDE_CONTAINER_A.classList.add('yb-lockScroll-y');
                            } else {
                                SIDE_CONTAINER_A.classList.add('yb-lockScroll-y');
                            }
                        }

                        return ["switching", SIDE_CONTAINER_A];
                    } 
                }
            } else {
                if (i === SIDE_CONTAINERS.length - 1){
                    MOBILE_HEADER.classList.add("hide");
                    NAV_BAR.classList.add("hideMobile");
                    SIDE_CONTAINER_A.classList.add("open");
                    CREATE_POPOUT.classList.add("hide");
                    SEARCH_POPOUT.classList.add("hide");

                    if (scroll) {
                        if (SIDE_CONTAINER_A.classList.contains('yb-lockScroll-y')){
                            SIDE_CONTAINER_A.classList.remove('yb-lockScroll-y');
                            SIDE_CONTAINER_A.classList.add('vScroll');
                        } else {
                            SIDE_CONTAINER_A.classList.add('vScroll');
                        } 
                    } else {
                        if (SIDE_CONTAINER_A.classList.contains('vScroll')){
                            SIDE_CONTAINER_A.classList.remove('vScroll');
                            SIDE_CONTAINER_A.classList.add('yb-lockScroll-y');
                        } else {
                            SIDE_CONTAINER_A.classList.add('yb-lockScroll-y');
                        }
                    }

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
    let container = yb_toggle2WayContainer('create', true);
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

function checkSpotlightTop(focus=false) {

    //Check if the spotlight container is intersecting with the header and by how much
    let spotlightRect = SPOTLIGHT_CONTAINER.getBoundingClientRect();
    let headerRect = MOBILE_HEADER.getBoundingClientRect();
    
    console.log("\n Top\n " + spotlightRect.top, "\n bottom\n " + headerRect.bottom)
    
    if (spotlightRect.top < headerRect.bottom){
        SPOTLIGHT_CONTAINER.style.top = `${headerRect.bottom}px`;
        SPOTLIGHT_CONTAINER.style.height = `calc(100vh - ${headerRect.bottom}px)`;
        //adjust height as well
    }

}
function focusSpotlightField() {
    SPOTLIGHT_CONTAINER.classList.remove('sl-expanded');
    FLOATING_TEXT_INPUT.removeEventListener('focus', focusSpotlightField);
    FLOATING_TEXT_INPUT.addEventListener('blur', blurSpotlightField);

    // Reset CSS modifications
    SPOTLIGHT_CONTAINER.style.top = ''; // Reset the 'top' property
    SPOTLIGHT_CONTAINER.style.height = ''; // Reset the 'height' property



}



function blurSpotlightField() {
    SPOTLIGHT_CONTAINER.classList.add('sl-expanded');
    FLOATING_TEXT_INPUT.removeEventListener('blur', blurSpotlightField);
    FLOATING_TEXT_INPUT.addEventListener('focus', focusSpotlightField);

    //Check if the spotlight container is intersecting with the header and by how much

    setTimeout(checkSpotlightTop, 500);
}

function yb_openSpotlight(category=null){
    SPOTLIGHT_CONTAINER.classList.add('open');
    if (category != null){
        let search_cat = document.getElementById(`sFilter-${category}`);
        SEARCH_FILTER_FIELD.value = category;
        search_cat.classList.add('active');
    }
    //If screen width is less than 768pixels
    if (window.innerWidth < 768){
        FLOATING_TEXT_CONTAINER.classList.add('open');
        FLOATING_TEXT_INPUT.focus();
        FLOATING_TEXT_INPUT.addEventListener('blur', blurSpotlightField);
        CREATE_POPOUT.classList.add("hide");
        SEARCH_POPOUT.classList.add("hide");
        NAV_BAR.classList.add("hideMobile");

    
        
    } else {
        SEARCH_FIELD.focus();
    }


}
function yb_closeSpotlight(){
    SPOTLIGHT_CONTAINER.classList.remove('open');
    SEARCH_FIELD.value = "";

    if (window.innerWidth < 768){
        FLOATING_TEXT_CONTAINER.classList.remove('open');
        CREATE_POPOUT.classList.remove("hide");
        SEARCH_POPOUT.classList.remove("hide");
        NAV_BAR.classList.remove("hideMobile");
    }

}

function yb_openFocusContainer(source){
    $(FOCUS_CONTAINER).fadeIn(500);
    $(FOCUS_CONTAINER).load(source);
}

function yb_closeFocusContainer(){
    $(FOCUS_CONTAINER).fadeOut(500);
    FOCUS_CONTAINER.innerHTML = "";
}

function yb_navigateToProfile(e) {
    let username;
    yb_setSessionValues('location', 'profile');
    try {
        username = e.currentTarget.getAttribute("data-username");
    } catch(err) {
        username = e;
    }
    $("#content-container").load(`/profile/user/${username}/`);
    yb_closeSpotlight();
    MOBILE_HEADER.classList.toggle("hide");
    NAV_BAR.classList.add("hideMobile");
    CREATE_POPOUT.classList.add("hide");
    SEARCH_POPOUT.classList.add("hide");
    yb_setSessionValues('fullscreen', 'true');

    if (MAIN_LOADING_SCREEN.style.display === "block"){
        $(MAIN_LOADING_SCREEN).fadeOut(500).animate({opacity: 0}, 500);
    }
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

function yb_toggleConversation2Way(id){
    let container = yb_toggle2WayContainer('conversation', false);
    if (container[0] === "closing"){
        history.pushState(null, null, "/");
        container[1].setAttribute("data-state", "empty");
    } else {
        console.log("not closing")
        let container_content = container[1].querySelector(".yb-2Way-content");
        container[1].setAttribute("data-state", "conversation");
        $(container_content).load(`/messages/templates/conversation/${id}/`)
        history.pushState({}, "", `/messages/conversation/${id}/`);
    }

}

function yb_closePrompt(){
    
    TOP_LAYER.classList.remove("open");
    PROMPT_CONTAINER.classList.remove("open");

    PROMPT_TITLE.innerHTML = "";
    
    PROMPT_BODY.innerHTML = "";

    PROMPT_FOOTER.innerHTML = "";

}

function yb_changeSpace(space_name) {

    yb_setSessionValues('space', space_name);

    let space_label;
    let space_icon;

    if (space_name === "global") {
        space_label = "EVERYTHING"
    } else {
        space_label = space_name.toUpperCase() + "S";
    }

    if (space_name === "chat") {
        space_icon = `
            
            <path style="fill: #4b4b4b; height: 60px; width: 100px;" d="M3 18v-2h12v2Zm0-5v-2h18v2Zm0-5V6h18v2Z"/>
            
        `
    } else if (space_name === "photo") {
        space_icon = `
            
            <path style="fill: #4b4b4b; height: 60px; width: 100px;" d="M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-4.86 8.86l-3 3.87L9 13.14 6 17h12l-3.86-5.14z"/>
            
        `
    } else if (space_name === "video") {
        space_icon = `
            
            <path style="fill: #4b4b4b; height: 60px; width: 100px;" d="m9.15 17.15 8-5.15-8-5.15ZM12 22.8q-2.25 0-4.213-.85-1.962-.85-3.424-2.312Q2.9 18.175 2.05 16.212 1.2 14.25 1.2 12t.85-4.225Q2.9 5.8 4.363 4.338q1.462-1.463 3.424-2.301Q9.75 1.2 12 1.2t4.225.837q1.975.838 3.438 2.301 1.462 1.462 2.299 3.437Q22.8 9.75 22.8 12q0 2.25-.838 4.212-.837 1.963-2.299 3.426Q18.2 21.1 16.225 21.95q-1.975.85-4.225.85Zm0-2.65q3.425 0 5.788-2.363Q20.15 15.425 20.15 12t-2.362-5.788Q15.425 3.85 12 3.85q-3.425 0-5.787 2.362Q3.85 8.575 3.85 12q0 3.425 2.363 5.787Q8.575 20.15 12 20.15ZM12 12Z"/>
            
        `
    } else {
        space_icon = `
            
            <path style="fill: #4b4b4b; height: 60px; width: 100px;" d="M5.35 17.9q-2.45 0-4.175-1.725-1.725-1.725-1.725-4.2 0-2.45 1.713-4.188Q2.875 6.05 5.35 6.05q1 0 1.937.325Q8.225 6.7 8.95 7.4l1.525 1.475L8.5 10.65 7.15 9.4q-.375-.35-.838-.525Q5.85 8.7 5.35 8.7q-1.35 0-2.3.962-.95.963-.95 2.338 0 1.35.95 2.3.95.95 2.3.95.5 0 .962-.175.463-.175.838-.525l7.9-7.15q.725-.7 1.663-1.025.937-.325 1.937-.325 2.45 0 4.175 1.725Q24.55 9.5 24.55 11.95q0 2.475-1.713 4.212Q21.125 17.9 18.65 17.9q-1 0-1.937-.325-.938-.325-1.663-1.025l-1.525-1.425 2-1.8 1.325 1.225q.375.35.838.525.462.175.962.175 1.35 0 2.3-.963.95-.962.95-2.337 0-1.35-.95-2.3-.95-.95-2.3-.95-.5 0-.962.175-.463.175-.838.525l-7.9 7.15q-.725.7-1.663 1.025-.937.325-1.937.325Z"/>
        
        `
    }

    console.log(space_name);
    let location = yb_getSessionValues("location");

    if (location === "home") {
        let bitstream_icon = document.getElementById("bitstream-title-icon");
        bitstream_icon.innerHTML = space_icon;
        
        let bitstream_label = document.getElementById("bitstream-title-text");
        bitstream_label.innerHTML = space_label;
        
    }

    if (location === "home" || location === "profile") {
        try {
            for (let i = 0; i < SPACE_BUTTONS.length; i++) {
                if (SPACE_BUTTONS[i].querySelector(".yb-icon").classList.contains("active")) {
                    SPACE_BUTTONS[i].querySelector(".yb-icon").classList.remove("active")
                }
            } 

            let this_button = document.getElementById(`${space_name}-space-button`)
            
            this_button.querySelector(".yb-icon").classList.add("active");
            
            yb_getFeed()
            CONTENT_CONTAINER.scrollTo(0, 0);

        }
        catch(err) {
            console.log("Invalid location for space filters")
        }
    } 
}


function hideTopBanner() {
    SUBSCRIPTION_BANNER.classList.remove('open');

}

/*
        ----------------------------------
        -----SERVICE WORKER FUNCTIONS-----
        ----------------------------------
*/



async function subscribeToPush() {
    try {
      // Verify that a Service Worker registration exists
      if (!swRegistration) {
        throw new Error('Service Worker registration not found.');
      }
  
      const serverPublicKey = '<YOUR VAPID PUBLIC KEY>'; // Replace with your key
      if (!serverPublicKey) {
        throw new Error('VAPID_PUBLIC_KEY is missing or invalid.');
      }
  
      const subscriptionOptions = {
        userVisibleOnly: true,
        applicationServerKey: serverPublicKey
      };
  
      const subscription = await swRegistration.pushManager.subscribe(subscriptionOptions);
      sendSubscriptionToServer(subscription);
  
    } catch (error) {
      console.error('Error subscribing to push notifications:', error);
      // Handle the error, e.g., display an error message to the user
    }
  }
  
  async function sendSubscriptionToServer(subscription) {
    try {
      const response = await fetch('/notify/api/subscribe/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(subscription)
      });
  
      if (!response.ok) {
        throw new Error('Failed to send subscription to server. Server Response:', response.status); 
      } else {
        // ... rest of your code (show notification, hide banner)
      }
    } catch (error) {
      console.error('Error sending subscription data to server:', error);
      // Handle the error
    }
  }
  

const checkPermission = async () => {
    if (!('serviceWorker' in navigator)) {
        throw new Error('Service Worker not supported in this browser');
    } 
    
    if (!('PushManager' in window)) {
        throw new Error('Push API not supported in this browser');
    } 
    
    if (!('Notification' in window)) {
        throw new Error('Notifications not supported in this browser');
    }
}

const registerSW = async () => {
    const swRegistration = await navigator.serviceWorker.register('/static/scripts/main/sw.js');
    return swRegistration;
}

const requestNotificationPermission = async () => {
    const permission = await Notification.requestPermission();

    if (permission !== 'granted') {
        throw new Error('Permission not granted for Notification');
    } else {
        subscribeToPush();
        return permission;
    }
}

const checkSubscription = async () => {
    const subscription = await swRegistration.pushManager.getSubscription();
    return subscription;
}

function yb_showNotifyPrompt() {
    if (Notification.permission === 'default') {
        SUBSCRIPTION_BANNER.classList.add('open');
    }
}

let swRegistration; // Declared in a shared scope

$(document).ready(async function() { // Using async for await 
  try {
    await checkPermission(); 
    swRegistration = await registerSW(); 
    yb_showNotifyPrompt();

  } catch (error) {
    console.error('Error initializing push notifications:', error);
    // Handle setup errors
  }
});

$(document).ready(function() {
    if ('serviceWorker' in navigator && 'SyncManager' in window) {
        navigator.serviceWorker.ready
        .then(function(registration) {
            return registration.sync.register('sync-new-bits');
        })
        .catch(function(err) {
            console.log('Service Worker registration failed: ', err);
        });
    }

    SEARCH_BUTTON.addEventListener('mouseover', yb_searchMouseOver);
    CREATE_DESKTOP.addEventListener('click', yb_toggleCreateMenu);
    // EXIT_CREATE.addEventListener('click', yb_toggleCreateMenu);

    MESSAGES_DESKTOP.addEventListener("click", yb_handleMessageClick);
    NOTIFICATIONS_DESKTOP.addEventListener("click", yb_handleNotificationsClick);
    NOTIFICATIONS_MOBILE.addEventListener("click", yb_handleNotificationsClick);
    MESSAGE_BUTTON_MOBILE.addEventListener("click", yb_handleMessageClick)

    CREATE_POPOUT.addEventListener('click', yb_toggleCreateMenu);
    console.log(SEARCH_FIELD);

    SEARCH_POPOUT.addEventListener('click', function() {
        yb_openSpotlight();
    });

    for (let i = 0; i < MASTHEAD_LOGOS.length; i++) {
        MASTHEAD_LOGOS[i].addEventListener('click', function() {
            yb_startBitStream()
        })
    }


    yb_updateTimezone();

    if (window.matchMedia('(display-mode: standalone)').matches) {
        console.log('display-mode is standalone');
        SEARCH_POPOUT.classList.add("pwa-standalone");
        CREATE_POPOUT.classList.add("pwa-standalone");
        NAV_BAR.classList.add("pwa-standalone");
        MENU_BUTTON.classList.add("pwa-standalone");
    } else {
        console.log('display-mode is not standalone');
    }

    for (let i = 0; i < SPACE_BUTTONS.length; i++) {
        SPACE_BUTTONS[i].addEventListener("click", function(e){
            $(MAIN_LOADING_SCREEN).fadeIn(100).animate({opacity: 1}, 100);
            let space_name = e.currentTarget.getAttribute("name");
            yb_changeSpace(space_name);
        });
    }

    

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

function yb_showPopoutCard() {
    let card_element = document.getElementById('yb-temporary-card');
    card_element.classList.add('in');
    card_element.classList.remove('out');

}

function yb_hidePopoutCard() {
    let card_element = document.getElementById('yb-temporary-card');
    card_element.classList.remove('in');
    card_element.classList.add('out');
    setTimeout(function(){card_element.remove()}, 300);
}

function yb_viewBit(bit_id, comment_id = null) {
    let url = `/bits/templates/bit/focus/${bit_id}/`;
    yb_openFocusContainer(url);
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

function yb_acceptRequest(request_id) {
    
    let csrf = getCSRF();
    let url = `/profile/api/connect/friend/${request_id}/accept/`;
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








