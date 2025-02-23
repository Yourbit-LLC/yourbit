$(".bit-profile-image").click(function() {
    let username = $(this).attr("data-username");
    console.log(username)
    window.top.location.replace(`${base_url}/profile/${username}`);
});

function yb_hideComments(bit_id) {
    $(`#comment-container-${bit_id}`).hide();
    $(`#comment-label-${bit_id}`).hide();
    $(`#comment-container-${bit_id}`).empty();
}


function yb_handleDeleteBit(e){
    let this_button = e.currentTarget;
    let bit_id = this_button.getAttribute("data-catid");
    console.log("Bit ID: " + bit_id)

    yb_deleteBit(bit_id)

}

// function yb_handleEditBit(e){
//     let this_button = e.currentTarget;
//     let this_id = this_button.getAttribute("data-catid");
//     let this_bit = document.getElementById(`bit-${this_id}`);

//     let current_title_container = document.getElementById(`title-bit-${this_id}`);
//     let current_body_container = document.getElementById(`bit-body-${this_id}`);

//     let current_title = current_title_container.querySelector("h2").innerHTML;
//     let current_body = current_body_container.querySelector("p").innerHTML;


    
// }


/* 
    *Function to build bit context menu
    *@param {object} this_element - the element that was clicked
    *@returns {object} context_menu - the context menu element
*/

function yb_bitMenu(e){
    let this_button = e.currentTarget;
    let menu = document.getElementById("yb-slide-up-core");
    let this_id = this_button.getAttribute("data-catid");
    let this_bit = document.getElementById(`bit-${this_id}`);
    let bit_user_id = this_bit.getAttribute("data-userid");
    let user_id = yb_getSessionValues("id");
    let these_options;

    console.log("Bit Options Triggered")
    console.log("bit user id: " + bit_user_id)
    console.log("user id: " + user_id)
    console.log("bit id " + this_id)

    if (user_id == bit_user_id){
        these_options = {
            "Edit Bit": yb_handleDeleteBit,
            "Add to Cluster": yb_handleDeleteBit,
            "Hide Bit": yb_handleDeleteBit,
            "Delete Bit": yb_handleDeleteBit,
            "Cancel": yb_closeSlideUpTemplate, //main/yb_master.js
        }
    } else {
        these_options = {
            "Add to Cluster": yb_handleDeleteBit,
            "Hide Bit": yb_handleDeleteBit,
            "Report Bit": yb_handleDeleteBit,
            "Cancel": yb_closeSlideUpTemplate, //main/yb_master.js
        }

    }

    let this_container = yb_createElement("div", "bit-options-container", `bit-options-container-${this_id}`);

    for (let option in these_options) {
        
        let new_option = yb_createElement(
            "div", 
            "bit-option yb-menu-listButton yb-button-threeQuarter border-none squared yb-margin-T10 yb-widthConstraint-600 yb-autoText bg-gray font-heavy pointer-object", 
            `bit-option-${option}-${option.substring(0, 3)}`
        );
        
        let new_option_text = yb_createElement("p", "notification-response-text yb-center-margin all", `bit-option-text-${this_id}-${option.substring(0, 3)}`);
        new_option_text.innerHTML = option;

        new_option.appendChild(new_option_text);

        new_option.setAttribute("data-catid", this_id);

        new_option.setAttribute("name", option);
        new_option.addEventListener("click", these_options[option]);
        this_container.appendChild(new_option);
    }

    menu.appendChild(this_container);

    menu.classList.add("open");
    
}

/*
    * Function to create header of a bit
    * @param {object} bit - the bit object
    * @returns {object} header - the header element
*/

function createHeader(bit) {

    const header = yb_createElement("div", `yb-header-bit ${bit.type}`, `header-bit-${bit.id}`);
    const profileImageContainer = yb_createElement("div", "element-accent profile-image-thumbnail small yb-center-margin all", `profile-image-${bit.id}`);
    //Create a variable that sets to the bit.custom.accent_color, if undefined, set to white
    let border_color = bit.custom.accent_color ? bit.custom.accent_color : "white";
    profileImageContainer.style.border = `2px solid ${border_color}`;
    
    let custom = bit.custom;
    let images = custom.images;
    let profile_image = images.profile_image;
    let thumbnail; 

    if (profile_image.storage_type == "yb") {
        thumbnail = profile_image.small_thumbnail;
    } else {
        thumbnail = profile_image.tiny_thumbnail_ext
    }
    
    if (yb_getSessionValues("bit-colors-on") == "True" && yb_getSessionValues("only-my-colors") == "False"){
        profileImageContainer.style.borderColor = bit.custom.accent_color;
    }
    profileImageContainer.innerHTML = `
        <img style="object-fit:fill; border-radius: 50%; width: 100%;" src="${thumbnail}">
    `;
    profileImageContainer.setAttribute("data-username", bit.profile.username)
    header.appendChild(profileImageContainer);

    profileImageContainer.addEventListener("click", yb_navigateToProfile)
    const userInfo = yb_createElement("p", "yb-userInfo-bit", `bit-info-${bit.id}`);
    if (yb_getSessionValues("bit-colors-on") == "True" && yb_getSessionValues("only-my-colors") == "False"){
        userInfo.innerHTML = `<strong class="bit-name" style="color:${bit.custom.title_color};">${bit.display_name}</strong><br> <small class="bit-username" style="color:${bit.custom.text_color};">@${bit.profile.username}</small>`;    
    }
    else {
        userInfo.innerHTML = `<strong class="bit-name">${bit.display_name}</strong><br> <small class="bit-username">@${bit.profile.username}</small>`;
    }
    userInfo.setAttribute("data-username", bit.profile.username);
    userInfo.addEventListener("click", yb_navigateToProfile)
    
    header.appendChild(userInfo);

    const timeLabel = yb_createElement("p", "yb-timeLabel-bit", `time-posted-${bit.id}`);
    let [displayDate, displayTime] = bit.time.split("/");
    timeLabel.innerHTML = `${displayDate}<br><small>${displayTime}</small>`;
    header.appendChild(timeLabel);

    const ybMoreButton = yb_createElement("div", "yb-button-bitOptions", `bit-options-${bit.id}`)
    ybMoreButton.setAttribute("data-catid", bit.id);
    ybMoreButton.innerHTML = `
        <svg "yb-icon xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path class="yb-autoFill" d="M480-160q-33 0-56.5-23.5T400-240q0-33 23.5-56.5T480-320q33 0 56.5 23.5T560-240q0 33-23.5 56.5T480-160Zm0-240q-33 0-56.5-23.5T400-480q0-33 23.5-56.5T480-560q33 0 56.5 23.5T560-480q0 33-23.5 56.5T480-400Zm0-240q-33 0-56.5-23.5T400-720q0-33 23.5-56.5T480-800q33 0 56.5 23.5T560-720q0 33-23.5 56.5T480-640Z"/></svg>
    `
    header.appendChild(ybMoreButton)
    ybMoreButton.addEventListener("click", function(e){
        yb_navigateTo("drawer", "bit-options", bit.id, false)
    })

    return header;
}

/*
    * Function to create the interactions for a bit
    * @param {object} bit - the bit object
    * @returns {object} media - an attached media element
*/

function yb_addMedia(type, bit) {

    
    if (type === 'photo'){
        let index = 0;
        let photo = bit.photos[index]
        let attachment_container = yb_createElement("div", "attached-photo-container", `photo-container-${bit.id}`);
        let attachment = yb_createElement("img", "attached-photo", `photo-bit-${bit.id}`);

        if (photo.storage_type != "yb"){
            attachment.setAttribute("src", photo.large_thumbnail_ext);
        } else {
            attachment.setAttribute("src", photo.large_thumbnail);
        }
        attachment.setAttribute('data-id', bit.id);
        attachment.setAttribute('data-index', index);

        attachment_container.appendChild(attachment);
        
        attachment.addEventListener("click", function(){
            let source = this.getAttribute("src");
            let this_id = this.getAttribute("data-id");
            let this_index = this.getAttribute("data-index");
            yb_openImage(this_id)

        })

        return attachment_container;
    }

    if (type === 'video'){
        VIDEO_QUEUE.push(bit.id);
        let bit_video = bit.video_upload;
        let attached_video_container = yb_createElement("div", "attached-video-container", `video-container-${bit.id}`);
        let video_player;
        console.log(bit_video)
        if (bit_video.storage_type == "yb"){
            video_player = yb_createElement("video", "attached-video", `video-${bit.id}`);
            video_player.setAttribute("controls", "true");
            video_player.setAttribute("playsinline", "true");
            video_player.setAttribute("data-id", bit.id);
            video_player.setAttribute("src", bit_video.video);
            video_player.style.height = "100%";
        } else {
            // video_player = yb_createElement("mux-player", "attached-video", `video-${bit.id}`);
            // video_player.setAttribute("playback-id", bit_video.ext_id);
            // video_player.setAttribute("metadata-video-title", bit.title)
            // video_player.setAttribute("metadata-viewer-user-id", bit.display_name)
            // video_player.setAttribute("accent-color", bit.custom.primary_color)
            video_player = yb_createElement("img", "attached-video", `thumbnail-${bit.id}`)
            video_player.style.height = "100%";
            video_thumbnail = bit_video.thumbnail
            video_player.setAttribute("src", video_thumbnail.ext_url);
            video_player.addEventListener("click", function() {
                if (VIDEO_QUEUE.length > 0){
                    if (VIDEO_QUEUE.includes(bit.id)){
                        let index = VIDEO_QUEUE.indexOf(bit.id);
                        VIDEO_QUEUE.splice(index, 1); // Removes 'banana'
                    }    
                }
                yb_navigateTo("content-container", "bit-focus", bit.id);
            })
            let play_button = yb_createElement("div", "yb-play-icon circle yb-center-transform all", `play-icon-${bit.id}`)
            play_button.style.width = "120px";
            play_button.style.height = "120px";
            play_button.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
            play_button.style.zIndex = "2";
            play_button.innerHTML = `
                <svg class="yb-center-transform all" xmlns="http://www.w3.org/2000/svg" height="96px" viewBox="0 -960 960 960" width="96px" fill="#e8eaed"><path d="M305.87-250.09v-465.82q0-18.53 11.87-29.35 11.86-10.83 27.5-10.83 5.24 0 10.72 1.28 5.47 1.29 11.1 4.38l366.51 234.52q8.97 6.13 13.75 14.39 4.77 8.26 4.77 18.52t-4.77 18.52q-4.78 8.26-13.75 14.39L367.06-215.57q-5.63 3.09-11.12 4.09-5.49 1-10.74 1-15.68 0-27.5-10.41-11.83-10.42-11.83-29.2Z"/></svg>
            `
            play_button.addEventListener("click", function() {
                yb_navigateTo("content-container", "bit-focus", bit.id);
            })
            attached_video_container.appendChild(play_button);
            attached_video_container.addEventListener("mouseenter", function() {
                play_button.style.backgroundColor = bit.custom.primary_color;
                this.classList.add("yb-playerBounceDown-once");

            });

            attached_video_container.addEventListener("mouseleave", function() {
                play_button.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
                this.classList.remove("yb-playerBounceDown-once");

            });

            
        }
        // video_player.setAttribute("style", "max-width: 100%; max-height:100%; margin-left: auto; margin-right: auto; display: block;");
        // let video_source = yb_createElement("source", `video-source-${bit.id}`, "video-source");
        // video_source.setAttribute("src", `${bit_video}`);
        
        // video_player.appendChild(video_source);
        attached_video_container.appendChild(video_player);
        

        //Add an observer to the video
        // video_observer.observe(video_player);

        return attached_video_container;
    }
}


function makeLinksClickable(text) {
    // Updated pattern to match URLs without http/https
    const urlPattern = /(https?:\/\/[^\s]+|www\.[^\s]+|[a-zA-Z0-9-]+\.[a-zA-Z]{2,}(\/[^\s]*)?)/g;
    // Replace URLs with clickable links, adding http:// if missing
    return text.replace(urlPattern, function(url) {
        // Prepend http:// if the URL doesn't start with http or https
        let href = url.startsWith('http') ? url : 'http://' + url;

        let domainName;

        try {
            const urlObj = new URL(href);
            domainName = urlObj.hostname; // Extract the domain name
        } catch (e) {
            console.error('Invalid URL:', url);
            domainName = url; // Fallback to the original URL if invalid
        }
        return `
            <a class="yb-link-ext" href="${href}" target="_blank">
                <svg class="yb-center-margin all" xmlns="http://www.w3.org/2000/svg" height="16px" viewBox="0 -960 960 960" width="16px">
                    <path d="M480.28-96Q401-96 331-126t-122.5-82.5Q156-261 126-330.96t-30-149.5Q96-560 126-629.5q30-69.5 82.5-122T330.96-834q69.96-30 149.5-30t149.04 30q69.5 30 122 82.5T834-629.28q30 69.73 30 149Q864-401 834-331t-82.5 122.5Q699-156 629.28-126q-69.73 30-149 30ZM432-172v-68q-20 0-34-14.1T384-288v-48L175-545q-4 19-5.5 35t-1.5 30q0 115 74.5 203T432-172Zm288-109q18-21 31.5-44t22.36-48.55q8.86-25.56 13.5-52.5Q792-453 792-480q0-94.61-52-172.8Q688-731 600-768v24q0 29.7-21.15 50.85Q557.7-672 528-672h-96v48q0 20.4-13.8 34.2Q404.4-576 384-576h-48v96h240q20.4 0 34.2 13.8Q624-452.4 624-432v96h41q23 0 39 16t16 39Z"/>
                </svg>
                <p style="margin: 0;">${domainName}</p>
            </a>
         `;
    });
}

/*
    * Function to create the body of a bit
    * @param {object} bit - the bit object
    * @returns {object} body - the body element
*/

function yb_createBody(bit) {
    var body = yb_createElement("div", "yb-body-bit", `body-bit-${bit.id}`);
    let custom = bit.custom;
    let text_color = custom.text_color;
    const paragraph = yb_createElement("p", "yb-bodyText-bit yb-autoText font-medium", `bit-bodyText-${bit.id}`);
    paragraph.style.lineHeight = "1.5";

    if (USER_AUTHORIZED == "true") {
        if (yb_getSessionValues("bit-colors-on") == "True" && yb_getSessionValues("only-my-colors") == "False"){
            paragraph.style.color = text_color;
        }
    }
    paragraph.innerHTML = makeLinksClickable(bit.body);

    if (bit.type === "chat" && bit.body.length > 500){
        console.log("Chat bit with long body")
        let show_more_backdrop = yb_createElement("div", "yb-showMore-backdrop", `show-more-backdrop-${bit.id}`);
        let show_more = yb_createElement("p", "yb-showMore-bit yb-autoText", `show-more-${bit.id}`);
        show_more.innerHTML = "Show More";
        show_more.style.cursor = "pointer";
        show_more.setAttribute("data-catid", bit.id);

        show_more_backdrop.appendChild(show_more);
        body.appendChild(show_more_backdrop);

        show_more.addEventListener("click", yb_expandBit);
    }

    body.appendChild(paragraph);


    return body;
}


/*
    * Function to create the title of a bit
    * @param {object} bit - the bit object
    * @returns {object} title - the title element
*/

function createTitle(bit) {
    const title = yb_createElement("div", `yb-title-bit yb-margin-T10 ${bit.type}`, `title-bit-${bit.id}`);
    let custom = bit.custom;
    let bit_title_color;
    try {
        if (CUSTOM_CONFIG["bit-colors-on"] == "True"){
            bit_title_color = custom.title_color;
            
            if (bit.type == "video") {
                title.innerHTML = `
                    <svg class="yb-center-margin tb" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="${bit_title_color}"><path d="m380-300 280-180-280-180v360ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/></svg>
                    <h2 class="yb-titleText-bit ${bit.type} ybv-preview-title" style="color: ${bit_title_color};">${makeLinksClickable(bit.title)}</h2>
                    <p class="bit-view-count" style="color: ${bit.custom.text_color};">${bit.watch_count} views</p>
                `;
            } else {
                title.innerHTML = `<h2 class="yb-titleText-bit ${bit.type}" style="color: ${bit_title_color};">${makeLinksClickable(bit.title)}</h2>`;
            }
        } else {
            if (bit.type == "video") {
                title.innerHTML = `
                    <svg class="yb-autoFill yb-center-margin tb" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"><path d="m380-300 280-180-280-180v360ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/></svg>
                    <h2 class="yb-autoText yb-titleText-bit ybv-preview-title ${bit.type}"">${makeLinksClickable(bit.title)}</h2>
                    <p class="bit-view-count" style="color: ${bit.custom.text_color};">${bit.watch_count} views</p>
                `;
            } else {
                title.innerHTML = `<h2 class="yb-autoText yb-titleText-bit ${bit.type}">${makeLinksClickable(bit.title)}</h2>`;
            }
        }
    } catch {
        if (bit.type == "video") {
            title.innerHTML = `
                <svg class="yb-autoFill yb-center-margin tb" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"><path d="m380-300 280-180-280-180v360ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/></svg>
                <h2 class="yb-autoText yb-titleText-bit ybv-preview-title ${bit.type}"">${makeLinksClickable(bit.title)}</h2>
                <p class="bit-view-count" style="color: ${bit.custom.text_color};">${bit.watch_count} views</p>
            `;
        } else {
            title.innerHTML = `<h2 class="yb-autoText yb-titleText-bit ${bit.type}">${makeLinksClickable(bit.title)}</h2>`;
        }
            
    }
    return title;
}

/*
    * Function to create the body of a bit
    * @param {object} bit - the bit object
    * @returns {object} description - the description element
*/
/*
    * Function to create the interactions for a bit
    * @param {object} bit - the bit object
    * @returns {object} interactions - the interactions element
*/


function yb_createInteractions(bit) {
    let bit_interactions = yb_createElement("div", `yb-container-bitFeedback`, `bit-feedback-${bit.type}`);
    
    //Interactions
    let like_count = bit.like_count;
    let dislike_count = bit.dislike_count;
    let comment_count = bit.comment_count;

    //Likes
    let like_button = yb_createButton("like", "yb-button-feedback pointer-object", `like-${bit.id}`);
    like_button.setAttribute("data-catid", bit.id)
    like_button.innerHTML = `<svg id="feedback-icon-source" class="yb-icon-bit" xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path id="like-icon-${bit.id}" style="fill: white;" d="M15.5 11Q16.15 11 16.575 10.575Q17 10.15 17 9.5Q17 8.85 16.575 8.425Q16.15 8 15.5 8Q14.85 8 14.425 8.425Q14 8.85 14 9.5Q14 10.15 14.425 10.575Q14.85 11 15.5 11ZM8.5 11Q9.15 11 9.575 10.575Q10 10.15 10 9.5Q10 8.85 9.575 8.425Q9.15 8 8.5 8Q7.85 8 7.425 8.425Q7 8.85 7 9.5Q7 10.15 7.425 10.575Q7.85 11 8.5 11ZM12 17.5Q13.775 17.5 15.137 16.525Q16.5 15.55 17.1 14H15.45Q14.925 14.9 14.025 15.45Q13.125 16 12 16Q10.875 16 9.975 15.45Q9.075 14.9 8.55 14H6.9Q7.5 15.55 8.863 16.525Q10.225 17.5 12 17.5ZM12 22Q9.925 22 8.1 21.212Q6.275 20.425 4.925 19.075Q3.575 17.725 2.788 15.9Q2 14.075 2 12Q2 9.925 2.788 8.1Q3.575 6.275 4.925 4.925Q6.275 3.575 8.1 2.787Q9.925 2 12 2Q14.075 2 15.9 2.787Q17.725 3.575 19.075 4.925Q20.425 6.275 21.212 8.1Q22 9.925 22 12Q22 14.075 21.212 15.9Q20.425 17.725 19.075 19.075Q17.725 20.425 15.9 21.212Q14.075 22 12 22ZM12 12Q12 12 12 12Q12 12 12 12Q12 12 12 12Q12 12 12 12Q12 12 12 12Q12 12 12 12Q12 12 12 12Q12 12 12 12ZM12 20Q15.325 20 17.663 17.663Q20 15.325 20 12Q20 8.675 17.663 6.337Q15.325 4 12 4Q8.675 4 6.338 6.337Q4 8.675 4 12Q4 15.325 6.338 17.663Q8.675 20 12 20Z"/></svg>`;
    
    let bit_button_color = bit.custom.button_color;
    let bit_icon_color = bit.custom.button_text_color;

    //Check if bit is liked

    if (bit.is_liked){
        like_button.innerHTML = `<svg id="feedback-icon-source" class="yb-icon-bit" xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path id="like-icon-${bit.id}" class="yb-bit-icon active" style="fill: ${bit.custom.icon_color};" d="M15.5 11Q16.15 11 16.575 10.575Q17 10.15 17 9.5Q17 8.85 16.575 8.425Q16.15 8 15.5 8Q14.85 8 14.425 8.425Q14 8.85 14 9.5Q14 10.15 14.425 10.575Q14.85 11 15.5 11ZM8.5 11Q9.15 11 9.575 10.575Q10 10.15 10 9.5Q10 8.85 9.575 8.425Q9.15 8 8.5 8Q7.85 8 7.425 8.425Q7 8.85 7 9.5Q7 10.15 7.425 10.575Q7.85 11 8.5 11ZM12 17.5Q13.775 17.5 15.137 16.525Q16.5 15.55 17.1 14H15.45Q14.925 14.9 14.025 15.45Q13.125 16 12 16Q10.875 16 9.975 15.45Q9.075 14.9 8.55 14H6.9Q7.5 15.55 8.863 16.525Q10.225 17.5 12 17.5ZM12 22Q9.925 22 8.1 21.212Q6.275 20.425 4.925 19.075Q3.575 17.725 2.788 15.9Q2 14.075 2 12Q2 9.925 2.788 8.1Q3.575 6.275 4.925 4.925Q6.275 3.575 8.1 2.787Q9.925 2 12 2Q14.075 2 15.9 2.787Q17.725 3.575 19.075 4.925Q20.425 6.275 21.212 8.1Q22 9.925 22 12Q22 14.075 21.212 15.9Q20.425 17.725 19.075 19.075Q17.725 20.425 15.9 21.212Q14.075 22 12 22ZM12 12Q12 12 12 12Q12 12 12 12Q12 12 12 12Q12 12 12 12Q12 12 12 12Q12 12 12 12Q12 12 12 12Q12 12 12 12ZM12 20Q15.325 20 17.663 17.663Q20 15.325 20 12Q20 8.675 17.663 6.337Q15.325 4 12 4Q8.675 4 6.338 6.337Q4 8.675 4 12Q4 15.325 6.338 17.663Q8.675 20 12 20Z"/></svg>`;
        like_button.classList.add("active");
        if (yb_getSessionValues("bit-colors-on") == "True" && yb_getSessionValues("only-my-colors") == "False"){
            like_button.style.backgroundColor = bit.custom.button_color;
        }
        
        

    } 

    
    bit_interactions.appendChild(like_button);
    
    //Like Counter
    let like_counter = yb_createElement("p", "counter", `like-count-${bit.id}`);
    like_counter.innerHTML = like_count;
    bit_interactions.appendChild(like_counter);
    
    ;

    //Like Event Listener
    like_button.addEventListener("click", yb_pressLike);
    
    //Dislikes
    let dislike_button = yb_createButton("dislike", "yb-button-feedback pointer-object", `dislike-${bit.id}`);
    dislike_button.setAttribute("data-catid", bit.id);

    let dislike_html = `<svg id="feedback-icon-source" class="yb-icon-bit" xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path id="dislike-icon-${bit.id}" style="fill:white;" d="M620-520q26 0 43-17t17-43q0-26-17-43t-43-17q-26 0-43 17t-17 43q0 26 17 43t43 17Zm-280 0q26 0 43-17t17-43q0-26-17-43t-43-17q-26 0-43 17t-17 43q0 26 17 43t43 17ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-400Zm0 320q133 0 226.5-93.5T800-480q0-133-93.5-226.5T480-800q-133 0-226.5 93.5T160-480q0 133 93.5 226.5T480-160ZM325-280q7 0 14.5-4t11.5-10q22-30 55-48t74-18q41 0 74 18t55 48q4 6 11 10t14 4q18 0 26.5-16t-3.5-34q-26-39-73-64.5T480-420q-57 0-104 25.5T302-328q-11 17-2.5 32.5T325-280Z"/></svg>`
    dislike_button.innerHTML = dislike_html;
    //Check if user has already liked this bit

    if (bit.is_disliked){
        dislike_button.innerHTML = `
        <svg id="feedback-icon-source" class="yb-icon-bit" xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path id="dislike-icon-${bit.id}" style="fill:${bit.custom.icon_color};" class="yb-bit-icon active" d="M620-520q26 0 43-17t17-43q0-26-17-43t-43-17q-26 0-43 17t-17 43q0 26 17 43t43 17Zm-280 0q26 0 43-17t17-43q0-26-17-43t-43-17q-26 0-43 17t-17 43q0 26 17 43t43 17ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-400Zm0 320q133 0 226.5-93.5T800-480q0-133-93.5-226.5T480-800q-133 0-226.5 93.5T160-480q0 133 93.5 226.5T480-160ZM325-280q7 0 14.5-4t11.5-10q22-30 55-48t74-18q41 0 74 18t55 48q4 6 11 10t14 4q18 0 26.5-16t-3.5-34q-26-39-73-64.5T480-420q-57 0-104 25.5T302-328q-11 17-2.5 32.5T325-280Z"/></svg>
        `;
        dislike_button.classList.add("active");

        if (yb_getSessionValues("bit-colors-on") == "True" && yb_getSessionValues("only-my-colors") == "False"){
            dislike_button.style.backgroundColor = bit.custom.button_color;
        }
        

        
    } 

    

    bit_interactions.appendChild(dislike_button);
    let dislike_counter = yb_createElement("p", "counter", `dislike-count-${bit.id}`);
    dislike_counter.innerHTML = dislike_count;
    bit_interactions.appendChild(dislike_counter);
    
    dislike_button.addEventListener("click", yb_pressDislike);

    //Comments
    let comment_button = yb_createButton("show-comment", "yb-button-feedback pointer-object", `show-comment-${bit.id}`);
    comment_button.setAttribute("data-catid", bit.id)
    comment_button.setAttribute("data-state", "show")
    comment_button.innerHTML = `<svg id="feedback-icon-source" class="yb-icon-bit" xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path style="fill: white;" id="comment-icon-${bit.id}" d="M6 14H18V12H6ZM6 11H18V9H6ZM6 8H18V6H6ZM22 22 18 18H4Q3.175 18 2.588 17.413Q2 16.825 2 16V4Q2 3.175 2.588 2.587Q3.175 2 4 2H20Q20.825 2 21.413 2.587Q22 3.175 22 4ZM4 4V16Q4 16 4 16Q4 16 4 16H18.825L20 17.175V4Q20 4 20 4Q20 4 20 4H4Q4 4 4 4Q4 4 4 4ZM4 4V17.175V16Q4 16 4 16Q4 16 4 16V4Q4 4 4 4Q4 4 4 4Q4 4 4 4Q4 4 4 4Z"/></svg>`
    bit_interactions.appendChild(comment_button);

    //Comment Button Event Listener
    comment_button.addEventListener("click", yb_pressShowComments);
    

    //Comment Counter
    let comment_counter = yb_createElement("p", "counter", `comment-count-${bit.id}`);
    comment_counter.innerHTML = comment_count;
    bit_interactions.appendChild(comment_counter);

    if (bit.is_public) {
        
        //Shares
        let share_button = yb_createButton("share", "yb-button-feedback", `share-${bit.id}`);
        share_button.innerHTML = `<svg id="feedback-icon-source" class="yb-icon-bit" xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path style="fill: white;" d="M6 23Q5.175 23 4.588 22.413Q4 21.825 4 21V10Q4 9.175 4.588 8.587Q5.175 8 6 8H9V10H6Q6 10 6 10Q6 10 6 10V21Q6 21 6 21Q6 21 6 21H18Q18 21 18 21Q18 21 18 21V10Q18 10 18 10Q18 10 18 10H15V8H18Q18.825 8 19.413 8.587Q20 9.175 20 10V21Q20 21.825 19.413 22.413Q18.825 23 18 23ZM11 16V4.825L9.4 6.425L8 5L12 1L16 5L14.6 6.425L13 4.825V16Z"/></svg>`
        share_button.setAttribute("data-id", bit.id)
        bit_interactions.appendChild(share_button);


        share_button.addEventListener("click", yb_pressShare);

        let share_counter = yb_createElement("p", "counter", `share-count-${bit.id}`);
        share_counter.innerHTML = "0";
        bit_interactions.appendChild(share_counter);
    }

    if (bit.is_tips) {
        //Dontation
        let donate_button = yb_createButton("donate", "yb-button-feedback pointer-object", `donate-bit-${bit.id}`);
        donate_button.innerHTML = `<svg id="feedback-icon-source" class="yb-icon-bit" xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path style="fill: white;" d="M11.025 21V18.85Q9.7 18.55 8.738 17.7Q7.775 16.85 7.325 15.3L9.175 14.55Q9.55 15.75 10.288 16.375Q11.025 17 12.225 17Q13.25 17 13.963 16.538Q14.675 16.075 14.675 15.1Q14.675 14.225 14.125 13.712Q13.575 13.2 11.575 12.55Q9.425 11.875 8.625 10.938Q7.825 10 7.825 8.65Q7.825 7.025 8.875 6.125Q9.925 5.225 11.025 5.1V3H13.025V5.1Q14.275 5.3 15.088 6.012Q15.9 6.725 16.275 7.75L14.425 8.55Q14.125 7.75 13.575 7.35Q13.025 6.95 12.075 6.95Q10.975 6.95 10.4 7.438Q9.825 7.925 9.825 8.65Q9.825 9.475 10.575 9.95Q11.325 10.425 13.175 10.95Q14.9 11.45 15.788 12.537Q16.675 13.625 16.675 15.05Q16.675 16.825 15.625 17.75Q14.575 18.675 13.025 18.9V21Z"/></svg>`
        bit_interactions.appendChild(donate_button);
    }

    return bit_interactions;
    
}    

/*
    Function for creating a comment field
    `@param {object} bit - the bit object
    `@returns {object} comment_field_container - the comment field container element
*/


function yb_buildCommentField(bit) {
    let comment_field_container = yb_createElement("div", "yb-container-commentField", `field-write-comment-${bit.id}`);
    
    //Comment Field
    let comment_field = yb_createElement("input", "yb-field-commentField field-border yb-autoText", `field-write-comment-${bit.id}`);
    comment_field.setAttribute("placeholder", "Write Comment");
    comment_field_container.appendChild(comment_field);

    $(comment_field).on("change keyup", function(e){
        if (e.key === "Enter"){
            if (e.currentTarget.value.length > 0){
                let this_id = e.currentTarget.getAttribute("data-catid");
                submit_comment_button.click();
            }
        }
    });

    //Comment Submit Button
    let submit_comment_button = yb_createButton("send_comment", "yb-send-comment", `button-submit-comment-${bit.id}`)
    submit_comment_button.setAttribute("data-catid", bit.id);
    submit_comment_button.innerHTML = `<svg style="display: block; top: 50%; left: 50%; transform: translate(-50%, -50%); position: absolute;" xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path style="fill: white;" d="M6 19.05 7.975 18.25Q7.725 17.525 7.513 16.775Q7.3 16.025 7.175 15.275L6 16.075Q6 16.075 6 16.075Q6 16.075 6 16.075ZM10 18H14Q14.45 17 14.725 15.562Q15 14.125 15 12.625Q15 10.15 14.175 7.937Q13.35 5.725 12 4.525Q10.65 5.725 9.825 7.937Q9 10.15 9 12.625Q9 14.125 9.275 15.562Q9.55 17 10 18ZM12 13Q11.175 13 10.588 12.412Q10 11.825 10 11Q10 10.175 10.588 9.587Q11.175 9 12 9Q12.825 9 13.413 9.587Q14 10.175 14 11Q14 11.825 13.413 12.412Q12.825 13 12 13ZM18 19.05V16.075Q18 16.075 18 16.075Q18 16.075 18 16.075L16.825 15.275Q16.7 16.025 16.488 16.775Q16.275 17.525 16.025 18.25ZM12 1.975Q14.475 3.775 15.738 6.55Q17 9.325 17 13Q17 13 17 13Q17 13 17 13L19.1 14.4Q19.525 14.675 19.763 15.125Q20 15.575 20 16.075V22L15.025 20H8.975L4 22V16.075Q4 15.575 4.238 15.125Q4.475 14.675 4.9 14.4L7 13Q7 13 7 13Q7 13 7 13Q7 9.325 8.262 6.55Q9.525 3.775 12 1.975Z"/></svg>`
    comment_field_container.appendChild(submit_comment_button);

    submit_comment_button.addEventListener("click", yb_pressSendComment);

    return comment_field_container;
}

/*
    * Function for building a bit
    * @param {object} bit - the bit object
    * @returns {object} built_bit - the built bit element
    * @returns {string} element_id - the element id of the built bit
    
*/

function yb_buildBit(bit, interactions=true){
    
    console.log("Build bit running...");
    console.log(bit);
    
    //Bit information
    let id = bit.id;
    let time = bit.time;
    
    //Set Element Class (Defines layout and styling)
    let type = bit.type;

    //Define bit ID which is returned to position bit in feed index
    let element_id = `#bit-${bit.id}`;

    //User and Profile
    let user = bit.profile;

    let name = bit.display_name

    let username = user.username;

    //Customizations
    let custom = bit.custom;

    //colors
    let primary_color = custom.primary_color;
    let accent_color = custom.accent_color;
    let title_color = custom.title_color;
    let text_color = custom.text_color;
    let feedback_icon_color = custom.button_color;
    let feedback_background_color = custom.button_text_color;
    let paragraph_align = custom.paragraph_align;

    
    //Prepare new bit by creating an element
    new_bit = yb_createElement("div",`yb-element-background yb-bit-shell ${type}bit`, `bit-${id}`);
    
    console.log(yb_getSessionValues("bit-colors-on"));   
    console.log(yb_getSessionValues("only-my-colors"));

    
    
    try {
        console.log("Flat mode on: " + CUSTOM_CONFIG["flat-mode-on"]);
        if (CUSTOM_CONFIG["flat-mode-on"] == "True"){
            new_bit.style.backgroundColor = "transparent";
        } else {
            if (yb_getSessionValues("bit-colors-on") == "True" && yb_getSessionValues("only-my-colors") == "False"){
                new_bit.style.backgroundColor = primary_color;
            } 

        }
    } catch {
        new_bit.style.backgroundColor = "transparent";
    }
    

    //Apply All Attributes: element id, element class, data type, data-id, data-button-color, data icon color, data background color, style
    new_bit.setAttribute("data-type", `${type}`);
    new_bit.setAttribute("data-id", `${id}`);
    new_bit.setAttribute("data-userid", `${user.id}`);
    new_bit.setAttribute("data-username", `${username}`);
    new_bit.setAttribute("data-button-color", `${feedback_background_color}`);
    new_bit.setAttribute("data-icon-color", `${feedback_icon_color}`);
    new_bit.setAttribute("data-secondary-color", `${accent_color}`);
    new_bit.setAttribute("data-primary-color", `${primary_color}`);
    new_bit.setAttribute("data-title-color", `${title_color}`);
    new_bit.setAttribute("data-text-color", `${text_color}`);

    //generate header
    new_bit.appendChild(createHeader(bit));

    //Content Attachments
    if (type === "video" || type === "photo"){
        let media = yb_addMedia(type, bit);

        new_bit.appendChild(media); 
    }

    let rendered_title = createTitle(bit);
    new_bit.appendChild(rendered_title);

    
    console.log("Title Color: " + title_color);



    if (type != "video") {
    //Body
        let rendered_body = yb_createBody(bit);
        rendered_body.style.color = text_color;
        console.log("Title Color: " + text_color);  
        new_bit.appendChild(rendered_body);
        

    //Append interaction container
        if (USER_AUTHORIZED == "true") {
            console.log(USER_AUTHORIZED)
            if (interactions){
                new_bit.appendChild(yb_createInteractions(bit));
                //Comment Label
                let comment_label = yb_createElement("p", "comment-label", `comment-label-${id}`);
                comment_label.innerHTML = "Comments";
                comment_label.setAttribute("style", `display: none; color: ${title_color}; font-weight: bold;`)
                new_bit.appendChild(comment_label);

                let comment_container = yb_createElement("div", "yb-comment-container yb-comment-list", `comment-container-${id}`);
                new_bit.appendChild(comment_container);
            
                //Append comment field
                new_bit.appendChild(yb_buildCommentField(bit)); 

            }
        }
        
    }

    return {'element_id':element_id, 'built_bit':new_bit}
}

/* 
    *Function for generating comment bubbles
    * @param {object} comment - the comment object
    * @returns {object} comment_bubble - the comment bubble element
*/

function yb_buildComment(comment){
    //Set up variables
    let user = comment.profile;
    let sender_name = user.display_name;
    let custom = comment.custom;
    let comment_id = comment.id;
    let time = comment.time;
    let body = comment.body;
    let this_id = yb_getSessionValues("id");
    let is_sender;
    let comment_bubble;
    let comment_wrapper;
    let this_bit = document.getElementById(`bit-${comment.bit}`);
    let primary_color = this_bit.getAttribute("data-primary-color");
    let secondary_color = "#4b4b4b";

    console.log()
    console.log(this_id)
    //Check if user is sender
    if (user.id === parseInt(this_id)){
        
        is_sender = true;
    } else {
        is_sender = false;
    }

    //Build comment bubble right side for sender and left side for receiver
    if (is_sender === true){
        //Build comment bubble for sender
        comment_wrapper = yb_createElement("div", "yb-comment-shell", `comment-shell-${comment_id}`);
        comment_bubble = yb_createElement("div", "yb-comment-item right font-medium", `comment-${comment_id}`);
        comment_bubble.setAttribute("data-catid", comment_id);
        comment_bubble.setAttribute("style", `background-color: ${primary_color}`);
        //Create profile image
        comment_delete_button = yb_createElement(
            "div", 
            "yb-delete-comment pointer-object circle border-none", 
            `delete-comment-${comment_id}`, 
        );
        
        comment_delete_button.innerHTML = `<svg class="yb-center-transform all yb-icon small" xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/></svg>`;
        comment_delete_button.setAttribute("data-catid", comment_id);
        comment_delete_button.setAttribute("data-bitid", comment.bit);
        comment_bubble.appendChild(comment_delete_button);

        comment_delete_button.addEventListener("click", yb_pressCommentDelete);
        
        //Create comment name
        let comment_name = yb_createElement("p", "comment-name", `comment-name-${comment_id}`);
        comment_name.innerHTML = sender_name;
        comment_bubble.appendChild(comment_name);
        
        //Create comment body
        let comment_body = yb_createElement("p", "comment-body", `comment-body-${comment_id}`,);
        comment_body.innerHTML = body;
        comment_bubble.appendChild(comment_body);
        
        //Create comment time
        let comment_time = yb_createElement("p", "comment-time", `comment-time-${comment_id}`,);
        comment_time.innerHTML = `<small class="font-small" style="color:gray;">${time}</small>`;
        comment_bubble.appendChild(comment_time);
        comment_wrapper.appendChild(comment_bubble);
        return comment_wrapper

    } else {
        //Build comment bubble for sender
        comment_wrapper = yb_createElement("div", "yb-comment-shell", `comment-shell-${comment_id}`);
        comment_bubble = yb_createElement("div", "yb-comment-item left font-medium", `comment-${comment_id}`);
        comment_bubble.setAttribute("data-cat-id", comment_id);
        comment_bubble.setAttribute("style", `background-color: ${primary_color}`);

        //Create comment image
        // rendered_image = yb_renderImage(profile_image, "image-hang right", "yb-comment-image");
        // comment_bubble.appendChild(rendered_image);

        //Create comment name
        let comment_name = yb_createElement("p", "comment-name", `comment-name-${comment_id}`);
        comment_name.innerHTML = sender_name;
        comment_bubble.appendChild(comment_name);

        //Create comment body
        let comment_body = yb_createElement("p", "comment-body", `comment-body-${comment_id}`);
        comment_body.innerHTML = body;
        comment_bubble.appendChild(comment_body);

        //Create comment time
        let comment_time = yb_createElement("p", "comment-time", `comment-time-${comment_id}`);
        comment_time.innerHTML = `<small>${time}</small>`;
        comment_bubble.appendChild(comment_time);
        return comment_bubble;

    }    
}