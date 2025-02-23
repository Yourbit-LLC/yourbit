//Function for generating list items
function yb_buildListItem(result, action=null){
    let id = result.id

    if (id === undefined) {
        id = result.user.id
    }
    
    

    let name = result.display_name;
    let handle = result.username;
    let element_id = `${type}-${id}`;
    let new_item = yb_createElement("div", "yb-listItem yb-autoText", `result-${element_id}`);
    new_item.setAttribute("data-catid", `${id}`);
    new_item.setAttribute("data-username", `${handle}`);
    let image; 
    if (result.customcore.profile_image.storage_type == "yb") {
        image = result.customcore.profile_image.small_thumbnail;
    } else {
        image = result.customcore.profile_image.small_thumbnail_ext
    }
    new_item.innerHTML =`
        <div class = 'full-result-image-container'>
            <img class='full-result-image' style="width: 100%; position:relative;" src="${image}">
        </div>
        <div class='full-result-name-container'>
            <p class = 'full-result-name'><strong>${name}</strong></p>
            <p class = 'full-result-username'>
                <small>@${handle}</small>
            </p>
        </div>
    `

    if (action != null) {
        let handler = action(id, handle)
        new_item.addEventListener('click', handler)
        
    }
    
    return new_item
}

//Function for generating list items
function yb_buildContactItem(result, type){
    let id = result.this_id
    let primary_color = result.primary_color;
    let image = result.image_thumbnail_small;
    let name = result.name;
    let handle = result.username;
    let element_id = `${type}-${id}`;
    let new_item = yb_createElement("div", `result-${element_id}`, "full-result");
    new_item.setAttribute("data-catid", `${result.this_id}`);
    new_item.innerHTML =`
        
            <div class = 'full-result-image-container'>
                <img class='full-result-image' src="${image}">
            </div>
            <div class='full-result-name-container'>
                <p class = 'full-result-name'><strong>${name}</strong></p>
                <p class = 'full-result-username'>
                    <small>@${handle}</small>
                </p>
            </div>
    `
    new_item.addEventListener('click', function() {
        
        messages_conversation_url(id, handle);
        yb_endTask("#message-task")
        yb_hideWidget()
        $(".minibar").animate({"bottom":"-60px"}).fadeOut();
    });

    return new_item
}

function yb_buildFieldTag(label, id) {
    let new_tag = yb_createElement("div", "field-tag rounded yb-field-background yb-bText", `tag-${id}`);
    new_tag.innerHTML = `
        <p class="field-tag-label yb-autoText yb-margin-L5" style="overflow: hidden;">${label}</p>
        <button class="field-tag-delete yb-bText" style=" border-width: 0px; background-color: transparent; font-size: 24px;" data-catid="${id}">&times</button>
    `;

    return new_tag
}

//Function for generating message bubbles
function yb_buildMessage(this_message, photos = [], videos = []){
    
    let id= this_message.id
    let time = this_message.time
    let body = this_message.body
    let is_sender = this_message.is_sender

    console.log(is_sender)
    let message_contents = [];

    if (is_sender === true){
        let conversation_data = document.getElementById("conversation-data");
        let user_color = conversation_data.getAttribute("data-primary-color");

        if (photos.length > 0){
            for (let i=0; i<photos.length; i++){
                let photo = photos[i];
                let photo_id = photo.id;
                new_photo_container = yb_createElement("div", "message-bubble message-bubble-right", `message-photo-container-${photo_id}`);
                new_photo_container.style.backgroundColor = "transparent";
                new_photo = yb_renderImage(photo.image, "message-photo", "message-photo-" + photo_id, "A photo you sent");
                new_photo_container.appendChild(new_photo);
                message_contents.push(new_photo_container);
            }

        } else if (videos.length > 0){
            for (let i=0; i<videos.length; i++){
                let video = videos[i];
                let video_id = video.id;
                new_video_container = yb_createElement("div", "message-bubble message-bubble-left", `message-video-${video_id}`);
                new_video = yb_renderVideo(video.video, "message-video", "message-video-" + video_id, "Video from a friend");
                new_video_container.appendChild(new_video);
                message_contents.push(new_video_container);
            }
        }


        new_element = yb_createElement("div", "message-bubble message-bubble-right", `message-${id}`);
        new_element.setAttribute("data-id", id);
        new_body = yb_createElement("div", "message-body", `message-body-${id}`);
        new_body.innerHTML = body;
        new_element.appendChild(new_body);

        message_contents.push(new_element);
     
        // new_time = yb_createElement("p", `message-time-${id}`, "message-time");
        // new_time.innerHTML = `<small>${time}</small>`;
        // new_element.appendChild(new_time);

        // new_avatar = yb_renderImage(profile_image, "message-hangover-right", new_element);
        // new_avatar.style.display = "none";
        // new_avatar.style.marginRight = "10px";
        // new_element.appendChild(new_avatar);

    } else {

        if (photos.length > 0){
            for (let i=0; i<photos.length; i++){
                let photo_object = photos[i];
                let photo = photo_object.image;
                let photo_id = photo.id;
                new_photo_container = yb_createElement("div", "message-bubble message-bubble-left", `message-photo-container-${photo_id}`);
                new_photo = yb_renderImage(photo.image, "message-photo", "message-photo-" + photo_id, "Photo from a friend");
                new_photo_container.appendChild(new_photo);
                message_contents.push(new_photo_container);
            }

        } else if (videos.length > 0){
            for (let i=0; i<videos.length; i++){
                let video_object = videos[i];
                let video = video_object.image;
                let video_id = video.id;
                new_video_container = yb_createElement("div", "message-bubble message-bubble-left", `message-video-${video_id}`);
                new_video = yb_renderVideo(video.video, "message-video", "message-video-" + video_id, "Video from a friend");
                new_video_container.appendChild(new_video);
                message_contents.push(new_video_container);
            }
        }

        new_element = yb_createElement("div", "message-bubble message-bubble-left", `message-${id}`);
        new_element.setAttribute("data-id", id)
        
        new_body = yb_createElement("div", "message-body", `message-body-${id}`);
        new_body.innerHTML = body;
        new_element.appendChild(new_body);
        message_contents.push(new_element);

        // new_time = yb_createElement("p", `message-time-${id}`, "message-time");
        // new_time.innerHTML = `<small>${time}</small>`;
        // new_element.appendChild(new_time);

        // new_avatar = yb_renderImage(profile_image, "message-hangover-left", new_element);
        // new_avatar.style.display = "none";
        // new_avatar.style.marginRight = "10px";
        // new_element.appendChild(new_avatar);

    }


    return message_contents


}

