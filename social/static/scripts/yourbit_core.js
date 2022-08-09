var base_url = window.location.origin;
var width = screen.width;
var notifications_last = 0;
var first_load = true;
var iframe = document.getElementById('feed-content-container');

var postList = document.getElementById("content-container-feed");
$(document).ready(function() {
    console.log(notifications_last);
    updateNotificationStatus();
});

$('#logo-image').click(function(){
    window.location.href = `${base_url}`;
})

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

function show_post_detail() {
    const post_display = document.getElementsByClassName("large-post-container");
    post_display.style.display="block";
    post_display.style.zindex="10";

}

$('#notifications-quick').click(function() {
    show_notifications(growDropdown);
});

function show_notifications(callback) {
    const notification_panel = document.getElementById("notifications-dropdown");
    if (notification_panel.style.visibility === 'hidden') {
        
        notification_panel.style.visibility='visible';
        notification_panel.style.display='block';
        callback(notification_panel);
    } else {

        notification_panel.style.visibility='hidden';
        notification_panel.style.display='none';

    }
}

function growDropdown(item) {
    item.style.width = "250px"

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

/*Mobile Bit form Functions*/


/*
    ------- Function Change Mobile Bit form ----------
*/

function changeBitForm(button_name) {

    /* Set form equal to mobile-bit-inputs container */
    let form = document.getElementById('mobile-bit-inputs');

    
    if (button_name === 'chat') {
        form.innerHTML = `                            
            <input type="text" class="single-line-input" id="mobile-title" placeholder="Title (Optional)" style="color:white; font-size: 16px; font-weight: 600;">
            <textarea id="mobile-body" placeholder="Body" style="color:white; font-size: 14px;">
        `
        $('#text-type-button').replaceWith(`<a id = "text-type-button" class = "type-button-active" name = "chat"><svg class="space-button-image" xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="M.95 17.8V1.85q0-.5.325-.825Q1.6.7 2.1.7h14.25q.5 0 .825.325.325.325.325.825V12q0 .5-.325.825-.325.325-.825.325H5.6Zm5.8.9q-.5 0-.825-.325-.325-.325-.325-.825v-2.4h13.9V5.4h2.4q.5 0 .825.325.325.325.325.825v16.8L18.4 18.7Zm8.1-15.35H3.6v8.05l.9-.9h10.35Zm-11.25 0v8.05Z"/></svg></a>`);
        $('#photo-type-button').replaceWith(`<a id = "photo-type-button" class = "type-button" onclick="changeBitForm('photo')" name = "photo"><svg class="space-button-image" xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="M12 17.75q1.925 0 3.263-1.337Q16.6 15.075 16.6 13.15q0-1.925-1.337-3.263Q13.925 8.55 12 8.55q-1.925 0-3.262 1.337Q7.4 11.225 7.4 13.15q0 1.925 1.338 3.263Q10.075 17.75 12 17.75Zm0-2.65q-.8 0-1.375-.575t-.575-1.375q0-.8.575-1.375T12 11.2q.8 0 1.375.575t.575 1.375q0 .8-.575 1.375T12 15.1Zm-8.15 6.725q-1.1 0-1.875-.775-.775-.775-.775-1.875V7.125q0-1.1.775-1.875.775-.775 1.875-.775h3.025l2.05-2.25h6.15l2.05 2.25h3.025q1.1 0 1.875.775.775.775.775 1.875v12.05q0 1.1-.775 1.875-.775.775-1.875.775Zm16.3-2.65V7.125h-4.2l-2.05-2.25h-3.8l-2.05 2.25h-4.2v12.05ZM12 13.15Z"/></svg></a>`);
        $('#video-type-button').replaceWith(`<a id = "video-type-button" class = "type-button" onclick="changeBitForm('video')" name = "video"><svg class="space-button-image" xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="m9.15 17.15 8-5.15-8-5.15ZM12 22.8q-2.25 0-4.213-.85-1.962-.85-3.424-2.312Q2.9 18.175 2.05 16.212 1.2 14.25 1.2 12t.85-4.225Q2.9 5.8 4.363 4.338q1.462-1.463 3.424-2.301Q9.75 1.2 12 1.2t4.225.837q1.975.838 3.438 2.301 1.462 1.462 2.299 3.437Q22.8 9.75 22.8 12q0 2.25-.838 4.212-.837 1.963-2.299 3.426Q18.2 21.1 16.225 21.95q-1.975.85-4.225.85Zm0-2.65q3.425 0 5.788-2.363Q20.15 15.425 20.15 12t-2.362-5.788Q15.425 3.85 12 3.85q-3.425 0-5.787 2.362Q3.85 8.575 3.85 12q0 3.425 2.363 5.787Q8.575 20.15 12 20.15ZM12 12Z"/></svg></a>`);
    }
    
    if (button_name === 'video') {
        form.innerHTML = `
            <input type="text" class="single-line-input" id="mobile-title" placeholder="Title (Optional)" style="color:white; font-size: 16px; font-weight: 600;">
            <textarea id="mobile-body" placeholder="Info" style="color:white; font-size: 14px;"></textarea>
            <input type="file" id="mobile-file-field" accept=".mp4, .mov, .avi, .3GP, .FLV, .MKV"/>
        `
        $('#text-type-button').replaceWith(`<a id = "text-type-button" onclick="changeBitForm('chat')" class = "type-button" name = "chat"><svg class="space-button-image" xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="M.95 17.8V1.85q0-.5.325-.825Q1.6.7 2.1.7h14.25q.5 0 .825.325.325.325.325.825V12q0 .5-.325.825-.325.325-.825.325H5.6Zm5.8.9q-.5 0-.825-.325-.325-.325-.325-.825v-2.4h13.9V5.4h2.4q.5 0 .825.325.325.325.325.825v16.8L18.4 18.7Zm8.1-15.35H3.6v8.05l.9-.9h10.35Zm-11.25 0v8.05Z"/></svg></a>`);
        $('#photo-type-button').replaceWith(`<a id = "photo-type-button" onclick="changeBitForm('photo')" class = "type-button" name = "photo"><svg class="space-button-image" xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="M12 17.75q1.925 0 3.263-1.337Q16.6 15.075 16.6 13.15q0-1.925-1.337-3.263Q13.925 8.55 12 8.55q-1.925 0-3.262 1.337Q7.4 11.225 7.4 13.15q0 1.925 1.338 3.263Q10.075 17.75 12 17.75Zm0-2.65q-.8 0-1.375-.575t-.575-1.375q0-.8.575-1.375T12 11.2q.8 0 1.375.575t.575 1.375q0 .8-.575 1.375T12 15.1Zm-8.15 6.725q-1.1 0-1.875-.775-.775-.775-.775-1.875V7.125q0-1.1.775-1.875.775-.775 1.875-.775h3.025l2.05-2.25h6.15l2.05 2.25h3.025q1.1 0 1.875.775.775.775.775 1.875v12.05q0 1.1-.775 1.875-.775.775-1.875.775Zm16.3-2.65V7.125h-4.2l-2.05-2.25h-3.8l-2.05 2.25h-4.2v12.05ZM12 13.15Z"/></svg></a>`);
        $('#video-type-button').replaceWith(`<a id = "video-type-button" class = "type-button-active" name = "video"><svg class="space-button-image" xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="m9.15 17.15 8-5.15-8-5.15ZM12 22.8q-2.25 0-4.213-.85-1.962-.85-3.424-2.312Q2.9 18.175 2.05 16.212 1.2 14.25 1.2 12t.85-4.225Q2.9 5.8 4.363 4.338q1.462-1.463 3.424-2.301Q9.75 1.2 12 1.2t4.225.837q1.975.838 3.438 2.301 1.462 1.462 2.299 3.437Q22.8 9.75 22.8 12q0 2.25-.838 4.212-.837 1.963-2.299 3.426Q18.2 21.1 16.225 21.95q-1.975.85-4.225.85Zm0-2.65q3.425 0 5.788-2.363Q20.15 15.425 20.15 12t-2.362-5.788Q15.425 3.85 12 3.85q-3.425 0-5.787 2.362Q3.85 8.575 3.85 12q0 3.425 2.363 5.787Q8.575 20.15 12 20.15ZM12 12Z"/></svg></a>`);
    }

    if (button_name === 'photo') {
        form.innerHTML = `
            <input type="text" class="single-line-input" id="mobile-title" placeholder="Title (Optional)" style="color:white; font-size: 16px; font-weight: 600;">
            <textarea id="mobile-body" placeholder="Info" style="color:white; font-size: 14px;"></textarea>
            <input type="file" id="mobile-file-field" accept=".jpg, .jpeg, .png"/>
        `
        $('#text-type-button').replaceWith(`<a id = "text-type-button" onclick="changeBitForm('chat')" class = "type-button" name = "chat"><svg class="space-button-image" xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="M.95 17.8V1.85q0-.5.325-.825Q1.6.7 2.1.7h14.25q.5 0 .825.325.325.325.325.825V12q0 .5-.325.825-.325.325-.825.325H5.6Zm5.8.9q-.5 0-.825-.325-.325-.325-.325-.825v-2.4h13.9V5.4h2.4q.5 0 .825.325.325.325.325.825v16.8L18.4 18.7Zm8.1-15.35H3.6v8.05l.9-.9h10.35Zm-11.25 0v8.05Z"/></svg></a>`);
        $('#photo-type-button').replaceWith(`<a id = "photo-type-button" class = "type-button-active" name = "photo"><svg class="space-button-image" xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="M12 17.75q1.925 0 3.263-1.337Q16.6 15.075 16.6 13.15q0-1.925-1.337-3.263Q13.925 8.55 12 8.55q-1.925 0-3.262 1.337Q7.4 11.225 7.4 13.15q0 1.925 1.338 3.263Q10.075 17.75 12 17.75Zm0-2.65q-.8 0-1.375-.575t-.575-1.375q0-.8.575-1.375T12 11.2q.8 0 1.375.575t.575 1.375q0 .8-.575 1.375T12 15.1Zm-8.15 6.725q-1.1 0-1.875-.775-.775-.775-.775-1.875V7.125q0-1.1.775-1.875.775-.775 1.875-.775h3.025l2.05-2.25h6.15l2.05 2.25h3.025q1.1 0 1.875.775.775.775.775 1.875v12.05q0 1.1-.775 1.875-.775.775-1.875.775Zm16.3-2.65V7.125h-4.2l-2.05-2.25h-3.8l-2.05 2.25h-4.2v12.05ZM12 13.15Z"/></svg></a>`);
        $('#video-type-button').replaceWith(`<a id = "video-type-button" onclick="changeBitForm('video')" class = "type-button" name = "video"><svg class="space-button-image" xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="m9.15 17.15 8-5.15-8-5.15ZM12 22.8q-2.25 0-4.213-.85-1.962-.85-3.424-2.312Q2.9 18.175 2.05 16.212 1.2 14.25 1.2 12t.85-4.225Q2.9 5.8 4.363 4.338q1.462-1.463 3.424-2.301Q9.75 1.2 12 1.2t4.225.837q1.975.838 3.438 2.301 1.462 1.462 2.299 3.437Q22.8 9.75 22.8 12q0 2.25-.838 4.212-.837 1.963-2.299 3.426Q18.2 21.1 16.225 21.95q-1.975.85-4.225.85Zm0-2.65q3.425 0 5.788-2.363Q20.15 15.425 20.15 12t-2.362-5.788Q15.425 3.85 12 3.85q-3.425 0-5.787 2.362Q3.85 8.575 3.85 12q0 3.425 2.363 5.787Q8.575 20.15 12 20.15ZM12 12Z"/></svg></a>`);
    
    }
}