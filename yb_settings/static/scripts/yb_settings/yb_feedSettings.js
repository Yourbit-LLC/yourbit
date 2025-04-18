try {
    var form_fields = document.querySelectorAll('.feed-field');
} catch {
    form_fields = document.querySelectorAll('.feed-field');
}

function saveAccountSettings() {
    var form = $('#feed-settings-form');
    var formData = form.serialize();
    $.ajax({
        url: form.attr('action'),
        type: 'POST',
        data: formData,
        success: function (data) {
            if (data.success) {
                showNotification(expandNotification, "Feed Settings Saved");
            } else {
               showNotification(expandNotification, "Oops! Something went wrong..."); 
            }
        }
    });
}

function detectEnterPress(event) {
    if (event.key === 'Enter') {
        for (var i = 0; i < form_fields.length; i++) {
            form_fields[i].blur();
        }
        saveAccountSettings();
    }
}

$(document).ready(function () {
    for (var i = 0; i < form_fields.length; i++) {
        form_fields[i].addEventListener('focus', function () {
            this.select();

        });

        form_fields[i].addEventListener('keypress', function (event) {
            detectEnterPress(event);

        });

        form_fields[i].addEventListener('blur', function () {
            saveAccountSettings();
        });
    }
});