/*
    Universal Create Bit Functions
*/

var bit_submit_button = document.getElementById("button-submit-bit");
var bit_options_button = document.getElementById("bit-options-button");
var add_video_button = document.getElementById("add-video-button");
var add_photo_button = document.getElementById("add-photo-button");
var chat_type_button = document.getElementById("text-type-button");
var video_type_button = document.getElementById("video-type-button");
var photo_type_button = document.getElementById("photo-type-button");
var bit_type_field = document.getElementById("bb-field-bitType");
var type_buttons = document.querySelectorAll(".type-button");
var private_toggle = document.getElementById("bb-field-bitScope");
var upload_id_field = document.getElementById('bb-field-uploadId')

var photo_upload_field = document.getElementById("bb-field-bitPhoto");
var cropped_photo_upload_field = document.getElementById("bb-field-bitPhoto-cropped");
var video_upload_field = document.getElementById("bb-field-bitVideo");

var bit_schedule_button = document.getElementById("bb-schedule-button");
var bit_options_button = document.getElementById("bb-options-button");
var bit_monetize_button = document.getElementById("bb-monetize-button");
var bit_customize_button = document.getElementById("bb-customize-button");
var muxUploader = document.querySelector("mux-uploader");
var video_upload_id = "";


var cropped_photo;

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

    //Title

    let title_content= yb_createInput("text", `yb-builderBit bb-titleField`, "bb-field-bitTitle", "Bit Title");
    title_content.setAttribute("style", `color:${title_color}; text-align:center;`);

    new_bit.appendChild(title_content);

    //Body

    //Content Attachments
    
    if (type === 'photo'){

        let attachment = yb_createElement("div", `yb-builderBit bb-imgField`, "bb-field-img");
        attachment.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M440-280h80v-160h160v-80H520v-160h-80v160H280v80h160v160Zm40 200q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Z"/></svg><p>Upload Photo</p>`;
    }

    if (type === 'video'){
        
        let video_player = yb_createElement("div", `yb-builderBit bb-videoField`, "bb-field-video");
        video_player.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M440-280h80v-160h160v-80H520v-160h-80v160H280v80h160v160Zm40 200q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Z"/></svg><p>Upload Photo</p>`;
    
    }
    

    let text_content = yb_createInput("textarea", `yb-builderBit bb-field-body`, `bb-field-body`, "What's on your mind?")
    

    new_bit.appendChild(text_content)

    return new_bit;


}


function yb_clickFieldButton(button, field){

        console.log("clicked");
        let this_field = document.getElementById(field);
        let this_button = document.getElementById(button);
        
        $(this_button).animate({"transform": "translateX(-50%) scale(0)"}, 'fast');
        $(this_button).hide('fast', function(){
            $(this_field).show('fast', function(){
                $(this_field).animate({"transform": "translateX(-50%) scale(1,1)"}, 500);
                $(this_field).focus();
            });
        });
        
}

function yb_blurTextField(field, button, preview) {

    let this_field = document.getElementById(field);
    let this_button = document.getElementById(button);
    let this_preview = document.getElementById(preview);
            
    if (this_field.value === ""){
        $(this_field).hide('fast', function(){
            $(this_button).show('fast', function(){
                $(this_button).animate({"transform": "translateX(-50%) scale(1,1)"}, 500);
            });
        });
        

    } else {
        
        let title = this_field.value;
        console.log(title);
        this_preview.innerHTML = title.replace(/\n/g, "<br>");
        
        $(this_field).animate({"transform": "translateX(-50%) scale(0,0)"}, 500, function(){
            $(this_field).hide('fast', function(){
                $(this_preview).show('fast');
            });
        });

        
        
        this_preview.addEventListener("click", function(){
            $(this_preview).fadeOut('fast', function(){
                $(this_field).show('fast', function(){
                    $(this_field).animate({"transform": "translateX(-50%) scale(1,1)"}, 500);
                    this_field.focus();
                });
            });
            
        });
    };
}

function yb_assembleBitData() {
    let type = document.getElementById("bb-field-bitType").value;
    this_data = new FormData();
    this_data.append('type', type);
    if (type === "photo"){
        let image = document.getElementById("bb-field-bitPhoto").files[0];
        this_data.append('image', image);

        var crop_data = yb_getCropData();
        this_data.append('crop_data', JSON.stringify(crop_data));

        let tags = document.getElementById("bb-field-bitTags").value;
        this_data.append('tags', tags);

    } else if (type === "video"){
        let upload_id = document.getElementById("bb-field-uploadId").value;
        this_data.append('upload_id', upload_id);
        let tags = document.getElementById("bb-field-bitTags").value;
        this_data.append('tags', tags);

        let thumbnail_option = document.getElementById("bb-field-thumbnailOption").value;
        this_data.append("thumbnail_option", thumbnail_option);

        if (thumbnail_option == "upload"){
            let thumbnail_image = document.getElementById("bb-field-thumbnail");
            this_data.append('thumbnail', thumbnail_image);
        } else if (thumbnail_option == "choose") {
            let thumbnail_frame = document.getElementById("bb-frame-select");
            this_data.append("thumbnail_frame", thumbnail_frame)
        }
    }

    let scope = document.getElementById("bb-field-bitScope").value;
    this_data.append('scope', scope);

    let title = document.getElementById("bb-field-bitTitle").value;
    this_data.append('title', title);
    let body = document.getElementById("bb-field-body").value;
    this_data.append('body', body);

    let shoutouts = document.getElementById("bb-field-bitShoutouts").value;
    this_data.append('shoutouts', shoutouts);
    let csrf_token = getCSRF();

    yb_createBit(this_data, csrf_token); //Located in yb_bits/static/scripts/yb_bits/yb_ajax.js

}


/*
  Endpoint should be a function that returns a promise and resolves
  with a string for the upload URL.
*/

muxUploader.endpoint = function () {
    // Fetch the upload details from the server
    return fetch("/video/api/get-mux-url/")
      .then(res => res.json()) // Parse the response as JSON
      .then(data => {
        // Separate upload_id and upload_url
        document.getElementById("bb-field-uploadId").value = data.upload_id; // Store the upload_id for future reference
        return data.upload_url;    // Return the upload_url for the mux uploader
      })
      .catch(err => {
        console.error("Error fetching the Mux URL:", err);
      });
  };

muxUploader.addEventListener("success", function (event) {
  console.log("Upload successful!", event);
  yb_assembleBitData();
});  

function yb_handleCreateBit(){
    let type = document.getElementById("bb-field-bitType").value;
    if (type === "video"){
        const file = video_upload_field.files[0];  // Get the file from your custom file input
        if (file) {
            
            const hiddenFileInput = muxUploader.shadowRoot.querySelector('input[type="file"]');

            if (hiddenFileInput) {
                // Create a new DataTransfer object to simulate user file selection
                const dataTransfer = new DataTransfer();
                dataTransfer.items.add(file);  // Add the file to the DataTransfer object
                
                // Assign the file to the Mux Uploader's hidden input field
                hiddenFileInput.files = dataTransfer.files;

                // Trigger the 'change' event to start the upload
                hiddenFileInput.dispatchEvent(new Event('change'));
            }
        }
    }
    else {
        yb_assembleBitData();
    }
}  

$(document).ready(function(){
    let title_button = document.getElementById("title-bit-preview-button");
    let title_field = document.getElementById("bb-field-bitTitle");
    title_button.addEventListener("click", function(){
        yb_clickFieldButton("title-bit-preview-button", "bb-field-bitTitle");
    });

    title_field.addEventListener("blur", function(){
        yb_blurTextField("bb-field-bitTitle", "title-bit-preview-button", "title-bit-preview");
    });

    let desc_button = document.getElementById("description-bit-preview-button");
    let desc_field = document.getElementById("bb-field-body");
    desc_button.addEventListener("click", function(){
        yb_clickFieldButton("description-bit-preview-button", "bb-field-body");
    });

    desc_field.addEventListener("blur", function(){
        yb_blurTextField("bb-field-body", "description-bit-preview-button", "description-bit-preview");
    });

    let shoutout_button = document.getElementById("shoutout-bit-preview-button");
    let shoutout_field = document.getElementById("bb-field-bitShoutouts");
    shoutout_button.addEventListener("click", function(){
        yb_clickFieldButton("shoutout-bit-preview-button", "bb-field-bitShoutouts");
    });

    shoutout_field.addEventListener("blur", function(){
        yb_blurTextField("bb-field-bitShoutouts", "shoutout-bit-preview-button", "shoutout-bit-preview");
    });

    try {
        let tags_button = document.getElementById("tags-bit-preview-button");
        let tags_field = document.getElementById("bb-field-bitTags");
        tags_button.addEventListener("click", function(){
            yb_clickFieldButton("tags-bit-preview-button", "bb-field-bitTags");
        });

        tags_field.addEventListener("blur", function(){
            yb_blurTextField("bb-field-bitTags", "tags-bit-preview-button", "tags-bit-preview");
        });

        console.log("Tags field found successfully")
    } catch (error) {
        console.log("No tags field found");        
    }

    bit_submit_button.addEventListener("click", function(){
        yb_handleCreateBit();
        //disable button
        bit_submit_button.disabled = true;
        bit_submit_button.innerHTML = "Uploading...";
        bit_submit_button.style.backgroundColor = "rgb(100, 100, 100)";
        bit_submit_button.classList.add("yb-bounce-infinite");
    });

});

function finishBitCrop(){
    cropped_photo = cropper.getCroppedCanvas().toDataURL();
    let cropped_photo_field = document.getElementById("bb-field-bitPhoto-cropped");
    
    yb_2WayPage(1, "cropper-bit");
    yb_collapse2Way();
    
    let photo = photo_upload_field.files[0];
    photo_preview = URL.createObjectURL(photo);

    let this_image = yb_renderImage(cropped_photo, "bit-preview-image", `bit-preview-image`, "Preview Image");

    add_photo_button.innerHTML = "";
    add_photo_button.appendChild(this_image);
    add_photo_button.classList.add("fast");
    add_photo_button.classList.add("yb-bounceDown-once");

}


function dataURItoBlob(dataURI) {
    // convert base64/URLEncoded data component to raw binary data held in a string
    var byteString;
    if (dataURI.split(',')[0].indexOf('base64') >= 0)
        byteString = atob(dataURI.split(',')[1]);
    else
        byteString = unescape(dataURI.split(',')[1]);
    // separate out the mime component
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    // write the bytes of the string to a typed array
    var ia = new Uint8Array(byteString.length);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ia], {type:mimeString});
    
}


$(document).ready(function(){
    chat_type_button.addEventListener("click", function(){
        console.log("clicked");
        if (bit_type_field !== "chat"){
            console.log("not chat");
            for (let i = 0; i < type_buttons.length; i++){
                type_buttons[i].classList.remove("active");
            }
            chat_type_button.classList.add("active");
            bit_type_field.value = "chat";

            if (add_video_button.classList.contains("active")){
                add_video_button.classList.remove("active");
            } else if (add_photo_button.classList.contains("active")){
                add_photo_button.classList.remove("active");
            }
        
        } else {
            console.log("Already active");
        }
    });

    video_type_button.addEventListener("click", function(){
        console.log("clicked");
        if (bit_type_field !== "video"){
            console.log("not video");
            for (let i = 0; i < type_buttons.length; i++){
                type_buttons[i].classList.remove("active");
            }
            video_type_button.classList.add("active");
            bit_type_field.value = "video";

            if (add_photo_button.classList.contains("active")){
                add_photo_button.classList.remove("active");
            }

            add_video_button.classList.add("active");
        
        } else {
            console.log("Already active");
        }
    });

    photo_type_button.addEventListener("click", function(){
        console.log("clicked");
        if (bit_type_field !== "photo"){
            console.log("not photo");
            for (let i = 0; i < type_buttons.length; i++){
                type_buttons[i].classList.remove("active");
            }
            photo_type_button.classList.add("active");
            bit_type_field.value = "photo";

            if (add_video_button.classList.contains("active")){
                add_video_button.classList.remove("active");
            } 

            add_photo_button.classList.add("active");
        
        } else {
            console.log("Already active");
        }
    });

    add_photo_button.addEventListener("click", function(){
        photo_upload_field.click();
        photo_upload_field.addEventListener("change", function(){
            // let photo = photo_upload_field.files[0];
            // photo_preview = URL.createObjectURL(photo);
            // let this_image = yb_renderImage(photo_preview, "bit-preview-image", `bit-preview-image`, "Preview Image");
            // add_photo_button.innerHTML = "";
            // add_photo_button.appendChild(this_image);
            // add_photo_button.classList.add("fast");
            // add_photo_button.classList.add("yb-bounceDown-once");
            yb_2WayPage(2, "cropper-bit");
            yb_expand2Way();
           
        });
        
    });

    add_video_button.addEventListener("click", function(){
        video_upload_field.click();
    });

    video_upload_field.addEventListener("change", function(event){
        
        yb_2WayPage(2, 'video-setup');
        yb_expand2Way();
    })


    $("#bit-date-preview").html(formattedDate);

    bit_schedule_button.addEventListener("click", function(){
        yb_2WayPage(2, "schedule-bit");
    });

    bit_options_button.addEventListener("click", function(){
        yb_2WayPage(2, "bit-publish-options");
    });

    bit_monetize_button.addEventListener("click", function(){
        yb_2WayPage(2, "monetize-bit");
    });

    bit_customize_button.addEventListener("click", function(){
        yb_2WayPage(2, "bb-customize-bit");
    });

    yb_startClock("time-label", "decorated-time");
});