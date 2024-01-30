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

$(document).ready(function () {
    let filter_buttons = document.getElementsByClassName("message-filter");
    for (let i = 0; i < filter_buttons.length; i++){
        filter_buttons[i].addEventListener('click', function() {
            let filter = this.getAttribute("name");
            yb_getConversations(filter);
        });
    }
});