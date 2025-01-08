try {
    var new_image_button = document.getElementById("new-image-button");
    var new_image_input = document.getElementById("profile-image-upload");
    var image_preview = document.getElementById("profile-image-preview");
    var color_selectors = document.getElementsByClassName("color-circle");
    var color_inputs = document.getElementsByClassName("color-input");
    var overlay_strength_slider = document.getElementById("image-co-strength-slider");
    var enable_transparency = document.getElementById("yb-check-transparency");
    var enable_border = document.getElementById("yb-check-border");
    var border_color_selector = document.getElementById("image-bco-color-circle");
    var border_color_input = document.getElementById("image-bco-color-picker");
    var save_edit_button = document.getElementById("avatar-save-button");
    var edit_form = document.getElementById("edit-options");
    var inputs = document.querySelectorAll('input');

} catch {
    new_image_button = document.getElementById("new-image-button");
    new_image_input = document.getElementById("profile-image-upload");
    image_preview = document.getElementById("profile-image-preview");
    enable_transparency = document.getElementById("yb-check-transparency");
    enable_border = document.getElementById("yb-check-border");
    color_selectors = document.getElementsByClassName("color-circle");
    color_inputs = document.getElementsByClassName("color-input");
    overlay_strength_slider = document.getElementById("image-co-strength-slider");
    enable_transparency = document.getElementById("enable-transparency");
    enable_border = document.getElementById("enable-border");
    border_color_input = document.getElementById("image-bco-color-picker");
    border_color_selector = document.getElementById("image-bco-color-circle");
    save_edit_button = document.getElementById("avatar-save-button");
    edit_form = document.getElementById("edit-options");
    inputs = document.querySelectorAll('input');

}

var cropped_photo;
var source;

function yb_saveProfileImage() {
    cropped_image = dataURItoBlob(cropped_photo);
    uploadProfileImage(source, cropped_image, "profile", "profile");

    try {
        new_image_button.removeEventListener("click", yb_saveProfileImage);
        new_image_button.innerHTML = "New Image";
        new_image_button.style.backgroundColor = "gray";
        new_image_button.addEventListener("click", new_image_handler);
    } catch(err) {
        console.log("In onboarding")
    }
}

function new_image_handler() {
    new_image_input.click();

    new_image_button.removeEventListener("click", new_image_handler);



}

function finishProfileImage(image_input){
    let crop_data = yb_getCropData();
    console.log(crop_data);
    let image = image_input.files[0];

    yb_uploadProfileImage(image, crop_data, "user", "profile");

    try {
        yb_2WayPage(1, "profile-image-edit");

        
    } catch(err) {
        console.log("No 2 Way. Onboarding.")
    }

}

$(document).ready(function() {
    console.log("This is the updated edit image file.")
    console.log(color_selectors)

    new_image_button.addEventListener("click", new_image_handler);

    new_image_input.addEventListener("change", function() {
        yb_2WayPage(2, "cropper-profile");
        new_image_button.innerHTML = "Save Image";
        new_image_button.style.backgroundColor = "green";


    });

    for (let i = 0; i < color_selectors.length; i++) {
        color_selectors[i].addEventListener("click", function() {
            let this_option = color_selectors[i].getAttribute("name");
            console.log(this_option);
            let this_input = document.getElementById(this_option + "-color-picker");
            console.log(this_input)
            this_input.click();
        })
    }
    
    let color_overlay_preview = document.getElementById("image-co-color-preview");
    let color_overlay_input = document.getElementById("image-co-color-picker");

    color_overlay_input.addEventListener("input", function(){
        color_overlay_preview.style.backgroundColor = this.value;
        let color_overlay_selector = document.getElementById(this.getAttribute("name") + "-color-circle");
        color_overlay_selector.style.backgroundColor = this.value;
    })

    overlay_strength_slider.addEventListener("input", function() {
        color_overlay_preview.style.opacity = this.value;
    });

    enable_border.addEventListener("click", function(e){
        
        console.log(this.checked);
        
        if (this.checked === true) {
            image_preview.style.border = "solid";
            border_color_selector.style.opacity = 1;

        } else {
            image_preview.style.border = "none";
            border_color_selector.style.opacity = 0.1;
    
        }

    
        
    });

    border_color_input.addEventListener("input", function(){
        border_color_selector.style.backgroundColor = this.value;
        image_preview.style.borderColor = this.value;
    });

    for (let i = 0; i < inputs.length; i++) {
        inputs[i].addEventListener('input', function() {
            save_edit_button.style.backgroundColor = "green";
            save_edit_button.style.color = "white";
        })
    }

    save_edit_button.addEventListener("click", function(){

        let formData = new FormData();
        formData.append("color_overlay", color_overlay_input.value);
        formData.append("overlay_strength", overlay_strength_slider.value);
        if (enable_border.checked === true) {
            formData.append("enable_border", true);
        } else {
            formData.append("enable_border", false);
        }
        if (enable_transparency.checked === true) {
            formData.append("enable_transparency", true);
        } else {
            formData.append("enable_transparency", false);
        }
        formData.append("border_color", border_color_input.value);

        let csrf_token = getCSRF();

        $.ajax({
            type: 'POST',
            url: '/customize/pfp/edit/',
            data: formData,
            headers: {
                'X-CSRFToken': csrf_token,
            },
            processData: false,
            contentType: false,
            success: function(response) {
                showNotification(expandNotification, "Settings Updated");
                console.log(response);
            },
            error: function(response) {
                console.log(response);
            }
        });
        
    });


});

