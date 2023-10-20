

$(document).ready(function(){
    let location = yb_getSessionValues("location");
    if (location === "square-cropper"){
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

function previewImage(type, method) {
    let target_ratio;
    let this_element;
    console.log(type);
    $("#profile-advanced-options-button").fadeIn();
    if (type === "square") {
        target_ratio = 1;
        this_element = ".yb-cropper-container-square";
        $("#profile-cropper-submission-controls").fadeIn();
        this_window = square_crop;
    } else if (type === "ls-rect") {
        // Similar logic for other cases
    }
    let image = document.getElementById("square-image-preview"); // Get the image element
    let file;
    // Check if a file was selected
    if (method === "upload") {
        let input = FILE_UPLOAD_FIELD; // Get the input element
        file = input.files[0];
        let reader = new FileReader();
        reader.onload = function(e) {
            $(".cb-divider").fadeIn();
            $(this_element).css("pointer-events", "auto");
            image.src = e.target.result;
            cropper = new Cropper(image, {
                aspectRatio: target_ratio,
                viewMode: 2,
                crop: function(event) {
                    console.log(event.detail.width);
                    console.log(event.detail.height);
                    setTimeout(cropImage, 100, type);
                }
            });
        };
    
        reader.readAsDataURL(file);

        
    } else {
        // No file selected, fetch the image URL from the database
        imageURL = IMAGE_STAGE.getAttribute("src") // Implement this function to fetch the URL
        image.src = imageURL;
        // Rest of the code for setting up Cropper remains the same
        // Fetch the image data and convert it to a Blob
        fetch(imageURL)
        .then(response => response.blob())
        .then(blob => {
            // Create an Object URL from the Blob
            let blobUrl = URL.createObjectURL(blob);
            image.src = blobUrl;

            // Rest of the code for setting up Cropper remains the same
            cropper = new Cropper(image, {
                aspectRatio: target_ratio,
                viewMode: 2,
                crop: function(event) {
                    console.log(event.detail.width);
                    console.log(event.detail.height);
                    setTimeout(cropImage, 100, type);
                }
            });
        })
        .catch(error => {
            console.error("Error fetching and converting the image:", error);
        });
    }
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

                        
                    
