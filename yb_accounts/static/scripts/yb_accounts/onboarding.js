const intro_text = document.getElementById('intro-text');
const action_container = document.getElementById('action-container');
const profile_upload_button = document.getElementById('profile-trigger');
const profile_img_upload = document.getElementById('profile-image-upload');
const background_upload_button = document.getElementById('background-trigger');
const background_img_upload = document.getElementById('background-image-upload');
const CROP_CONTAINER = document.getElementById('square-crop-container');
const PROFILE_IMAGE_PREVIEW = document.getElementById('onboarding-image-container');
const BACKGROUND_IMAGE_PREVIEW = document.getElementById('onboarding-background-container');
var profile_back_button = document.getElementById('profile-back-button');
const IMAGE_SAVE_BUTTON = document.getElementById('image-cropper-save');
const ASPECT_RATIO_MENU = document.getElementById('select-aspect-ratio');
const BACKGROUND_MAIN_CONFIRM = document.getElementById('background-main-confirm');

const BACKGROUND_IMAGE_FORM = document.getElementById('background-image-form');
// Global variables (if needed)


const containers = {
    1: document.getElementById('onboarding-1'),
    2: document.getElementById('onboarding-2'),
    3: document.getElementById('onboarding-3'),
    4: document.getElementById('onboarding-4')
}
const nextButtons = {
    1: document.getElementById('onboarding-1-next'),
    2: document.getElementById('onboarding-2-next'),
    3: document.getElementById('onboarding-3-next'),
    4: document.getElementById('onboarding-4-next')
}
const backButtons = {
    2: document.getElementById('onboarding-2-back'),
    3: document.getElementById('onboarding-3-back'),
    4: document.getElementById('onboarding-4-back')
}

const form = document.getElementById('onboarding-form');

const next = (current) => {
    containers[current].hidden = true;
    containers[current + 1].hidden = false;
}

const back = (current) => {
    containers[current].hidden = true;
    containers[current - 1].hidden = false;
}

const submit = () => {
    form.submit();
}

yb_handleNext = () => {
    next(current);
    current++;
    check(current);
}

yb_handleBack = () => {
    back(current);
    current--;
    check(current);
}


const check = (current) => {
    if (current === 1) {
        nextButtons[current].hidden = false;
        
        
    } else if (current === 4) {
        nextButtons[current].hidden = true;
        backButtons[current].hidden = false;
        backButtons[current].addEventListener('click', yb_handleBack);
    } else {
        nextButtons[current].hidden = false;
        backButtons[current].hidden = false;
        backButtons[current].addEventListener('click', yb_handleBack);
    }

    nextButtons[current].addEventListener('click', yb_handleNext);
}

let current = 1;

check(current);

function yb_hideCropper(aspect_menu = false) {

    CROP_CONTAINER.hidden = true;
    if (aspect_menu) {
        ASPECT_RATIO_MENU.hidden = false;
    } else {
        containers[current].hidden = false;
    }
    resetCropper();
}


//onload event of document
window.onload = function() {
    profile_upload_button.addEventListener('click', () => {
        profile_img_upload.click();
    });

    // Initialize cropper to null or a default state
 
    // Event listener for file input change
    profile_img_upload.addEventListener('change', function() {
        // Hide current container, show crop container
        containers[current].hidden = true;
        CROP_CONTAINER.hidden = false;
        IMAGE_SAVE_BUTTON.setAttribute('data-type', 'profile');
        IMAGE_SAVE_BUTTON.setAttribute('data-class', 'profile');

        $("#profile-back-button").attr("name", "profile");
        

    });

    background_img_upload.addEventListener('change', function() {
        // Hide current container, show crop container
        containers[current].hidden = true;
        ASPECT_RATIO_MENU.hidden = false;
        $('#desktop-preview-output').attr('src', URL.createObjectURL(this.files[0]));
        $('#mobile-preview-output').attr('src', URL.createObjectURL(this.files[0]));
        $("#profile-back-button").attr("name", "background");
 
    });

    $("#desktop-crop-option").on("click", function() {
        ASPECT_RATIO_MENU.hidden = true;
        CROP_CONTAINER.hidden = false;

        IMAGE_SAVE_BUTTON.setAttribute('name', 'desktop');
        IMAGE_SAVE_BUTTON.setAttribute('data-type', 'background');
        IMAGE_SAVE_BUTTON.setAttribute('data-class', 'profile');
    });        

    $("#mobile-crop-option").on("click", function() {
        ASPECT_RATIO_MENU.hidden = true;
        CROP_CONTAINER.hidden = false;

        IMAGE_SAVE_BUTTON.setAttribute('name', 'mobile');
        IMAGE_SAVE_BUTTON.setAttribute('data-type', 'background');
        IMAGE_SAVE_BUTTON.setAttribute('data-class', 'profile');
    });

    BACKGROUND_MAIN_CONFIRM.addEventListener('click', function() {
        // Hide current container, show crop container
        containers[current].hidden = false
        ASPECT_RATIO_MENU.hidden = true;
    });


    // Event listener for back button
    $('#profile-back-button').on('click', function() {
        // Reset and hide cropper
        resetCropper();
        // Reset file input
        $('#profile-image-upload').val('');

        // Show the previous container
        if ($(this).attr('name') === 'profile') {
            containers[current].hidden = false;
            CROP_CONTAINER.hidden = true;
        } else {

            CROP_CONTAINER.hidden = true;
            ASPECT_RATIO_MENU.hidden = false;
        }
    });

    // Event listener for crop button
    $('#image-cropper-save').on('click', function() {
        let this_name = $(this).attr('name');
        console.log(this_name);
        let this_type = $(this).attr('data-type');
        console.log(this_type);
        let this_class = $(this).attr('data-class');
        let source_image;
        
        //Get cropped image data
        var croppedImageDataURL = cropper.getCroppedCanvas().toDataURL();
        var cropped_image = dataURItoBlob(croppedImageDataURL);
        let wpid;

        console.log(this_type)

        if (this_type === 'profile') {
            this.disabled = true;
            finishProfileImage(profile_img_upload);

            yb_hideCropper(false);
            
            profile_upload_button.innerHTML = "Change Profile Image"
            document.getElementById('onboarding-heading-1').innerHTML = `Thats a good look for you. Click next to Continue.`;
            PROFILE_IMAGE_PREVIEW.innerHTML = `
                <svg class="profile-image-thumbnail xxlarge border-solid plainBorder narrowBorder circle yb-center-margin lr yb-margin-B20" xmlns="http://www.w3.org/2000/svg" height="256" viewBox="0 -960 960 960" width="256"><path style="fill:green;" d="m424-296 282-282-56-56-226 226-114-114-56 56 170 170Zm56 216q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Z"/></svg>
            `;

            nextButtons[current].innerHTML = "Next";



        } else if (this_type === 'background') {
            console.log("uploading background image")
            source_image = background_img_upload.files[0];

            if (this_name === 'desktop') {
                $('#desktop-preview-output').attr('src', croppedImageDataURL);
            } else {
                
                $('#mobile-preview-output').attr('src', croppedImageDataURL);
            }

            if (BACKGROUND_IMAGE_FORM.hasAttribute('data-wpid')) {
                wpid = BACKGROUND_IMAGE_FORM.getAttribute('data-wpid');
            } else {
                wpid = null;
            }
            
        }
        
    });


    background_upload_button.addEventListener('click', () => {
        background_img_upload.click();
    });
    //your jQuery code goes here
    setTimeout(function() {
        intro_text.style.opacity = 1;

        setTimeout(function() {
            action_container.style.transform = "translateY(0)";

        }, 1200);
    }, 1200);
};

