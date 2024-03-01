/* Handles click of messages */
function yb_handleMessageClick() {
    let container = yb_toggle2WayContainer('messages');
    if (container[0] === "closing"){
        history.pushState(null, null, "/");
        container[1].setAttribute("data-state", "empty");
    } else {
        console.log("not closing")
        let container_content = container[1].querySelector(".yb-2Way-content");
        container[1].setAttribute("data-state", "messages");
        $(container_content).load("/messages/inbox/")
        history.pushState({}, "", '/messages/');

    }
}

function yb_handleNotificationsClick() {
    let container = yb_toggle2WayContainer('notifications');
    if (container[0] === "closing"){
        history.pushState(null, null, "/");
        container[1].setAttribute("data-state", "empty");
    } else {
        console.log("not closing")
        let container_content = container[1].querySelector(".yb-2Way-content");
        container[1].setAttribute("data-state", "notifications");
        $(container_content).load("/notify/template/list/")
        history.pushState({}, "", '/notify/');
    }
    //let container_content = container.querySelector(".yb-2way-content");
    
    // let container_content = document.getElementById("yb-2way-content");
    // $(container_content).load("/notifications/")

}

function yb_updateTimezone() {
    let timezone = document.getElementById("id_timezone").value;
    let data = {
        timezone: timezone
    }
    $.ajax({
        type: "POST",
        url: "/systems/update/timezone/",
        data: data,
        success: function(response){
            console.log(response);
        }
    })
}


