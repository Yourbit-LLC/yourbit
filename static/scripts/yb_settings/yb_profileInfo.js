try {
    var info_fields = document.querySelectorAll('.profile-field');

} catch {
    info_fields = document.querySelectorAll('.profile-field');
}   

function saveProfileInfo() {
    var data = {};
    for (var i = 0; i < info_fields.length; i++) {
        data[info_fields[i].name] = info_fields[i].value;
    }
    let csrf_token = getCSRF();
    $.ajax({
        type: 'POST',
        url: '/profile/profile-info/update/',
        data: data,
        headers: {
            'X-CSRFToken': csrf_token
        },
        success: function (response) {
            if (response.status == 'success') {
                console.log('Profile info saved');
                showNotification(expandNotification, 'Profile info saved successfully');
            } else {
                showNotification(expandNotification, "Oops! Something went wrong..."); 
            }
        }
    });
}


$(document).ready(function () {
    for (var i = 0; i < info_fields.length; i++) {
        info_fields[i].addEventListener('blur', function () {
            saveProfileInfo();
        });
    }

    //FOr each field detect enter button and then blur
    for (var i = 0; i < info_fields.length; i++) {
        info_fields[i].addEventListener('keypress', function (e) {
            if (e.key === 'Enter') {
                //if its in a text area, if shift is held dont blur
                if (e.target.tagName === 'TEXTAREA' && e.shiftKey) {
                    return;
                } else {
                    e.preventDefault();
                    e.target.blur();
                }
            }
        });
    }
});