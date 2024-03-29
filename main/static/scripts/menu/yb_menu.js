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

const MENU_PROFILE_BUTTON = document.getElementById('profile-icon-menu');

const HOME_BUTTON = document.getElementById('main-menu-home');
const MESSAGE_BUTTON = document.getElementById('main-menu-messages');

function yb_logout() {
    console.log("logout clicked")
    window.location.href = "/logout/";
}

function yb_goHome() {
    console.log("home clicked");
    window.location.href = "/";

}


function yb_toggleMainMenu() {
    if (SIDE_CONTAINER_A.classList.contains('open')){
        SIDE_CONTAINER_A.classList.toggle('open');
    } else if (SIDE_CONTAINER_B.classList.contains('open')){
        SIDE_CONTAINER_B.classList.toggle('open');
    }
    MOBILE_HEADER.classList.toggle("hide");
    NAV_BAR.classList.toggle("hideMobile");
    CREATE_POPOUT.classList.toggle("hide");
    SEARCH_POPOUT.classList.toggle("hide");
    MAIN_MENU.classList.toggle("open");


    window.navigator.vibrate(1000);

}

function yb_toggleSettingsMenu() {
    console.log("settings shown")
    let container = yb_toggle2WayContainer('settings', true);
    if (container[0] === "closing"){
        history.pushState(null, null, "/");
        container[1].setAttribute("data-state", "empty");
    } else {
        console.log("not closing")
        let container_content = container[1].querySelector(".yb-2Way-content");
        container[1].setAttribute("data-state", "settings");
        $(container_content).load("/settings/root/")
        history.pushState({}, "", '/settings/main/');

    }
}

function yb_showPeoplePage() {
    console.log("settings shown")
    let container = yb_toggle2WayContainer('people');
    if (container[0] === "closing"){
        history.pushState(null, null, "/");
        container[1].setAttribute("data-state", "empty");
    } else {
        console.log("not closing")
        let container_content = container[1].querySelector(".yb-2Way-content");
        container[1].setAttribute("data-state", "people");
        $(container_content).load("/profile/templates/people/")
        history.pushState({}, "", '/profile/people/');

    }
}

function yb_showOrbitsPage() {
    console.log("settings shown")
    let container = yb_toggle2WayContainer('orbits');
    if (container[0] === "closing"){
        history.pushState(null, null, "/");
        container[1].setAttribute("data-state", "empty");
    } else {
        console.log("not closing")
        let container_content = container[1].querySelector(".yb-2Way-content");
        container[1].setAttribute("data-state", "orbits");
        $(container_content).load("/profile/templates/orbits/")
        history.pushState({}, "", '/profile/people/');

    }
}

function yb_showHistoryPage() {
    console.log("settings shown")
    let container = yb_toggle2WayContainer('history');
    if (container[0] === "closing"){
        history.pushState(null, null, "/");
        container[1].setAttribute("data-state", "empty");
    } else {
        console.log("not closing")
        let container_content = container[1].querySelector(".yb-2Way-content");
        container[1].setAttribute("data-state", "history");
        $(container_content).load("/profile/templates/history/")
        history.pushState({}, "", '/profile/history/');
    }
}

function yb_showStuffPage() {
    console.log("settings shown")
    let container = yb_toggle2WayContainer('stuff');
    if (container[0] === "closing"){
        history.pushState(null, null, "/");
        container[1].setAttribute("data-state", "empty");
    } else {
        console.log("not closing")
        let container_content = container[1].querySelector(".yb-2Way-content");
        container[1].setAttribute("data-state", "stuff");
        $(container_content).load("/profile/templates/stuff/")
        history.pushState({}, "", '/profile/stuff/');

    }
}

function yb_messageButton() {
    yb_handleMessageClick();
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


$(document).ready(function () {
    MENU_BUTTON.addEventListener('click', yb_toggleMainMenu);
    SETTINGS_BUTTON.addEventListener("click", yb_toggleSettingsMenu);
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
