/*

        Yourbit Notification Manager Script
        This script handles updating, receiving, and responding to notifications on yourbit

*/

/* ----Declare Global Variables --- */
var notifications_last = 0;
var first_load = true;
var width = screen.width;
var base_url = window.location.origin;

/*
--On document load get notifications, load bits, get messages, update rewards points--
*/
$(document).ready(function() {
    console.log(notifications_last);
    updateNotificationStatus();
    getNotifications();
});


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

                if (status_response.status === false) {
                    $('#notification-status').show();
                    if (first_load === true) {
                        first_load = false;
                    } else {
                        if (current_notifications > notifications_last) {
                            /*document.getElementById("notification-sound").play();*/
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
    let cookie = document.cookie;
    let csrfToken = cookie.substring(cookie.indexOf('=') + 1);
    $.ajax(
        {
            type: 'POST',
            headers: {
                'X-CSRFToken': csrfToken
            },
            url: '/social/notifications/',

            success: function(data) {
                let notifications = Object.keys(data);
                let notification_length = Object.keys(notifications).length
                console.log(notification_length)
                let notification = '';
                let x = 0;
                if (width > 700){
                    for (let i = 0; i < notification_length; i++) {
                        notification = notifications[x];
                        let notification_info = data[notification];
                        console.log(notification_info);
                        let user_name = notification_info['from_name'];
                        $('#notifications-dropdown').empty();

                        $('#notifications-dropdown').append(
                            `
                            <div class="interaction-notification" id="friend-request">
                                <img class="notification-profile-image" src="">
                                <p class="interaction-notification-text">${user_name} wants to be your friend!</p>
                                <div class="notification-response-button-container">
                                    <button type="button" name="accept_friend" class="friend-request-response-button">Accept</button>
                                    <button type="button" name="decline_friend" class="friend-request-response-button">Decline</button>
                                <div>
                            </div>
                            
                            `
                        );
                    }
                    
                } else {
                    $('#menu-notification-container').empty();
                    for (let i = 0; i < notification_length; i++) {
                        notification = notifications[x];
                        let notification_info = data[notification];
                        let username = notification_info['username'];
                        let user_name = notification_info['from_name'];
                        let profile_id = notification_info['profile_id'];
                        let notif_id = notification_info['id'];
                        let send_list = [username, user_name, profile_id, notif_id];
                        console.log(username)
                        $('#menu-notification-container').append(`
                            <div class='mobile-notification' id='mobile-friend-request' style="color:white;">
                                <p class="mobile-interaction-notification-text">${user_name} wants to be your friend!</p>
                                <span data-username="${username}" data-name="${user_name}" data-catid="${profile_id}" onclick="viewNotification('${send_list}')" class="mobile-notification-link" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; display:block; z-index:2;"></span>
                            </div>
                        `)
                    }
                }
            }

        }
    )
};

function viewNotification(receive_list) {
    receive_list = receive_list.split(',');
    let username = receive_list[0];
    let user_name = receive_list[1];
    let profile_id = receive_list[2];
    let notif_id = receive_list[3];
    displayBubbleSmall(growBubbleSmall, user_name, username, profile_id, notif_id);
}

function displayBubbleSmall(callback, user_name, username, profile_id, notif_id) {
    $('#small-bubble').show();
    callback(user_name, username, profile_id, notif_id);
}

function growBubbleSmall(user_name, username, profile_id, notif_id) {
    $('#info-divider').show();
    $('#small-bubble').animate({height: "140px", width: "300px"}, "fast");
    $('#notification-bubble-text').html(`
        <p style="color:white;">Add ${user_name} to friends?</p>
        <button class="friend-request-response-button" onclick="acceptFriend('${notif_id}')" name="accept_friend" style="color: green">Accept</button>
        <button class="friend-request-response-button" onclick="denyFriend('${notif_id}')" name="deny_request" style = "color:red">Decline</button>
        <br>
        <a href="${base_url}/social/profile/${username}" style="display: block; margin-left: auto; margin-right: auto; width: 150px; margin-top: 3px; text-decoration: none; color: blue; background-color: white; padding: 4px; border-radius: 10px;">Show Profile</a>
    `);
}

function acceptFriend(notif_id) {
    let cookie = document.cookie;
    let csrfToken = cookie.substring(cookie.indexOf('=') + 1);
    let friend_request = new FormData()
    let action = 'accept_friend'
    let id = notif_id
    friend_request.append('id', id)
    friend_request.append('action', action)
    $.ajax (
        {
            type: 'POST',
            contentType: false,
            // The following is necessary so jQuery won't try to convert the object into a string
            processData: false,
            headers: {
                'X-CSRFToken': csrfToken
            },
            url: '/social/add_friend/',
            data: friend_request,

            success: function(data) {
                let response = data;
                let to_user = data.name;
                if (width < 700) {
                    $('#small-bubble').hide();
                    $('#info-divider').hide();
                }
                // Notify();
                let body = `Added ${to_user} as friends`;
                showNotification(expandNotification, body);
            }
        }
    )
}

function denyFriend(profile_id) {
    let cookie = document.cookie;
    let csrfToken = cookie.substring(cookie.indexOf('=') + 1);
    let friend_request = new FormData()
    let action = 'deny_request'
    let user_id = profile_id
    friend_request.append('user_id', user_id)
    friend_request.append('action', action)
    $.ajax (
        {
            type: 'POST',
            contentType: false,
            // The following is necessary so jQuery won't try to convert the object into a string
            processData: false,
            headers: {
                'X-CSRFToken': csrfToken
            },
            url: '/social/add_friend/',
            data: friend_request,

            success: function(data) {
                let response = data;
                let to_user = data.name;

                let body = `Denied ${to_user} as friends`;
                showNotification(expandNotification, body);

                if (width < 700) {
                    $('#small-bubble').hide();
                    $('#info-divider').hide();
                }
            }
        }
    )
}

function showNotification(callback1, body) {
    $('#non-interactive-notification-modal').show();
    $('#non-interactive-notification-modal').animate({'top': '70px', 'opacity':'1'}, 'fast');
    showText(body);
    setTimeout(callback1, 1000);
};

function expandNotification() {
    $('#non-interactive-notification-modal').animate({'width':'400px'}, 'fast');
    $('non-interactive-notification-modal').html(`
    
    `);
    setTimeout(contractNotification, 5000);
    
};

function showText(body) {
    $('#non-interactive-notification-modal').html(`
        <p>${body}</p>
    `);
}

function contractNotification() {
    
    $('#non-interactive-notification-modal').animate({'width':'50px', 'opacity':'0'}, 'fast');
    setTimeout(hideNotification, 1000);
};

function hideNotification() {
    $('#non-interactive-notification-modal').hide();
};

function Notify(type, from_user, to_user) {
    let notification = new FormData();
    notification.append('type', type);
    notification.append('from_user', from_user);
    notification.append('to_user', to_user);
    let cookie = document.cookie;
    let csrfToken = cookie.substring(cookie.indexOf('=') + 1);

    $.ajax(
        {
            type: 'POST',
            contentType: false,
            // The following is necessary so jQuery won't try to convert the object into a string
            processData: false,
            headers: {
                'X-CSRFToken': csrfToken
            },
            url: '/social/notify/',
            data: notification,
            success: function(data){
                let response = data;
                let to_user = response.to_user;
                if (type === 1){
                    let body = `You liked ${to_user}'s bit`;
                    showNotification(expandNotification, body);
                }

                if (type === 2){
                    let body = `Comment sent`;
                    showNotification(expandNotification, body);
                }

                if (type === 3){
                    let body = `You followed ${to_user}`;
                    showNotification(expandNotification, body);
                }

                if (type === 4){
                    let body = `Sent request to ${to_user}`;
                    showNotification(expandNotification, body);
                }


            }
        }
    )
}
