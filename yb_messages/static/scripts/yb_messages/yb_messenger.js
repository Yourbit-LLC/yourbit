var new_message_button = document.getElementById("new-message-main")
var conversations = document.querySelectorAll(".conversation-container")

function yb_getConversations(filter){
    $.ajax({
        type: 'GET',
        url: '/messages/conversations/',
        data: {
            filter: filter
        },
        success: function(response){
            let conversation_container = document.getElementById("conversation-container");
            conversation_container.innerHTML = "";
            for (let i = 0; i < response.conversations.length; i++){
                let conversation = response.conversations[i];
                let this_id = conversation.id;
                let this_name = conversation.name;
                let this_image = conversation.image_thumbnail_small;
                let this_primary_color = conversation.primary_color;
                let this_unread = conversation.unread;
                let this_blueprint = {
                    "id": this_id,
                    "name": this_name,
                    "image": this_image,
                    "primary_color": this_primary_color,
                    "unread": this_unread,
                }
                let display_conversation = yb_buildConversation(this_blueprint);
                conversation_container.appendChild(display_conversation);
            }
        }
    });
}

function yb_toggleNewMessage(){
    
    
    let container = yb_toggle2WayContainer('messages-new');
    if (container[0] === "closing"){
        history.pushState(null, null, "/");
        container[1].setAttribute("data-state", "empty");
    } else {
        console.log("not closing")
        let container_content = container[1].querySelector(".yb-2Way-content");
        container[1].setAttribute("data-state", "messages-new");
        yb_purgeScripts(yb_clearContainer);
        
        $(container_content).load("/messages/templates/new-message/")

        history.pushState({}, "", '/messages/');

        }
}

$(document).ready(function () {
    let filter_buttons = document.getElementsByClassName("message-filter");
    for (let i = 0; i < filter_buttons.length; i++){
        filter_buttons[i].addEventListener('click', function() {
            let filter = this.getAttribute("name");
            yb_getConversations(filter);
        });
    }

    // yb_hide2WayLoad();

    new_message_button.addEventListener("click", yb_toggleNewMessage);

    for (i = 0; i < conversations.length; i++){
        conversations[i].addEventListener("click", function(){
            let this_id = this.getAttribute("data-catid")
            yb_toggleConversation2Way(this_id);
            yb_expand2Way();
        });
    }


});