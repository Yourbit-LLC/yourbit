const SUBMIT = document.getElementById("submit-button");
var loginWidgetId;


// //If mobile device, show PWA popup based on android or ios
// if (navigator.userAgent.match(/Android/i)) {
//     pwa_popup.style.display = "block";
//     pwa_popup.classList.add('show');
//     pwa_content_android.classList.add('show');
// } else if (navigator.userAgent.match(/iPhone|iPad|iPod/i)) {
//     pwa_popup.style.display = "block";
//     pwa_popup.classList.add('show');
//     pwa_content_ios.classList.add('show');



function prevalidateLogin() {
    let form = document.getElementById('login-form');
    let email = form.querySelector('input[name="email"]');
    let password = form.querySelector('input[name="password"]');
    let emailError = document.getElementById('email-error');
    let passwordError = document.getElementById('password-error');
    let valid = true;
    
    if (email.value === '') {
        emailError.textContent = 'Email is required';
        emailError.style.display = 'block';
        valid = false;
        
    } 

    if (password.value === '') {
        passwordError.textContent = 'Password is required';
        passwordError.style.display = 'block';
        valid = false;
        
    } 

    return valid;
}

function yb_attempt_login() {
    let form = document.getElementById('login-form');
    let form_data = new FormData(form);
    $.ajax({
        type: 'POST',
        url: '/login/',
        data: form_data,
        processData: false,   // Prevent jQuery from processing FormData
        contentType: false,   // Prevent jQuery from setting Content-Type header
        success: function(response) {
            
            window.location.href = '/bitstream/';
 
        },
        error: function(response) {
            if (response.status === 400) {        
                let error = document.getElementById('login-error');
                error.textContent = "Incorrect username or password. Please try again.";
                error.style.display = 'block';

                turnstile.reset(loginWidgetId);
            }

        }
    });
}

$(document).ready(function() {

    signUpWidgetId = turnstile.render('#login-turnstile', {
        sitekey: '0x4AAAAAAAkRMoW7uwLsbC_G'
    });

    SUBMIT.addEventListener('click', yb_attempt_login);

});
