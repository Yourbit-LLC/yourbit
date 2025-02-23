
var cropper;

var square_crop = document.getElementById('profile-image-preview');
var wide_crop = document.getElementById('background-image-preview');
var preview2 = document.getElementById("profile-image-edited");
var background_container = document.getElementById("background-container");
var background = document.getElementById("bg-image");
var select_button = document.getElementById("select-button");

var cropper_output = {
    'x': 0,
    'y': 0,
    'width': 0,
    'height': 0

}


function yb_getCropData() {
    return cropper_output;
}

function resetCropper() {
    if (cropper) {
        cropper.destroy();
        cropper = null;
        
    }
}


function initializeOrUpdateCropper(target_ratio, field, preview_block) {

    let file_upload_field = document.getElementById(field);

    if (cropper) {
        console.log("cropper exists")
        try {
            yb_getSessionValues('location');
            let input = file_upload_field; // Get the input element
            file = input.files[0];
            let reader = new FileReader();
            reader.onload = function(e) {
                let imageElement = document.getElementById(preview_block);
                imageElement.src = e.target.result;
                cropper = new Cropper(imageElement, {
                    aspectRatio: target_ratio,
                    viewMode: 2,
                    crop: function(event) {

                        cropper_output.x = event.detail.x;
                        cropper_output.y = event.detail.y;
                        cropper_output.width = event.detail.width;
                        cropper_output.height = event.detail.height;

                        cropImage(target_ratio);
                    }
                });
            }
    
            reader.readAsDataURL(file);
        } catch {
            console.log("Located in onboarding")
            cropper.replace($("#" + field).attr('src'));
        }
        

    } else {

        let input = file_upload_field; // Get the input element
        file = input.files[0];
        let reader = new FileReader();
        reader.onload = function(e) {
            let imageElement = document.getElementById(preview_block);
            imageElement.src = e.target.result;
            cropper = new Cropper(imageElement, {
                aspectRatio: target_ratio,
                viewMode: 2,
                crop: function(event) {

                    cropper_output.x = event.detail.x;
                    cropper_output.y = event.detail.y;
                    cropper_output.width = event.detail.width;
                    cropper_output.height = event.detail.height;
                    cropImage(target_ratio);
                }
            });
        }

        reader.readAsDataURL(file);
    }
}

function previewProfileImage() {
    initializeOrUpdateCropper(1, "profile-image-upload", "crop-image-preview");
}

//Use for video thumnails
function previewDesktopBackgroundImage() {
    initializeOrUpdateCropper(16/9, "background-image-upload", "crop-image-preview");
}

function previewMobileBackgroundImage() {
    initializeOrUpdateCropper(9/19.5, "background-image-upload", "crop-image-preview");
}

function previewBitCrop() {
    initializeOrUpdateCropper(1, "bb-field-bitPhoto", "crop-image-preview");    
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

    console.log(type)

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

function cropImage(type) {
    var canvas = cropper.getCroppedCanvas();
    console.log(canvas);
    if (type === "square"){
        //preview2.src = canvas.toDataURL();
        return
    } else {
        return
    }
    
    
}