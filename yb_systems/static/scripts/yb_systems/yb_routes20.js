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


/* 

    Register templates to be loaded into the content container.
    The content container is the main container on Yourbit. It
    displays the bitstream, for example.

*/
const CORE_TEMPLATE_INDEX = {
    "home": {
        "template": "/bits/templates/bitstream/",
        "url": "/bitstream/"
    },
    "customize-main": 
        {
            "template": "/customize/templates/main/",
            "url": "/customize/"
        },
    "profile": {
        "template": `/profile/templates/profile/{{data}}/`,
        "url": "/profile/{{data}}/"
    },
    "support-center": {
        "template": "/support/templates/support-center/",
        "url": "/support/"
    },
    "bit-focus": {
        "template": "/bits/templates/bit/view/{{data}}/",
        "url": "/bits/view/{{data}}/"
    },
    "search": {
        "template":"/search/templates/search/",
        "url":"/search/"
    }
        
    
};

/*  

    Register templates to be loaded into the drawer. A drawer is
    typically used as a menu of additional options, but can also
    be used for browsing visual thumbnails.

*/
const DRAWER_CONTENT = {
    "browse-stickers": "/customize/stickers/browse/",
    "profile-connect": `/profile/templates/connect_menu/`,
    "profile-text-edit": "/customize/templates/profile/edit/font/text/",
    "profile-title-edit": "/customize/templates/profile/edit/title/",
    "profile-button-edit": "/customize/templates/profile/edit/button/",
    "bit-options": "/bits/templates/options/{{data}}/",
    "list-clusters": "/bits/templates/select-clusters/",
    "share-bit": "/bits/templates/share-menu/{{data}}/",
    "new-image": "/photo/templates/menus/new-image/",
}

/*
    Below is a directory of templates to be loaded into a 2Way Container

    URL Schema: /<app>/templates/<template-name>/<filter[optional]>/

    When creating urls to a 2Way Container within a urls.py file, use the above format to ensure
    the template is loaded correctly when using filter options

    The template key is used to load the template into the container
    The url key is used to set the url in the browser
*/
const TWO_WAY_INDEX = {
    "background-image-upload": {
        "template": "/customize/templates/wallpaper/",
        "url": ""
    },
    "bb-customize-bit": {
        "template": "/bits/templates/builder/customize/",
        "url": ""
    },
    "bit-builder-thumbnail": {
        "template": "/bits/templates/builder/thumbnail/",
        "url": ""
    },
    "bit-publish-options": {
        "template": "/bits/templates/builder/options/",
        "url": ""
    },
    "bug-report": {
        "template": "/support/templates/report-bug/",
        "url": "/support/bug-report/"
    },
    "change-password": {
        "template": "/settings/templates/change-password/",
        "url": ""
    },
    "cluster": {
        "template": "/bits/templates/cluster/{{data}}/",
        "url": "/bits/cluster/{{data}}/"
    },
    "cluster-settings": {
        "template": "/settings/templates/cluster/{{data}}/",
        "url": ""
    },
    "conversation": {
        "template": "/messages/templates/conversation/{{data}}/",
        "url": "/messages/conversation/{{data}}/"
    },
    "conversation-settings": {
        "template": "/messages/templates/conversation-settings/{{data}}/",
        "url": ""
    },
    "create": {
        "template": "/core/create-menu/",
        "url": "/create/"
    },
    "create-bit": {
        "template": "/core/templates/create/bit/",
        "url": "/create/bit/"
    },
    "create-cluster": {
        "template": "/core/templates/create/cluster/",
        "url": "/create/cluster/"
    },
    "create-orbit": {
        "template": "/core/templates/create/orbit/",
        "url": "/create/orbit/"
    },
    "create-theme": {
        "template": "/customize/templates/create-theme/",
        "url": ""
    },
    "cropper-bit": {
        "template": "/photo/templates/cropper/bit/",
        "url": ""
    },
    "cropper-desktop-background": {
        "template": "/photo/templates/cropper/desktop-wallpaper/",
        "url": ""
    },
    "cropper-mobile-background": {
        "template": "/photo/templates/cropper/mobile-wallpaper/",
        "url": ""
    },
    "cropper-profile": {
        "template": "/photo/templates/cropper/profile/",
        "url": ""
    },
    "edit-bit": {
        "template": "/bits/templates/edit-bit/{{data}}/",
        "url": "/bits/edit/{{data}}/"
    },
    "feature-request": {
        "template": "/support/templates/request-feature/",
        "url": "/support/feature-request/"
    },
    "history": {
        "template": "/profile/templates/history/",
        "url": "/profile/history/"
    },
    "manage-keys": {
        "template": "/accounts/templates/manage-keys/",
        "url": ""
    },
    "messages": {
        "template": "/messages/inbox/",
        "url": "/messages/"
    },
    "monetize-bit": {
        "template": "/bits/templates/builder/monetization/",
        "url": ""
    },
    "notifications": {
        "template": "/notify/template/list/",
        "url": "/notify/"
    },
    "orbit-setup": {
        "template": "/profile/templates/orbit-setup/",
        "url": ""
    },
    "orbits": {
        "template": "/profile/templates/orbits/",
        "url": "/profile/orbits/"
    },
    "people": {
        "template": "/profile/templates/people/",
        "url": "/profile/people/"
    },
    "profile-image-upload": {
        "template": "/customize/templates/profile-image/",
        "url": ""
    },
    "schedule-bit": {
        "template": "/bits/templates/builder/scheduling/",
        "url": ""
    },
    "settings": {
        "template": "/settings/root/",
        "url": "/settings/"
    },

    "profile-settings": {
        "template": "/settings/templates/profile/",
        "url": "/settings/profile/"
    },
    "stuff": {
        "template": "/profile/templates/stuff/",
        "url": "/profile/stuff/"
    },
    "support-center": {
        "template": "/support/templates/support-center/",
        "url": "/support/"
    },
    "video-setup": {
        "template": "/video/templates/video-setup/",
        "url": ""
    }
};


/*
    Below is a directory of templates to be loaded into list containers

    URL Schema: /<app>/templates/<template-name>/<filter[optional]>/

    Do not include the filter in the index it will be applied by the load list function

    When creating urls to a list within a urls.py file, use the above format to ensure 
    the list is loaded correctly when using filter options
*/
const LIST_TEMPLATE_INDEX = {
    "people": "/profile/people-list/",
    "orbits": "/profile/templates/orbits/", //Needs to be updated to match people list format "/orbits-list/"
    "history": "/profile/history-list/",
    "conversations": "/messages/conversations-list/",  
    "contacts": "/messages/list/contacts/",
    "messages": "/messages/list/message-list/",

}

//Internal back tracking variables
var last_page = "home";
var last_data = null;
var last_container = "content-container";

//Current page tracking variables to be sent to server on page load for cross device continuity
var current_page = "home";
var current_data = null;
var current_container = "content-container";

function yb_sendTaskData(data, url) {
    let csrf_token = getCSRF();
    $.ajax({
        type: "POST",
        url: url,
        data: data,
        headers: {
            'X-CSRFToken': csrf_token
        },
        success: function(response) {
            console.log(response);
        },
        error: function(response) {
            console.log(response);
        }
    });
}

function yb_syncTask(template, page_data=null) {
    let location = yb_getSessionValues("location");
    let space = yb_getSessionValues("space");
    let syncData;
    if (template === "profile") {
        syncData = page_data;
    } else {
        syncData = current_data;
    }
    
    let data = {
        location:location, 
        space:space, 
        current_page:current_page,
        current_data:syncData,
        current_container:current_container
    };
    yb_sendTaskData(data, "/systems/tasks/sync/");
}

function yb_goToPage(page, data=null) {
    if (page == "home") {
        CONTENT_CONTAINER_A.classList.add("show");
        CONTENT_CONTAINER_B.classList.remove("show");
        yb_showMobileUI()
        yb_setSessionValues("fullscreen", false);
        if (CONTENT_CONTAINER_A.innerHTML == "") {
        
            if (data != null) {
                $(CONTENT_CONTAINER_A).load(CORE_TEMPLATE_INDEX[page].template + data.toString() + "/");
            } else {
                $(CONTENT_CONTAINER_A).load(CORE_TEMPLATE_INDEX[page].template);
            }
        } 
        
        
    } else {
        CONTENT_CONTAINER_B.classList.add("show")
        CONTENT_CONTAINER_A.classList.remove("show")
        if (data != null) {
            try {
                $(CONTENT_CONTAINER_B).load(CORE_TEMPLATE_INDEX[page].template.replace("{{data}}", data.toString()));
            } catch (error) {
                console.log(error);
                $(CONTENT_CONTAINER_B).load(CORE_TEMPLATE_INDEX[page].template + data.toString() + "/");
            }
        } else {
            $(CONTENT_CONTAINER_B).load(CORE_TEMPLATE_INDEX[page].template);
        }
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

function yb_clearContainer(type){
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

    $('#content-container-a').load('/bitstream/feed-html/');
    
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

    
    $("#content-container-b").load(`${base_url}/profile/templates/profile/${data.username}/`)
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
    
    $("#content-container-b").load(`${base_url}/customize/templates/profile/`);
    CONTENT_CONTAINER_A.style.display="none";
    CONTENT_CONTAINER_B.style.display="block";
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
    
    $("#content-container-b").load(`${base_url}/customize/templates/profile-splash/`);
    CONTENT_CONTAINER_A.classList.remove("show")
    CONTENT_CONTAINER_B.classList.add("show")
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

    $("#content-container-b").load(`${base_url}/customize/templates/customize-bit/`);
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

    $("#content-container-b").load(`${base_url}/customize/templates/customize-ui/`);
    yb_setSessionValues("location","customize-ui");
    history.pushState({}, "", `/customize/ui/`);
}

//Below were legacy function names before the creation of yb_navigateTo() which 
// were adapted to the new functionality to account for refactoring changes
function yb_goHome() {
    yb_toggleMainMenu();
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


//Function to load a content, contact, or message list into a container.
// Uses list template index to reference registered pages available for navigation
function yb_loadList(container, template, filter=null){
    let url = LIST_TEMPLATE_INDEX[template];

    if (filter === null) {
        $(container).load(template_url);
    } else {
        $(container).load(template_url + filter + "/");
    }
}

//Function to set the last location that the user visited for the universal back function
function yb_setLast(container, page, data) {
    last_container = current_container;
    last_page = current_page;
    last_data = current_data;

    current_container = container;
    current_page = page;
    current_data = data;
    
    if (USER_AUTHORIZED == "true") {
        yb_syncTask(page, data);
    }
}

//Function to reload containers as needed to refresh data or catch failures
function yb_reload(container) {
    if (container === "2way") {
        let active_container = yb_getActive2Way();
        let page = active_container.getAttribute("data-state");
        let container_content = active_container.querySelector(".yb-2way-content");
        container_content.innerHTML = "";
        $(container_content).load(TWO_WAY_INDEX[page].template);
    }

    else if (container === "content-container") {
        let page = yb_getSessionValues("location");
        $(CONTENT_CONTAINER_B).load(CORE_TEMPLATE_INDEX[page].template);

    }

}

//Universal navigate to function for accessing pages in the template Indexes
function  yb_navigateTo(container, template, data=null, reloadable=true) {
    if (container.includes("2way")) {
        yb_setLast(container, template, data);

        //Check if the data is null, if it is then we need to set the url to the template url
        if (data != null) {
            history.pushState({container:container, template:template, data:data}, template, TWO_WAY_INDEX[template]["url"].replace("{{data}}", data.toString()));
        } else {
            history.pushState({container:container, template:template, data:data}, template, TWO_WAY_INDEX[template]["url"]);
        }
        
        //Check if page, only time navigateTo should be used for pages is when going back
        if (container.includes("page")){
            yb_2WayPage(1); //Any time the history state includes page it will typically be the second page
        } else {
            
            if (data === null){
                let this_container = yb_launch2WayContainer(template);
                active_cotainer = "2way";
                if (this_container == "launched") {
                    if (!window.matchMedia('(display-mode: standalone)').matches) {
                        let header = document.getElementById("div-heaader");
                        header.style.paddingTop = "70px";
                    }
                }
            } else {
                let this_container = yb_launch2WayContainer(template, data);

                if (this_container == "launched") {
                    if (!window.matchMedia('(display-mode: standalone)').matches) {
                        let header = document.getElementById("div-heaader");
                        header.style.paddingTop = "70px";
                    }
                }
            }
        }
    } else if (container.includes("content-container")) {
        CONTENT_CONTAINER_B.innerHTML = "";
        console.log("launching page in content container");
        yb_setSessionValues("location", template)
        yb_setLast(container, template, data);
        active_cotainer = "content-container";
        if (data != null) {
            history.pushState({container:container, template:template, data:data}, template, CORE_TEMPLATE_INDEX[template]["url"].replace("{{data}}", data.toString()));
        } else {
            history.pushState({container:container, template:template, data:data}, template, CORE_TEMPLATE_INDEX[template]["url"]);
        }
        
   
        if (data === null) {

            yb_goToPage(template);

        } else {

            yb_goToPage(template, data);
        }

        if (template != "profile") {
            if (USER_AUTHORIZED == "true") {
                yb_revertUIColor();
            }
        } 


    } else if (container.includes("drawer")) {

        if (data === null) {
            if (reloadable) {
                yb_openDrawer(template);
            } else {
                yb_openDrawer(template, reloadable=false);
            }
            
        } else {
            if (reloadable) {
                yb_openDrawer(template, data);
            } else {
                yb_openDrawer(template, data, false);
            }
            
        }
    } else if (container.includes("card")) {
        if (data === null) {
            yb_openCard(template);
        } else {
            yb_openCard(template, data);
        }
    }

    yb_setSessionValues("location", template);
}

//Function for getting the next video in a playlist or bitstream
function yb_getNextVideo() {
    //Video ID is retrieved in the list of videos queued to play
    let video_id = VIDEO_QUEUE.shift();
    
    //Video object is the json data for this video bit retrieved from local video_json
    let video_object = video_json[video_id];

    //Retrieve data elements of the video player for exchanging out new data
    let video_player = document.getElementById("yb-player");
    let video_title = document.getElementById("yb-player-title");
    let video_desc = document.getElementById("yb-player-description");
    let user_name = document.getElementById("yb-player-display-name");
    let username = document.getElementById("yb-player-username");
    let pfp = document.getElementById("yb-player-pfp");
    let air_date = document.querySelector("#time-posted-");

    //Replace the inner HTML of the player elements with new video data
    user_name.innerHTML = video_object.profile.display_name;
    username.innerHTML = video_object.profile.username;
    video_title.innerHTML = video_object.title;
    video_desc.innerHTML = video_object.description;
    air_date.innerHTML = video_object.time; 
    pfp.src = video_object.custom.profile_image.small_thumbnail_ext;

    //Change attributes of video player for newly loaded content
    video_player.setAttribute("playback-id", video_object.video_upload.ext_id);
    video_player.setAttribute("data-id", video_id.id);
    video_player.setAttribute("data-username", video_id.profile.username);
    video_player.setAttribute("data-title", video_id.title);


    //Update comments section for newly loaded content
    yb_getComments(false, video_id, "player-comments")

    //Play the current video
    video_player.play();
}

//Universal function for back navigation
function yb_goBack(page=false) {
    if (page) {
        yb_navigateTo("2way-page", last_page, last_data);
    } else {
        yb_navigateTo(last_container, last_page, last_data);
    }
}

window.addEventListener('popstate', function(event) {
    console.log(event.state);
    yb_navigateTo(event.state.container, event.state.template, event.state.data);      

});