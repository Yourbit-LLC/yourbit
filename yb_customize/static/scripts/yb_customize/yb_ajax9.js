
function submitCustomOption(c_class, option, value) {
    let csrf_token = getCSRF();
    $.ajax({
        type: 'POST',
        url: '/customize/update/',
        data: {
            c_class: c_class,
            option: option,
            value: value
        },
        headers: {
            'X-CSRFToken': csrf_token,
        },
        success: function(response) {
            yb_showNotification(expandNotification, "Settings Updated");
            console.log(response);
        },
        error: function(response) {
            console.log(response);
        }
    });
}

function yb_uploadProfileImage(source, data, profile_class, image_type="profile", wpid=null) {
    let formData = new FormData();
    let crop_data = {
        'x': data.x,
        'y': data.y,
        'width': data.width,
        'height': data.height
    }
    formData.append('crop_data', JSON.stringify(crop_data))
    formData.append('image', source);
    formData.append('image_type', image_type);
    formData.append('profile_class', profile_class);
    formData.append('wpid', wpid);

    let csrf_token = getCSRF();
    $.ajax({
        type: 'POST',
        url: `/photo/upload/`,
        data: formData,
        headers: {
            'X-CSRFToken': csrf_token,
        },
        processData: false,
        contentType: false,
        success: function(data) {
            console.log(data);
            try {
                yb_replaceProfileImages();
                yb_setWPID(data.wpid);
            } catch(err) {
                console.log("No profile images to replace");
            }
            
            console.log(data.wpid);
            
        },
        error: function(data) {
            console.log(data);
        }
    });
}
