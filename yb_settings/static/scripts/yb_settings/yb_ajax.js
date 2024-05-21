function saveAccountSettings() {
    var form = $('#account-settings-form');
    var formData = form.serialize();
    $.ajax({
        url: form.attr('action'),
        type: 'POST',
        data: formData,
        success: function (data) {
            if (data.success) {
                showNotification('success', data.message);
            } else {
                showNotification('error', data.message);
            }
        }
    });
}

function saveProfileInfo() {
    var form = $('#profile-info-form');
    var formData = form.serialize();
    $.ajax({
        url: form.attr('action'),
        type: 'POST',
        data: formData,
        success: function (data) {
            if (data.success) {
                showNotification('success', data.message);
            } else {
                showNotification('error', data.message);
            }
        }
    });
}

function savePassword() {
    var form = $('#password-form');
    var formData = form.serialize();
    $.ajax({
        url: form.attr('action'),
        type: 'POST',
        data: formData,
        success: function (data) {
            if (data.success) {
                showNotification('success', data.message);
            } else {
                showNotification('error', data.message);
            }
        }
    });
}
