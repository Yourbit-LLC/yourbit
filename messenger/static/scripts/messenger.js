
let send_button = document.getElementById("send-button");

send_button.addEventListener("click", function(){
    let text_field = document.getElementById("message-field")
    let this_id = yb_getSessionValues("conversation");
    let that_user = yb_getSessionValues("that-username")
    let body = text_field.value;

    //This ID refers to conversation id
    yb_sendMessage(body, this_id, that_user)
})



