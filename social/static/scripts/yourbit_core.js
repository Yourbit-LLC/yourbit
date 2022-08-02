base_url = window.location.origin;
var width = screen.width;
var notifications_last = 0;
var first_load = true;
var iframe = document.getElementById('feed-content-container');
$(document).ready(function() {
    console.log(notifications_last);
    post_fly_in();
    updateNotificationStatus();
});

var menu = document.getElementById("profile-menu");
function show_profile_menu() {
    let width = screen.width;
    if (width > 800){
        if (menu.style.visibility === 'hidden') {
            menu.style.visibility='visible';

            menu.style.transform= 'translate(0em)';
        } else {
            menu.style.visibility='hidden';

            menu.style.transform= 'translate(17em)';
        }
    }

    if (width < 800) {
        if (menu.style.visibility === 'hidden') {
            menu.style.visibility='visible';

            menu.style.transform= 'translate(0, -90vh)';
        } else {
            menu.style.visibility='hidden';

            menu.style.transform= 'translate(0, 0vh)';
        }
    }
    }

const createPost = document.getElementById("create-post");
const writePost = document.getElementById("write-post");
function show_create_post() {
    $("#create-post").fadeIn('slow');
}

function hide_create_post() {
    $("#create-post").fadeOut('slow');
}
var postList = document.getElementById("content-container");
function post_fly_in() {
    postList.style.transform = 'translate(0, -100vh)';

}

function show_post_detail() {
    const post_display = document.getElementsByClassName("large-post-container");
    post_display.style.display="block";
    post_display.style.zindex="10";

}

function show_notifications() {
    const notification_panel = document.getElementById("notifications-dropdown");
    if (notification_panel.style.visibility === 'hidden') {
        
        notification_panel.style.visibility='visible';
        notification_panel.style.display='block';
    } else {

        notification_panel.style.visibility='hidden';
        notification_panel.style.display='none';

    }
}

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

function ShowDescription(bit_id) {
    var bit_id = bit_id;
    var description = document.getElementById(bit_id);
    if (description.style.display === 'none') {
        description.style.display='block';
    } else {
        description.style.display='none';
    }
    
}

function ShowComments(bit_id, label_id) {
    var bit_id = bit_id;
    var label_id = label_id;
    var comments = document.getElementById(bit_id);
    var comment_display_lbl = document.getElementById(label_id);
    if (comments.style.display === 'none') {
        comments.style.display='flex';
        comment_display_lbl.style.display='block';
    } else {
        comments.style.display='none';
        comment_display_lbl.style.display='none';
    }
}

function VideoForm() {
    var chat_form = document.getElementById('write-post');
    var video_form = document.getElementById('upload-video');
    var photo_form = document.getElementById('upload-photo');
    if (chat_form.style.display === 'grid') {
        chat_form.style.display = 'none';
    } if (photo_form.style.display === 'grid'){
        photo_form.style.display = 'none';
    }

    video_form.style.display = 'grid';
}

function PhotoForm() {
    var chat_form = document.getElementById('write-post');
    var video_form = document.getElementById('upload-video');
    var photo_form = document.getElementById('upload-photo');
    if (chat_form.style.display === 'grid') {
        chat_form.style.display = 'none';
    } if (video_form.style.display === 'grid'){
        video_form.style.display = 'none';
    }

    photo_form.style.display = 'grid';

}

function ChatForm() {
    var chat_form = document.getElementById('write-post');
    var video_form = document.getElementById('upload-video');
    var photo_form = document.getElementById('upload-photo');
    if (video_form.style.display === 'grid') {
        video_form.style.display = 'none';
    } if (photo_form.style.display === 'grid'){
        photo_form.style.display = 'none';
    }

    chat_form.style.display = 'grid';

}

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
--On document load get notifications, load bits, get messages, update rewards points--
*/


/*
--Function for updating notifications--
*/
function updateNotificationStatus(){
    
    notificationIconUpdate();
    setTimeout(updateNotificationStatus, 5000);
    
};



/*
--Function for updating the notification icon-- 
*/

function notificationIconUpdate() {
    $.ajax(
        {
            type: 'GET',
            url: '/social/notifications/status/',

            success: function(data) {
                let status_response= data;
                let current_notifications = status_response.notification_len;
                
                console.log(status_response);

                if (status_response.status === true) {
                    $('#notification-status').show();
                    if (first_load === true) {
                        first_load = false;
                    } else {
                        if (current_notifications > notifications_last) {
                            document.getElementById("notification-sound").play();
                            notifications_last = status_response.notification_len;
                        }
                }
                    
                } else {
                    $('#notification-status').hide();
                }
            }

        }
        
    )
};
/*
    --Function For displaying notifications--
*/

function getNotifications() {
    $.ajax(
        {
            type: 'GET',
            url: '/social/notifications/',

            success: function(data) {
                let response = data;
                let notifications = response.notifications
                for (let i = 0; i < notifications.length; i++) {
                    $('#notifications-dropdown').append(
                        `
                        <div class="interaction-notification" id="friend-request">
                            <img class="notification-profile-image"src="">
                            <p class="interaction-notification-text"></p>
                            <div class="notification-response-button-container">
                                <button type="button" name="accept_friend" class="friend-request-response-button">Accept</button>
                                <button type="button" name="decline_friend" class="friend-request-response-button">Decline</button>
                            <div>
                        </div>
                        
                        `
                    )
                }
            }

        }
    )
};

/*
--Create Bit Functions--
*/

$('#mobile-create-icon').click(function() {
    showCreateBit(raiseCreateBit);
});

$('#bit-panel-close').click(function() {
    dropCreateBit(hideCreateBit)
});

function showCreateBit(callback) {
    let create_bit = document.getElementById('create-bit-mobile');
    create_bit.style.visibility='visible';
    callback(titleFocus);
}

function titleFocus() {
    let create_bit = document.getElementById('create-bit-mobile');
    $('#mobile-title').focus();
}

function raiseCreateBit(callback){
    let create_bit = document.getElementById('create-bit-mobile');
    create_bit.style.transform = 'translate(0, -80vh)';
    setTimeout(callback, 500);
}

function dropCreateBit(followUp) {
    let create_bit = document.getElementById('create-bit-mobile');
    create_bit.style.transform = 'translate(0, 0vh)';
    followUp();
}

function hideCreateBit() {
    let create_bit = document.getElementById('create-bit-mobile');
    create_bit.style.visibility='hidden';
}

$('#mobile-publish-bit').click(function() {
    submitBit()
});

function submitBit() {
    let title_field = document.getElementById("mobile-title");
    let body_field = document.getElementById("mobile-body");
    let title = title_field.value;
    let body = body_field.value;
    let cookie = document.cookie;
    let csrfToken = cookie.substring(cookie.indexOf('=') + 1);
    console.log(title)
    $.ajax(
        {
            type: 'POST',
            headers: {
                'X-CSRFToken': csrfToken
            },
            url: '/social/publish/',
            data: {
                title: title,
                body: body
            },
            success: function(){
                iframe.contentWindow.location.reload();
                dropCreateBit(hideCreateBit);

            }
        }
    )
}

$('.type-button').click(function() {
    let button_name = $(this).attr('name');
    changeType(button_name);
});

function changeType(button_name) {
    if (button_name === 'chat'){
        $('bit-type-hidden-field').val('chat');
        

    }

    if (button_name === 'video'){
        $('bit-type-hidden-field').val('video');
    }

    if (button_name === 'photo'){
        $('bit-type-hidden-field').val('photo');
    }

};

/*
--Mobile Search Functions--
*/

$('#mobile-search-icon').click(function() {
    showSearch();
});

function showSearch() {
    let search = document.getElementById('search-mobile');
    $('#search-mobile').show();
    search.style.transform = 'translate(0, -100vh)';
    $('#mobile-searchbar').focus();
}

function searchFocus() {
    let search = document.getElementById('search-mobile');
    
}

function dropSearch() {
    let search = document.getElementById('search-mobile');
    search.style.transform = 'translate(0, 0vh)';
}

/*

Show Search Filters

*/

$(".search-bar").focus(function() {
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

    let cookie = document.cookie;
    let csrfToken = cookie.substring(cookie.indexOf('=') + 1);
    
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

$('#profile-follow-button').click(function() {
    let cookie = document.cookie;
    let csrfToken = cookie.substring(cookie.indexOf('=') + 1);
    let profile = $(this).attr("data-catid");
    console.log(profile)
    $.ajax(
        {
        type: "POST",
        headers: {
            'X-CSRFToken': csrfToken
        },
        url: '/social/follow/',
        data: {
            profile: profile
        },
        success: function(data) {
            let response = data;
            var name = response.name;
            $('#non-interactive-notification-modal').append(`<h3>You are now following ${name}</h3>`);
            showNotification(expandNotification);
        }
    }

    )
});

function showNotification(callback) {
    $('#non-interactive-notification-modal').show();
    $('#non-interactive-notification-modal').animate({'top': '70px', 'opacity':'1'}, 'fast');
    setTimeout(callback, 1000);
};

function expandNotification() {
    $('#non-interactive-notification-modal').animate({'width':'400px'}, 'fast');
    setTimeout(contractNotification, 5000)
};

function contractNotification() {
    
    $('#non-interactive-notification-modal').animate({'width':'50px', 'opacity':'0'}, 'fast');
    setTimeout(hideNotification, 1000);
};

function hideNotification() {
    $('#non-interactive-notification-modal').hide();
};