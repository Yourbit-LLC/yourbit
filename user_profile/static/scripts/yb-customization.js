/*##################################################################################################################

                                                YB-CUSTOMIZATION.JS
            This file contains the core functions needed for the profile personalization page to work.
            This file should be attached to the personalize profile page.

            Updated: 5/26/2023

####################################################################################################################*/

//Declare base URL
var base_url = window.location.origin;

//Declare constants for all preview elements
const MINI_USER_IMAGE_CONTAINER = document.getElementById("accent-color-preview");
const MINI_USER_IMAGE = document.getElementById("profile-image-preview-image");
const MINI_USER_NAME = document.getElementById("preview-name");
const MINI_USERNAME = document.getElementById("preview-username");
const MINI_BIT = document.getElementById("mini-bit");
const MINI_BIT_MOBILE = document.getElementById("bit-colors-preview");
const MINI_TITLE = document.getElementById("mini-title");
const MINI_TITLE_MOBILE = document.getElementById("preview-title");
const MINI_PARAGRAPH = document.getElementById("mini-paragraph");
const MINI_PARAGRAPH_MOBILE = document.getElementById("preview-paragraph");
const BIT_PROFILE_IMAGE = document.getElementById("bit-profile-image-image");

//Declare constants for all input elements
const PROFILE_IMAGE_INPUT = document.getElementById("profile-image-input");
const BACKGROUND_IMAGE_INPUT = document.getElementById("background-image-input");
const PRIMARY_COLOR_INPUT = document.getElementById("primary-color-select");
const SECONDARY_COLOR_INPUT = document.getElementById("accent-color-select");
const ICON_COLOR_INPUT = document.getElementById("icon-color-select");
const TEXT_COLOR_INPUT = document.getElementById("pfont-color-select");
const TITLE_COLOR_INPUT = document.getElementById("tfont-color-select");
const FEEDBACK_ICON_COLOR_INPUT = document.getElementById("feedback-icon-color-select");
const FEEDBACK_BACKGROUND_COLOR_INPUT = document.getElementById("feedback-background-color-select");
const PARAGRAPH_ALIGN_HIDDEN = document.getElementById("hidden-field-alignParagraph");
const BLUR_RADIUS_INPUT = document.getElementById("blur-radius-select");

//Declare constants for buttons
const ALIGN_BUTTONS = {
    "left": document.getElementById("button-align-left"),
    "center": document.getElementById("button-align-center"),
    "right": document.getElementById("button-align-right")
}

/*################################ 

        History tracking

#################################*/

//Declare change history object: {"#input-id" : {"old": "old value", "new": "new value"}}
var change_history = {};
var history_length = Object.keys(change_history).length;

//Declare constants for all input elements
PAGES = ["#profile-images", "#ui-colors", "#bits", "#fonts"]

//Custom data stores information downloaded from the server on initialization (Might be legacy)
var custom_data = {}

//Document ready function
$(document).ready(function() {
    let page_data = document.getElementById("page-data");
    let is_new = page_data.getAttribute("data-is-new");
    if (is_new === "True") {
        $('#back-to-home').fadeIn('slow');
        $('#back-to-home').animate({'bottom': '110px'});
        $(".minibar").hide();
        $.ajax({
            type: 'GET',
            url: `${base_url}/profile/custom/first_visit/`,
            success: function(data) {
                page_data.setAttribute("data-is-new", "False");
            }
        })
    }
    $('#content-container').animate({'top':'0px'});
    yb_hideSpaceBar();

    let id = yb_getSessionValues("id");

    //Add event listeners

    //Event listener for cancel button inside image selection containt
    let selection_cancel_button = document.getElementById("cancel-button");
    selection_cancel_button.addEventListener("click", function() {
        yb_closeImageSelection();
    });

    //Event listener for navigating back one step on image options
    let profile_image_back_button = document.getElementById("profile-cropper-back");
    profile_image_back_button.addEventListener("click", function() {
        console.log("clicked")
        let state = this.getAttribute("data-state");
        console.log(state)
        if (state === "0"){
            $("#profile-cropper").fadeOut();
            $("#background-cropper").fadeOut();
            $("#profile-images").fadeIn();
        } else {
            $("#profile-cropper-select-button").fadeIn();
            $("#upload-button").fadeIn();
            $("#profile-image-input").hide();
        }
    });

    //Event listener for color select
    var color_circles = document.getElementsByClassName("color-selector");
    for (let i = 0; i < color_circles.length; i++){
        color_circles[i].addEventListener("click", function() {
            yb_handleColorSelector(this);
        });
    }
        
    //Event listener for profile image upload button
    let profile_image_edit_button = document.getElementById("edit-profile-img");
    profile_image_edit_button.addEventListener("click", function(){
        $("#profile-images").fadeOut();
        $("#yb-browse-nav").animate({"top":"-100px"}, "fast").fadeOut("slow");
        $("#profile-cropper").fadeIn();
    });

    //Event listener for background image upload button
    let bkd_image_edit_button = document.getElementById("edit-background-img");
    bkd_image_edit_button.addEventListener("click", function(){
        $("#profile-images").fadeOut();
        $("#yb-browse-nav").animate({"top":"-100px"},"fast").fadeOut("slow");
        $("#background-cropper").fadeIn();
    });

    ALIGN_BUTTONS[PARAGRAPH_ALIGN_HIDDEN.value].classList.add("active");

    //Event listener for align buttons
    for (let i = 0; i < Object.keys(ALIGN_BUTTONS).length; i++){
        ALIGN_BUTTONS[Object.keys(ALIGN_BUTTONS)[i]].addEventListener("click", function() {
            yb_handleAlignButton(this);
        });
    }

});

function yb_updatePreview(this_element, style_attr, style_value) {
    $(this_element).css(style_attr, style_value);
}

function yb_handleAlignButton(this_element){
    let this_id = this_element.getAttribute("id");
    let this_value = this_element.getAttribute("name");
    let old_value = PARAGRAPH_ALIGN_HIDDEN.value;

    //Remove active class from all buttons
    for (let i = 0; i < Object.keys(ALIGN_BUTTONS).length; i++){
        ALIGN_BUTTONS[Object.keys(ALIGN_BUTTONS)[i]].classList.remove("active");
    }

    //Add active class to this button
    this_element.classList.add("active");

    //Set hidden input value
    PARAGRAPH_ALIGN_HIDDEN.value = this_value;

    //Add to change history
    change_history["#hidden-field-alignParagraph"] = {"old": old_value, "new": this_value};

    //Update custom
    updateCustom("text_edit", "p_align", this_value);

    //Update preview
    yb_updatePreview("#preview-paragraph", "text-align", this_value);
}
function yb_handleSlider(this_element){
    let this_slider = this_element.getAttribute("name");
    let this_value = this_element.value;

    if (this_slider === "background_blur"){
        yb_updatePreview("#bg-image", "-webkit-filter", `blur(${this_value}px)`);
        yb_updatePreview("#bg-image", "filter", `blur(${this_value}px)`);
        updateCustom("background_effect", "blur", this_value);
    }


}
function yb_handleColorCircle(this_object){
    let this_name = $(this_object).attr("name");

    //Primary color circle pressed
    if (this_name === "primary"){
        change_history["#primary-color-select"] = {"old": PRIMARY_COLOR_INPUT.value, "new": "awaiting user input..."};
        

    }
    //Secondary color circle pressed
    else if (this_name === "secondary"){
        change_history["#accent-color-select"] = {"old": SECONDARY_COLOR_INPUT.value, "new": "awaiting user input..."};
        
     
    }
    //Icon color circle pressed
    else if (this_name === "icon"){
        
        change_history["#icon-color-select"] = {"old": ICON_COLOR_INPUT.value, "new": "awaiting user input..."};
        
        
    } 
    //Title color circle pressed
    else if (this_name === "title"){
        change_history["#tfont-color-select"] = {"old": TITLE_COLOR_INPUT.value, "new": "awaiting user input..."};
        
        
    }
    //Text color circle pressed
    else if (this_name === "text"){
        change_history["#pfont-color-select"] = {"old": TEXT_COLOR_INPUT.value, "new": "awaiting user input..."};
        
        
    }
    //Feedback icon color circle pressed
    else if (this_name === "fb_icon"){
        change_history["#feedback-icon-color-select"] = {"old": FEEDBACK_ICON_COLOR_INPUT.value, "new": "awaiting user input..."};

        

    }
    //Feedback background color circle pressed
    else if (this_name === "fb_background"){
        change_history["#feedback-background-color-select"] = {"old": FEEDBACK_BACKGROUND_COLOR_INPUT.value, "new": "awaiting user input..."};
        

    }

};

function yb_undo(type, field){
    if (type === "color"){
        let change_keys = Object.keys(change_history);
        for (let i = 0; i < change_keys.length; i++){
            if (change_keys[i] === field){
                let old_value = change_history[change_keys[i]]["old"];
                let new_value = change_history[change_keys[i]]["new"];
                $(change_keys[i]).attr("value", old_value);
                change_history[change_keys[i]]["old"] = new_value;
                change_history[change_keys[i]]["new"] = old_value;
            }
        }
    }

}



//Function for showing image selection grid container for selecting from previous uploads
function showImageSelection() {
    let selector_container = document.getElementById("image-selector");
    selector_container.style.display = "block";
    $("#image-selector").animate({"height": "65vh", "width":"95vw"}, "fast");
    
    //Set URL for api to fetch photos
    let url = "/api/photos/"
    
    //Fetch photos from API and put them into create grid function
    fetch(url)
    .then((resp) => resp.json())
    .then(function(data){
        yb_createImageGrid(data);
        
    });
}

//Function for laying images out on a grid
function yb_createImageGrid(data) {
    const container = document.querySelector('.image-grid-container');
    data.forEach(item => {
        let image = yb_renderImage(item.image, `yb-photo-${item.id}`, "yb-photo-tile");
        image.src = item.image;
        image.setAttribute("data-id", item.id);
        container.appendChild(img);
    })
}


$('#back-to-home').click(function() {
    window.location.href = `${base_url}/bitstream/home/`
});
//End legacy functions

$('#bit-colors-preview').click(function() {
    showColorOption('#advanced-color-bit-background', focusIn)
    
});


//Focus on field for color option to reveal selector ("#field-id")
function focusIn(field){
    $(field).focus();
}

//Hide color option ("#field-id")
function hideColorOption(field) {
    $(field).hide();
}

//Blur out of field for color option to hide selector ("#field-id")
function focusOut(field){
    $(field).blur();
}

var profile_image_loaded;

var preview_stage = 0;

//Function for hiding an element by node
function hideElement(sub_setting) {
    sub_setting.style.display = "none";
}

//AI contrast color request, may be replaced by built in function
function yb_ContrastColor(value){
    let csrfToken = getCSRF();
    let request = new FormData();
    let url = `${base_url}/profile/api/contrast/`;
    request.append('hex_code', value);
    $.ajax({
        type: 'POST',
        contentType: false,
        // The following is necessary so jQuery won't try to convert the object into a string
        processData: false,
        headers: {
            
            'X-CSRFToken': csrfToken
        },
        url: url,
        data: request,
        success: function(response) {
            let text_color_field = document.getElementById('pfont-color-select');
            let text_color_preview = document.getElementById('preview-paragraph');

            let color = response.text;

            console.log(color)

            text_color_field.value = color;

            $("#preview-paragraph").css({"color": color});
                        
        }
    });
}


/*############################################################################

    
    CHANGE LISTENERS
    Functions for listening to changes in the color picker fields and updating


##############################################################################*/

//Change event listener for primary color field

PRIMARY_COLOR_INPUT.addEventListener("change", function() {

    //Update history
    change_history["#primary-color-select"]["new"] = this.value; 

    //Update Preview
    yb_updatePreview("#bit-colors-preview", "background-color" ,this.value);
    
    //Update customizations ajax
    updateCustom('color_change', 'primary', this.value)
});

//Change event listener for secondary color field

SECONDARY_COLOR_INPUT.addEventListener("change", function() {

    //Set preview elements
    let border1 = document.getElementById('accent-color-preview');
    let border2 = document.getElementById('bit-profile-image');
    let bit_pic = document.getElementById('profile-pic');

    //Update Previews
    yb_updatePreview(border1, "border-color" ,this.value);
    yb_updatePreview(border2, "border-color" ,this.value);
    yb_updatePreview(bit_pic, "border-color" ,this.value)
    
    //Update customizations ajax
    updateCustom('color_change', 'secondary', this.value);

    //Update history
    change_history["#accent-color-select"]["new"] = this.value;

    
});

FEEDBACK_BACKGROUND_COLOR_INPUT.addEventListener("change", function() {
    let feedback_buttons = document.getElementsByClassName('preview-feedback-button');
    for (let i = 0; i < feedback_buttons.length; i++){
        feedback_buttons[i].style.backgroundColor = this.value;
    }

    //Update customizations ajax
    updateCustom('color_change', 'feedback_icon_background', this.value);

    //Update history
    change_history["#feedback-background-color-select"]["new"] = this.value;
});

//Change event listener for text color field

FEEDBACK_ICON_COLOR_INPUT.addEventListener('change', function() {

    //Update preview elements
    let feedback_icons = document.getElementsByClassName('preview-feedback-icon');
    for (let i = 0; i < feedback_icons.length; i++){
        feedback_icons[i].style.fill = this.value;
    }
    //Update customizations ajax
    updateCustom('color_change', 'feedback_icon', this.value);

    //Update history
    change_history["#feedback-icon-color-select"]["new"] = this.value;
    
});


ICON_COLOR_INPUT.addEventListener('change', function() {

    //Update preview elements
    let space_icon1 = document.getElementById('icon-image-1').style.fill = this.value;
    let space_icon2 = document.getElementById('icon-image-2').style.fill = this.value;
    let space_icon3 = document.getElementById('icon-image-3').style.fill = this.value;
    let space_icon4 = document.getElementById('icon-image-4').style.fill = this.value;
    let space_icon5 = document.getElementById('icon-image-5').style.fill = this.value;
    let space_icon6 = document.getElementById('icon-image-6').style.fill = this.value;
    let space_icon7 = document.getElementById('icon-image-7').style.fill = this.value;
    let space_icon8 = document.getElementById('icon-image-8').style.fill = this.value;
    $('.space-button-icon').css({'fill':this.value});
    $('.mobile-floating-actions-path').css({'fill': this.value});
    $('.mobile-floating-actions').css({'border-color': this.value});

    //Update history
    change_history["#icon-color-select"]["new"] = this.value;

    //Update customizations ajax
    updateCustom('color_change', 'icon', this.value);
    
    
});

//Change event listener for text color field

TEXT_COLOR_INPUT.addEventListener('change', function() {

    let text_color_preview = document.getElementById('preview-paragraph');
    text_color_preview.style.color = this.value;

    //Update history
    change_history["#pfont-color-select"]["new"] = this.value;

    //Update customizations ajax
    updateCustom('color_change', 'paragraph_font', this.value);

});

//Change event listener for text color field

TITLE_COLOR_INPUT.addEventListener('change', function() {


    //Update preview elements
    let title_color_preview = document.getElementById('preview-title');
    title_color_preview.style.color = this.value;

    //Update history
    change_history["#tfont-color-select"]["new"] = this.value;

    //Update customizations ajax
    updateCustom('color_change', 'title_font', this.value);

});

//Change event listener for text color field
const paragraph_align_field = document.getElementById('yb-align-text');
paragraph_align_field.addEventListener('change', function() {

    //Update preview elements
    $('#preview-paragraph').css({'text-align': this.value});

    //Update history
    change_history["#yb-align-text"]["new"] = this.value;

    //Update customizations ajax
    updateCustom('text_edit', 'para-align', this.value);
    
});

//Close image selection container
function yb_closeImageSelection(){
    let selector_container = document.getElementById("image-selector");
    $("#image-selector").animate({"height": "0vh", "width":"0vw"}, "fast").fadeOut();
}

//Legacy Code for the old color picker to be removed after any potential conflicts ruled out
SECONDARY_COLOR_INPUT.addEventListener('click', function() {
    if (preview_stage === 1) {
        $('#bit-colors-preview').fadeOut();
        $('#accent-color-preview').fadeIn();
    }
    if (preview_stage === 2) {
        $('#icon-color-preview').fadeOut();
        $('#accent-color-preview').fadeIn();
    }

    preview_stage = 0
});


ICON_COLOR_INPUT.addEventListener('click', function() {
    if (preview_stage === 0) {
        $('#accent-color-preview').fadeOut();
        $('#icon-color-preview').fadeIn();
    }
    if (preview_stage === 1) {
        $('#bit-colors-preview').fadeOut();
        $('#icon-color-preview').fadeIn();
    }
    preview_stage = 2
});


TITLE_COLOR_INPUT.addEventListener('click', function() {
    if (preview_stage === 0) {
        $('#accent-color-preview').fadeOut();
        $('#bit-colors-preview').fadeIn();
    }
    if (preview_stage === 2) {
        $('#icon-color-preview').fadeOut();
        $('#bit-colors-preview').fadeIn();
    }
    preview_stage = 1
});


TEXT_COLOR_INPUT.addEventListener('click', function() {
    if (preview_stage === 0) {
        $('#accent-color-preview').fadeOut();
        $('#bit-colors-preview').fadeIn();
    }
    if (preview_stage === 2) {
        $('#icon-color-preview').fadeOut();
        $('#bit-colors-preview').fadeIn();
    }
    preview_stage = 1
});

FEEDBACK_ICON_COLOR_INPUT.addEventListener('click', function() {
    if (preview_stage === 0) {
        $('#accent-color-preview').fadeOut();
        $('#bit-colors-preview').fadeIn();
    }
    if (preview_stage === 2) {
        $('#icon-color-preview').fadeOut();
        $('#bit-colors-preview').fadeIn();
    }
    preview_stage = 1
});


PRIMARY_COLOR_INPUT.addEventListener('click', function() {
    if (preview_stage === 0) {
        $('#accent-color-preview').fadeOut();
        $('#bit-colors-preview').fadeIn();
        showColorOption('#', focusIn)
    }
    if (preview_stage === 2) {
        $('#icon-color-preview').fadeOut();
        $('#bit-colors-preview').fadeIn();
    }
    preview_stage = 1
});

paragraph_align_field.addEventListener('click', function() {
    if (preview_stage === 0) {
        $('#accent-color-preview').fadeOut();
        $('#bit-colors-preview').fadeIn();
    }
    if (preview_stage === 2) {
        $('#icon-color-preview').fadeOut();
        $('#bit-colors-preview').fadeIn();
    }
    preview_stage = 1
});
//End of legacy code

