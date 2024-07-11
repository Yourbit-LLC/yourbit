/*
            

            main/yb_routes.js
            Yourbit, LLC
            Created: 11/25/2022
            Modified: 7/11/2024

*/

const LOADING_CORE = document.getElementById("yb-loading-main");
/*
    Core UI Functions

*/


//Register templates to be loaded into the content container
const CORE_TEMPLATE_INDEX = {
    "home": "/bits/templates/bitstream/",
    "customize-main": "/customize/templates/customize/main/",
    "profile": `/profile/templates/profile/`,
    
};

//Register templates to be loaded into the drawer
const DRAWER_CONTENT = {
    "browse-stickers": "/customize/stickers/browse/",
    "profile-connect": `/profile/templates/connect_menu/`,
}

//Register templates to be loaded into a 2Way Container
const TWO_WAY_INDEX = {
    "create": 
        {
            "template" : "/core/create-menu/",
            "url" : "/create/"
        },
    "messages" : 
        {
            "template" : "/messages/inbox/",
            "url" : "/messages/"
        },
    "notifications": 
        {
            "template" : "/notify/template/list/",
            "url" : "/notify/"
        },
    "conversation": 
        {
            "template" : "/messages/templates/conversation/",
            "url" : "/messages/conversation/"
        },
    "people":
        {
            "template" : "/profile/templates/people/",
            "url" : "/profile/people/"
        },
    "orbits": 
        {
            "template" : "/profile/templates/orbits/",
            "url" : "/profile/orbits/"
        },
    "settings": 
        {
            "template" : "/settings/root/",
            "url" : "/settings/"
        },
    "stuff": 
        {
            "template" : "/profile/templates/stuff/",
            "url" : "/profile/stuff/"
        },
    "history": 
        {
            "template" : "/profile/templates/history/",
            "url" : "/profile/history/"
        },

    "support-center":
        {
            "template" : "/support/templates/support-center/",
            "url" : "/support/"
        },
    "bug-report":
        {
            "template" : "/support/templates/bug-report/",
            "url" : "/support/bug-report/"
        },
    "feature-request":
        {
            "template" : "/support/templates/feature-request/",
            "url" : "/support/feature-request/"
        },
    "cropper-bit":
        {   
            "template" : "/photo/templates/cropper/bit/",
            "url" : ""
        },

    "cropper-profile":
        {
            "template" : "/photo/templates/cropper/profile/",
            "url" : ""
        },

    "cropper-desktop-background":
        {
            "template" : "/photo/templates/cropper/desktop-wallpaper/",
            "url" : ""
        },

    "cropper-mobile-background":
        {
            "template" : "/photo/templates/cropper/background/",
            "url" : ""
        },

    "profile-image-upload":
        {
            "template" : "/customize/templates/profile-image/",
            "url" : ""
        },

    "background-image-upload":
    {
        "template" : "/customize/templates/wallpaper/",
        "url" : ""
    },
    
          
};

function yb_goToPage(page, data=null) {

    if (data != null) {
        $(CONTENT_CONTAINER).load(CORE_TEMPLATE_INDEX[page] + data.toString() + "/");
    } else {
        $(CONTENT_CONTAINER).load(CORE_TEMPLATE_INDEX[page]);
    }
}


//Show Loading
function yb_showLoadingCore(){
    LOADING_CORE.style.display = "block";
}

//Hide Loading
function yb_hideLoadingCore(){
    LOADING_CORE.style.display = "none";
}


function yb_purgeScripts(callback){
    let loaded = yb_getLoaded();
    let location = yb_getSessionValues("location");
    let content_container = document.getElementById("content-container");
    if (loaded) {
        //Remove any page scripts
        let scripts = document.getElementsByClassName("page-script");
        console.log(scripts)
        let script_count = scripts.length;
        console.log(script_count)
        for (let i = script_count - 1; i >= 0; i--) {
            let script = scripts[i];
            console.log(script);
            if (location === "home" || location === "profile") {
                content_container.removeEventListener("scroll", debounced_eventPause);
                content_container.removeEventListener("scroll", debounced_getDisplay);
            }
            script.disabled = true;
            script.parentNode.removeChild(script);

        }

        //Invoke callback
        callback();

    }
}

function yb_clearContainer(){
    $("#content-container").empty();
    $("#page-header").remove();
    
}

//home
function home_url(data){
    try {
        yb_purgeScripts(yb_clearContainer);
    } catch (error) {
        console.log(error);
    }
    
    //load content

    $('#content-container').load('/bitstream/feed-html/');
    
    let menu = document.getElementById("profile-menu");
    
    if (menu.style.visibility === "visible") {
        yb_show_profile_menu();
    }
    
    
    //set url
    history.pushState({}, "", "/bitstream/");

    yb_setSessionValues("location", "home");

    //load source


}


/*

        ---Profile Page Routes---

*/


//profile
function profile_url(data){
    
    yb_setSessionValues("location", "profile");
    yb_setSessionValues("space", "global");
    yb_setSessionValues("profile-username", data.username);

    let base_url = getBaseURL();
    try {
        yb_purgeScripts(yb_clearContainer);
    } catch (error) {
        console.log(error);
    }

    
    $("#content-container").load(`${base_url}/profile/templates/profile/${data.username}/`)
    $("#page-header").remove();
    history.pushState({}, "", `/profile/${data.username}/`)

}

//customize
function customize_url(data){
    try {
        yb_purgeScripts(yb_clearContainer);
    } catch (error) {
        console.log(error);
    }
    console.log("function");
    
    $("#content-container").load(`${base_url}/customize/templates/main/`);
    yb_setSessionValues("location","customize");
    history.pushState({}, "", `/customize/`);
    

}

//customize
function customize_profile_url(data=null){
    try {
        yb_purgeScripts(yb_clearContainer);
    } catch (error) {
        console.log(error);
    }
    console.log("function");
    
    $("#content-container").load(`${base_url}/customize/templates/profile/`);
    yb_setSessionValues("location","customize-profile");
    history.pushState({}, "", `/profile/customize/profile/`);
    

}

function customize_profile_splash_url(data=null){
    try {
        yb_purgeScripts(yb_clearContainer);
    } catch (error) {
        console.log(error);
    }
    console.log("function");
    
    $("#content-container").load(`${base_url}/customize/templates/profile-splash/`);
    yb_setSessionValues("location","customize-profile");
    history.pushState({}, "", `/customize/profile/`);
    
}

function customize_bit_url(data=null){
    try {
        yb_purgeScripts(yb_clearContainer);
    } catch (error) {
        console.log(error);
    }
    console.log("function");

    $("#content-container").load(`${base_url}/customize/templates/customize-bit/`);
    yb_setSessionValues("location","customize-bit");
    history.pushState({}, "", `/customize/bit/`);
}

function customize_ui_url(data=null){
    try {
        yb_purgeScripts(yb_clearContainer);
    } catch (error) {
        console.log(error);
    }
    console.log("function");

    $("#content-container").load(`${base_url}/customize/templates/customize-ui/`);
    yb_setSessionValues("location","customize-ui");
    history.pushState({}, "", `/customize/ui/`);
}


function yb_goHome() {
    yb_navigateTo("content-container", "home");
}

function yb_toggleSettingsMenu() {
    yb_navigateTo("2way", "settings");
}

function yb_showPeoplePage() {
    yb_navigateTo("2way", "people");
}

function yb_showOrbitsPage() {
    yb_navigateTo("2way", "orbits");
}

function yb_showHistoryPage() {
    yb_navigateTo("2way", "history");
}

function yb_showStuffPage() {
    yb_navigateTo("2way", "stuff");
}

function yb_showMessagePage() {
    yb_navigateTo("2way", "messages");
}

function yb_navigateTo(container, template, data=null){
    if ("2way" in container) {
        if (data === null){
            yb_launch2WayContainer(template);
        } else {
            yb_launch2WayContainer(template, data);
        }
    } else if ("content-container" in container) {
        CONTENT_CONTAINER.innerHTML = "";

        if (data === null) {
            yb_goToPage(template);

        } else {
            yb_goToPage(template, data);
        }

        if (template != "profile") {
            yb_revertUIColor();
        } 
    } else if ("drawer" in container) {

        if (data === null) {
            yb_openDrawer(template);
        } else {
            yb_openDrawer(template, data);
        }
    } else if ("card" in container) {
        if (data === null) {
            yb_openCard(template);
        } else {
            yb_openCard(template, data);
        }
    }

    yb_setSessionValues("location", template);


}