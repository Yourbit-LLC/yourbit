try {
    var new_image_button = document.getElementById("new-image-button");
    var new_image_input = document.getElementById("wallpaper-image-upload");
    
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

function new_image_handler() {
    new_image_input.click();

    new_image_button.removeEventListener("click", new_image_handler);

}

function finishWallpaperImage(){
    cropped_photo = cropper.getCroppedCanvas().toDataURL();

    yb_2WayPage(1, "background-image-edit");

    let this_image = yb_renderImage(cropped_photo, "profile-icon", `profile-image-preview`, "Preview Image");
    this_image.setAttribute("style", "height: 100%; width: 100%; object-fit: cover;");
    image_preview.innerHTML = "";
    image_preview.appendChild(this_image);

    let photo_upload_field = document.getElementById("background-image-upload");
    source = photo_upload_field.files[0];

    
    new_image_button.addEventListener("click", yb_saveWallpaperImage);


}

$(document).ready(function() {


    new_image_button.addEventListener("click", new_image_handler);

    new_image_input.addEventListener("change", function() {
        yb_2WayPage(2, "cropper-background");
        new_image_button.innerHTML = "Save Image";
        new_image_button.style.backgroundColor = "green";


    });



});

