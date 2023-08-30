var this_data = document.getElementById("conversation-data");
var conversation = this_data.getAttribute('data-id');

$(document).ready(function(){
    let send_button = document.getElementById('send-button');
    let message_input = document.getElementById('message-field');
    let message_list = $('#message-container');
    
    let options_button = document.getElementById('options-button');

    let back_button = document.getElementById("back-to-convos");
    console.log("conversation loaded!")

    let message_container = document.getElementById("message-container");

    back_button.addEventListener("click", function() {
        let header = document.getElementById("header");
        let message_input = document.getElementById("message-input");
        message_input.style.transform = "translateY(100%)";
        header.style.transform = "translateY(-100%)";

        window.location.href = "/messages/inbox/";
    });

    message_input.addEventListener('keyup', function(event){
        if (message_input.value.length > 0){
            send_button.disabled = false;
            send_button.style.backgroundColor = "green";
        } else {
            send_button.disabled = true;
            send_button.style.backgroundColor = "rgb(75,75,75)";
        }
    });

    send_button.addEventListener('click', function(){
        let body = message_input.value;
        let receiver = this_data.getAttribute('data-receiver-username');
        
        this.disabled = true;

        this.style.width = "33.25px";
        this.style.height = "33.25px";
        this.style.borderRadius = "50%";
        this.innerHTML = `<div class="loading-circle msl"></div>`;
        this.style.backgroundColor = "transparent";

        yb_sendMessage(body, conversation, receiver);
    });

    setInterval(function(){
        let current_position = message_container.scrollTop;
        yb_refreshConversation();
    }, 1000);
    
});



function yb_refreshConversation(current_position){
    let message_container = document.getElementById("message-container");
    
    $.ajax({
        type: 'GET',
        url: `/messages/check/${conversation}/`,
        success: function(data){
            if (data.is_messages == true){
                for (let i = 0; i < data.messages.length; i++){
                    let this_message = data.messages[i];
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

                    // Scroll to bottom
                    if (current_position == 0){
                        message_container.scrollTop = message_container.scrollHeight; 
                    }
                    
                }
            }
        }
    });
}