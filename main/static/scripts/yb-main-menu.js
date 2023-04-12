$('#profile-name').click(function() {
    let username = $(this).attr("data-username")
    console.log(username)
    let data = {"username": username}
    profile_url(data);
    yb_show_profile_menu();

})

$('.profile-menu-link').click(function() {
    console.log("clicked");
    let location = yb_getSessionValues("location");
    if (location === "home") {
        let content_container = document.getElementById("content-container");
        content_container.removeEventListener("scroll", debounced_function);
        let script = document.getElementById("home-script");
        script.remove();
    }
    let button_pressed = $(this).attr("name");

    if (button_pressed === "home") {
        yb_updatePageTask("home");
        home_url();
    }

    if (button_pressed === "rewards") {
        yb_updatePageTask("rewards")
        rewards_url();
    }

    if (button_pressed === "history") {
        yb_updatePageTask("history")
        history_url();
    }

    if (button_pressed === "messages"){
        yb_updatePageTask("messages")
        messages_inbox_url();
    }

    if (button_pressed === "settings"){
        yb_updatePageTask("settings")
        settings_url();
    }

    if (button_pressed === "connections"){
        yb_updatePageTask("connections")
        connections_url();
    }

    if (button_pressed === "stuff"){
        yb_updatePageTask("stuff")
        stuff_url();

    }


});

function yb_listNotifications(filter){
    if (filter === "notifications"){
        url = "/api/notifications/";
    }
    else {
        url = "/api/notifications/?filter=" + filter;
    }

    $.ajax(
        {
            type: 'GET',
            url: url,
            success: function(data) {
                console.log("notifications loaded")
                let notification_list = data.list;
                let is_notifications = data.found_notifications;
                let list_container = document.getElementById("notification-list");
                
                //Clear the list container
                list_container.innerHTML = "";
                console.log(is_notifications)
                if (is_notifications === false) {
                    let no_notifications = yb_createElement("h3", "no-notifications", "general-title-text");
                    no_notifications.innerHTML = "No Notifications";
                    list_container.appendChild(no_notifications);
                } else {
                    console.log("found true")
                    var notification_keys = Object.keys(notification_list);
                    console.log(notification_keys.length)
                    for (var i = 0; i < notification_keys.length; i++){
                        console.log("attempted notification render")
                        let notification_item = notification_list[i];
                        let this_notification = yb_buildNotification(notification_item);
                        list_container.appendChild(this_notification);
                        

                    }
                }
            }
        }
    )
}

function yb_BuildNotificationContainer(filter) {
    console.log("build container ran")
    let ui_container = document.getElementById("general-ui-container");
    //Create container and add to DOM Tree with yb create element
    let notification_container = yb_createElement("div", "notification-container", "general-container");


    if (filter === "notifications"){
        all_button_class = "filter-button-active";
    } else {
        all_button_class = "filter-button";
    }
    if (filter === "messages"){
        message_button_class = "filter-button-active";
    } else {
        message_button_class = "filter-button";
    }
    if (filter === "bits"){
        bit_button_class = "filter-button-active";
    } else {
        bit_button_class = "filter-button";
    }
    if (filter === "connections"){
        connection_button_class = "filter-button-active";
    } else {
        connection_button_class = "filter-button";
    }
    //Create and append the header
    let notification_header = yb_createElement("h3", "notification-header", "general-title-text");
    notification_header.setAttribute("style", "margin-bottom: 25px;");
    notification_header.innerHTML = "Notifications";
    notification_container.appendChild(notification_header);     

    let filter_bar = yb_createElement("div", "notification-filter", "yb-card-filter-bar");
    filter_bar.setAttribute("style", "display:grid; margin-bottom: 25px; grid-template-columns: 1fr 1fr 1fr 1fr;");

    
    let all_button = yb_createButton("button", "all-button", all_button_class, "All");
    filter_bar.appendChild(all_button);
    all_button.addEventListener("click", function(){
        filter_bar.querySelectorAll(".filter-button-active").forEach(function(button){
            button.setAttribute("class", "filter-button");
        });
        this.setAttribute("class", "filter-button-active");
        yb_listNotifications("notifications");
    });
    
    let message_button = yb_createButton("button", "message-button", message_button_class, "Messages");
    filter_bar.appendChild(message_button);
    message_button.addEventListener("click", function(){
        filter_bar.querySelectorAll(".filter-button-active").forEach(function(button){
            button.setAttribute("class", "filter-button");
        });
        this.setAttribute("class", "filter-button-active");
        yb_listNotifications("messages");
    });

    let bit_button = yb_createButton("button", "bit-button", bit_button_class, "Bits");
    filter_bar.appendChild(bit_button);
    bit_button.addEventListener("click", function(){
        filter_bar.querySelectorAll(".filter-button-active").forEach(function(button){
            button.setAttribute("class", "filter-button");
        });
        this.setAttribute("class", "filter-button-active");
        yb_listNotifications("bits");
    });

    let connection_button = yb_createButton("button", "connection-button", connection_button_class, "People");
    filter_bar.appendChild(connection_button);
    connection_button.addEventListener("click", function(){
        filter_bar.querySelectorAll(".filter-button-active").forEach(function(button){
            button.setAttribute("class", "filter-button");
        });
        this.setAttribute("class", "filter-button-active");
        yb_listNotifications("connections");
    });

    notification_container.appendChild(filter_bar);
    let notification_list = yb_createElement("div", "notification-list", "card-list-container");

    notification_container.appendChild(notification_list);
    ui_container.appendChild(notification_container);



    yb_listNotifications(filter);
}

$(".menu-widget").click(function() {

    let widget_name = $(this).attr("name");
    if (widget_name === "rewards"){
        rewards_url("none");
    }
    else {
        yb_show_profile_menu();
        $("#general-ui-container").show();
        $("#cb-divider").fadeIn();
        $("#general-ui-container").css("visibility", "visible");
        $("#general-ui-container").animate({"top": "10vh"}, 500);
        yb_BuildNotificationContainer(widget_name);
    }



});

$('#menu-panel-close').click(function(){
    yb_show_profile_menu();
});