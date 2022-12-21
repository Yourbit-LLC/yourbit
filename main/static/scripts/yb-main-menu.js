$('#profile-name').click(function() {
    let username = $(this).attr("data-username");
    let data = {"username": username}
    profile_url(data);
    show_profile_menu();

})

$('.profile-menu-link').click(function() {
    console.log("clicked");
    let button_pressed = $(this).attr("name");

    if (button_pressed === "rewards") {
        rewards_url();
    }

    if (button_pressed === "history") {
        history_url();
    }

    if (button_pressed === "messages"){
        messages_inbox_url();
    }

    if (button_pressed === "settings"){
        settings_url();
    }

    if (button_pressed === "connections"){
        connections_url();
    }

    if (button_pressed === "stuff"){
        stuff_url();

    }


});

$('#menu-panel-close').click(function(){
    show_profile_menu();
});