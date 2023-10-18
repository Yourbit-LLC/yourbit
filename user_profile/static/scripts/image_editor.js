$(document).ready(function() {
    let staged_image = IMAGE_STAGE.getAttribute("src");
    let image_preview = document.getElementById("profile-image-preview");
    let hue_slider = document.getElementById("avatar-hue-slider");
    let enable_transparency = document.getElementById("enable-transparency");
    let enable_border = document.getElementById("enable-border");
});

function previewImage(source){
    let viewer = yb_createElement('div', 'photo-viewer', 'photo-viewer');
    viewer.setAttribute("style", "display: none");
    let viewing_image = yb_renderImage(source, "full-screen-image", "full-screen-image");
    viewer.appendChild(viewing_image);
    document.body.appendChild(viewer);

    $('.photo-viewer').fadeIn(200);
    $('.photo-viewer').animate({"top": "0px"}, 200);

    let select_button = yb_createElement("button", "select-button", "select-button");
}