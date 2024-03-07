const NOTIFICATION_CONTAINER = document.getElementById('notification-widget');

function showNotification(callback1, body) {
    NOTIFICATION_CONTAINER.classList.add('active');
    setTimeout(callback1, 1000, showText, body);
};

function expandNotification(callback, body) {
    NOTIFICATION_CONTAINER.classList.add('expanded');
    $(NOTIFICATION_CONTAINER).html(`
    
    `);
    callback(body);
    setTimeout(contractNotification, 5000);
    
};

function showText(body) {
    NOTIFICATION_CONTAINER.innerHTML = `
        <p style='display:block; position: relative; margin: auto; top:50%; left: 50%; transform:translate(-50%, -50%); margin-left: 20px;'>${body}</p>
    `;
}

function contractNotification() {
    
    NOTIFICATION_CONTAINER.classList.remove('expanded');
    setTimeout(hideNotification, 1000);
};

function hideNotification() {
    NOTIFICATION_CONTAINER.classList.remove('active');
};

function yb_clearNotifications() {
    NOTIFICATION_CONTAINER.innerHTML = "";
}


function yb_displayNotifications(response) {
    yb_clearNotifications();
    if (response.length == 0) {
        return;
    }
    for (let i = 0; i < response.length; i++) {
        
        new_item = yb_buildListItem(response[i]);

        NOTIFICATION_CONTAINER.appendChild(new_item);
    }
}

function yb_getNotificationList(type) {

    $.ajax( {
        type: 'GET',
        url: '/notifications/',
        data: { 
            type: type,
        },
        success: function(response){

            yb_displayNotifications(response);

        }
    })
};

function yb_checkNotification(type) {
    $.ajax( {
        type: 'GET',
        url: '/notifications/check/',
        data: { 
            type: type,
        },
        success: function(response){
            if (response.length > 0) {
                showNotification(expandNotification, response[0].body);
            }
        }
    })
}

$(document).ready(function(){
    setInterval(yb_checkNotification, 60000, 'all');
});