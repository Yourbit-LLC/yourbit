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
const MAIN_CONTAINER = document.getElementById("container-1")
const BACKGROUND_IMAGE_FORM = document.getElementById('background-image-form');
// Global variables (if needed)


const containers = {
    1: document.getElementById('onboarding-1'),
    2: document.getElementById('onboarding-2'),
    3: document.getElementById('onboarding-3'),
    
}
const nextButtons = {
    1: document.getElementById('onboarding-1-next'),
    2: document.getElementById('onboarding-2-next'),
    3: document.getElementById('onboarding-3-next'),
    
}
const backButtons = {
    2: document.getElementById('onboarding-2-back'),
    3: document.getElementById('onboarding-3-back'),
    
}

const form = document.getElementById('onboarding-form');

const next = (current) => {
    if (current == 2) {
        //submit bio form with ajax
        const bio_form = document.getElementById('bio-form');
        const bio_data = new FormData(bio_form);
        $.ajax({
            url: bio_form.action,
            type: bio_form.method,
            data: bio_data,
            processData: false,
            contentType: false,
            success: function(response) {
                console.log(response);
            },
            error: function(error) {
                console.log(error);
            }
        });
        
    };
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
    MAIN_CONTAINER.style.overflowY = "hidden";
    if (current === 1) {
        nextButtons[current].hidden = false;
            
    } else if (current === 3) {
        nextButtons[current].hidden = true;
        backButtons[current].hidden = false;
        backButtons[current].addEventListener('click', yb_handleBack);
        MAIN_CONTAINER.style.overflowY = "scroll";
        
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

    //your jQuery code goes here
    setTimeout(function() {
        intro_text.style.opacity = 1;

        setTimeout(function() {
            action_container.style.transform = "translateY(0)";

        }, 1200);
    }, 1200);
};

