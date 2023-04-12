/*
            

            main/yb-routes.js
            Yourbit, LLC
            11/25/2022

            YB URLS contains the front end code for managing and passing URLS. The states pushed
            match backend django urls so that when the back button is pressed in the broswer the
            correct content is received.
        


*/
yb_page_scripts = {
    "home" : "/static/scripts/yb-home.js/",
    "profile": "/static/scripts/yb-profiles.js/",
    "search": "/static/scripts/yb-search.js/",
    "customize": "/static/scripts/yb-customize.js",
    "connections": "/static/scripts/yb-connections.js",
    "settings": "/static/scripts/yb-settings.js",
    "messages": "/static/scripts/yb-messages.js",
    "rewards": "/static/scripts/yb-rewards.js/"

}

yb_page_styles = {
    "profile":"/static/css/yourbit_profile.css/",
    "posts":"/static/css/yourbit_posts.css/",
    "settings": "/static/css/yourbit_settings.css/",
    "results":"/static/css/search_results.css/",
    "personalization":"/static/css/personalization-new.css/",
    
}

function yb_appendScript(source){
    console.log("ran create script");
    let current = document.getElementById("page-script");

    let script_source = yb_page_scripts[source];
    let new_script = document.createElement("script");
    
    new_script.setAttribute("id", "page-script");
    new_script.setAttribute("src", script_source);

    $("page-script-container").html(new_script);
}

function yb_applyStyle(source){
    let yb_style = yb_page_styles[source]
    let element_id = source + "-style-sheet"
    $("#content-container").append(`<link rel="stylesheet" id = "${element_id}" type="text/css" href="${yb_style}"/>`);

}




//home
function home_url(data){
    console.log("home routed")
    //clear screen
    $("#content-container").html("");
    $("#page-header").remove();
    let container = document.getElementByIletd('content-container');
    let htmlUrl = `${base_url}/feed/feed-html/`
    let request = new XMLHttpRequest();
    request.open('GET', htmlUrl, true);
    request.onload = function() {
    if (request.status >= 200 && request.status < 400) {
        container.innerHTML = request.responseText;
    }
    };
    request.send();
    
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
    $("#content-container").empty();
    $("#page-header").remove();
    history.pushState({}, "", "/bitstream/chat/")
    yb_setSessionValues("location", "home");
    yb_setSessionValues("space", "chat");

    //load source
    
    
}

//home video
function home_video_url(data){
    
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



function getProfile() {
    let user_id = getUserID();
    console.log(user_id)
    let url = `${base_url}/api/profiles/${user_id}/`



}

//profile
function profile_url(data){
    
    console.log("reached url");
    yb_setSessionValues("location", "profile");
    yb_setSessionValues("space", "global");
    yb_setSessionValues("profile-username", data.username)
    $("#content-container").empty();
    $("#content-container").load(`${base_url}/user_profile/templates/user_profile/profile.html`)
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
    console.log("url located");
    let base_url = getBaseURL();

    yb_setSessionValues("location","connections");
    

    $("#content-container").html('');
    $("#content-container").load(`${base_url}/user_profile/templates/user_profile/connections.html`)
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
    $("#content-container").html('');
    $("#content-container").load(`${base_url}/settings/templates/settings/settings.html/`);
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
    $("#content-container").load(`${base_url}/settings/templates/settings/feed_settings.html/`);
    yb_setSessionValues("location", "settings_feed");
    history.pushState({}, "", `/settings/feed/`)

}

//account settings
function settings_account_url(data){
    $("#content-container").html('');
    $("#content-container").load(`${base_url}/settings/templates/settings/account_settings.html/`);
    yb_setSessionValues("location","settings_account");
    history.pushState({}, "", `/settings/account/`);
    
}

//customize
function customize_url(data){
    console.log("function");
    $("#content-container").empty();
    $("#content-container").load(`${base_url}/user_profile/templates/user_profile/personalize_profile.html/`);
    yb_setSessionValues("location","customize");
    history.pushState({}, "", `/profile/customize/`);
    

}

//profile info
function settings_profile_url(data){
    $("#content-container").html('');
    $("#content-container").load(`${base_url}/settings/templates/settings/profile_info.html/`);
    yb_setSessionValues("location","settings_profile");
    history.pushState({}, "", `/settings/profile/`)

}



//privacy settings
function settings_privacy_url(data){
    $("#content-container").html('');
    $("#content-container").load(`${base_url}/settings/templates/settings/privacy_settings.html/`);
    yb_setSessionValues("location","settings_privacy");
    history.pushState({}, "", `/settings/privacy/`)
    

}

//subscription
function settings_subscription_url(data){
    $("#content-container").html('');
    yb_setSessionValues("location","settings_subscription");
    $("#content-container").load(`${base_url}/settings/templates/settings/subscription_settings.html/`);
    history.pushState({}, "", `/settings/subscriptions/`);
    
}

//money settings
function settings_money_url(data){
    $("#content-container").html('');
    $("#content-container").load(`${base_url}/settings/templates/settings/feed-settings.html/`);
    yb_setSessionValues("location","settings_money");
    history.pushState({}, "", `/settings/feed/`);
    


}

//Messages
function messages_inbox_url(){
    $("#content-container").html('');
    $("#content-container").load(`${base_url}/messenger/templates/messenger/messages.html/`);
    yb_setSessionValues("location","inbox");
    yb_createScript("messages");
    let menu = document.getElementById("profile-menu");
    
    if (menu.style.visibility === "visible") {
        yb_show_profile_menu();
    }

    let ui_status = yb_getSessionValues("ui")
    
    if (ui_status === "hidden") {
        headerDropIn();
    }
    history.pushState({}, "", '/messages/inbox/');
    
}

//Private Inbox
function messages_public_inbox_url(data){
    $("#content-container").html('');
    yb_setSessionValues("location","public_inbox");
    history.pushState({}, "", '/messages/inbox/public/');
    

}

//Public Inbox
function messages_private_inbox_url(data){
    $("#content-container").load(`${base_url}/messenger/templates/messenger/conversation.html/`)
    yb_setSessionValues("location","private_inbox");
    history.pushState({}, "", '/messages/inbox/private/')
    
}

//Conversation
function messages_conversation_url(id, username){
    yb_setSessionValues("conversation", id)
    yb_setSessionValues("that-username", username)
    $("#content-container").load(`${base_url}/messenger/templates/messenger/conversation.html/`);
    yb_setSessionValues("location","conversation");
    history.pushState({}, "", `/conversation/${id}/`)
    
}

//New conversation
function messages_new_conversation_url(data){
    $("#content-container").empty();
    $("#content-container").load(`${base_url}/messenger/templates/messenger/new_conversation.html/`);
    yb_setSessionValues("location","new_conversation");
    history.pushState({}, "", `/messages/new/`)
}

//Rewards
function yb_initPageData(user_id) {
    let url = `/api/rewards/${user_id}/`
    fetch(url)
    .then((resp) => resp.json())
    .then(function(data){

        let point_balance = data.point_balance
        if (point_balance < 1) {
            point_balance = 0;
        }
        //Set point balance
        $("#points-balance").html(`
        ${data.point_balance}<small>pts</small>
        `)
        //set level progress
        $("#level-progress").html(`
        ${data.rewards_earned}/1500
        `)
        //update progress bar
        $("#progress-container").html(`
            Level ${data.level}  <progress max="1500" value="${data.rewards_earned}"></progress>  Level ${data.level+1}
        `)

    });
}

function rewards_url(data){
    
    $("#content-container").html('');
    $("#content-container").load(`${base_url}/rewards/templates/rewards/rewards.html/`);
    
    let user_id = yb_getSessionValues("id");

    yb_setSessionValues("location","rewards");
    
    yb_initPageData(user_id);
    yb_createScript("rewards")

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

//Redeem rewards
function rewards_redeem_url(data){
    $("#content-container").html('');
    yb_setSessionValues("location","redeem_rewards");
    history.pushState({}, "", `/rewards/redeem/${data.perk}/`);
    
}

//history
function history_url() {
    $("#content-container").empty();
    $("#content-container").load(`${base_url}/user_profile/templates/user_profile/history.html/`);
    yb_setSessionValues("location", "history");
    history.pushState({}, "", "/profile/history/all/");

            
    if (menu.style.visibility === "visible") {
        yb_show_profile_menu();
    }
    
}

function stuff_url() {
    $("#content-container").empty();
    yb_setSessionValues("location", "stuff");
    $("#content-container").load(`${base_url}/user_profile/templates/user_profile/my_stuff.html/`);
    
    history.pushState({}, "", "/profile/stuff/");

            
    if (menu.style.visibility === "visible") {
        yb_show_profile_menu();
    }
    

}

function search_url(this_query) {
    $("#content-container").empty();
    yb_setSessionValues("location", "search");
    $("#content-container").load(`${base_url}/search/templates/search/search_results.html/`);
    
    history.pushState({}, "", `/search/?query=${this_query}`);

            
    if (menu.style.visibility === "visible") {
        yb_show_profile_menu();
    }
    

}