/*

        Yourbit Notification Manager Script
        This script handles updating, receiving, and responding to notifications on yourbit

*/

/* ----Declare Global Variables --- */
var notifications_last = 0;
var first_load = true;
var width = screen.width;

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

                if (status_response.status === true) {
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
                let connect_notifications = data;
                let notifications = Object.keys(connect_notifications);
                console.log(notifications)
                let notification = '';
                let x = 0;
                if (width > 700){
                    for (let i = 0; i < notifications.length; i++) {
                        notification = notifications[x];
                        let notification_info = connect_notifications[notification];
                        console.log(notification_info)
                        let user_name = notification_info['from_name'];
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
                    if (notifications.length > 0) {

                        $('#no-notifications-message').hide();

                        for (let i = 0; i < notifications.length; i++) {
                            notification = notifications[x];
                            console.log(notification)
                            let notification_info = connect_notifications[notification];
                            console.log(notification_info)
                            let user_name = notification_info['from_name'];
                            $('#menu-notification-container').append(`
                                <div class='mobile-notification' id='mobile-friend-request' style="color:white;">
                                    <p class="mobile-interaction-notification-text">${user_name} wants to be your friend!</p>
                                    <a class="mobile-notification-link" style="display:none;"></a>
                                </div>
                            `)
                        }
                    }
                }
            }

        }
    )
};


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
