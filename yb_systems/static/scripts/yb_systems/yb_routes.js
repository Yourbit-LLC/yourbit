/*
            

            main/yb-routes.js
            Yourbit, LLC
            11/25/2022

            YB URLS contains the front end code for managing and passing URLS. 
            The states pushed match backend django urls so that when the back 
            button is pressed, or the page is refreshed, the correct content 
            is received.

            Load Order:
                1. yb_routes.js **You are Here**
                2. yb_master.js
                3. yb_create.js
                4. yb_events.js

            How to Use:
                1. Add a url function which contains:
                    - A try catch block containing the following:
                        - yb_purgeScripts()
                        - yb_clearContainer()
                    - A call to load content
                    - A call to set the url
                    - A call to set the location in yb_sessions
                    - Push the state to the history object

                2. Add the above url function call to the yb_navigateTo 
                function

                3. Add the yb_navigateTo function call to any event within
                the yb_events.js file
                    -ex: 
                        MENU_BUTTON.addEventListener(
                            "click", 
                            yb_navigateTo, 
                            "destination", 
                            {data: "data"}
                        );

*/
const LOADING_CORE = document.getElementById("yb-loading-main");
/*
    Core UI Functions

*/

//Show Loading
function yb_showLoadingCore(){
    LOADING_CORE.style.display = "block";
}

//Hide Loading
function yb_hideLoadingCore(){
    LOADING_CORE.style.display = "none";
}

function yb_applyStyle(source){
    let yb_style = yb_page_styles[source]
    let element_id = source + "-style-sheet"
    $("#content-container").append(`<link rel="stylesheet" id = "${element_id}" type="text/css" href="${yb_style}"/>`);

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

//home chat
function home_chat_url(data){

    try {
        yb_purgeScripts();
    } catch (error) {
        console.log(error);
    }
    $("#content-container").empty();
    $("#page-header").remove();

    history.pushState({}, "", "/bitstream/chat/")
    yb_setSessionValues("location", "home");
    yb_setSessionValues("space", "chat");

    //load source
    
    
}

//home video
function home_video_url(data){
    try {
        yb_purgeScripts();
    } catch (error) {
        console.log(error);
    }
    
    //clear content
    $("#content-container").empty();
    $("#page-header").remove();

    //set url
    history.pushState({}, "", "/bitstream/video/")
    yb_setSessionValues("location", "home");
    yb_setSessionValues("space", "video");
    //load source
    
    
}

//home photo
function home_photo_url(data){
    try {
        yb_purgeScripts();
    } catch (error) {
        console.log(error);
    }
    $("#content-container").empty();
    $("#page-header").remove();
    history.pushState({}, "", "/bitstream/photo/")

    yb_setSessionValues("location", "home");
    yb_setSessionValues("space", "photo");

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

//profile chat
function profile_chat_url(data){
    yb_setSessionValues("location", "profile")
    yb_setSessionValues("space","chat")
    $("#content-container").html('');
    history.pushState({}, "", `/profile/${data.username}/chat/`)
    PAGE_SCRIPT.src = setSource("profile")

}

//profile video
function profile_video_url(data){
    $("#content-container").html('');
    yb_setSessionValues("location", "profile")
    yb_setSessionValues("space","video")
    history.pushState({}, "", `/profile/${data.username}/video/`)
    PAGE_SCRIPT.src = setSource("profile")

}

//profile photo
function profile_photo_url(data){
    $("#content-container").html('');
    yb_setSessionValues("location", "profile")
    yb_setSessionValues("space","photo")
    history.pushState({}, "", `/profile/${data.username}/photo/`)
    PAGE_SCRIPT.src = setSource("profile")


}


//connections
function connections_url(data){
    
    let base_url = getBaseURL();

    yb_setSessionValues("location","connections");

    //Remove any page scripts
    try {
        yb_purgeScripts(yb_clearContainer);
    } catch (error) {
        console.log(error);
    }

    $("#content-container").load(`${base_url}/profile/templates/connections-html/`)
    history.pushState({}, "", `/profile/connections/`);
    let menu = document.getElementById("profile-menu");
    
    if (menu.style.visibility === "visible") {
        yb_show_profile_menu();
    }
    
    


}

//connections friends
function connections_friends_url(data){
    $("#content-container").html('');

    yb_setSessionValues("location", "connections_friends");
    yb_setSessionValues("filter", "friends")
    history.pushState({}, "", `/connections/friends/`);
    PAGE_SCRIPT.src = setSource("connections");


}

//connections following
function connections_following_url(data){
    $("#content-container").html('');
    yb_setSessionValues("location", "connections_following");
    yb_setSessionValues("filter", "following");
    history.pushState({}, "", `/connections/following/`);


}

//connections followers
function connections_followers_url(data){
    yb_setSessionValues("location", "connections_followers");
    yb_setSessionValues("filter", "followers");
    $("#content-container").html('');
    history.pushState({}, "", `/connections/followers/`)
    

}
  

//connections community
function connections_community_url(data){
    $("#content-container").html('');
    yb_setSessionValues("location", "connections_community");
    yb_setSessionValues("filter", "community")
    history.pushState({}, "", `/connections/community/`);
    

}

//settings
function settings_url(data){
    //Remove any page scripts
    try {
        yb_purgeScripts(yb_clearContainer);
    } catch (error) {
        console.log(error);
    }

    //Clear Screen
    
    $("#content-container").load(`${base_url}/settings/templates/settings-html/`);
    yb_setSessionValues("location", "settings")
    let menu = document.getElementById("profile-menu");
    
    if (menu.style.visibility === "visible") {
        yb_show_profile_menu();
    }
    
    history.pushState({}, "", `/settings/`)
    

}

//feed settings
function settings_feed_url(data){
    $("#content-container").html('');
    $("#content-container").load(`${base_url}/settings/templates/feed-settings-html/`);
    yb_setSessionValues("location", "settings_feed");
    history.pushState({}, "", `/settings/feed/`)

}

//account settings
function settings_account_url(data){
    $("#content-container").html('');
    $("#content-container").load(`${base_url}/settings/templates/account-settings-html/`);
    yb_setSessionValues("location","settings_account");
    history.pushState({}, "", `/settings/account/`);
    
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



function rewards_url(data){
    try {
        yb_purgeScripts(yb_clearContainer);
    } catch (error) {
        console.log(error);
    }

    
    $("#content-container").load(`${base_url}/rewards/templates/rewards-html/`);
    
    let user_id = yb_getSessionValues("id");

    yb_setSessionValues("location","rewards");

    history.pushState({}, "", '/rewards/');

        
    if (menu.style.visibility === "visible") {
        yb_show_profile_menu();
    }
    

}

//Browse perks
function rewards_browse_url(data){
    $("#content-container").html('');
    yb_setSessionValues("location","browse_perks");
    history.pushState({}, "", '/rewards/browse/')
    
}

function yb_navigateTo(container, template, data=null){
    if ("2way" in container) {
        if (data === null){
            yb_launch2WayContainer(template);
        } else {
            yb_launch2WayContainer(template, data);
        }
    } else if ("content-container" in container) {
        if (data === null) {
            yb_goToPage(template);
        } else {
            yb_goToPage(template, data);
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
}