
let send_button = document.getElementById("send-button");


$(document).ready(function(){
    send_button.addEventListener("click", function(){
        let text_field = document.getElementById("message-field")
        let this_id = yb_getSessionValues("conversation");
        let that_user = yb_getSessionValues("that-username")
        let body = text_field.value;
    
        //This ID refers to conversation id
        yb_sendMessage(body, this_id, that_user)
    })

    setInterval(yb_checkMessages, 1000);

});



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
