/*##################################################################################################################

                                                YB-CUSTOMIZATION.JS
            This file contains the core functions needed for the profile personalization page to work.
            This file should be attached to the personalize profile page.

####################################################################################################################*/

//Declare base URL
var base_url = window.location.origin;

//Declare constants for all preview elements
MINI_USER_IMAGE_CONTAINER = document.getElementById("accent-color-preview");
MINI_USER_IMAGE = document.getElementById("profile-image-preview-image");
MINI_USER_NAME = document.getElementById("preview-name");
MINI_USERNAME = document.getElementById("preview-username");
MINI_BIT = document.getElementById("mini-bit");
MINI_BIT_MOBILE = document.getElementById("bit-colors-preview");
MINI_TITLE = document.getElementById("mini-title");
MINI_TITLE_MOBILE = document.getElementById("preview-title");
MINI_PARAGRAPH = document.getElementById("mini-paragraph");
MINI_PARAGRAPH_MOBILE = document.getElementById("preview-paragraph");
BIT_PROFILE_IMAGE = document.getElementById("bit-profile-image-image");

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
const BLUR_RADIUS_INPUT = document.getElementById("blur-radius-select");


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

    let url = `${base_url}/api/custom/${id}/`

    //Fetch customization data on page load
    fetch(url)
    .then((resp) => resp.json())
    .then(function(data){
        let custom = data;
        custom_data = {
            "profile_image":custom.image,
            "wallpaper":custom.wallpaper,
            "primary_color":custom.primary_color,
            "secondary_color":custom.accent_color,
            "icon_color": custom.icon_color,
            "feedback_icon_color": custom.feedback_icon_color,
            "feedback_icon_background": custom.feedback_icon_background,
            "blur_radius": custom.blur_radius,
            "background_dim": custom.background_dim,
            "title_color": custom.title_color,
            "text_color":custom.text_color,
        }

        BIT_PROFILE_IMAGE.style.borderColor = custom_data.secondary_color;
        MINI_BIT.style.backgroundColor = custom_data.primary_color;
        MINI_BIT_MOBILE.style.backgroundColor = custom_data.primary_color;

        //Fill UI colors
        $("#primary-color-select").attr("value", custom_data.primary_color);
        $("#accent-color-select").attr("value", custom_data.secondary_color);
        $("#icon-color-select").attr("value", custom_data.secondary_color);

        //Fill Bit Colors
        $("#tfont-color-select").attr("value",custom.title_color);
        $("#pfont-color-select").attr("value", custom.text_color);
        $("#feedback-background-color-select").attr("value", custom.feedback_icon_background);
        $("#feedback-icon-color-select").attr("value", custom.feedback_icon_color);

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

    });



    //Event listener for color select
    $('.color-circle').click(function(){
        let this_name = $(this).attr("name");

        //Primary color circle pressed
        if (this_name === "primary"){
            change_history["#primary-color-select"] = {"old": PRIMARY_COLOR_INPUT.value, "new": "awaiting user input..."};
            showColorOption('#primary-color-select', focusIn);

        }
        //Secondary color circle pressed
        else if (this_name === "secondary"){
            change_history["#accent-color-select"] = {"old": SECONDARY_COLOR_INPUT.value, "new": "awaiting user input..."};
            
            showColorOption("#accent-color-select", focusIn);
        }
        //Icon color circle pressed
        else if (this_name === "icon"){
            
            change_history["#icon-color-select"] = {"old": ICON_COLOR_INPUT.value, "new": "awaiting user input..."};
            
            showColorOption("#icon-color-select", focusIn);
        } 
        //Title color circle pressed
        else if (this_name === "title"){
            change_history["#tfont-color-select"] = {"old": TITLE_COLOR_INPUT.value, "new": "awaiting user input..."};
            
            showColorOption("#tfont-color-select", focusIn);
        }
        //Text color circle pressed
        else if (this_name === "text"){
            change_history["#pfont-color-select"] = {"old": TEXT_COLOR_INPUT.value, "new": "awaiting user input..."};
            
            showColorOption("#pfont-color-select", focusIn);
        }
        //Feedback icon color circle pressed
        else if (this_name === "fb_icon"){
            change_history["#feedback-icon-color-select"] = {"old": FEEDBACK_ICON_COLOR_INPUT.value, "new": "awaiting user input..."};

            showColorOption("#feedback-icon-color-select", focus);

        }
        //Feedback background color circle pressed
        else if (this_name === "fb_background"){
            change_history["#feedback-background-color-select"] = {"old": FEEDBACK_BACKGROUND_COLOR_INPUT.value, "new": "awaiting user input..."};
            showColorOption('#feedback-background-color-select');

        }

    });
        
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


    
});

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


//Legacy functions to be migrated to scrapyard
$(".filter-button").click(function() {
    let this_name = $(this).attr("name");
    $(".dropdown-large").fadeOut();
    $(".filter-button-wide-active").attr("class","filter-button");
    $(this_name).fadeIn();
    $(this).attr("class","filter-button-wide-active");
});

$(".filter-button-wide-active").click(function() {
    let this_name = $(this).attr("name");
    $(".dropdown-large").fadeOut();
    $(".filter-button-wide-active").attr("class","filter-button");
    $(this_name).fadeIn();
    $(this).attr("class","filter-button-wide-active");
});

$('#back-to-home').click(function() {
    window.location.href = `${base_url}/bitstream/home/`
});
//End legacy functions

$('#bit-colors-preview').click(function() {
    showColorOption('#advanced-color-bit-background', focusIn)
    
});

//Show color option ("#field-id", callback_function)
function showColorOption(field, callback) {
    $(field).show();
    callback(field);
}

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

//Event listener for global toggle colors switch
$('#toggle-colors').change(function() {
    let color_option = document.getElementById('color-customizations');
    if ( color_option.style.display === 'none') {
        $('#color-customizations').animate({'height': '15vh'}, 'slow');
    }
    else {
        $('#color-customizations').animate({'height': '0vh'}, 'slow');
    }
}); 

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

    //Set preview element = to bit background
    let bit_background = document.getElementById('bit-colors-preview');
    
    //Update color circle to match color setting
    $("#color-circle-primary").css("transition", "0.5s");
    $("#color-circle-primary").css("background-color", this.value);
    
    //Hide the color selection field
    hideColorOption('#primary-color-select');

    //Update history
    change_history["#primary-color-select"]["new"] = this.value; 

    //Update bit background color
    bit_background.style.backgroundColor = this.value;
    
    //Update customizations ajax
    updateCustom('color_change', 'primary', this.value)
});

//Change event listener for secondary color field

SECONDARY_COLOR_INPUT.addEventListener("change", function() {

    //Set preview elements
    let border1 = document.getElementById('accent-color-preview');
    let border2 = document.getElementById('bit-profile-image');

    //Update border colors of preview elements
    border1.style.borderColor = this.value;
    border2.style.borderColor = this.value;
    $('#profile-pic').css({'border-color': this.value});
    
    //Update customizations ajax
    updateCustom('color_change', 'secondary', this.value);

    //Update history
    change_history["#accent-color-select"]["new"] = this.value;

    //Update color circle to match color setting
    $("#color-circle-secondary").css("transition", "0.5s");
    $("#color-circle-secondary").css("background-color", this.value);
    
    //Hide the color selection field
    hideColorOption('#accent-color-select');
    
});

//Change event listener for text color field

FEEDBACK_ICON_COLOR_INPUT.addEventListener('change', function() {
    
    //Update color circle to match color setting
    $("#color-circle-fb-icon").css("transition", "0.5s");
    $("#color-circle-fb-icon").css("background-color", this.value);

    //Update preview elements
    let feedback_preview1 = document.getElementById('button1').style.backgroundColor = this.value;
    let feedback_preview2 = document.getElementById('button2').style.backgroundColor = this.value;
    let feedback_preview3 = document.getElementById('button3').style.backgroundColor = this.value;
    let feedback_preview4 = document.getElementById('button4').style.backgroundColor = this.value;
    let feedback_preview5 = document.getElementById('button5').style.backgroundColor = this.value;
    
    //Update customizations ajax
    updateCustom('color_change', 'feedback_icon', this.value);

    //Update history
    change_history["#feedback-icon-color-select"]["new"] = this.value;

    //Hide the color selection field
    hideColorOption('#feedback-icon-color-select');

    //Update history
    change_history["#feedback-icon-color-select"]["new"] = this.value;
    
});


ICON_COLOR_INPUT.addEventListener('change', function() {

    //Update color circle to match color setting
    $("#color-circle-icon").css("transition", "0.5s");
    $("#color-circle-icon").css("background-color", this.value);

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
    
    //Hide the color selection field
    hideColorOption('#icon-color-select');
    
});

//Change event listener for text color field

TEXT_COLOR_INPUT.addEventListener('change', function() {
    //Update color circle to match color setting
    $("#color-circle-text").css("transition", "0.5s");
    $("#color-circle-text").css("background-color", this.value);
    let text_color_preview = document.getElementById('preview-paragraph');
    text_color_preview.style.color = this.value;

    //Update history
    change_history["#pfont-color-select"]["new"] = this.value;

    //Update customizations ajax
    updateCustom('color_change', 'paragraph_font', this.value);

    //Hide the color selection field
    hideColorOption('#text-color-select');
});

//Change event listener for text color field

TITLE_COLOR_INPUT.addEventListener('change', function() {
    //Update color circle to match color setting
    $("#color-circle-title").css("transition", "0.5s");
    $("#color-circle-title").css("background-color", this.value);

    //Update preview elements
    let title_color_preview = document.getElementById('preview-title');
    title_color_preview.style.color = this.value;

    //Update history
    change_history["#tfont-color-select"]["new"] = this.value;

    //Update customizations ajax
    updateCustom('color_change', 'title_font', this.value);

    //Hide the color selection field
    hideColorOption('#tfont-color-select');
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

