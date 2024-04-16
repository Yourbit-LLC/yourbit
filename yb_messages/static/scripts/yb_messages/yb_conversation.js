var this_data = document.getElementById("conversation-data");
var conversation = this_data.getAttribute('data-id');
var send_button = document.getElementById('send-button');
var message_input = document.getElementById('message-field');


var options_button = document.getElementById('options-button');

var back_button = document.getElementById("back-to-convos");
console.log("conversation loaded!")

let message_container = document.getElementById("message-container");


function yb_refreshConversation(current_position){
    
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



function yb_checkMessages(){
    let this_id = yb_getSessionValues("conversation");
    console.log("checking messages...");
    $.ajax({
        type: 'GET',
        url: `/messages/check/${this_id}/`,
        success: function(data){

            if (data.is_messages == true){
                for (let i = 0; i < data.messages.length; i++){
                    let message = data.messages[i];
                    let message_container = document.getElementById("message-container");
                    let is_sender = false;
                    let this_blueprint = {
                        "id": message.id,
                        "sender":message.sender,
                        "time": message.time,
                        "body": message.body,
                        "image": message.image,
                        "is_sender":is_sender,
                        
                    }
                    let display_message = BuildMessage(this_blueprint);
                    message_container.insertBefore(display_message, message_container.firstChild);
                }
            }

        }
    })

}


function yb_intervalMessenger() {
    if (document.getElementById("message-container")) {
        let current_position = message_container.scrollTop;
        yb_refreshConversation();

    } else {
        clearInterval(yb_intervalMessenger);
        clearInterval(yb_intervalMessenger, 2000);

    }
}

$(document).ready(function(){

    back_button.addEventListener("click", function() {
        let header = document.getElementById("message-header");
        let message_input = document.getElementById("message-input");
        let message_list = document.getElementById("message-container");
        message_input.style.transform = "translateY(100%)";
        header.style.transform = "translateY(-100%)";
        message_container.style.transform = "translateY(100%)";
        

        yb_handleMessageClick();
    });

    message_input.addEventListener('keyup', function(event){
        if (message_input.value.length > 0){
            send_button.disabled = false;
            send_button.classList.add("enabled")
        } else {
            send_button.disabled = true;
            send_button.classList.remove("enabled");
        }
    });

    send_button.addEventListener('click', function(){
        let body = message_input.value;
        let receiver = conversation;
        
        this.disabled = true;

        this.style.width = "33.25px";
        this.style.height = "33.25px";
        this.style.borderRadius = "50%";
        this.innerHTML = `<div class="loading-circle msl"></div>`;
        this.style.backgroundColor = "transparent";

        let this_data = {
            "id" : conversation,
            "body": body,
        }

        yb_sendMessage(this_data);
    });

    setInterval(yb_intervalMessenger, 2000);
    
});
