
//Event listener for image select button
let image_edit_button = document.getElementById("edit-profile-img");
image_edit_button.addEventListener("click", function(){
    $("#profile-images").fadeOut();
    $("#profile-cropper").fadeIn();

});

let back_button = document.getElementById("cropper-back");
back_button.addEventListener("click", function() {
    let state = $("#cropper-back").attr("data-state");
    console.log(state)
    if (state === "0"){
        $("#cropper").fadeOut();
        $("#profile-images").fadeIn();
    } else {
        $("#cropper-select-button").fadeIn();
        $("#upload-button").fadeIn();
        $("#image-input").hide();
    }
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
let uploadButton = document.getElementById("image-upload-button");
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
});
