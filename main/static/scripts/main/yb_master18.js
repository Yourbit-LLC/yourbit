/**
 * @fileoverview This file contains the YB Master JS functions and constants used by multiple pages.
 * @description This file defines various constants, functions, and variables used throughout the application.
 * @module YB_Master
 * @version 1.0.0
 * @license Yourbit, LLC - 2023
 * @author Austin Chaney
 * @created 10/26/2023
 * @lastModified 07/11/2024
 */
//YB Master JS File
//Yourbit, LLC - 2023
//Author: Austin Chaney
//Created: 10/26/2023
//Last Modified: 07/11/2024


//Master contains functions that are used by multiple pages
// as well as any of the 3 core scripts create, events, and master
// This file is at top level of load order

//Define Core UI Constants

const SPACE_BUTTONS = document.querySelectorAll(".space-button");

const ALL_SPACE_BUTTON = document.getElementById('global-space-button');
const CHAT_SPACE_BUTTON = document.getElementById('chat-space-button');
const PHOTO_SPACE_BUTTON = document.getElementById('photo-space-button');
const VIDEO_SPACE_BUTTON = document.getElementById('video-space-button');
const IMAGE_STAGE = document.getElementById('image-stage');

const SEARCH_BUTTON = document.getElementById('search-button');
const SEARCH_FIELD = document.getElementById('desktop-search-bar');
const SEARCH_ICON = document.getElementById('search-icon');
const SEARCH_CONTAINER = document.getElementById('search');

const CREATE_BUTTON = document.getElementById('yb-create-button');
const EXIT_CREATE = document.getElementById('cb-panel-close')
const CREATE_OPTIONS = document.querySelectorAll(".create-option");
const MASTHEAD_LOGOS = document.querySelectorAll(".yb-logo-masthead");
const MOBILE_HEADER = document.getElementById('yb-mobile-header');
const SPOTLIGHT_CONTAINER = document.getElementById('yb-container-spotlight');
const SPOTLIGHT_CONTENT =  document.getElementById('spotlight-content');
const MOBILE_IFRAME = document.getElementById('yb-iframe-mobile');

const CREATE_POPOUT = document.getElementById("create-button-popout");
const SEARCH_POPOUT = document.getElementById("search-button-popout");

const CREATE_MENU = document.getElementById("yb-create-menu");
const CREATE_MENU_BUTTON = document.getElementById("yb-create-menu-button");
const CMENU_CONTENT = document.getElementById("create-menu-content");
const CREATE_DESKTOP = document.getElementById("create-quick");
const MESSAGES_DESKTOP = document.getElementById('messages-quick');
const NOTIFICATIONS_DESKTOP = document.getElementById('notifications-quick');
const NOTIFICATIONS_MOBILE = document.getElementById('button-notifications-mobile-header');
const NAV_BAR = document.querySelector(".yb-navigation");
const MESSAGE_BUTTON_MOBILE = document.getElementById("button-message-mobile-header");

const TOP_LAYER = document.getElementById("top-layer");
const FLOATING_TEXT_CONTAINER = document.getElementById("floating-text");
const FLOATING_TEXT_INPUT = document.getElementById("input-floating-text");

const MAIN_LOADING_SCREEN = document.getElementById("yb-loading-main");
const SUBSCRIPTION_BANNER = document.getElementById("notification-permission-banner");

const SCREEN_WIDTH = window.screen.width;

const VAPID_PUBLIC_KEY = "BDAIHj_HT2qvxVsrE-pvZOGc2TcJeMKUIM0LxStPASodefcu9fucQndG9XSONnd04finmXAueTLmxqBjv9q6H7g";

const LOGO_PATHS = document.querySelectorAll(".cls-1");

const TIME_KEEPER = document.getElementById("time-keeper-node");
const LAYER_DIVIDER_1 = document.getElementById("layer-divider-1");

const BOTTOM_GRADIENT = document.getElementById("gradient-overlay");
const USER_AUTHORIZED = document.getElementById("auth-status").value;

//Initialize touch variables for gestures
var toustStartY = 0;
var touchEndY = 0;
var touchStartX = 0;
var touchEndX = 0;

const FEED_PARAMS = {
    "space": yb_getSessionValues("space"),
    "page": yb_getSessionValues("page"),
    "filter": yb_getSessionValues("filter"),
    "sort": yb_getSessionValues("sort"),
}

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


function throttle(callback, delay) {
    let lastTime = 0;
    return function (...args) {
      const now = new Date().getTime();
      if (now - lastTime >= delay) {
        callback(...args);
        lastTime = now;
      }
    };
  }

function yb_hideMobileHeader() {
    if (MOBILE_HEADER.classList.contains("hide") === false){
        MOBILE_HEADER.classList.add("hide");
    }
}

function yb_showMobileHeader() {
    if (MOBILE_HEADER.classList.contains("hide")){
        MOBILE_HEADER.classList.remove("hide");
    }
}

function yb_hideMobileNavigation() {
    if (NAV_BAR.classList.contains("hideMobile") === false){
        NAV_BAR.classList.add("hideMobile");
        BOTTOM_GRADIENT.style.display = "none";
    }
    if (CREATE_POPOUT.classList.contains("hide") === false){
        CREATE_POPOUT.classList.add("hide");
    }
    if (SEARCH_POPOUT.classList.contains("hide") === false){
        SEARCH_POPOUT.classList.add("hide");
    }
    
}

function yb_showMobileNavigation() {
    if (NAV_BAR.classList.contains("hideMobile")){
        NAV_BAR.classList.remove("hideMobile");
        BOTTOM_GRADIENT.style.display = "block";
    }

    if (USER_AUTHORIZED == "true "){
        if (CREATE_POPOUT.classList.contains("hide")){
            CREATE_POPOUT.classList.remove("hide");
        }
        if (SEARCH_POPOUT.classList.contains("hide")){
            SEARCH_POPOUT.classList.remove("hide");
        }
    }
    
}

function yb_hideMobileUI() {
    yb_hideMobileHeader();
    yb_hideMobileNavigation();
}

function yb_showMobileUI() {
    yb_showMobileHeader();
    yb_showMobileNavigation();
}

function yb_positionLayerDivider(behind_element) {
    this_index = behind_element.style.zIndex;
    LAYER_DIVIDER_1.style.zIndex = z_layer
}
function yb_showLayerDivider(behind_element){
    yb_positionLayerDivider(behind_element);
    LAYER_DIVIDER_1.style.display = "block";
}

function getOSAndDevice() {
    const userAgent = navigator.userAgent;
    let os = "Unknown";
    let device = "Unknown";
  
    if (/android/i.test(userAgent)) {
      os = "Android";
      device = "Mobile";
    } else if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
      os = "iOS";
      device = "Mobile";
    } else if (/Macintosh|Mac OS X/.test(userAgent)) {
      os = "macOS";
      device = "Desktop";
    } else if (/Windows NT/.test(userAgent)) {
      os = "Windows";
      device = "Desktop";
    } else if (/Linux/.test(userAgent)) {
      os = "Linux";
      device = "Desktop";
    }
  
    return { os, device };
}

const { os, device } = getOSAndDevice();
console.log(`Operating System: ${os}`);
console.log(`Device: ${device}`);
  

function yb_getPlatform() {
    try {
        var platform = navigator.platform;
    } catch (e) {
        var platform = "unknown";
    }

    return platform;
}

function yb_getTouches() {
    try {
        var touches = navigator.maxTouchPoints;
    } catch (e) {
        var touches = "unknown";
    }

    return touches;
}

function yba_endSequence(class_name) {
    let these_targets = document.querySelectorAll(class_name);
    for (let i = 0; i < these_targets.length; i++) {
        these_targets[i].style.animation = "none";
    }
}


function yba_createSequence(animation, class_name, delay, duration, iterations=1) {
    let these_targets = document.querySelectorAll(class_name);
    for (let i = 0; i < iterations; i++) {
        for (let i = 0; i < these_targets.length; i++) {
            setTimeout(function() {
                these_targets[i].style.animation = `${animation} ${duration}s ease-in-out`;
            }, delay);
        }
    }
}

function yb_replaceProfileImages(){
    let profile_id = yb_getSessionValues("user-profile");
    $.ajax({
        type: 'GET',
        url: `/profile/api/profile/${profile_id}/image/`,
        success: function(response) {
            console.log(response)
            let profile_image = response.profile_image;
            
            let image_containers = document.querySelectorAll(".profile-icon");
            console.log(image_containers)
            for (let i = 0; i < image_containers.length; i++){
                let this_image = image_containers[i];
                let image_source = profile_image.large_thumbnail;
                this_image.setAttribute("src", image_source);
            }

        },
        error: function(response) {
            console.log(response);
        }
    });

}

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
function yb_combineDateTime(date, time) {

    const combinedDateTime = `${date}T${time}`; // "2025-04-17T13:45"

    console.log(combinedDateTime);
    return combinedDateTime;

}


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

function yb_getStagedFiles(type){
    if (type === "image") {
        return IMAGE_STAGE.getAttribute("src");
    } else if (type === "video") {
        return VIDEO_STAGE.getAttribute("src");
    }
}

function yb_showIframe(url){
    let preview_window = document.getElementById("mobile-preview");
    preview_window.setAttribute("src", url);
    MOBILE_IFRAME.style.display = "block";
}

function yb_hideIframe(){
    let preview_window = document.getElementById("mobile-preview");
    MOBILE_IFRAME.style.display = "none";
    preview_window.setAttribute("src", "");
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


function yb_startBitStream() {
    $(CONTENT_CONTAINER_A).html("");
    if (yb_getSessionValues("fullscreen") === "true"){
        MOBILE_HEADER.classList.remove("hide");
        NAV_BAR.classList.remove("hideMobile");
        CREATE_POPOUT.classList.remove("hide");
        SEARCH_POPOUT.classList.remove("hide");
        yb_setSessionValues("fullscreen", "false");
        yb_revertUIColor();
    }   
    yb_setSessionValues("location", "home");
    
    $(CONTENT_CONTAINER_A).load('/bits/templates/bitstream/');
}

const START_BITSTREAM = yb_startBitStream();

function yb_toggleCreateMenu() {
    let container = yb_toggle2WayContainer('create', true);
    if (container[0] != "closing"){
        
        let container_content = container[1].querySelector(".yb-2Way-content");
        container[1].setAttribute("data-state", "create");
        $(container_content).load("/core/create-menu/");
        history.pushState({container:'2way', template:"create", data:null}, "create", '/create/');
    } else {
        history.pushState({container:"content-container", template:yb_getSessionValues("location")}, null, "/"); //Session values location only tracks content-container locaitons
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

function yb_enableSwipeDown(element, action, threshold=50, speed=0.3) {
    // Attach an event listener for touchstart event
    element.addEventListener("touchstart", function(event) {
        
        touchStartX = event.changedTouches[0].screenX;
        touchStartY = event.changedTouches[0].screenY;
        // Add an event listener for touchend event
        
    });

    element.addEventListener("touchend", function(event) {
        touchEndX = event.changedTouches[0].screenX;
        touchEndY = event.changedTouches[0].screenY;
      
        const deltaX = touchEndX - touchStartX;
        const deltaY = touchEndY - touchStartY;
      
        if (Math.abs(deltaX) < Math.abs(deltaY)) {

          if (deltaY > threshold) {
            console.log('Swiped Down');
            action();
          } 
        }
    });

}

function yb_switchUserPerspective(orbit_name) {
    let csrf = getCSRF();
    let url = "/core/switch-perspective/";
    let data = {
        'username': orbit_name,
    }
    $.ajax({
        type: "POST",
        url: url,
        data: data,
        headers: {
            'X-CSRFToken': csrf
        },
        success: function(data){
            console.log(data);
            location.reload();
        }
    })
}

function yb_navigateToProfile(e) {
    let username;
    yb_setSessionValues('location', 'profile');
    try {
        username = e.currentTarget.getAttribute("data-username");
    } catch(err) {
        username = e;
    }
    $("#content-container-b").load(`/profile/user/${username}/`);
    CONTENT_CONTAINER_A.classList.remove("show")
    CONTENT_CONTAINER_B.classList.add("show")
    yb_closeSpotlight();
    yb_setSessionValues('fullscreen', 'true');
    yb_setLast("content-container", "profile", username);

    $(MAIN_LOADING_SCREEN).fadeIn(100).animate({opacity: 1}, 100);

    for (let i = 0; i < SIDE_CONTAINERS.length; i++){
        if (SIDE_CONTAINERS[i].classList.contains("open")){
            let this_state = SIDE_CONTAINERS[i].getAttribute("data-state");
            yb_toggle2WayContainer(this_state);
        }
    }

    history.pushState({container:"content-container", template:"profile", data:username}, "profile", `/profile/${username}/`);
}

function yb_addToCluster(cluster_id, bit_id) {
    let csrf = getCSRF();
    let url = "/bits/add-to-cluster/";
    let data = {
        'bit_id': bit_id,
        'cluster_id': cluster_id,
    }
    $.ajax({
        type: "POST",
        url: url,
        data: data,
        headers: {
            'X-CSRFToken': csrf
        },
        success: function(data){
            console.log(data);
            showNotification(expandNotification, "Bit added to " + data.cluster_name);
            yb_closeDrawer();
        }
    })
}

function yb_removeFromCluster(cluster_id, bit_id) {
    let csrf = getCSRF();
    let url = "/bits/remove-from-cluster/";
    let data = {
        'bit_id': bit_id,
        'cluster_id': cluster_id,
    }
    $.ajax({
        type: "POST",
        url: url,
        data: data,
        headers: {
            'X-CSRFToken': csrf
        },
        success: function(data){
            try {
                let this_item = document.getElementById("result-bits-" + bit_id);
                this_item.remove();
            } catch {
                console.log("Cluster view not open")
            }
            
            showNotification(expandNotification, "Bit removed from " + data.cluster_name);

        }
    })
}


function yb_closeImage(container_id=null) {
    if (container_id === null) {
        PHOTO_VIEWER.classList.remove("open");
        PHOTO_VIEWER.innerHTML = "";
    }
    else {
        let this_container = document.getElementById(container_id);        
        this_container.remove();
    }

}

function yb_fullScreenImage(source){
    let viewer = yb_createElement('div', 'photo-viewer', 'temp-photo-viewer');
    let viewing_image = yb_renderImage(source, "full-screen-image", "full-screen-image");

    let photo_header = yb_createElement('div', 'div-header', 'div-header');
    photo_header.setAttribute("style", "position: absolute; display:grid; grid-template-columns: 1fr 1fr; top: 0px; left: 0px; width: 100%; height: 50px; background-color: rgba(0, 0, 0, 0.5);");
    photo_header.innerHTML = `
        <h3 class="yb-fillWidth yb-margin-L10 yb-font-auto yb-margin-center tb"></h3>
        <div class='yb-button-close' id='cb-panel-close' onclick="yb_closeImage('temp-photo-viewer');"><svg class="yb-transform-center all yb-icon small" xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path class='yb-fill-white' d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/></svg></div>
    `

    
    viewer.appendChild(photo_header);

    viewer.appendChild(viewing_image);
    document.body.appendChild(viewer);

    $('#temp-photo-viewer').fadeIn(200);
    $('#temp-photo-viewer').animate({"top": "0px"}, 200);

}

function yb_listClusters(bit_id) {
    yb_openDrawer("list-clusters", bit_id, false);
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


/*
    Legacy Function **MARKED FOR REMOVAL** yb_toggleConversation2Way()
        -Pending Implementation Confirmation-

        Replaced With: yb_launch2WayContainer(page, data=null)
*/

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



function yb_changeSpace(space_name) {

    yb_setSessionValues('space', space_name);

    yb_setSessionValues('bitstream-page', 1);

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
            if (yb_getSessionValues("location") == "home"){
                CONTENT_CONTAINER_A.scrollTo(0, 0);
            } else {
                CONTENT_CONTAINER_B.scrollTo(0, 0);
            }

        }
        catch(err) {
            console.log("Invalid location for space filters")
        }
    } 
}


function hideTopBanner() {
    SUBSCRIPTION_BANNER.classList.remove('open');

}

function getBrowserName(userAgent) {
    // Convert the user agent string to lowercase for easier comparison
    var ua = userAgent.toLowerCase();
  
    // Check for common browser identifiers in the user agent string
    if (ua.indexOf('firefox') !== -1) {
      return 'Firefox';
    } else if (ua.indexOf('chrome') !== -1) {
      return 'Chrome';
    } else if (ua.indexOf('safari') !== -1) {
      return 'Safari';
    } else if (ua.indexOf('opera') !== -1 || ua.indexOf('opr') !== -1) {
      return 'Opera';
    } else if (ua.indexOf('edge') !== -1) {
      return 'Edge';
    } else if (ua.indexOf('msie') !== -1 || ua.indexOf('trident') !== -1) {
      return 'Internet Explorer';
    } else {
      // If the browser is not recognized, return 'Unknown'
      return 'Unknown';
    }
  }
  

/*
        ----------------------------------
        -----SERVICE WORKER FUNCTIONS-----
        ----------------------------------
*/

var swRegistration; // Declared in a shared scope

function encodeBase64URL(input) {
    //Convert the input to a UintArray
    const inputArray = new Uint8Array(input);
    //Encode the input to base64
    const base64 = btoa(String.fromCharCode.apply(null, inputArray));

    //Convert the base64 to base64URL
    const base64URL = base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
    


async function subscribeToPush() {
    try {
      // Verify that a Service Worker registration exists
      if (!swRegistration) {
        throw new Error('Service Worker registration not found.');
      }
  
      const serverPublicKey = VAPID_PUBLIC_KEY; // Replace with your key
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
    console.log(subscription)
    //Get browser name and append to 
  
    //Get browser type and append to subscription
    
    let csrfToken = getCSRF();
    try {
      const response = await $.ajax({
            type: "POST",
            url: '/notify/subscribe/',
            data: JSON.stringify(subscription),
            contentType: 'application/json',
            headers: {
                'X-CSRFToken': csrfToken
            },
            success: function(data){
                console.log(data);
            }
        })




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

function registerSW(){
    const swRegistration = navigator.serviceWorker.register('/static/service-worker.js');
    return swRegistration;
}

const requestNotificationPermission = async () => {
    const permission = await Notification.requestPermission();

    if (permission != 'granted') {
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

const yb_showNotifyPrompt = async () => {
    if (permission != 'granted') {
        SUBSCRIPTION_BANNER.classList.add('open');
    }
}

function yb_acceptOption(this_id) {
    yb_acceptRequest(this_id);
    yb_closeCard();
}


$(document).ready(function() {
    let this_browser = console.log(getBrowserName(navigator.userAgent));
    console.log(this_browser);

    if (USER_AUTHORIZED == "true"){
        showNotification(expandNotification, "Active as " + "<b color: " + yb_getCustomValues("ui-title-color") + ">@" + yb_getSessionValues("username") + "</b>");
        CREATE_DESKTOP.addEventListener('click', yb_toggleCreateMenu);
        // EXIT_CREATE.addEventListener('click', yb_toggleCreateMenu);

        MESSAGES_DESKTOP.addEventListener("click", yb_handleMessageClick);
        NOTIFICATIONS_DESKTOP.addEventListener("click", yb_handleNotificationsClick);
        NOTIFICATIONS_MOBILE.addEventListener("click", yb_handleNotificationsClick);
        MESSAGE_BUTTON_MOBILE.addEventListener("click", yb_handleMessageClick)

        CREATE_POPOUT.addEventListener('click', yb_toggleCreateMenu);
        yb_updateTimezone();

    } 
    if (typeof navigator.serviceWorker !== 'undefined') {
        navigator.serviceWorker.register('/static/service-worker.js')
        .then(function(registration) {
            console.log('Service Worker registered successfully');
            swRegistration = registration;
        })
        .catch(function(err) {
            console.error('Service Worker registration failed: ', err);
        });
    }

    console.log("User Agent:" + navigator.userAgent);
    try{
        console.log("Downlink: " + navigator.connection.downlink + " Mbps");
    } catch(err) {
        console.log("Connection API not supported");
    }

    try {
        console.log("Device Memory: " + navigator.deviceMemory + "GB");
    } catch(err) {
        console.log("Device Memory API not supported");
    }

    try {
        console.log("Hardware Concurrency: " + navigator.hardwareConcurrency);
    } catch(err) {
        console.log("Hardware Concurrency API not supported");
    }

    try {
        console.log("Max Touch Points: " + navigator.maxTouchPoints);
    } catch(err) {
        console.log("Touch Points API not supported");
    }

    try {
        console.log("Platform Version: " + navigator.platformVersion);
    } catch(err) {
        console.log("Platform Version API not supported");
    
    }

    try {
        console.log("Platform: " + navigator.platform);
    } catch(err) {
        console.log("Platform API not supported");
    }

    if ('serviceWorker' in navigator && 'SyncManager' in window) {
        navigator.serviceWorker.ready
        .then(function(registration) {
            return registration.sync.register('sync-new-bits');
        })
        .catch(function(err) {
            console.log('Service Worker registration failed: ', err);
        });
    }

    history.replaceState({container:"content-container", template:yb_getSessionValues("location"), data:null}, "home", "/bitstream/");


    SEARCH_BUTTON.addEventListener('mouseover', yb_searchMouseOver);
    SEARCH_POPOUT.addEventListener('click', function() {
        yb_openSpotlight();
    });

    window.addEventListener('beforeunload', () => {
        console.log("Clearing bitstream data");
        sessionStorage.removeItem('savedBitstream'); // Clear the specific saved feed
    });
    

    for (let i = 0; i < MASTHEAD_LOGOS.length; i++) {
        MASTHEAD_LOGOS[i].addEventListener('click', function() {
            yb_navigateTo("content-container", "home");
        })
    }


    //Display standalone check for browser/pwa specific actions
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
    
    yb_navigateTo("content-container", "bit-focus", bit_id);
}

function copyToClipboard(element_id) {
    let this_field = document.getElementById(element_id);

    // Copy the text from the field to the clipboard
    navigator.clipboard.writeText(this_field.innerHTML).then(() => {
        // Provide feedback that the copy was successful
        showNotification(expandNotification, "Text copied to clipboard");   
    }).catch(err => {
        console.error("Failed to copy text: ", err);
        showNotification(expandNotification, "Failed to copy text to clipboard");
    });
}

function yb_startRepost(bit_id) {
    yb_navigateTo("2Way", "edit-bit", bit_id);

}

function yb_startShare(bit_id) {
    let url = "https://yourbit.me/bits/view/" + bit_id + "/";
    data = {
        "url" : url,
        "title" : "Check out this bit on Yourbit!",
    };
    navigator.share(data);
}

//Close the card container
function yb_closeCard() {
    CARD_CONTAINER.innerHTML = '';
    CARD_CONTAINER.classList.remove("open");
    LAYER_DIVIDER_1.style.display = "none";
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

// Function to lock orientation to portrait
function yb_lockOrientation() {
    if (screen.orientation && screen.orientation.lock) {
      screen.orientation.lock("portrait").catch(err => {
        console.warn("Orientation lock failed:", err);
      });
    } else {
      console.warn("Screen Orientation API is not supported in this browser.");
    }
  }
  
  // Function to unlock orientation
  function yb_unlockOrientation() {
    if (screen.orientation && screen.orientation.unlock) {
      screen.orientation.unlock();
    } else {
      console.warn("Screen Orientation API is not supported in this browser.");
    }
  }
  
  // Example usage: Lock orientation on specific pages
  document.addEventListener("DOMContentLoaded", () => {
    const isPortraitOnlyPage = window.location.pathname === "/portrait-only-page";
    if (isPortraitOnlyPage) {
      yb_lockOrientation();
    } else {
      yb_unlockOrientation();
    }
  });
  
