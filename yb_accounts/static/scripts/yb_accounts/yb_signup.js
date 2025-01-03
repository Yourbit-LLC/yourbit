const SUBMIT = document.getElementById("submit-button")
var signUpWidgetId;


// //If mobile device, show PWA popup based on android or ios
// if (navigator.userAgent.match(/Android/i)) {
//     pwa_popup.style.display = "block";
//     pwa_popup.classList.add('show');
//     pwa_content_android.classList.add('show');
// } else if (navigator.userAgent.match(/iPhone|iPad|iPod/i)) {
//     pwa_popup.style.display = "block";
//     pwa_popup.classList.add('show');
//     pwa_content_ios.classList.add('show');


function yb_attempt_signup() {
    let form = document.getElementById('signup-form');
    let form_data = new FormData(form);

    $.ajax({
        type: 'POST',
        url: '/register/',
        data: form_data,
        processData: false,   // Prevent jQuery from processing FormData
        contentType: false,   // Prevent jQuery from setting Content-Type header
        success: function(response) {
            window.location.href = '/accounts/templates/interact-terms/';
        },
        error: function(response) {
            if (response.status === 400) {
                const errors = response.responseJSON.errors;

                if (errors) {
                    // Loop through each error and display it
                    for (let field_name in errors) {
                        let error_field = document.getElementById('error-' + field_name);
                        if (error_field) {
                            error_field.textContent = errors[field_name].join(', ');
                            error_field.style.display = 'block';
                        }
                    }

                    // Scroll to the first error message
                    let first_error_key = Object.keys(errors)[0];
                    let first_error_message = document.getElementById('error-' + first_error_key);
                    if (first_error_message) {
                        first_error_message.scrollIntoView({ behavior: 'smooth' });
                    }
                } else {
                    console.error('Error: No detailed error messages received from server.');
                }
            } else {
                console.error('Unexpected error:', response);
            }

            turnstile.reset(signUpWidgetId);
        }
    });
}


$(document).ready(function() {

    signUpWidgetId = turnstile.render('#signup-turnstile', {
        sitekey: '0x4AAAAAAAkRMoW7uwLsbC_G'
    });

    SUBMIT.addEventListener('click', yb_attempt_signup);

});
