

$(document).ready(function(){
    showUpload("profile-image");
    let location = yb_getSessionValues("location");
    if (location === "square-crop"){
        previewImage("square");
    };
    
});
var cropper;
var square_crop = document.getElementById('profile-image-preview');
var wide_crop = document.getElementById('background-image-preview');
var preview2 = document.getElementById("profile-image-preview-image");
var background_container = document.getElementById("background-container");
var background = document.getElementById("bg-image");
var select_button = document.getElementById("select-button");

function showUpload(type){
    $("#profile-cropper-select-button").hide();
    $("#profile-cropper-back").fadeIn();
    if (type === 'profile-image'){
        $("#profile-image-input").fadeIn();
        $("#profile-upload-button").hide();
    } else {
        $("#background-image-input").fadeIn();
        $("#background-upload-button").hide();
    }
    $("#profile-cropper-back").attr("data-state", "1")
    
}
function previewImage(type) {
    let target_ratio;
    let this_element;
    console.log(type);
    $("#profile-advanced-options-button").fadeIn();
    if (type === "square") {
        target_ratio = 1;
        element = IMAGE_STAGE.getAttribute("id");
        this_element = ".yb-cropper-container-square"
        $("#profile-cropper-submission-controls").fadeIn();
        this_window = square_crop;
    } else if (type === "ls-rect") {
            element = IMAGE_STAGE.getAttribute("id");
            target_ratio = 16/9;
            $("#background-cropper-submission-controls").fadeIn();
            
            this_window = wide_crop;
    } else if (type === "p-rect") {
            element = IMAGE_STAGE.getAttribute("id");
            target_ratio = 9/19.5;
            this_element = ".yb-cropper-container.p-rect"
            $("#background-cropper-submission-controls").fadeIn();
            this_window = wide_crop;
            
            if (background.style.opacity === "0"){
                $("#bg-image").animate({"opacity": "1"}, "slow");
            }
    }
    console.log(element)
    // var input = document.getElementById(element);
    // console.log(input)
    // var file = input.files[0];
    var file = IMAGE_STAGE.src;
    var reader = new FileReader();
    console.log(this_window)
    reader.onload = function(e) {
        $(".cb-divider").fadeIn();
        $(this_element).css("pointer-events", "auto");
        this_window.src = e.target.result;
        cropper = new Cropper(this_window, {
            aspectRatio: target_ratio,
            viewMode: 2,
            crop: function(event) {
                console.log(event.detail.width);
                console.log(event.detail.height);
                setTimeout(cropImage,100, type);
            }
        });
    };
    reader.readAsDataURL(file);
}

function cropImage(type) {
    var canvas = cropper.getCroppedCanvas();
    if (type === "profile-image"){
        preview2.src = canvas.toDataURL();
    } else {
        try {
            background.src = canvas.toDataURL();
        } catch(err) {
            background_container.innerHTML = `
                <img class="bg-image" id="bg-image" src = "${canvas.toDataURL()}">
            `

        }
    }
    
    
}



function dataURItoBlob(dataURI) {
    // convert base64/URLEncoded data component to raw binary data held in a string
    var byteString;
    if (dataURI.split(',')[0].indexOf('base64') >= 0)
        byteString = atob(dataURI.split(',')[1]);
    else
        byteString = unescape(dataURI.split(',')[1]);
    // separate out the mime component
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    // write the bytes of the string to a typed array
    var ia = new Uint8Array(byteString.length);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ia], {type:mimeString});
    
}

function uploadImage(type){

    var this_canvas = cropper.getCroppedCanvas();
    console.log(this_canvas);

    var img = this_canvas.toDataURL(); 
    var file = dataURItoBlob(img);
    console.log(img);

    let this_cropper = document.querySelectorAll('.cropper-container');
    this_cropper.forEach(function(element){
        element.remove();
    });

    let cropper_container = document.querySelectorAll('.yb-cropper-container');
    cropper_container.forEach(function(element){
        element.style.pointerEvents = "none";
    });


    if (type === "profile-image"){
        updateCustom('image_upload', 'profile_image', file);
    } else {
        updateCustom('image_upload', 'background_image', file);
    }
    this_canvas.remove();
    /* fetch(`/customize/`, {s
        method: 'POST',
        contentType: false,
        // The following is necessary so jQuery won't try to convert the object into a string
        processData: false,
        headers: {
            'X-CSRFToken': csrfToken
        },
        body: formData
        })
        .then(response => response.json())
        .then(data => {
        console.log(data); // log the response from the backend
        })
        .catch(error => {
        console.error('Error:', error);
        }); */
}

                        
                    
