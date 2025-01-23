/*
    File: yb_menu.js
    Yourbit, LLC, 2023
    Author: Austin Chaney
    Created: 11/12/2023
    Modified: 7/11/2024
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


const BUTTON_FUNCTIONS = {
    "bitstream": yb_goHome,
    "messages": yb_showMessagePage,
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
    yb_navigateTo("content-container", "support-center");
    yb_toggleMainMenu();
}

$(document).ready(function () {

    try {
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
    } catch {
        console.log("User not logged in");
    }
});
