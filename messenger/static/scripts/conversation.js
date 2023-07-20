$(document).ready(function(){
    let send_button = document.getElementById('send-button');
    let message_input = document.getElementById('message-field');
    let message_list = $('#message-container');
    let message_field = $('#message-field');
    let options_button = document.getElementById('options-button');

    let this_data = document.getElementById("conversation-data");

    let back_button = document.getElementById("back-to-convos");
    console.log("conversation loaded!")

    let message_container = document.getElementById("message-container");
    let mobile_spacer = yb_createElement("div", "mobile-spacer", "mobile-spacer");
    message_container.appendChild(mobile_spacer);

    yb_getMessages(this_id);

    back_button.addEventListener("click", function() {
        console.log("Go back")
        clearInterval(yb_checkMessages);
        messages_inbox_url();
        $('.minibar').animate({"bottom": "95px"}).fadeIn();

    });

    send_button.addEventListener('click', function(){
        let body = message_input.value;
        let conversation = this_data.getAttribute('data-id');
        let receiver = this_data.getAttribute('data-receiver');
        yb_sendMessage();
    });

    setInterval(function(){
        yb_refreshConversation();
    }, 1000);
    
});



function yb_refreshConversation(){
    let message_list = $('#message-container');
    let message_field = $('#message-field');
    let this_id = yb_getSessionValues('conversation');
    $.ajax({
        type: 'GET',
        url: `/messages/check/${this_id}/`,
        success: function(data){
            if (data.is_messages == true){
                for (let i = 0; i < data.messages.length; i++){
                    let message = data.messages[i];
                    let is_sender = false;
                    let this_blueprint = {
                        "id": this_message.id,
                        "sender":this_message.sender,
                        "time": this_message.time,
                        "body": this_message.body,
                        "image": this_message.image,
                        "is_sender":is_sender,
                        
                    }
                    let display_message = BuildMessage(this_blueprint);
                    message_container.insertBefore(display_message, message_container.firstChild);
                }
            }
        }
    });
}