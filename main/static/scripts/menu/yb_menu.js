/*
    File: yb_menu.js
    Yourbit, LLC, 2023
    Author: Austin Chaney
    Date: 11/12/2023
*/
//Define Main Menu Constants
const MENU_BUTTON = document.getElementById('profile-icon');
const MAIN_MENU = document.getElementById('yb-main-menu');
const MENU_BUTTONS = document.querySelectorAll('.yb-item-mainMenu');
const LOGOUT_BUTTON = document.getElementById("yb-logout-button");
const SETTINGS_BUTTON = document.getElementById('yb-settings-button');
const SUPPORT_BUTTON = document.getElementById('yb-support-button');

const MENU_PROFILE_BUTTON = document.getElementById('profile-icon-menu');

const HOME_BUTTON = document.getElementById('main-menu-home');
const MESSAGE_BUTTON = document.getElementById('main-menu-messages');

function yb_logout() {
    console.log("logout clicked")
    window.location.href = "/logout/";
}




function yb_toggleMainMenu() {
    if (SIDE_CONTAINER_A.classList.contains('open')){
        SIDE_CONTAINER_A.classList.toggle('open');
    } else if (SIDE_CONTAINER_B.classList.contains('open')){
        SIDE_CONTAINER_B.classList.toggle('open');
    }
    if (MAIN_MENU.classList.contains('open')){
        MOBILE_HEADER.classList.remove("hide");
        NAV_BAR.classList.remove("hideMobile");
        CREATE_POPOUT.classList.remove("hide");
        SEARCH_POPOUT.classList.remove("hide");
        MAIN_MENU.classList.remove("open");
 
    } else {
        MOBILE_HEADER.classList.add("hide");
        NAV_BAR.classList.add("hideMobile");
        CREATE_POPOUT.classList.add("hide");
        SEARCH_POPOUT.classList.add("hide");
        MAIN_MENU.classList.add("open");

    
    }


}

function yb_goHome() {
    yb_toggleMainMenu();
    $(CONTENT_CONTAINER).html("");
    yb_setSessionValues("location", "home")
    $(CONTENT_CONTAINER).load('/bits/templates/bitstream/');
    yb_revertUIColor();
}

function yb_toggleSettingsMenu() {
    yb_launch2WayContainer("settings");
}

function yb_showPeoplePage() {
    yb_launch2WayContainer("people");
}

function yb_showOrbitsPage() {
    yb_launch2WayContainer("orbits");
}

function yb_showHistoryPage() {
    yb_launch2WayContainer("history");
}

function yb_showStuffPage() {
    yb_launch2WayContainer("stuff");
}

function yb_messageButton() {
    yb_launch2WayContainer("messages");
}

const BUTTON_FUNCTIONS = {
    "bitstream": yb_goHome,
    "messages": yb_messageButton,
    "people": yb_showPeoplePage,
    "stuff": yb_showStuffPage,
    "orbits": yb_showOrbitsPage,
    "history": yb_showHistoryPage
}


function yb_handleMenuGridLink(link) {

    console.log(link);
    console.log("clicked")
    if (link in BUTTON_FUNCTIONS){
        BUTTON_FUNCTIONS[link]();
    } else {
        console.log("no function found for link");
    }
}

function yb_handleSupportClick() {
    yb_launch2WayContainer("support-center");
}

$(document).ready(function () {
    MENU_BUTTON.addEventListener('click', yb_toggleMainMenu);
    SETTINGS_BUTTON.addEventListener("click", yb_toggleSettingsMenu);
    SUPPORT_BUTTON.addEventListener("click", yb_handleSupportClick);

    LOGOUT_BUTTON.addEventListener("click", yb_logout);
    for (let i = 0; i < MENU_BUTTONS.length; i++){
        console.log("added event listener to button")
        MENU_BUTTONS[i].addEventListener('click', function(){
            let link = MENU_BUTTONS[i].getAttribute("name");
            yb_handleMenuGridLink(link);
        });
    }

    MENU_PROFILE_BUTTON.addEventListener('click', function(){
        let username = MENU_PROFILE_BUTTON.getAttribute("data-username");
        //clear content-container
        yb_toggleMainMenu();
        yb_navigateToProfile(username);
    });
});
