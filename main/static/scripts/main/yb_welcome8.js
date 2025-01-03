const sections = document.querySelectorAll('.yb-section-container');
const login_button = document.getElementById('login-button');
const signup_button = document.getElementById('signup-button');
const floating_actions = document.querySelector('.yb-container-floatingAction');
const bg_image = document.querySelector('.feathered-background');
const home_header = document.getElementById('welcome-header');
const login_cancel_button = document.getElementById('go-back-login');
const signup_cancel_button = document.getElementById('go-back-signup');
const menu_button = document.getElementById('hamburger-button');
const back_to_signup = document.getElementById('back-to-sign-up');
const back_to_login = document.getElementById('back-to-login');
const pwa_popup = document.getElementById('pwa-popup');
const pwa_content_android = document.getElementById('pwa-content-android');
const pwa_content_ios = document.getElementById('pwa-content-ios');
const submit_signup = document.getElementById('submit-signup');
const submit_login = document.getElementById('submit-login');
let currentSection = 0;
var loginWidgetId;
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
                error.textContent = "Incorrect email or password. Please try again.";
                error.style.display = 'block';

                turnstile.reset(loginWidgetId);
            }

        }
    });
}
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




function hideLogin() {
    $(home_header).animate({"top": "0px"}, "fast");
    $('#login-form').animate({"top": "100vh"}, function() {
        // Animation complete, hide the element
        $(this).hide();
    });
    history.pushState(null, null, '/');
    $(floating_actions).show('fast', function() {
        // Animation complete
        $(this).animate({"bottom": "35px"}, "fast");
    });
    $('.yb-section-container').show();
    bg_image.style.filter = "brightness(50%) blur(150px)";
    bg_image.style.webkitFilter = "brightness(50%) blur(150px)";
}

function showLogin() {
    $(home_header).animate({"top": "-60px"}, "fast");
    $(floating_actions).animate({"bottom": "-150px"}, function() {
        // Animation complete, hide the element
        $(this).hide();

    });
    $('#login-form').show('fast', function() {
        // Animation complete
        $(this).animate({"top": "0vh"}, "fast");
    });
    history.pushState(null, null, '/login/');
    $('.yb-section-container').hide();
    bg_image.style.filter = "brightness(20%) blur(150px)";
    bg_image.style.webkitFilter = "brightness(20%) blur(150px)";

    //Reverse on click of cancel button
    $(login_cancel_button).click(hideLogin);
}

function hideSignUp() {
    // Render each widget manually and store the widgetId
    
    $(home_header).animate({"top": "0px"}, "fast");
    $('#signup-form').animate({"top": "100vh"}, function() {
        // Animation complete, hide the element
        $(this).hide();
    });
    history.pushState(null, null, '/');
    $(floating_actions).show('fast', function() {
        // Animation complete
        $(this).animate({"bottom": "35px"}, "fast");
    });
    $('.yb-section-container').show();
    bg_image.style.filter = "brightness(50%) blur(150px)";
    bg_image.style.webkitFilter = "brightness(50%) blur(150px)";
}


function showSignUp() {
    $(home_header).animate({"top": "-60px"}, "fast");
    $(floating_actions).animate({"bottom": "-150px"}, function() {
        // Animation complete, hide the element
        $(this).hide();
    });
    $('#signup-form').show('fast', function() {
        // Animation complete
        $(this).animate({"top": "0vh"}, "fast");
    });
    $('.yb-section-container').hide();
    history.pushState(null, null, '/register/');
    bg_image.style.filter = "brightness(20%) blur(150px)";
    bg_image.style.webkitFilter = "brightness(20%) blur(150px)";

    //Reverse on click of cancel button
    $(signup_cancel_button).click(hideSignUp);
}

$(document).ready(function() {
    loginWidgetId = turnstile.render('#login-turnstile', {
        sitekey: '0x4AAAAAAAkRMoW7uwLsbC_G'
    });
    signUpWidgetId = turnstile.render('#signup-turnstile', {
        sitekey: '0x4AAAAAAAkRMoW7uwLsbC_G'
    });

    submit_signup.addEventListener('click', yb_attempt_signup);
    submit_login.addEventListener('click', yb_attempt_login);

    // Add a click event handler to trigger the animation
    $(login_button).click(showLogin);

    //Sign up button does same thing as login button
    $(signup_button).click(showSignUp);

    $(back_to_signup).click(function () {
        hideLogin();
        showSignUp();
    });

    $(back_to_login).click(function () {
        hideSignUp();
        showLogin();
    });

    //Hamburger menu button
    $(menu_button).click(function() {
        $(this).toggleClass('closed');
        $('#side-menu').toggleClass('closed');
        $('#hamburger-path').toggleClass('closed');
        $(this).toggleClass('open');
        $('#side-menu').toggleClass('open');
        $('#hamburger-path').toggleClass('open');
    });
});
