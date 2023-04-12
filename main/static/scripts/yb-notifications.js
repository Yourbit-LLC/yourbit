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
    updateNotificationStatus();
    yb_getNotificationCounts();
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
            url: '/notifications/status/',

            success: function(data) {
                let status_response= data;
                let current_notifications = status_response.notification_len;
                
                

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


function yb_removeNotification(notification_id) {
    let csrfToken = getCSRF();
    $.ajax(
        {   
            type: 'DELETE',
            headers: {
                'X-CSRFToken': csrfToken
            },
            url: `/api/notifications/${notification_id}/`,

            success: function(data) {
                $("#notification-" + notification_id).remove();
            }
        }
    )
}

/*
    --Function For displaying notifications--
*/

function yb_getNotificationCounts() {
    let cookie = document.cookie;
    let csrfToken = getCSRF();
    console.log("function ran")
    $.ajax(
        {   
            type: 'GET',
            headers: {
                'X-CSRFToken': csrfToken
            },
            url: '/notifications/counts/',

            success: function(data) {
                let message_count = data.message_count;
                let connection_count = data.connection_count;
                let general_count = data.general_count;
                $("#display-notification-count").html(general_count);
                $("#display-message-count").html(message_count);
                $("#display-new-connection-count").html(connection_count);
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
    let csrfToken = getCSRF();
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
            url: '/profile/api/add_friend/',
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
    let csrfToken = getCSRF();
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
            url: '/profile/api/add_friend/',
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
    setTimeout(callback1, 1000, showText, body);
};

function expandNotification(callback, body) {
    $('#non-interactive-notification-modal').animate({'width':'300px'}, 'fast');
    $('non-interactive-notification-modal').html(`
    
    `);
    callback(body);
    setTimeout(contractNotification, 5000);
    
};

function showText(body) {
    $('#non-interactive-notification-modal').html(`
        <p style='display:block; position: relative; margin: auto; top:50%; left: 50%; transform:translate(-50%, -50%); margin-left: 20px;'>${body}</p>
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
    let csrfToken = getCSRF();

    $.ajax(
        {
            type: 'POST',
            contentType: false,
            // The following is necessary so jQuery won't try to convert the object into a string
            processData: false,
            headers: {
                'X-CSRFToken': csrfToken
            },
            url: '/notifications/notify/',
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
