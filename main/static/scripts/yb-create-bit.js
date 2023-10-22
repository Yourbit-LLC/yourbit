/*
    Universal Create Bit Functions
*/

//Function for generating bits
function BuildBitPreview(type){

    let time = bit.time;

    //Define bit ID which is returned to position bit in feed index
    let element_id = `#bit-preview`;

    //User and Profile
    let user = bit.user;
    let first_name = yb_getSessionValues("first_name");
    let last_name = yb_getSessionValues("last_name");
    let name = first_name + " " + last_name;

    let username = yb_getSessionValues("username");

    //Profile Image
    let profile_image = document.getElementById("profile-pic").src;

    //colors
    let primary_color = yb_getUserCustom('primary-color');
    let accent_color = yb_getUserCustom("accent-color");
    let title_color = yb_getUserCustom("title-color");
    let text_color = yb_getUserCustom("text-color");
    let paragraph_align = yb_getUserCustom("paragraph-align");

    let flat_mode_on = yb_getUserCustom('flat-mode-on')

    let background_color;

    if (flat_mode_on === "False"){
        background_color = primary_color;
    } else {
        background_color = "rgb(35, 35, 35);";
    }
    
    //Prepare new bit by creating an element
    new_bit = yb_createElement("div", `bit-${id}`, `yb-element-background post-wrapper container-bit-${type}`)

    //Title

    let title_content= yb_createElement("div", `yb-builderbit-title`, "bit-title");
    title_content.setAttribute("style", `color:${title_color}; text-align:center;`);

    let title_field = yb_createInput("text", "yb-bit-field", `field-title-bit-builder`);
    title_content.appendChild(title_field);

    new_bit.appendChild(title_content);
    //Body
    

    //generate header

    let header = yb_createElement("div", `header-bit-${id}`, "header-bit");

    let profile_image_container = yb_createElement("div", `profile-image-${id}`, "element-accent container-image-tiny");
    profile_image_container.setAttribute("data-username", username);
    profile_image_container.setAttribute("style", `border-color: ${accent_color};`);
    profile_image_container.innerHTML = `<img class="image-thumbnail-small" style="object-fit:fill; border-radius: 50%;" src="${profile_image}">`
    header.appendChild(profile_image_container);

    let user_info = yb_createElement("p", `bit-info-${id}`, "bit-user-info");

    user_info.innerHTML = `<strong id="chat-user-name" class="bit-name" style="color:${title_color};">${name}</strong> <small class="bit-username" style="color:${text_color};">@${username}</small>`
    header.appendChild(user_info)

    //Prepare time for viewing by splitting at "/" place the 2 pieces in the corresponding areas
    let split_time = time.split("/");

    let display_date = split_time [0];
    let display_time = split_time[1];
    
    let time_label = yb_createElement("p", `time-posted-${id}`, "bit-time-label");
    time_label.innerHTML = `${display_date}<br><small>${display_time}</small>`
    header.appendChild(time_label);

    new_bit.appendChild(header);

    //Content Attachments
    
    if (type === 'photo'){

        let attachment = yb_createElement("img", `photo-bit-${id}`, "attached-photo builder");
        attachment.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M440-280h80v-160h160v-80H520v-160h-80v160H280v80h160v160Zm40 200q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Z"/></svg><p>Upload Photo</p>`;
    }

    if (type === 'video'){
        
        let video_player = yb_createElement("div", `video-${id}`, "attached-video builder");
        video_player.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M440-280h80v-160h160v-80H520v-160h-80v160H280v80h160v160Zm40 200q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Z"/></svg><p>Upload Photo</p>`;
    
    }
    

    let text_content = yb_createElement("div", `description-bit-${id}`, `description-bit-${type} bit-description`)
    
    text_content.innerHTML = `
            <p style="color: ${text_color}; text-align:${paragraph_align}">Click to Add Text</p>
        
    `;

    new_bit.appendChild(text_content)

    new_bit.appendChild(comment_field_container)

    return new_bit;


}