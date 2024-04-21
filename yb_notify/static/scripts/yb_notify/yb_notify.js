const NOTIFICATION_WIDGET = document.getElementById('notification-widget'); //CSS 
const NOTIFICATION_STATUS = document.querySelectorAll('.notification-status');
const NOTIFICATION_CONTENT = document.getElementById('notification-widget-content');

function showNotification(callback1, body) {
    NOTIFICATION_WIDGET.classList.add('active');
    setTimeout(callback1, 1000, showText, body);
};

function expandNotification(callback, body) {
    NOTIFICATION_WIDGET.classList.add('expanded');
    $(NOTIFICATION_WIDGET).html(`
    
    `);
    callback(body);
    setTimeout(contractNotification, 5000);
    
};

function showText(body) {
    NOTIFICATION_CONTENT.innerHTML = body
}

function contractNotification() {
    
    NOTIFICATION_WIDGET.classList.remove('expanded');
    setTimeout(hideNotification, 1000);
};

function hideNotification() {
    NOTIFICATION_WIDGET.classList.remove('active');
};

function yb_clearNotifications() {
    NOTIFICATION_CONTAINER.innerHTML = "";
}


function yb_checkNotification() {
    $.ajax( {
        type: 'GET',
        url: '/notify/api/notification-core/has_unseen/',
        success: function(response){
            console.log(response.has_unseen)
            if (response.has_unseen) {
                for (let i = 0; i < NOTIFICATION_STATUS.length; i++) {
                    NOTIFICATION_STATUS[i].style.display = 'inline-block';
                }
            } else {
                for (let i = 0; i < NOTIFICATION_STATUS.length; i++) {
                    NOTIFICATION_STATUS[i].style.display = 'none';
                }
            }
        }
    })
}

$(document).ready(function(){
    yb_checkNotification();
    setInterval(yb_checkNotification, 10000, 'all');
});