var base_url = window.location.origin;
var width = screen.width;
var notifications_last = 0;
var first_load = true;
var home_feed = document.getElementById('feed-content-container');
var content_container = document.getElementById('content-container');

var postList = document.getElementById("content-container-feed");

//Core Function Preparation
$(document).ready(function(){
    yb_setTimezone();
})

/*################################################################################################################

    Create Bit Functions

##################################################################################################################*/

//Opening the menu on click of create icon
$('#mobile-create-icon').click(function() {
    $('#cb-divider').show();
    showCreateBit(raiseCreateBit);
});

//Closing the menu
$('#bit-panel-close').click(function() {
    dropCreateBit(hideCreateBit);
});

/* Places the cursor in the title field on reveal */
function titleFocus() {
    let create_bit = document.getElementById('create-bit-mobile');
    $('#mobile-title').focus();
}



/* Function to set display of create bit to block */
function showCreateBit(callback) {
    let create_bit = document.getElementById('create-bit-mobile');
    create_bit.style.visibility='visible';
    
    // let current_url = document.getElementById('current_url').value;
    callback(titleFocus);
    // history.pushState({}, "", `${current_url}/create/`);
}

/* Function to animate create bit onto the screen */
function raiseCreateBit(callback){
    let create_bit = document.getElementById('create-bit-mobile');
    create_bit.style.transition = '0.5s';
    create_bit.style.transform = 'translate(-50%, -90vh)';
    setTimeout(callback, 500);
}


/* Before hiding create bit, ru a drop animation followUp = hideCreateBit() */
function dropCreateBit(followUp) {
    let create_bit = document.getElementById('create-bit-mobile');
    create_bit.style.transition = '0.25s';
    create_bit.style.transform = 'translate(-50%, 0vh)';
    followUp();
}

/* Hide Create bit after drop down animation */
function hideCreateBit() {
    let create_bit = document.getElementById('create-bit-mobile');
    create_bit.style.visibility='hidden';
    // let current_url = document.getElementById('current_url').value;
    // history.pushState({}, "", `${current_url}/`);
    $('#cb-divider').hide();
}


/*################################################################################################################

    Scroll UI

##################################################################################################################*/


$(".button-support").click(function(){
    $("#cb-divider").fadeIn();
    console.log("clicked");
    let ui_container = document.getElementById("general-ui-container");
    $("#general-ui-container").css({"display": "block"});
    $("#general-ui-container").css({"visibility": "visible"});
    $("#general-ui-container").animate({"top": "10vh"});
    let support_container = yb_createElement("div", "support-container", "general-container");
    let support_title = yb_createElement("div", "support-title", "general-title");
    let support_title_text = yb_createElement("h3", "support-title-text", "general-title-text");
    
    support_title_text.innerHTML = "<br><br>Yourbit Support Center<br>";
    support_title.appendChild(support_title_text);
    support_container.appendChild(support_title);
    ui_container.appendChild(support_container);

    let sub_title = yb_createElement("p", "support-sub-title", "support-sub-title");
    sub_title.setAttribute("style", "font-size: small");
    sub_title.innerHTML = "<br>What can I help you with?<br>";
    support_container.appendChild(sub_title);

    let option_1 = yb_createButton("option-1", "support-option", "create-option", "Report a Bug");
    support_container.appendChild(option_1);

    option_1.addEventListener("click", function(){
        support_container.innerHTML = "";
        let bug_container = yb_createElement("div", "bug-container", "general-container");
        let bug_title = yb_createElement("div", "bug-title", "general-title");
        let bug_title_text = yb_createElement("h3", "bug-title-text", "general-title-text");
        bug_title_text.innerHTML = "<br><br>Report a Bug<br>";
        bug_title.appendChild(bug_title_text);
        bug_container.appendChild(bug_title);
        support_container.appendChild(bug_container);

        let bug_sub_title = yb_createElement("p", "bug-sub-title", "bug-sub-title");
        bug_sub_title.setAttribute("style", "font-size: small");
        bug_sub_title.innerHTML = "<br>What is the issue?<br>";
        bug_container.appendChild(bug_sub_title);

        let bug_subject = yb_createInput("text", "yb-single-line-input", "report-subject-field");
        bug_subject.setAttribute("placeholder", "Subject");
        bug_container.appendChild(bug_subject);

        let bug_input = yb_createInput("textarea", "yb-single-line-input", "report-description-field");
        bug_input.setAttribute("placeholder", "Describe the issue you are having...");
        
        bug_container.appendChild(bug_input);
        let break_1 = yb_createElement("br", "break", "break");
        let break_2 = yb_createElement("br", "break", "break");
        bug_container.appendChild(break_1);
        bug_container.appendChild(break_2);
        let bug_submit = yb_createButton("bug-submit", "bug-submit", "wide-button", "Submit");
        bug_container.appendChild(bug_submit);

        let details = yb_createElement("p", "bug-details", "bug-details");
        details.setAttribute("style", "font-size: small; width: 90%; margin-left: auto; margin-right: auto;");
        details.innerHTML = `
            <br>
                <small>
                    Once this form is submitted you will receive an automated email confirming your submission. 
                    Yourbit will get back to you with a response within 3-5 business days.
                    By submitting this bug report, you agree to allow Yourbit to use the information you provide to improve our services.
                    
                </small>
            <br>
            <br>`
        bug_container.appendChild(details);
        bug_submit.addEventListener("click", function(){
            yb_submitReport("bug");
        });
    });

    let option_2 = yb_createButton("option-2", "support-option", "create-option", "Request a Feature");
    support_container.appendChild(option_2);

    option_2.addEventListener("click", function(){
        support_container.innerHTML = "";
        let feature_container = yb_createElement("div", "feature-container", "general-container");
        let feature_title = yb_createElement("div", "feature-title", "general-title");
        let feature_title_text = yb_createElement("h3", "feature-title-text", "general-title-text");
        feature_title_text.innerHTML = "<br><br>Request a Feature<br>";
        feature_title.appendChild(feature_title_text);
        feature_container.appendChild(feature_title);
        support_container.appendChild(feature_container);

        let feature_sub_title = yb_createElement("p", "feature-sub-title", "feature-sub-title");
        feature_sub_title.setAttribute("style", "font-size: small");
        feature_sub_title.innerHTML = "<br>What feature would you like to see?<br>";
        feature_container.appendChild(feature_sub_title);

        let feature_subject = yb_createInput("text", "yb-single-line-input", "report-subject");
        feature_subject.setAttribute("placeholder", "Subject");
        feature_container.appendChild(feature_subject);

        let feature_input = yb_createInput("textarea", "yb-single-line-input", "report-description");
        feature_input.setAttribute("placeholder", "Describe the feature you would like to see...");
        
        feature_container.appendChild(feature_input);
        let break_1 = yb_createElement("br", "break", "break");
        let break_2 = yb_createElement("br", "break", "break");
        feature_container.appendChild(break_1);
        feature_container.appendChild(break_2);
        let feature_submit = yb_createButton("feature-submit", "feature-submit", "wide-button", "Submit");
        feature_container.appendChild(feature_submit);

        let details = yb_createElement("p", "feature-details", "feature-details");
        details.setAttribute("style", "font-size: small; width: 90%; margin-left: auto; margin-right: auto;");
        details.innerHTML = `
            <br>
                <small>
                    Once this form is submitted you will receive an automated email confirming your submission. 
                    Yourbit will get back to you with a response within 3-5 business days.
                    By submitting this feature request, you agree to allow Yourbit to use the information you provide to improve our services.
                    
                </small>
            <br>
            <br>`
        feature_container.appendChild(details);
        feature_submit.addEventListener("click", function(){
            yb_submitReport("feature")
        });
    });

    let option_3 = yb_createButton("option-3", "support-option", "create-option", "Report a User");
    support_container.appendChild(option_3);

    option_3.addEventListener("click", function(){
        support_container.innerHTML = "";
        let report_container = yb_createElement("div", "report-container", "general-container");
        let report_title = yb_createElement("div", "report-title", "general-title");
        let report_title_text = yb_createElement("h3", "report-title-text", "general-title-text");
        report_title_text.innerHTML = "<br><br>Report a User<br>";
        report_title.appendChild(report_title_text);
        report_container.appendChild(report_title);
        support_container.appendChild(report_container);

        let report_sub_title = yb_createElement("p", "report-sub-title", "report-sub-title");
        report_sub_title.setAttribute("style", "font-size: small");
        report_sub_title.innerHTML = "<br>What is the issue?<br>";
        report_container.appendChild(report_sub_title);

        let report_user = yb_createInput("text", "yb-single-line-input", "report-user-field");
        report_user.setAttribute("placeholder", "Username in question");
        
        report_container.appendChild(report_input);

        let report_subject = yb_createInput("text", "yb-single-line-input", "report-subject-field");
        report_subject.setAttribute("placeholder", "Subject");
        report_container.appendChild(report_subject);

        let report_input = yb_createInput("textarea", "yb-single-line-input", "report-description-field");
        report_input.setAttribute("placeholder", "Describe the issue you are having with this user...");
        
        report_container.appendChild(report_input);
        let break_1 = yb_createElement("br", "break", "break");
        let break_2 = yb_createElement("br", "break", "break");
        report_container.appendChild(break_1);
        report_container.appendChild(break_2);
        let report_submit = yb_createButton("report-submit", "report-submit", "wide-button", "Submit");
        report_container.appendChild(report_submit);

        let details = yb_createElement("p", "report-details", "report-details");
        details.setAttribute("style", "font-size: small; width: 90%; margin-left: auto; margin-right: auto;");
        details.innerHTML = `
            <br>
                <small>
                    Once this form is submitted you will receive an automated email confirming your submission. 
                    Yourbit will get back to you with a response within 3-5 business days.
                    By submitting this report, you agree to allow Yourbit to use the information you provide to improve our services.
                    
                </small>
            <br>
            <br>`
        report_container.appendChild(details);
        report_submit.addEventListener("click", function(){
            yb_submitReport("user")
        });
    });


    let option_4 = yb_createButton("option-4", "support-option", "create-option", "Tips & Tricks");
    support_container.appendChild(option_4);

    option_4.addEventListener("click", function(){
        support_container.innerHTML = "";
        let tips_container = yb_createElement("div", "tips-container", "general-container");
        let tips_title = yb_createElement("div", "tips-title", "general-title");
        let tips_title_text = yb_createElement("h3", "tips-title-text", "general-title-text");
        tips_title_text.innerHTML = "<br><br>Tips & Tricks<br>";
        tips_title.appendChild(tips_title_text);
        tips_container.appendChild(tips_title);
        support_container.appendChild(tips_container);

        let tips_sub_title = yb_createElement("p", "tips-sub-title", "tips-sub-title");
        tips_sub_title.setAttribute("style", "font-size: small");
        tips_sub_title.innerHTML = "<br>How to use Yourbit<br>";
        tips_container.appendChild(tips_sub_title);

        let tips_paragraph = yb_createElement("p", "tips-paragraph", "tips-paragraph");
        tips_paragraph.setAttribute("style", "width: 80%; margin: 0 auto;");
        tips_paragraph.innerHTML = `
            <br>
                <small>
                    <ul>
                        <li>Use the search bar to find the content you are looking for.</li>
                        <li>Use the filters to narrow down your search.</li>
                        <li>Use the "Create" button to create your own content.</li>
                        <li>Use the "Profile" button to view your profile.</li>
                        <li>Use the "Settings" button to change your account settings.</li>
                        <li>Use the "Support" button to contact us.</li>
                    </ul>
                </small>
            <br>
            <br>`
        tips_container.appendChild(tips_paragraph);

    });

    email_header = yb_createElement("h4", "email-header", "email-header");
    email_header.innerHTML = "<br>Other Inquiries:<br>";

    support_container.appendChild(email_header);

    let option_5 = yb_createButton("option-5", "support-option", "create-option", "Email Yourbit");
    support_container.appendChild(option_5);

    option_5.addEventListener("click", function(){
        support_container.innerHTML = "";
        let email_container = yb_createElement("div", "email-container", "general-container");
        let email_title = yb_createElement("div", "email-title", "general-title");
        let email_title_text = yb_createElement("h3", "email-title-text", "general-title-text");
        email_title_text.innerHTML = "<br><br>Email Support<br>";
        email_title.appendChild(email_title_text);
        email_container.appendChild(email_title);
        support_container.appendChild(email_container);

        let email_sub_title = yb_createElement("p", "email-sub-title", "email-sub-title");
        email_sub_title.setAttribute("style", "font-size: small");
        email_sub_title.innerHTML = "<br>How can we help?<br>";
        email_container.appendChild(email_sub_title);

        let email_input = yb_createInput("textarea", "yb-single-line-input", "email-input");
        email_input.setAttribute("placeholder", "Describe the issue you are having with this user...");
        
        email_container.appendChild(email_input);
        let break_1 = yb_createElement("br", "break", "break");
        let break_2 = yb_createElement("br", "break", "break");
        email_container.appendChild(break_1);
        email_container.appendChild(break_2);
        let email_submit = yb_createButton("email-submit", "email-submit", "wide-button", "Submit");
        email_container.appendChild(email_submit);

        let details = yb_createElement("p", "email-details", "email-details");
        details.setAttribute("style", "font-size: small; width: 90%; margin-left: auto; margin-right: auto;");
        details.innerHTML = `
            <br>
                <small>
                    Once this form is submitted you will receive an automated email confirming your submission. 
                    Yourbit will get back to you with a response within 3-5 business days.
                    By submitting this report, you agree to allow Yourbit to use the information you provide to improve our services.
                    
                </small>
            <br>
            <br>`
        email_container.appendChild(details);
        email_submit.addEventListener("click", function(){
            let email = email_input.value
            let csrfToken = getCSRF();
            let base_url = window.location.origin;
            let url = `${base_url}/support/email/`
            let this_data = new FormData();
            this_data.append("email", email);
            this_data.append("csrfmiddlewaretoken", csrfToken);
            $.ajax({
                url: url,
                type: "POST",
                data: this_data,
                processData: false,
                contentType: false,
                success: function(response){

                }
            })
        })

    });

    let email_paragraph = yb_createElement("p", "email-paragraph", "email-paragraph");
    
    email_paragraph.innerHTML = "<br><small>The Yourbit team will review your email and we will get back to you as quickly as we can.<br><br>Until then, try and browse the support center to find the answer to your question!</small><br><br>";
    email_paragraph.setAttribute("style", "width: 80%; margin: 0 auto;");
    support_container.appendChild(email_paragraph);

});

function yb_closeCard(){
    $("#general-ui-container").animate({"top": "100vh"}, 25);
    $("#general-ui-container").animate({"height": "80vh"}, 25);
    $(".general-container").remove();
    $("#cb-divider").fadeOut();
}

$("#support-panel-close").click(function(){
    yb_closeCard();
    
})

function yb_showComments(bit_id) {
    $(`#comment-container-${bit_id}`).show();
    $(`#comment-label-${bit_id}`).show();
    yb_getComments(bit_id)

}
function yb_hideComments(bit_id) {
    $(`#comment-container-${bit_id}`).hide();
    $(`#comment-label-${bit_id}`).hide();
    $(`#comment-container-${bit_id}`).empty();
}


//Click the logo to go home
$('#logo-image').click(function(){
    window.location.href = `${base_url}`;
})


//Get the base url for various functions
function getBaseURL() {
    return base_url;
}

// var touchstartX = 0;
// var touchstartY = 0;
// var touchendX = 0;
// var touchendY = 0;

// var gesturedZone = document.getElementById('profile-menu');

// gesturedZone.addEventListener('touchstart', function(event) {
//     touchstartX = event.screenX;
//     touchstartY = event.screenY;
// }, {passive: true});

// gesturedZone.addEventListener('touchend', function(event) {
//     touchendX = event.screenX;
//     touchendY = event.screenY;
//     handleGesure();
// },{passive: true}); 

// function handleGesure() {
//     var swiped = 'swiped: ';
//     if (touchendX < touchstartX) {
        
//     }
//     if (touchendX > touchstartX) {
        
//     }
//     if (touchendY < touchstartY) {
        
//         show_profile_menu()
//     }
//     if (touchendY > touchstartY) {
        
//     }
//     if (touchendY == touchstartY) {
        
//     }
// }

var menu = document.getElementById("profile-menu");
var profile_icon = document.getElementById("profile-icon");
profile_icon.addEventListener("click", yb_show_profile_menu);

//Expand Profile Menu
function yb_show_profile_menu() {
    let width = screen.width;
    if (width > 800){
        if (menu.style.visibility === 'hidden') {
            menu.style.visibility='visible';

            menu.style.transform= 'translate(0em)';
        } else {
            menu.style.visibility='hidden';

            menu.style.transform= 'translate(17em)';
            yb_getNotificationCounts();
        }
    }

    if (width < 800) {
        if (menu.style.visibility === 'hidden') {
            menu.style.visibility='visible';

            menu.style.transform= 'translate(0, -102vh)';
            $('#cb-divider').fadeIn();
            yb_getNotificationCounts();

        } else {
            menu.style.visibility='hidden';

            menu.style.transform= 'translate(0, 0vh)';
            $('#cb-divider').fadeOut();
        }
    }
    }

function changeSpace(data, callback) {

    yb_getFeed(data, callback, false);
}

$('.space-button').click(function() {
    let location = yb_getSessionValues("location");
    let type = $(this).attr('name');
    let filter = yb_getSessionValues("filter");
    let sort = yb_getSessionValues("sort");
    data = {
        "location":location,
        "type":type,
        "filter": filter,
        "sort":sort,

    }
    console.log(type)
    if (type === 'global'){
        $('#bit-container').remove();
        showSpaceSplash('#global-space-splash');
        $('.space-button-active').attr("class", "space-button");
        $(this).attr("class", "space-button-active");

        let filter_state = $("#button-filter-search").attr("data-state");

        if (filter_state === "expanded") {
            $("#input-filter-search").attr("placeholder","Search Global")
        }
        

        yb_setSessionValues("space", "global");
        
        history.pushState({}, "", `${base_url}/bitstream/`)
    }
    if (type === 'chat'){
        $('#bit-container').remove();
        showSpaceSplash('#chat-space-splash');
        $('.space-button-active').attr("class", "space-button");
        $(this).attr("class", "space-button-active");

        let filter_state = $("#button-filter-search").attr("data-state");
        
        if (filter_state === "expanded") {
            $("#input-filter-search").attr("placeholder","Search Chats")
        }
        
        yb_setSessionValues("space", "chat");

        history.pushState({}, "", `${base_url}/bitstream/chat/`)
    }
    if (type === 'video') {
        $('#bit-container').remove();
        showSpaceSplash('#video-space-splash');
        $('.space-button-active').attr("class", "space-button");
        $(this).attr("class", "space-button-active");
        
        let filter_state = $("#button-filter-search").attr("data-state");

        if (filter_state === "expanded") {
            $("#input-filter-search").attr("placeholder","Search Videos")
        }
        
        yb_setSessionValues("space", "video");

        history.pushState({}, "", `${base_url}/bitstream/video/`)

    }
    if (type === 'photo') {
        $('#bit-container').remove();
        showSpaceSplash('#photo-space-splash');
        
        $('.space-button-active').attr("class", "space-button");
        
        yb_setSessionValues("space", "photo");
        
        let filter_state = $("#button-filter-search").attr("data-state");

        if (filter_state === "expanded") {
            $("#input-filter-search").attr("placeholder","Search Photos")
        }

        $(this).attr("class", "space-button-active");
        history.pushState({}, "", `${base_url}/bitstream/photo/`);
        
    }
    changeSpace(data, hideSplash, false)
});



    //Expand Bit
function show_post_detail() {
    const post_display = document.getElementsByClassName("large-post-container");
    post_display.style.display="block";
    post_display.style.zindex="10";

}

    //Show Messages Dropdown (Legacy possible future recovery)
function show_messages() {
    const messages_panel = document.getElementById("messages-dropdown");
    if (messages_panel.style.visibility === 'hidden') {
        
        messages_panel.style.visibility='visible';
        messages_panel.style.display='block';

    } else {

        messages_panel.style.visibility='hidden';
        messages_panel.style.display='none';

    }
}

    //Show Description on Video Bits

function ShowDescription(bit_id) {
    var bit_id = bit_id;
    var description = document.getElementById(bit_id);
    if (description.style.display === 'none') {
        description.style.display='block';
    } else {
        description.style.display='none';
    }
    
}



// function ShowComments(bit_id, label_id) {
//     var bit_id = bit_id;
//     var label_id = label_id;
//     var comments = document.getElementById(bit_id);
//     var comment_display_lbl = document.getElementById(label_id);
//     if (comments.style.display === 'none') {
//         comments.style.display='flex';
//         comment_display_lbl.style.display='block';
//     } else {
//         comments.style.display='none';
//         comment_display_lbl.style.display='none';
//     }
// }



// function LikeBit(bit_id) {
//     var bit_id = bit_id;
//     var like_button = document.getElementById(bit_id)
//     $.ajax({
//         type:'POST',
//         url: "{% url 'like' ${bit_id} %}",
//         success: function(response){
//             if (response === 'success') {


//             }
//         }
//     })

// }


/*
            --Declare Global Variables--
*/




/*

Show Search Filters

*/

$(".search-bar").focus(function() {
    console.log('search-bar-clicked')
    document.getElementById('search-options').style.display = "grid";
});

$(".search-bar").blur('blur', function() {
    document.getElementById('search-options').style.display = "none";
});

/*
Show Visibility Settings
*/  

$('#visibility-icon').click(function() {
    showVisibility(getVisibilityOptions, visibilityClose, scrollOpen, updateVisibilitySwitches);
});

$('#visibility-icon-mobile').click(function() {
    showVisibility(getVisibilityOptions, visibilityClose, scrollOpen, updateVisibilitySwitches);
});

function showVisibility(getData, callbackClose, callbackOpen, pass) {
    

    if (width > 700) {
        let dropdown = document.getElementById("visibility-dropdown");
        if (dropdown.style.display === 'none') {

            dropdown.style.display='block';
            getData(callbackOpen, pass);

        } else {

            $('#visibility-dropdown').stop().animate({height: "0px"}, 150);
            callbackClose(dropdown);

        }
    } else {
        let dropdown = document.getElementById("visibility-dropdown-mobile");
        if (dropdown.style.display === 'none') {

            dropdown.style.display='block';
            getData(callbackOpen, pass);

        } else {

            $('#visibility-dropdown-mobile').stop().animate({height: "0px"}, 150);
            callbackClose(dropdown);

        }

    }
    
}

/*

Change Visibility Settings

*/

$('.checkbox').change(function() {
    let button_name = $(this).attr("name");
    let iframe = getIframe();
    let csrfToken = getCSRF();
    $.ajax(
        {
            type:'POST',
            headers: {
                'X-CSRFToken': csrfToken
            },
            url: "/social/visibility/",
            data: {
                button_name: button_name
            },
            success: function(data){
                let file = data;
                iframe = document.getElementById('feed-content-container');
                if(button_name === "bitColor"){
                    iframe.contentWindow.location.reload();
                }
                if(button_name === "wallpaper") {
                    if(file.toggle === 'off') {
                        $('.bg-image').replaceWith('<div class="bg-image" style="background-color: rgb(95, 95, 95)"></div>');
                    } else {
                        $('.bg-image').replaceWith(`<img class="bg-image" src="${file.wallpaper}">`);
                    }
                }if(button_name === "defaultThemeS") {
                    $('.bg-image').replaceWith('<div class="bg-image" style="background-color: rgb(95, 95, 95)"></div>');
                    iframe.contentWindow.location.reload();
                }
                
                updateVisibilitySwitches(file);
            }
        }
    )
});


function updateVisibilitySwitches(data) {
    let options = data;
    let user_colors_on = options.bit_colors_on;
    let wallpaper_on = options.wallpaper_on;
    let default_theme_on = options.default_theme_on;
    let post_color_check = document.getElementById('postColorCheck');
    let wallpaper_check = document.getElementById('wallpaperCheck');
    let default_theme_check = document.getElementById('defaultCheck')
    console.log(user_colors_on);
    console.log(wallpaper_on);
    console.log(default_theme_on);

    if (width > 700) {
        let post_color_check = document.getElementById('postColorCheck');
        let wallpaper_check = document.getElementById('wallpaperCheck');
        let default_theme_check = document.getElementById('defaultCheck')
        if (user_colors_on) {
            post_color_check.checked = true;
        } else {
            post_color_check.checked = false;
        }    
        
        if (wallpaper_on) {
            wallpaper_check.checked = true;
        } else {
            wallpaper_check.checked = false;
        }

        if (default_theme_on) {
            default_theme_check.checked = true;
        } else {
            default_theme_check.checked = false;
        }
    } else {
        let post_color_check = document.getElementById('postColorCheckMobile');
        let wallpaper_check = document.getElementById('wallpaperCheckMobile');
        let default_theme_check = document.getElementById('defaultCheckMobile')
        if (user_colors_on) {
            post_color_check.checked = true;
        } else {
            post_color_check.checked = false;
        }    
        
        if (wallpaper_on) {
            wallpaper_check.checked = true;
        } else {
            wallpaper_check.checked = false;
        }

        if (default_theme_on) {
            default_theme_check.checked = true;
        } else {
            default_theme_check.checked = false;
        }
    }
};


function getVisibilityOptions(scrollOpen, pass) {
    $.ajax(
        {
            type: "GET",
            url: "/social/visibility/",
        success: function(data) {
            let options_set = data;
            console.log(options_set)
            scrollOpen(options_set, pass);
        }
    });
};

function scrollOpen(data, pass) {
    showVisibilityOptions();
    pass(data);

};

function showVisibilityOptions() {
    let width = screen.width;
    if (width > 800) {  
        $('#visibility-dropdown').show();
        $('#visibility-dropdown').animate({height: "170px"}, 150);
      
    } else {
        $('#visibility-dropdown-mobile').show();
        $('#visibility-dropdown-mobile').animate({height: "200px"}, 150);
        

    }  
};

function visibilityClose(dropdown) {
    if (width > 800) {  
        dropdown.style.display='none';
    } else {
       $('#visibility-dropdown-mobile').animate({height: '0px'});
       $('#visibility-dropdown-mobile').hide();

    }  
};

function yb_openImage(source, index, this_id){
    let viewer = yb_createElement('div', 'photo-viewer', 'photo-viewer');
    viewer.setAttribute("style", "display: none");
    let viewing_image = yb_renderImage(source, "full-screen-image", "full-screen-image");
    viewer.appendChild(viewing_image);
    document.body.appendChild(viewer);

    $.ajax(
        {
            type: "GET",
            url: `/api/bits/${this_id}/`,
        

            success: function(data) {
                let bit = data;
                let id = bit.id;
                let user = bit.user;
                let like_count = bit.like_count;
                let dislike_count = bit.dislike_count;
                let comment_count = bit.comment_count;

                let photo = bit.photos[index];

                let full_viewing_image = yb_renderImage(photo.image, "full-screen-image", "full-screen-image");
                full_viewing_image.setAttribute("style", "visibility: hidden;");
                viewer.appendChild(full_viewing_image);

                full_viewing_image.onload = function() {
                    viewing_image.remove();
                    full_viewing_image.setAttribute("style", "visibility: visible;");
                    
                }

                let info_container = yb_createElement('div', 'photo-info-container', 'info-container-fs');
                info_container.setAttribute("style", "padding-left: 10px; color: white; text-shadow: 1px 1px 2px black; position: absolute; bottom: 60px;");
                
                let name_container = yb_createElement('b', 'photo-name-container', 'name-container-fs');
                name_container.innerHTML = user.first_name + " " + user.last_name;
                info_container.appendChild(name_container);

                let description = yb_createElement('p', 'photo-description-container', 'description-container-fs');
                description.setAttribute("style", "font-size: 14px;");
                description.innerHTML = bit.body;
                info_container.appendChild(description);
                
                viewer.appendChild(info_container);
                
                let interaction_container = yb_createElement('div', 'photo-interaction-container', 'interaction-container-fs');
                interaction_container.setAttribute("style", "position: absolute; display: grid; grid-template-columns: 50px auto 50px auto 50px auto 50px auto 50px;, width: 100%; bottom: 0px; left: 0px;");
                
                //Like Button
                let like_button = yb_createButton("like", `like-${id}`, "feedback-icon");
                like_button.setAttribute("data-catid", id)
                like_button.innerHTML = `<svg id="feedback-icon-source" xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path id="like-icon-${id}" style="fill:" d="M15.5 11Q16.15 11 16.575 10.575Q17 10.15 17 9.5Q17 8.85 16.575 8.425Q16.15 8 15.5 8Q14.85 8 14.425 8.425Q14 8.85 14 9.5Q14 10.15 14.425 10.575Q14.85 11 15.5 11ZM8.5 11Q9.15 11 9.575 10.575Q10 10.15 10 9.5Q10 8.85 9.575 8.425Q9.15 8 8.5 8Q7.85 8 7.425 8.425Q7 8.85 7 9.5Q7 10.15 7.425 10.575Q7.85 11 8.5 11ZM12 17.5Q13.775 17.5 15.137 16.525Q16.5 15.55 17.1 14H15.45Q14.925 14.9 14.025 15.45Q13.125 16 12 16Q10.875 16 9.975 15.45Q9.075 14.9 8.55 14H6.9Q7.5 15.55 8.863 16.525Q10.225 17.5 12 17.5ZM12 22Q9.925 22 8.1 21.212Q6.275 20.425 4.925 19.075Q3.575 17.725 2.788 15.9Q2 14.075 2 12Q2 9.925 2.788 8.1Q3.575 6.275 4.925 4.925Q6.275 3.575 8.1 2.787Q9.925 2 12 2Q14.075 2 15.9 2.787Q17.725 3.575 19.075 4.925Q20.425 6.275 21.212 8.1Q22 9.925 22 12Q22 14.075 21.212 15.9Q20.425 17.725 19.075 19.075Q17.725 20.425 15.9 21.212Q14.075 22 12 22ZM12 12Q12 12 12 12Q12 12 12 12Q12 12 12 12Q12 12 12 12Q12 12 12 12Q12 12 12 12Q12 12 12 12Q12 12 12 12ZM12 20Q15.325 20 17.663 17.663Q20 15.325 20 12Q20 8.675 17.663 6.337Q15.325 4 12 4Q8.675 4 6.338 6.337Q4 8.675 4 12Q4 15.325 6.338 17.663Q8.675 20 12 20Z"/></svg>`;
                interaction_container.appendChild(like_button);

                //Like Counter
                let like_counter = yb_createElement("p", `like-count-${id}`, "counter");
                like_counter.innerHTML = like_count;
                interaction_container.appendChild(like_counter);


                //Dislike Button
                let dislike_button = yb_createButton("dislike", `dislike-${id}`, "feedback-icon");
                dislike_button.setAttribute("data-catid", id)
                dislike_button.innerHTML = `<svg id="feedback-icon-source" xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path id="dislike-icon-${id}" style="fill:" d="M15.5 11Q16.15 11 16.575 10.575Q17 10.15 17 9.5Q17 8.85 16.575 8.425Q16.15 8 15.5 8Q14.85 8 14.425 8.425Q14 8.85 14 9.5Q14 10.15 14.425 10.575Q14.85 11 15.5 11ZM8.5 11Q9.15 11 9.575 10.575Q10 10.15 10 9.5Q10 8.85 9.575 8.425Q9.15 8 8.5 8Q7.85 8 7.425 8.425Q7 8.85 7 9.5Q7 10.15 7.425 10.575Q7.85 11 8.5 11ZM12 17.5Q13.775 17.5 15.137 16.525Q16.5 15.55 17.1 14H15.45Q14.925 14.9 14.025 15.45Q13.125 16 12 16Q10.875 16 9.975 15.45Q9.075 14.9 8.55 14H6.9Q7.5 15.55 8.863 16.525Q10.225 17.5 12 17.5ZM12 22Q9.925 22 8.1 21.212Q6.275 20.425 4.925 19.075Q3.575 17.725 2.788 15.9Q2 14.075 2 12Q2 9.925 2.788 8.1Q3.575 6.275 4.925 4.925Q6.275 3.575 8.1 2.787Q9.925 2 12 2Q14.075 2 15.9 2.787Q17.725 3.575 19.075 4.925Q20.425 6.275 21.212 8.1Q22 9.925 22 12Q22 14.075 21.212 15.9Q20.425 17.725 19.075 19.075Q17.725 20.425 15.9 21.212Q14.075 22 12 22ZM12 12Q12 12 12 12Q12 12 12 12Q12 12 12 12Q12 12 12 12Q12 12 12 12Q12 12 12 12Q12 12 12 12Q12 12 12 12ZM12 20Q15.325 20 17.663 17.663Q20 15.325 20 12Q20 8.675 17.663 6.337Q15.325 4 12 4Q8.675 4 6.338 6.337Q4 8.675 4 12Q4 15.325 6.338 17.663Q8.675 20 12 20Z"/></svg>`;
                interaction_container.appendChild(dislike_button);

                //Dislike Counter
                let dislike_counter = yb_createElement("p", `dislike-count-${id}`, "counter");
                dislike_counter.innerHTML = dislike_count;
                interaction_container.appendChild(dislike_counter);
                

                //Comment Button
                let comment_button = yb_createButton("show-comment", `show-comment-${id}`, "feedback-icon");
                comment_button.setAttribute("data-catid", id)
                comment_button.setAttribute("data-state", "show")
                comment_button.innerHTML = `<svg id="feedback-icon-source" xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path id="comment-icon-${id}" d="M6 14H18V12H6ZM6 11H18V9H6ZM6 8H18V6H6ZM22 22 18 18H4Q3.175 18 2.588 17.413Q2 16.825 2 16V4Q2 3.175 2.588 2.587Q3.175 2 4 2H20Q20.825 2 21.413 2.587Q22 3.175 22 4ZM4 4V16Q4 16 4 16Q4 16 4 16H18.825L20 17.175V4Q20 4 20 4Q20 4 20 4H4Q4 4 4 4Q4 4 4 4ZM4 4V17.175V16Q4 16 4 16Q4 16 4 16V4Q4 4 4 4Q4 4 4 4Q4 4 4 4Q4 4 4 4Z"/></svg>`
                interaction_container.appendChild(comment_button);

                //Comment Counter
                let comment_counter = yb_createElement("p", `comment-count-${id}`, "counter");
                comment_counter.innerHTML = comment_count;
                interaction_container.appendChild(comment_counter);


                //Shares
                let share_button = yb_createButton("share", `share-${id}`, "feedback-icon");
                share_button.innerHTML = `<svg id="feedback-icon-source" xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="M6 23Q5.175 23 4.588 22.413Q4 21.825 4 21V10Q4 9.175 4.588 8.587Q5.175 8 6 8H9V10H6Q6 10 6 10Q6 10 6 10V21Q6 21 6 21Q6 21 6 21H18Q18 21 18 21Q18 21 18 21V10Q18 10 18 10Q18 10 18 10H15V8H18Q18.825 8 19.413 8.587Q20 9.175 20 10V21Q20 21.825 19.413 22.413Q18.825 23 18 23ZM11 16V4.825L9.4 6.425L8 5L12 1L16 5L14.6 6.425L13 4.825V16Z"/></svg>`
                interaction_container.appendChild(share_button);

                //Share Counter
                let share_counter = yb_createElement("p", `share-count-${id}`, "counter");
                share_counter.innerHTML = "0";
                interaction_container.appendChild(share_counter);


                //Dontation
                let donate_button = yb_createButton("donate", `donate-bit-${id}`, "feedback-icon");
                donate_button.innerHTML = `<svg id="feedback-icon-source" xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="M11.025 21V18.85Q9.7 18.55 8.738 17.7Q7.775 16.85 7.325 15.3L9.175 14.55Q9.55 15.75 10.288 16.375Q11.025 17 12.225 17Q13.25 17 13.963 16.538Q14.675 16.075 14.675 15.1Q14.675 14.225 14.125 13.712Q13.575 13.2 11.575 12.55Q9.425 11.875 8.625 10.938Q7.825 10 7.825 8.65Q7.825 7.025 8.875 6.125Q9.925 5.225 11.025 5.1V3H13.025V5.1Q14.275 5.3 15.088 6.012Q15.9 6.725 16.275 7.75L14.425 8.55Q14.125 7.75 13.575 7.35Q13.025 6.95 12.075 6.95Q10.975 6.95 10.4 7.438Q9.825 7.925 9.825 8.65Q9.825 9.475 10.575 9.95Q11.325 10.425 13.175 10.95Q14.9 11.45 15.788 12.537Q16.675 13.625 16.675 15.05Q16.675 16.825 15.625 17.75Q14.575 18.675 13.025 18.9V21Z"/></svg>`
                interaction_container.appendChild(donate_button);

                viewer.appendChild(interaction_container);
                $('.photo-viewer').fadeIn(200);
                $('.photo-viewer').animate({"top": "0px"}, 200);
            
                // Retrieve the #photo-viewer element
                var photoViewer = document.getElementById("photo-viewer");

                // Attach an event listener for touchstart event
                photoViewer.addEventListener("touchstart", function(event) {
                    var initialY = event.touches[0].clientY;

                    // Add an event listener for touchend event
                    photoViewer.addEventListener("touchend", function(event) {
                        yb_swipeDown("photo-viewer", event, initialY);
                    });

                    
                });
                    
            }
        } 
    );

    
}

function yb_swipeDown(option, event, initialY) {
    if (option == "photo-viewer") {
        var finalY = event.changedTouches[0].clientY;
        var deltaY = finalY - initialY;

        // Check if the user has swiped down
        if (deltaY > 0) {
            // Perform actions to exit fullscreen
            // Add your code here to handle fullscreen exit
            console.log("Swiped down to exit fullscreen!");
            $('.photo-viewer').animate({"top": "100vh"}, 200);
            $('.photo-viewer').fadeOut(200);
        }
    }
}

// const menuContainer = document.querySelector('.menu-container');
// const menu = document.querySelector('.menu');

// let isDragging = false;
// let startY = 0;
// let currentY = 0;
// let startTranslateY = 0;
// let currentTranslateY = 0;

// const MENU_SNAP_POINTS = [0, -102]; // set your own snapping points
// const EXPANDED_POSITION = MENU_SNAP_POINTS[0];
// const HIDDEN_POSITION = SNAP_POINTS[SNAP_POINTS.length - 1];

// function handleDragStart(e) {
//   isDragging = true;
//   startY = e.touches ? e.touches[0].clientY : e.clientY;
//   startTranslateY = currentTranslateY;
// }

// function handleDragMove(e) {
//   if (!isDragging) return;

//   currentY = e.touches ? e.touches[0].clientY : e.clientY;
//   currentTranslateY = startTranslateY + (currentY - startY);

//   // clamp currentTranslateY to snap points range
//   currentTranslateY = Math.max(Math.min(currentTranslateY, EXPANDED_POSITION), HIDDEN_POSITION);

//   menuContainer.style.transform = `translateY(${currentTranslateY}px)`;
// }

// function handleDragEnd(e) {
//   isDragging = false;

//   // snap to nearest snap point
//   const closestSnapPoint = SNAP_POINTS.reduce((prev, curr) => {
//     return Math.abs(curr - currentTranslateY) < Math.abs(prev - currentTranslateY) ? curr : prev;
//   });
//   currentTranslateY = closestSnapPoint;

//   menuContainer.style.transform = `translateY(${currentTranslateY}px)`;
// }

// function handleSwipeUp() {
//   currentTranslateY = EXPANDED_POSITION;
//   menuContainer.style.transform = `translateY(${currentTranslateY}px)`;
// }

// function handleSwipeDown() {
//   currentTranslateY = HIDDEN_POSITION;
//   menuContainer.style.transform = `translateY(${currentTranslateY}px)`;
// }

// // add event listeners
// menuContainer.addEventListener('touchstart', handleDragStart);
// menuContainer.addEventListener('touchmove', handleDragMove);
// menuContainer.addEventListener('touchend', handleDragEnd);
// menuContainer.addEventListener('mousedown', handleDragStart);
// menuContainer.addEventListener('mousemove', handleDragMove);
// menuContainer.addEventListener('mouseup', handleDragEnd);
// menuContainer.addEventListener('mouseleave', handleDragEnd);
// menuContainer.addEventListener('animationend', () => {
//   menuContainer.classList.remove('animate');
// });

function yb_showUniversalInput() {
    let search = document.getElementById('container-input-universal-bottom');
    console.log("function ran");
    $('#container-input-universal-bottom').css({"display": "grid"});
    search.style.transform = 'translate(0, -100vh)';
}

function yb_dropUniversalInput(hide) {
    let input = document.getElementById('container-input-universal-bottom');
    input.style.transform = 'translate(0, 100vh)';
    setTimeout(hide, 200);
}

function yb_hideUniversalInput() {
    $('#container-input-universal-bottom').hide();
}