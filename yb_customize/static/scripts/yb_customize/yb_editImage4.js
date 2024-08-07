try {
    var new_image_button = document.getElementById("new-image-button");
    var new_image_input = document.getElementById("profile-image-upload");
    var image_preview = document.getElementById("profile-image-preview");
    var hue_slider = document.getElementById("avatar-hue-slider");
    var enable_transparency = document.getElementById("enable-transparency");
    var enable_border = document.getElementById("enable-border");

} catch {
    new_image_button = document.getElementById("new-image-button");
    new_image_input = document.getElementById("profile-image-upload");
    image_preview = document.getElementById("profile-image-preview");
    hue_slider = document.getElementById("avatar-hue-slider");
    enable_transparency = document.getElementById("enable-transparency");
    enable_border = document.getElementById("enable-border");

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

    yb_uploadProfileImage(image, crop_data, "profile", "profile");

    try {
        yb_2WayPage(1, "profile-image-edit");
    } catch(err) {
        console.log("No 2 Way. Onboarding.")
    }

}

$(document).ready(function() {

    try {
        new_image_button.addEventListener("click", new_image_handler);

        new_image_input.addEventListener("change", function() {
            yb_2WayPage(2, "cropper-profile");
            new_image_button.innerHTML = "Save Image";
            new_image_button.style.backgroundColor = "green";


        });
    } catch(err) {
        console.log("On Onboarding \n\n -Message from yb_editImage4 \n\n"+ err)
    }



});

