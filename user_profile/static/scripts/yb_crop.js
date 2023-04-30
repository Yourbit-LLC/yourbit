
var cropper;
var profile_crop = document.getElementById('profile-image-preview');
var background_crop = document.getElementById('background-image-preview');
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
    if (type === "profile-image") {
        target_ratio = 1;
        element = 'profile-image-input';
        this_element = ".yb-cropper-container.profile-image"
        $("#profile-cropper-submission-controls").fadeIn();
        this_window = profile_crop;
    } else if (type === "desktop-background") {
            element = 'background-image-input';
            target_ratio = 16/9;
            $("#background-cropper-submission-controls").fadeIn();
            
            this_window = background_crop;
    } else if (type === "mobile-background") {
            element = 'background-image-input';
            target_ratio = 9/19.5;
            this_element = ".yb-cropper-container.background"
            $("#background-cropper-submission-controls").fadeIn();
            this_window = background_crop;
            
            if (background.style.opacity === "0"){
                $("#bg-image").animate({"opacity": "1"}, "slow");
            }
    } 
    console.log(element)
    var input = document.getElementById(element);
    console.log(input)
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

function generateUniqueFileName(originalFileName) {
    const timestamp = new Date().getTime();
    const randomNumber = Math.floor(Math.random() * 1000000);
    const fileExtension = originalFileName.split('.').pop();
    const uniqueFileName = `${timestamp}_${randomNumber}.${fileExtension}`;
    return uniqueFileName;
  }

function dataURItoBlob(dataURI, unique_name) {
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

    image_blob = new Blob([ia], {type:mimeString});

    image_blob.name = unique_name;

    console.log(unique_name);

    return image_blob;
    
}

function uploadImage(type){
    let input_field = document.getElementById(`${type}-input`);
    let file_source = input_field.files[0];
    console.log(file_source.name);

    let unique_name = generateUniqueFileName(file_source.name);
    console.log(unique_name);

    var this_canvas = cropper.getCroppedCanvas();
    console.log(this_canvas);

    var img = this_canvas.toDataURL(); 
    var file = dataURItoBlob(img, unique_name);
    console.log(img);

    if (type === "profile-image"){
        updateCustom('image_upload', 'profile_image', file);
    } else {
        updateCustom('image_upload', 'background_image', file);
    }
    this_canvas.remove();
    /* fetch(`/customize/`, {
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

                        
                    
