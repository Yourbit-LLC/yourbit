
let send_button = document.getElementById("send-button");






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
