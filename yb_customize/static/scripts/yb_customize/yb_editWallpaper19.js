try {
    var new_image_button = document.getElementById("new-wallpaper-button");
    var new_image_input = document.getElementById("background-image-upload");
    var blur_slider = document.getElementById("wallpaper-blur");
    var brightness_slider = document.getElementById("wallpaper-brightness");
    


} catch {
    new_image_button = document.getElementById("new-wallpaper-button");
    new_image_input = document.getElementById("background-image-upload");
    blur_slider = document.getElementById("wallpaper-brightness");
    brightness_slider = document.getElementById("wallpaper-blur");

}

var cropped_desktop_photo;
var cropped_mobile_photo;
var source;
var wpid = null;

function yb_saveWallpaperImage() {
    cropped_image = dataURItoBlob(cropped_photo);
    uploadProfileImage(source, cropped_image, "background", "desktop");

    new_image_button.removeEventListener("click", yb_saveWallpaperImage);
    new_image_button.innerHTML = "New Image";
    new_image_button.style.backgroundColor = "gray";
    new_image_button.addEventListener("click", new_image_handler);
}

function yb_setWPID(id){
    wpid = id;
}


function cropWallpaperImage(){
    console.log("from edit wallpaper js");
    yb_2WayPage(2, "cropper-desktop-background");
}

function new_image_handler() {
    new_image_input.click();
    new_image_input.addEventListener("change", cropWallpaperImage);

}


function finishDesktopBackgroundImage(){
    let crop_data = yb_getCropData();
    console.log(crop_data);
    console.log(crop_data);
    let image = new_image_input.files[0];

    yb_uploadProfileImage(image, crop_data, "profile", "desktop", wpid);

}

function finishMobileBackgroundImage(){
    let crop_data = yb_getCropData();
    console.log(crop_data);
    console.log(wpid);
    let image = new_image_input.files[0];

    yb_uploadProfileImage(image, crop_data, "profile", "mobile", wpid);

    yb_2WayPage(1, "background-image-upload");

    new_image_input.addEventListener("change", cropWallpaperImage);

}

$(document).ready(function() {

    
    new_image_button.addEventListener("click", new_image_handler);

    

    new_image_input.addEventListener("change", function() {

        //Ensure the following function only runs once
        yb_2WayPage(2, "cropper-desktop-background");
        new_image_input.removeEventListener("change", cropWallpaperImage);


    });



});

