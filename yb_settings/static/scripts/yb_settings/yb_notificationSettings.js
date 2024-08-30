try {
    var notify_checkboxes = document.querySelectorAll('.notification-check');
    var notify_fields = document.querySelectorAll('.ntfy-field');
} catch {
    notify_checkboxes = document.querySelectorAll('.notification-check');
    notify_fields = document.querySelectorAll('.ntfy-field');
}

function saveNotificationSettings() {
    
    var form = $('#notification-settings-form');
    var formData = form.serialize();
    
    $.ajax({
        url: form.attr('action'),
        type: 'POST',
        data: formData,
        success: function (data) {
            if (data.success) {
                showNotification(expandNotification, "Notification Settings Saved");
            } else {
               showNotification(expandNotification, "Oops! Something went wrong..."); 
            }
        }
    });
}

$(document).ready(function () {

    for (var i = 0; i < notify_fields.length; i++) {
        notify_fields[i].addEventListener('blur', function () {
            saveNotificationSettings();
        });
    }

    for (var i = 0; i < notify_checkboxes.length; i++) {
        notify_checkboxes[i].addEventListener('input', function () {
            saveNotificationSettings();
        });
    }

});