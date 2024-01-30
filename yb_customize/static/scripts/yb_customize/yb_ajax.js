function uploadProfileImage(source_image, cropped_image, type, profile_class, name=null, wpid=null) {
    var formData = new FormData();
    formData.append('image', source_image);
    formData.append('cropped_image', cropped_image);
    formData.append('type', type);
    formData.append('name', name);
    formData.append('wpid', wpid);
    formData.append('class', profile_class);

    console.log(source_image);
    console.log(cropped_image);

    let csrf_token = getCSRF();
    
    $.ajax({
        type: 'POST',
        url: `/customize/upload/${type}-image/`,
        data: formData,
        headers: {
            'X-CSRFToken': csrf_token,
        },
        processData: false,
        contentType: false,
        success: function(data) {
            console.log(data);

            
            console.log(data.stage);

        if (type === 'background') {
            if (data.stage === 1){
                console.log('stage 1');
                document.getElementById('background-image-form').setAttribute('data-wpid', data.wpid);
                document.getElementById('onboarding-heading-crop').innerHTML = "Click 'Confirm', at the bottom, if you're finished. Otherwise, select an option to continue editing.";
            } else if (data.stage === 2) {
                console.log('stage 2');
                ASPECT_RATIO_MENU.hidden = true;
                background_upload_button.innerHTML = "Change Wallpaper";
                nextButtons[current].innerHTML = "Next";
                document.getElementById('onboarding-heading-2').innerHTML = 'Great! Now, click "Next" to continue with the last step.';
                document.getElementById('onboarding-heading-crop').innerHTML = "If you need to, you can make some changes. Otherwise, scroll down and click 'Confirm'.";
                BACKGROUND_IMAGE_PREVIEW.innerHTML = `
                    <svg class="profile-image-thumbnail xxlarge border-solid plainBorder narrowBorder circle yb-center-margin lr yb-margin-B20" xmlns="http://www.w3.org/2000/svg" height="256" viewBox="0 -960 960 960" width="256"><path style="fill:green;" d="m424-296 282-282-56-56-226 226-114-114-56 56 170 170Zm56 216q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Z"/></svg>
                `;
            }

            yb_hideCropper(true);
            
        } else {
            yb_hideCropper(false);
        }

        },
        error: function(data) {
            console.log(data);
        }
    });
}

