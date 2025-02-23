
try {
    var conversation_data = document.getElementById("conversation-data");
    var this_id = conversation_data.getAttribute("data-id")
    var add_attachment_button = document.getElementById("add-attachment");
    var attachment_menu = document.getElementById("attachment-container");
    var attachment_icon = document.getElementById("attachment-icon");
    var add_photo_button = document.getElementById("photo-attachment");
    var add_video_button = document.getElementById("video-attachment");
    var attachment_preview_container = document.getElementById("attachment-preview-container");
    var message_container = document.getElementById("message-container");
    var send_button = document.getElementById("send-button");
    var message_input = document.getElementById("message-input");
    var message_field = document.getElementById("message-field");
    var video_input = document.getElementById("video-attachment-input");
    var photo_input = document.getElementById("photo-attachment-input");
    var conversation = this_data.getAttribute('data-id');

    
    var options_button = document.getElementById('options-button');

    var back_button = document.getElementById("back-to-convos");
    console.log("conversation loaded!")

    var message_container = document.getElementById("message-container");

} catch(err) {
    conversation_data = document.getElementById("conversation-data");
    video_input = document.getElementById("video-attachment-input");
    photo_input = document.getElementById("photo-attachment-input");
    this_id = conversation_data.getAttribute("data-id");
    message_input = document.getElementById("message-input");
    message_field = document.getElementById("message-field");
    add_attachment_button = document.getElementById("add-attachment");
    attachment_menu = document.getElementById("attachment-container");
    attachment_icon = document.getElementById("attachment-icon");
    add_photo_button = document.getElementById("photo-attachment");
    add_video_button = document.getElementById("video-attachment");
    attachment_preview_container = document.getElementById("attachment-preview-container");
    message_container = document.getElementById("message-container");
    send_button = document.getElementById("send-button");
    conversation = conversation_data.getAttribute('data-id');
    
    options_button = document.getElementById('options-button');

    back_button = document.getElementById("back-to-convos");
    console.log("conversation loaded!")

    message_container = document.getElementById("message-container");
}

function yb_sendMessage(data, photo = false, video = false) {
    let csrf_token = getCSRF();
    console.log(data)
    console.log("is photos: " + photo);
    console.log("is videos: " + video);
    //Send a message
    $.ajax({
        type: 'POST',
        url: '/messages/api/messages/',
        data: data,
        headers: {
            'X-CSRFToken': csrf_token,
        },
        processData: false,
        contentType: false,
        success: function(response) {
            //Update the feed
            console.log(response);
            let message_field = document.getElementById("message-field");

            message_field.value = "";
            let this_message = response;
            let message_container = document.getElementById("message-container");

            let attached_photos = [];
            let attached_videos = [];
            
            let is_sender = true
            let this_blueprint = {
                "id": this_message.id,
                "sender":this_message.from_user,
                "time": this_message.time,
                "body": this_message.decrypted_body,
                "is_sender":is_sender,
                
            }

            if (photo){
                let photo_input = document.getElementById("photo-attachment-input");
                photo_input.value = "";
                attachment_preview_container.innerHTML = "";
                message_container.style.paddingBottom = "60px";
                for (let i = 0; i < this_message.images.length; i++){
                    let photo = this_message.images[i];
                    attached_photos.push(photo);
                    
                }
            } else if (video){
                let video_input = document.getElementById("video-attachment-input");
                video_input.value = "";
                attachment_preview_container.innerHTML = "";
                message_container.style.paddingBottom = "60px";
                for (let i = 0; i < this_message.videos.length; i++){
                    let video = this_message.videos[i];
                    attached_videos.push(video);
                    
                }
            }
            let display_messages = yb_buildMessage(this_blueprint, attached_photos, attached_videos);
            
            for (let i = 0; i < display_messages.length; i++){
                message_container.insertBefore(display_messages[i], message_container.firstChild);
            }
            
    
            // Scroll to bottom
            
            message_container.scrollTop = message_container.scrollHeight; 
            
    
            send_button.innerHTML = "Send";
            
            send_button.style.width = "95%";
            send_button.style.height = "95%";
            send_button.style.borderRadius = "10px";
            send_button.style.backgroundColor = "gray";
    
            console.log(response);
        },
        error: function(response) {
            //Error
            console.log(response);
        }
    });
}



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
    

    console.log("checking messages...");
    $.ajax({
        type: 'GET',
        url: `/messages/check/${this_id}/${conversation_data.getAttribute("data-last-message")}/`,
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
                    let display_message = yb_buildMessage(this_blueprint);
                    for (let i = 0; i < display_message.length; i++){
                        message_container.insertBefore(display_message[i], message_container.firstChild);
                    }

                    if (i = data.messages.length) {
                        conversation_data.setAttribute("data-last-message", message.id)
                    }
                }
            }

        }
    })

}


function yb_intervalMessenger() {
    if (document.getElementById("message-container")) {
        let current_position = message_container.scrollTop;
        yb_checkMessages();

    } else {
        clearInterval(yb_intervalMessenger);
        clearInterval(yb_intervalMessenger, 2000);

    }
}

function yb_hideAttachmentClick(){
    let attachment_menu = document.getElementById("attachments-menu");
    attachment_menu.classList.remove("open");
    attachment_icon.style.transform = "translate(-50%, -50%) rotate(0deg)";
    add_attachment_button.removeEventListener('click', yb_hideAttachmentClick);
    add_attachment_button.addEventListener('click', yb_handleAttachmentClick);
}

function yb_handleAttachmentClick(){
    let attachment_menu = document.getElementById("attachments-menu");
    attachment_menu.classList.add("open");
    attachment_icon.style.transform = "translate(-50%, -50%) rotate(135deg)";
    add_attachment_button.removeEventListener('click', yb_handleAttachmentClick);
    add_attachment_button.addEventListener('click', yb_hideAttachmentClick);
}


$(document).ready(function(){
    // yb_hide2WayLoad();

    back_button.addEventListener("click", function() {
        let header = document.getElementById("message-header");
        let message_list = document.getElementById("message-container");
        message_input.style.transform = "translateY(100%)";
        header.style.transform = "translateY(-100%)";
        message_container.style.transform = "translateY(100%)";
        

        yb_handleMessageClick();
    });

    message_field.addEventListener('keyup', function(event){
        if (message_field.value.length > 0 || attachment_preview_container.innerHTML != ""){
            send_button.disabled = false;
            send_button.classList.add("enabled")
        } else {
            send_button.disabled = true;
            send_button.classList.remove("enabled");
        }
    });


    

    send_button.addEventListener('click', function(){
        let body = message_field.value;
        let receiver = conversation;
        let photo = false;
        let video = false;
        
        this.disabled = true;

        this.style.width = "35px";
        this.style.height = "35px";
        this.style.borderRadius = "50%";
        this.innerHTML = `<div class="loading-circle"></div>`;
        this.style.backgroundColor = "transparent";

        let this_data = new FormData();
        this_data.append("body", body);
        this_data.append("id", receiver);

        if (photo_input.files.length > 0){
            photo = true;
            this_data.append("is_images", true);
            this_data.append("photo", photo_input.files[0]);
        } else if (video_input.files.length > 0){
            video = true;
            this_data.append("is_videos", true);
            this_data.append("videos", video_input.files[0]);
        }

        yb_sendMessage(this_data, photo, video);
    });

    add_attachment_button.addEventListener('click', yb_handleAttachmentClick);
    add_photo_button.addEventListener('click', function(){
        let attachment_menu = document.getElementById("attachments-menu");
        photo_input.click();
        attachment_menu.classList.remove("open");
        attachment_icon.style.transform = "translate(-50%, -50%) rotate(0deg)";
    });

    add_video_button.addEventListener('click', function(){
        let attachment_menu = document.getElementById("attachments-menu");
        let video_input = document.getElementById("video-attachment-input");
        video_input.click();
        attachment_menu.classList.remove("open");
        attachment_icon.style.transform = "translate(-50%, -50%) rotate(0deg)";
    });

    add_photo_button.addEventListener('change', function(){
        let photo_input = document.getElementById("photo-attachment-input");
        let photo = photo_input.files[0];
        let reader = new FileReader();
        reader.onload = function(e){
            let image = e.target.result;
            let image_preview = yb_renderImage(image, "attachment-preview", "attachment-preview", "Your attached photo");
            attachment_preview_container.appendChild(image_preview);
            send_button.disabled = false;
            send_button.style.backgroundColor = "#007bff";
            
        }
        reader.readAsDataURL(photo);
        message_container.style.paddingBottom = "160px";
    });

    add_video_button.addEventListener('change', function(){
        
        let video = video_input.files[0];
        let reader = new FileReader();
        reader.onload = function(e){
            let video = e.target.result;
            let video_preview = yb_renderVideo(video, "attachment-preview", "attachment-preview", "Your attached video");
            attachment_preview_container.appendChild(video_preview);
            send_button.disabled = false;
            send_button.style.backgroundColor = "#007bff";
        }
        reader.readAsDataURL(video);
        message_container.style.paddingBottom = "160px";
    });

    setInterval(yb_intervalMessenger, 2000);
    
});
