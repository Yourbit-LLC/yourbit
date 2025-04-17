/*
    Universal Create Bit Functions
*/
var bit_submit_button = document.getElementById("button-submit-bit");
var bit_options_button = document.getElementById("bit-options-button");

var chat_type_button = document.getElementById("text-type-button");
var video_type_button = document.getElementById("video-type-button");
var photo_type_button = document.getElementById("photo-type-button");
var bit_type_field = document.getElementById("bb-field-bitType");
var type_buttons = document.querySelectorAll(".type-button");
var private_toggle = document.getElementById("bb-field-bitScope");
var upload_id_field = document.getElementById('bb-field-uploadId');
var muxUploader = document.querySelector("mux-uploader");
var video_upload_id = "";
var build_mode = document.getElementById("bb-field-buildMode").value;

//Configuration fields yb_bits/templates/yb_bits/bit_builder/builder_configuration.html
function yb_getCustomBitOverrides() {
    return {

    }
}

/*
    Builder Fields Index
    
    The object below is an index of all master fields in the bit builder form. When new fields are added 
    to the bit builder, they must be registered here with a name matching the fieldName suffix in the field ID. 
    The field name should be the same as the field name in the bit builder fields object. 

*/
var builderFields = {
    "data":
    {
        "title": document.getElementById("bb-field-bitTitle"),
        "body": document.getElementById("bb-field-body"),
        "tags": document.getElementById("bb-field-bitTags"),
        "shoutouts": document.getElementById("bb-field-bitShoutouts"),
        "scope": document.getElementById("bb-field-bitScope"),
        "type": document.getElementById("bb-field-bitType"),
        "photo": document.getElementById("bb-field-bitPhoto"),
        "crop_data": document.getElementById("bb-field-bitPhoto-cropped"),
        "video": document.getElementById("bb-field-bitVideo"),
        "thumbnail": document.getElementById("bb-field-thumbnailImage"),
        "thumbnail_frame": document.getElementById("bb-field-thumbnailFrame"),
        "thumbnail_option": document.getElementById("bb-field-thumbnailOption"),
        "upload_id": document.getElementById("bb-field-uploadId"),      
    },

    "config": 
    {  
        "is_scheduled": document.getElementById("bb-field-isScheduled"),
        "scheduled_date": document.getElementById("bb-field-scheduledDate"),
        "scheduled_time": document.getElementById("bb-field-scheduledTime"),
        "evaporate": document.getElementById("bb-field-hasExpiration"),
        "expiration_date": document.getElementById("bb-field-evaporationDate"),
        "expiration_time": document.getElementById("bb-field-evaporationTime"),
        "is_tips": document.getElementById("bb-field-isDonations"),
        "has_ads": document.getElementById("bb-field-hasAds"),
        "requires_subscription": document.getElementById("bb-field-requireSubscription"),
        "is_comments": document.getElementById("bb-field-isComments"),
        "is_shoutouts": document.getElementById("bb-field-isShoutouts"),
        "is_shareable": document.getElementById("bb-field-isShareable"),
        "is_feedback": document.getElementById("bb-field-isFeedback"),
        "is_tags": document.getElementById("bb-field-isTags"),
        "is_quiz": document.getElementById("bb-field-isQuiz"),
        "is_survey": document.getElementById("bb-field-isSurvey"),
        "is_customized": document.getElementById("bb-field-customOverride"),
        "build_mode": document.getElementById("bb-field-buildMode"),
    },
    
    "custom_overrides": 
    {
        "primary_color": document.getElementById("bb-field-primaryColor"),
        "accent_color": document.getElementById("bb-field-accentColor"),
        "title_color": document.getElementById("bb-field-titleColor"),
        "text_color": document.getElementById("bb-field-textColor"),
        // "paragraph_align": document.getElementById("bb-field-paragraphAlign").value,
        "button_color": document.getElementById("bb-field-buttonColor"),
        "button_text_color": document.getElementById("bb-field-buttonTextColor"),
    },

}

var builderButtons = {
    "title": document.getElementById("title-bit-preview-button"),
    "photo": document.getElementById("add-photo-button"),
    "video": document.getElementById("add-video-button"),
    "body": document.getElementById("description-bit-preview-button"),
    "tags": document.getElementById("tags-bit-preview-button"),
    "shoutouts": document.getElementById("shoutout-bit-preview-button"),
    "schedule": document.getElementById("bb-schedule-button"),
    "options": document.getElementById("bb-options-button"),
    "monetize": document.getElementById("bb-monetize-button"),
    "customize": document.getElementById("bb-customize-button"),
}

var bitBuilder = {
    "field": Object.assign(
        {}, 
        builderFields.config, 
        builderFields.data, 
        builderFields.custom_overrides
    ),
    "button": builderButtons,
}



console.log(bitBuilder);

//Function to load form with data from existing bit, used for editing and sharing
function yb_loadBuilderFieldsFromJSON(jsonData) {
    Object.keys(builderFields).forEach(section => {
        const sectionFields = builderFields[section];
        const sectionData = jsonData[section];

        if (!sectionData) return;

        Object.keys(sectionFields).forEach(field => {
            const element = sectionFields[field];
            const value = sectionData[field];

            if (element && value !== undefined) {
                if (element.type === "file") {
                    // Handle preview instead
                    const previewId = field + "Preview";
                    const hiddenId = field + "-existing";
                    const preview = document.getElementById(previewId);
                    const hiddenInput = document.getElementById(hiddenId);
                    if (preview && hiddenInput) {
                        preview.src = value;
                        preview.style.display = "block";
                        hiddenInput.value = value;
                    }
                } else if (element.type === "checkbox") {
                    element.checked = Boolean(value);
                } else {
                    element.value = value;
                }
            }
        });
    });
}

//Function for retrieving values of bit configuration fields
function yb_getBitConfig(){
    //Get the value from each field, if the field is a checkbox, return true or false
    let config = new FormData();
    let is_scheduled = builderFields.config.is_scheduled.checked ? true : false;
    let has_expiration = builderFields.config.has_expiration.checked ? true : false;
    for (let field in builderFields.config){
        if (builderFields.config[field].type === "checkbox"){
            config.append(field, builderFields.config[field].checked ? true : false);
        } else {
 
            config.append(field, builderFields.config[field].value);
        
        }
    }

    if (builderFields.config.is_customized.checked == true){
        let custom_overrides = builderFields.custom_overrides;
        let list_custom_overrides = {};
        for (let field in custom_overrides){
            config.custom_overrides[field] = custom_overrides[field].value;
        }

        config.append("custom_overrides", JSON.stringify(list_custom_overrides));

    }

    return config;
}

//Function for retrieving values of bit data fields
function yb_getBitData(){
    let data = new FormData();

    for (let field in builderFields.data){
        console.log(field)
        if (builderFields.data[field].type === "checkbox"){
            data.append(field, builderFields.data[field].checked ? true : false);
        } else {
            if (field == "photo" || field == "video"){
                data.append(field, builderFields.data[field].files[0]);
            } else {
                data.append(field, builderFields.data[field].value);
            }
        }
    }

    if (builderFields.data.type.value === "photo"){
        data.append("crop_data", JSON.stringify(    yb_getCropData()));
    }

    return data;
}

function yb_assembleBitPackage() {
    let packaged_data = new FormData();

    for (const [key, value] of yb_getBitData().entries()) { 
        packaged_data.append(key, value); // Append each entry in bit data to packaged_data
    }
    for (const [key, value] of yb_getBitConfig().entries()) { 
        packaged_data.append(key, value); // Append each entry in bit data to packaged_data
    }

    return packaged_data;
}

var cropped_photo;

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

    let csrf_token = getCSRF();

    yb_createBit(yb_assembleBitPackage(), csrf_token); //Located in yb_bits/static/scripts/yb_bits/yb_ajax.js

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
        const file = bitBuilder.field.video.files[0];  // Get the file from your custom file input
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
    
    bitBuilder.button.title.addEventListener("click", function(){
        yb_clickFieldButton("title-bit-preview-button", "bb-field-bitTitle");
    });

    bitBuilder.field.title.addEventListener("blur", function(){
        yb_blurTextField("bb-field-bitTitle", "title-bit-preview-button", "title-bit-preview");
    });

    bitBuilder.button.body.addEventListener("click", function(){
        yb_clickFieldButton("description-bit-preview-button", "bb-field-body");
    });

    bitBuilder.field.body.addEventListener("blur", function(){
        yb_blurTextField("bb-field-body", "description-bit-preview-button", "description-bit-preview");
    });

    bitBuilder.button.shoutouts.addEventListener("click", function(){
        yb_clickFieldButton("shoutout-bit-preview-button", "bb-field-bitShoutouts");
    });

    bitBuilder.field.shoutouts.addEventListener("blur", function(){
        yb_blurTextField("bb-field-bitShoutouts", "shoutout-bit-preview-button", "shoutout-bit-preview");
    });

    try {

        bitBuilder.button.tags.addEventListener("click", function(){
            yb_clickFieldButton("tags-bit-preview-button", "bb-field-bitTags");
        });

        bitBuilder.field.tags.addEventListener("blur", function(){
            yb_blurTextField("bb-field-bitTags", "tags-bit-preview-button", "tags-bit-preview");
        });

        console.log("Tags field found successfully")
    } catch (error) {
        console.log("No tags field found");        
    }

    bit_submit_button.addEventListener("click", function(){
        if (build_mode === "create"){
            yb_handleCreateBit();
        } else {
            yb_handleEditBit();
        }
        
        //disable button
        bit_submit_button.disabled = true;
        bit_submit_button.innerHTML = "Uploading...";
        bit_submit_button.style.backgroundColor = "rgb(100, 100, 100)";
        bit_submit_button.classList.add("yb-bounce-infinite");
    });

    bitBuilder.button.body.click();
    

});

function finishBitCrop(){
    cropped_photo = cropper.getCroppedCanvas().toDataURL();
    
    yb_2WayPage(2);
    yb_collapse2Way();
    
    let photo = bitBuilder.field.photo.files[0];
    photo_preview = URL.createObjectURL(photo);

    let this_image = yb_renderImage(
        cropped_photo, 
        "bit-preview-image", 
        `bit-preview-image`, 
        "Preview Image"
    );

    bitBuilder.button.photo.innerHTML = "";
    bitBuilder.button.photo.appendChild(this_image);
    bitBuilder.button.photo.classList.add("fast");
    bitBuilder.button.photo.classList.add("yb-bounceDown-once");

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

            if (bitBuilder.button.video.classList.contains("active")){
                bitBuilder.button.video.classList.remove("active");
            } else if (bitBuilder.button.photo.classList.contains("active")){
                bitBuilder.button.photo.classList.remove("active");
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

            if (bitBuilder.button.photo.classList.contains("active")){
                bitBuilder.button.photo.classList.remove("active");
            }

            bitBuilder.button.video.classList.add("active");
        
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

            if (bitBuilder.button.video.classList.contains("active")){
                bitBuilder.button.video.classList.remove("active");
            } 

            bitBuilder.button.photo.classList.add("active");
        
        } else {
            console.log("Already active");
        }
    });

    bitBuilder.button.photo.addEventListener("click", function(){
        bitBuilder.field.photo.click();
        bitBuilder.field.photo.addEventListener("change", function(){
            // let photo = bitBuilder.field.photo.files[0];
            // photo_preview = URL.createObjectURL(photo);
            // let this_image = yb_renderImage(photo_preview, "bit-preview-image", `bit-preview-image`, "Preview Image");
            // bitBuilder.button.photo.innerHTML = "";
            // bitBuilder.button.photo.appendChild(this_image);
            // bitBuilder.button.photo.classList.add("fast");
            // bitBuilder.button.photo.classList.add("yb-bounceDown-once");
            yb_2WayPage(3, "cropper-bit");
            yb_expand2Way();
           
        });
        
    });

    bitBuilder.button.video.addEventListener("click", function(){
        bitBuilder.field.video.click();
    });

    bitBuilder.field.video.addEventListener("change", function(event){
        
        yb_2WayPage(3, 'video-setup');
        yb_expand2Way();
    })


    $("#bit-date-preview").html(formattedDate);

    bitBuilder.button.schedule.addEventListener("click", function(){
        yb_2WayPage(3, "schedule-bit");
    });

    bitBuilder.button.options.addEventListener("click", function(){
        yb_2WayPage(3, "bit-publish-options");
    });

    bitBuilder.button.monetize.addEventListener("click", function(){
        yb_2WayPage(3, "monetize-bit");
    });
    bitBuilder.button.customize.addEventListener("click", function(){
        yb_2WayPage(3, "bb-customize-bit");
    });

    yb_startClock("time-label", "decorated-time");
});