try {
    var new_image_button = document.getElementById("new-image-button");
    var new_image_input = document.getElementById("background-image-upload");
    
    var hue_slider = document.getElementById("avatar-hue-slider");
    var enable_transparency = document.getElementById("enable-transparency");
    var enable_border = document.getElementById("enable-border");

} catch {
    new_image_button = document.getElementById("new-image-button");
    new_image_input = document.getElementById("background-image-upload");
    image_preview = document.getElementById("profile-image-preview");
    hue_slider = document.getElementById("avatar-hue-slider");
    enable_transparency = document.getElementById("enable-transparency");
    enable_border = document.getElementById("enable-border");

}

var cropped_desktop_photo;
var cropped_mobile_photo
var source;

function yb_saveWallpaperImage() {
    cropped_image = dataURItoBlob(cropped_photo);
    uploadProfileImage(source, cropped_image, "background", "desktop");

    new_image_button.removeEventListener("click", yb_saveWallpaperImage);
    new_image_button.innerHTML = "New Image";
    new_image_button.style.backgroundColor = "gray";
    new_image_button.addEventListener("click", new_image_handler);
}

function cropWallpaperImage(){
    yb_2WayPage(2, "cropper-desktop-background");
}

function new_image_handler() {
    new_image_input.click();
    new_image_input.addEventListener("change", cropWallpaperImage);

}

function finishDesktopBackgroundImage(){
    console.log(cropper);
    let cropped_photo = cropper.getCroppedCanvas().toDataURL();

    yb_2WayPage(3, "cropper-mobile-background");

    cropped_desktop_photo = cropped_photo;

}

function finishMobileBackgroundImage(){
    let cropped_photo = cropper.getCroppedCanvas().toDataURL();
    cropped_mobile_photo = cropped_photo;

    yb_2WayPage(1, "background-image-upload");
}

$(document).ready(function() {


    new_image_button.addEventListener("click", new_image_handler);

    new_image_input.addEventListener("change", function() {
        yb_2WayPage(2, "cropper-desktop-background");
        new_image_button.innerHTML = "Save Image";
        new_image_button.style.backgroundColor = "green";


    });



});

