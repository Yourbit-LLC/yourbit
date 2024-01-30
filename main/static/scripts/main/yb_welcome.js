const sections = document.querySelectorAll('.yb-section-container');
const login_button = document.getElementById('login-button');
const signup_button = document.getElementById('signup-button');
const floating_actions = document.querySelector('.yb-container-floatingAction');
const bg_image = document.querySelector('.feathered-background');
const home_header = document.getElementById('welcome-header');
const login_cancel_button = document.getElementById('go-back-login');
const signup_cancel_button = document.getElementById('go-back-signup');
const menu_button = document.getElementById('hamburger-button');
let currentSection = 0;


document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown') {
        scrollToNextSection();
    }
});

document.addEventListener('wheel', (e) => {
    if (e.deltaY > 150) {
        scrollToNextSection();
    }
});

function scrollToNextSection() {
    if (currentSection < sections.length - 1) {
        currentSection++;
        sections[currentSection].scrollIntoView({ behavior: 'smooth' });
        if (currentSection == 1) {
            let video = document.getElementById("video-terrain-scan");
            video.play();
        }
        if (currentSection == 2) {
            let video = document.getElementById("video-color-your-world");
            video.play();
        }
    }
}

let isScrolling = false;
const scrollDelay = 800; // Adjust this value to set the delay between section transitions

// ... (previous code)

let startY = 0;
let endY = 0;

document.addEventListener('wheel', (e) => {
    if (!isScrolling) {
        if (e.deltaY > 150) {
            scrollToNextSection();
        } else {
            scrollToPreviousSection();
        }
        isScrolling = true;
        setTimeout(() => {
            isScrolling = false;
        }, scrollDelay);
    }
});

document.addEventListener('touchstart', (e) => {
    startY = e.touches[0].clientY;
});

document.addEventListener('touchmove', (e) => {
    endY = e.touches[0].clientY;
});

document.addEventListener('touchend', () => {
    if (!isScrolling) {
        if (endY+150 < startY) {
            scrollToNextSection();
        } else {
            scrollToPreviousSection();
        }
        isScrolling = true;
        setTimeout(() => {
            isScrolling = false;
        }, scrollDelay);
    }
});

function scrollToPreviousSection() {
    if (currentSection > 0) {
        currentSection--;
        sections[currentSection].scrollIntoView({ behavior: 'smooth' });
    }
}

// ...


function scrollToPreviousSection() {
    if (currentSection > 0) {
        currentSection--;
        sections[currentSection].scrollIntoView({ behavior: 'smooth' });
    }


}

$(document).ready(function() {
    // Target the element you want to slide down and hide

    // Add a click event handler to trigger the animation
    $(login_button).click(function() {
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
        $(login_cancel_button).click(function() {
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
        });
    });

    //Sign up button does same thing as login button
    $(signup_button).click(function() {
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
        $(signup_cancel_button).click(function() {
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
        });
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
