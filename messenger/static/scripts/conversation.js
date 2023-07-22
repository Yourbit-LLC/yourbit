var this_data = document.getElementById("conversation-data");
var conversation = this_data.getAttribute('data-id');

$(document).ready(function(){
    let send_button = document.getElementById('send-button');
    let message_input = document.getElementById('message-field');
    let message_list = $('#message-container');
    let message_field = $('#message-field');
    let options_button = document.getElementById('options-button');

    let back_button = document.getElementById("back-to-convos");
    console.log("conversation loaded!")

    let message_container = document.getElementById("message-container");

    back_button.addEventListener("click", function() {
        console.log("Go back")
        clearInterval(yb_checkMessages);
        messages_inbox_url();
        $('.minibar').animate({"bottom": "95px"}).fadeIn();

    });

    send_button.addEventListener('click', function(){
        let body = message_input.value;
        let receiver = this_data.getAttribute('data-receiver-username');
        
        this.disabled = true;

        this.style.width = "33.25px";
        this.style.height = "33.25px";
        this.style.borderRadius = "50%";
        this.innerHTML = `<div class="loading-circle"></div>`;
        this.style.backgroundColor = "transparent";

        yb_sendMessage(body, conversation, receiver);
    });

    setInterval(function(){
        yb_refreshConversation();
    }, 1000);
    
});



function yb_refreshConversation(){
    
    $.ajax({
        type: 'GET',
        url: `/messages/check/${conversation}/`,
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