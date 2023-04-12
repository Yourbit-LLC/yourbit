$(document).ready(function() {
    
    let element = document.getElementById("session_values");
    let location = element.getAttribute("data-location");
    $(document).on('contextmenu', function(e) {
        return false;
    });
    headerDropIn();

    console.log(location);

    //Load page url and attach script corresponding to location to page script
    if (location === "home") {
        let space = element.getAttribute('data-space');
        console.log(space);
        if (space === "global"){
            home_url("get")
        }

        if (space === "chat") {
            home_chat_url("get")
        }

        //Load page url and attach script corresponding to location to page script
        if (space === "photo") {
            home_photo_url("get")

        }

        if (space === "video") {
            console.log("video-space")
            home_video_url("get")

        }

    }


    if (location === "profile") {
        let space = element.getAttribute('data-space');

        if (space === "global") {
            let this_username = yb_getSessionValues("username");
            profile_url({"username": this_username})
        }

        if (space === "chat") {
            profile_chat_url("get")
            
        }
    
        //Load page url and attach script corresponding to location to page script
        if (space === "photo") {
            profile_photo_url("get")
    
        }
    
        if (space === "video") {
            profile_video_url("get")
    
        }

    }

    if (location === "stuff") {
        stuff_url("get");
    }

    if (location === "history") {
        history_url("get");
    }

    if (location === "connections"){
        connections_url("get");
        
    }

    if (location === "connections_friends"){
        connections_friends_url("get");


    }

    if (location === "connections_followers"){
        connections_followers_url("get");

    }

    if (location === "connections_following"){
        connections_following_url("get");
        let filter = element.getAttribute("data-filter");
        let sort = element.getAttribute("data-sort");

    }

    if (location === "connections_community"){
        connections_community_url("get");
        let filter = element.getAttribute("data-filter");
        let sort = element.getAttribute("data-sort");
    }

    if (location === "settings"){
        settings_url("get");
    }

    if (location === "settings_feed"){
        settings_feed_url("get");

    }

    if (location === "settings_profile"){
        settings_profile_url("get");

    }

    if (location === "settings_privacy"){
        settings_privacy_url("get");

    }

    if (location === "settings_subscription"){
        settings_subscription_url("get");
    }

    if (location === "customize"){
        customize_url("get");
    }

    if (location === "inbox") {
        messages_inbox_url("get");
        //pass
    }

    if (location === "public_inbox"){
        //pass
        messages_public_inbox_url("get");

    }

    if (location === "private_inbox"){
        messages_private_inbox_url("get");
        //pass

    }

    if (location === "conversation"){
        messages_conversation_url("get");

    }

    if (location === "rewards"){
        rewards_url("get");
    }

    if (location === "browse_perks"){
        rewards_browse_url("get");
    }

    if (location === "redeem_rewards"){
        rewards_redeem_url("get");
    }
    if (location != "home"){
        post_fly_in();
    }

});
