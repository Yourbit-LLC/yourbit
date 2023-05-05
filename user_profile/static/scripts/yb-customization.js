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
PAGES = ["#profile-images", "#ui-colors", "#bits", "#fonts"]

var custom_data = {}

$(document).ready(function() {
    
    $('#back-to-home').fadeIn('slow');
    $('#back-to-home').animate({'bottom': '110px'});
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

        
        MINI_USER_IMAGE.setAttribute("src", custom_data.profile_image);
        MINI_USER_IMAGE_CONTAINER.style.borderColor = custom_data.secondary_color;
        BIT_PROFILE_IMAGE.setAttribute("src", custom_data.profile_image);
        BIT_PROFILE_IMAGE.style.borderColor = custom_data.secondary_color;
        MINI_BIT.style.backgroundColor = custom_data.primary_color;
        MINI_BIT_MOBILE.style.backgroundColor = custom_data.primary_color;

        MINI_USER_NAME.style.color =custom.title_color;
        MINI_USERNAME.style.color =custom.title_color;

        MINI_TITLE.style.color = custom.title_color;
        MINI_TITLE_MOBILE.style.color = custom.title_color;
        MINI_PARAGRAPH.style.color = custom.text_color;
        MINI_PARAGRAPH_MOBILE.style.color = custom.text_color;

        //Fill UI colors
        $("#primary-color-select").attr("value", custom_data.primary_color);
        $("#accent-color-select").attr("value", custom_data.secondary_color);
        $("#icon-color-select").attr("value", custom_data.secondary_color);

        //Fill Bit Colors
        $("#tfont-color-select").attr("value",custom.title_color);
        $("#pfont-color-select").attr("value", custom.text_color);
        $("#feedback-background-color-select").attr("value", custom.feedback_icon_background);
        $("#feedback-icon-color-select").attr("value", custom.feedback_icon_color);



    });

/* 

        History tracking

*/
//Declare change history object: {"#input-id" : {"old": "old value", "new": "new value"}}
var change_history = {};
var history_length = Object.keys(change_history).length;

//Event listener for color select
$('.color-circle').click(function(){
    let this_name = $(this).attr("name");
    if (this_name === "primary"){
        showColorOption('#primary-color-select', focusIn);
    }
    else if (this_name === "secondary"){
        showColorOption("#accent-color-select", focusIn);
    }
    else if (this_name === "icon"){
        showColorOption("#icon-color-select", focusIn);
    } 
    else if (this_name === "title"){
        showColorOption("#title-color-select", focusIn);
    }
    else if (this_name === "text"){
        showColorOption("#text-color-select", focusIn);
    }
    else if (this_name === "fb_icon"){
        showColorOption("#feedback-icon-color-select", focus);

    } else if (this_name === "fb_background"){
        showColorOption('feedback-background-color-select');

    }

});
    
//Event listener for image select button
let profile_image_edit_button = document.getElementById("edit-profile-img");
profile_image_edit_button.addEventListener("click", function(){
    $("#profile-images").fadeOut();
    $("#yb-browse-nav").animate({"top":"-100px"}, "fast").fadeOut("slow");
    $("#profile-cropper").fadeIn();

});

let bkd_image_edit_button = document.getElementById("edit-background-img");
bkd_image_edit_button.addEventListener("click", function(){
    $("#profile-images").fadeOut();
    $("#yb-browse-nav").animate({"top":"-100px"},"fast").fadeOut("slow");
    $("#background-cropper").fadeIn();

});


    
});

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
/* let uploadButton = document.getElementById("image-upload-button");
uploadButton.addEventListener("click", function(){
    if ($(this).attr("data-state") === "upload"){
        $("#profile-img-upload-field").fadeIn();
        $(this).html("Cancel");
        $(this).attr("data-state", "cancel")
    } else {
        $("#profile-img-upload-field").fadeOut();
        $(this).html("Upload");
        $(this).attr("data-state", "upload")
    }
});*/


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

$('#bit-colors-preview').click(function() {
    showColorOption('#advanced-color-bit-background', focusIn)
    
});

function showColorOption(field, callback) {
    $(field).show();
    callback(field);
}
function focusIn(field){
    $(field).focus();
}

function hideColorOption(field) {
    $(field).hide();
}
function focusOut(field){
    $(field).blur();
}

var profile_image_loaded;

var preview_stage = 0;


function hideElement(sub_setting) {
    sub_setting.style.display = "none";
}


/* let profile_bkd_field = document.getElementById('bkd-image-field');
profile_bkd_field.addEventListener("change", function() {
    let image_preview = document.getElementById('preview-background-img');
    const image_loaded = this.files[0];
    if (image_loaded) {
        const reader = new FileReader();

        reader.addEventListener('load', function() {
            image_preview.setAttribute('src', this.result);
            updateCustom('image_upload', 'background_image', image_loaded)
        });

        reader.readAsDataURL(image_loaded);

    }
}); */

/*let profile_img_field = document.getElementById('profile-img-upload-field');
profile_img_field.addEventListener("change", function() {
    let user_image_preview = document.getElementById('profile-image-preview-image');
    const image_loaded = this.files[0];
    if (image_loaded) {
        const reader = new FileReader();

        reader.addEventListener('load', function() {

            updateCustom('image_upload', 'profile_image', image_loaded)
            $("#profile-img-upload-field").fadeOut();
            $("#image-upload-button").html("Upload");
            $("#image-upload-button").attr("data-state", "upload");
        });

        reader.readAsDataURL(image_loaded);

    }
}); */

$('#toggle-colors').change(function() {
    let color_option = document.getElementById('color-customizations');
    if ( color_option.style.display === 'none') {
        $('#color-customizations').animate({'height': '15vh'}, 'slow');
    }
    else {
        $('#color-customizations').animate({'height': '0vh'}, 'slow');
    }
}); 

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


const primary_color_field = document.getElementById('primary-color-select')
primary_color_field.addEventListener("change", function() {
    let bit_background = document.getElementById('bit-colors-preview');
    
    $("#color-circle-primary").css("transition", "0.5s");
    $("#color-circle-primary").css("background-color", this.value);
    hideColorOption('#primary-color-select');



    bit_background.style.backgroundColor = this.value;
    updateCustom('color_change', 'primary', this.value)
});

const accent_color_field = document.getElementById('accent-color-select')
accent_color_field.addEventListener("change", function() {
    let border1 = document.getElementById('accent-color-preview');
    let border2 = document.getElementById('bit-profile-image');
    border1.style.borderColor = this.value;
    border2.style.borderColor = this.value;
    $('#profile-pic').css({'border-color': this.value});
    updateCustom('color_change', 'secondary', this.value);

    $("#color-circle-secondary").css("transition", "0.5s");
    $("#color-circle-secondary").css("background-color", this.value);
    hideColorOption('#accent-color-select');
    
});

const feedback_icon_field = document.getElementById('feedback-icon-color-select');
feedback_icon_field.addEventListener('change', function() {
    $("#color-circle-fb-icon").css("transition", "0.5s");
    $("#color-circle-fb-icon").css("background-color", this.value);
    let feedback_preview1 = document.getElementById('button1').style.backgroundColor = this.value;
    let feedback_preview2 = document.getElementById('button2').style.backgroundColor = this.value;
    let feedback_preview3 = document.getElementById('button3').style.backgroundColor = this.value;
    let feedback_preview4 = document.getElementById('button4').style.backgroundColor = this.value;
    let feedback_preview5 = document.getElementById('button5').style.backgroundColor = this.value;
    updateCustom('color_change', 'feedback_icon', this.value);
    hideColorOption('#feedback-icon-color-select');
    
});


const icon_field = document.getElementById('icon-color-select');
icon_field.addEventListener('change', function() {
    $("#color-circle-icon").css("transition", "0.5s");
    $("#color-circle-icon").css("background-color", this.value);
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
    updateCustom('color_change', 'icon', this.value);
    hideColorOption('#icon-color-select');
    
});

const text_color_field = document.getElementById('pfont-color-select');
text_color_field.addEventListener('change', function() {
    $("#color-circle-text").css("transition", "0.5s");
    $("#color-circle-text").css("background-color", this.value);
    let text_color_preview = document.getElementById('preview-paragraph');
    text_color_preview.style.color = this.value;
    updateCustom('color_change', 'paragraph_font', this.value);
    hideColorOption('#text-color-select');
});

const title_color_field = document.getElementById('tfont-color-select');
title_color_field.addEventListener('change', function() {
    $("#color-circle-title").css("transition", "0.5s");
    $("#color-circle-title").css("background-color", this.value);
    let title_color_preview = document.getElementById('preview-title');
    title_color_preview.style.color = this.value;
    updateCustom('color_change', 'title_font', this.value);
    hideColorOption('#tfont-color-select');
});

const paragraph_align_field = document.getElementById('yb-align-text');
paragraph_align_field.addEventListener('change', function() {
    $('#preview-paragraph').css({'text-align': this.value});
    updateCustom('text_edit', 'para-align', this.value);
    
});

accent_color_field.addEventListener('click', function() {
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

icon_field.addEventListener('click', function() {
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

title_color_field.addEventListener('click', function() {
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

text_color_field.addEventListener('click', function() {
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

feedback_icon_field.addEventListener('click', function() {
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
primary_color_field.addEventListener('click', function() {
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
