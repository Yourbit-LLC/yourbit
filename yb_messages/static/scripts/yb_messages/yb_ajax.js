
function yb_getConversations() {
    //Get the conversations
    $.ajax({
        type: 'GET',
        url: '/messages/api/conversations/',
        success: function(response) {
            //Update the feed
            console.log(response);
            yb_renderConversations();
            
        },
        error: function(response) {
            //Error
            console.log(response);
        }
    });
}

function yb_sendMessage(data) {
    //Send a message
    $.ajax({
        type: 'POST',
        url: '/messages/api/messages/',
        data: data,
        success: function(response) {
            //Update the feed
            let message_field = document.getElementById("message-field")
            message_field.value = "";
            let this_message = response.data;
            let message_container = document.getElementById("message-container");
            
            let is_sender = true
            let send_button = document.getElementById("send-button");
            let this_blueprint = {
                "id": this_message.id,
                "sender":this_message.from_user,
                "time": this_message.time,
                "body": this_message.body,
                "is_sender":is_sender,
                
            }
            let display_message = yb_buildMessage(this_blueprint);
            message_container.insertBefore(display_message, message_container.firstChild);
    
            // Scroll to bottom
            
            message_container.scrollTop = message_container.scrollHeight; 
            
    
            send_button.innerHTML = "Send";
            send_button.disabled = false;
            send_button.style.width = "95%";
            send_button.style.height = "95%";
            send_button.style.borderRadius = "10px";
            send_button.style.backgroundColor = "green";
    
            console.log(response);
        },
        error: function(response) {
            //Error
            console.log(response);
        }
    });
}
