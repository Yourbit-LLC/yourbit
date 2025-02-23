const NOTIFICATION_WIDGET = document.getElementById('notification-widget'); //CSS 
const NOTIFICATION_STATUS = document.querySelectorAll('.notification-status');
const NOTIFICATION_CONTENT = document.getElementById('notification-widget-content');

function showNotification(callback1, body) {
    NOTIFICATION_WIDGET.classList.add('active');
    console.log(body);
    setTimeout(callback1, 1000, showText, body);
};

function expandNotification(callback, body) {
    console.log(body);
    NOTIFICATION_WIDGET.classList.add('expanded');
    $(NOTIFICATION_CONTENT).html(``);
    callback(body);
    setTimeout(contractNotification, 5000);
    
};

function showText(body) {
    console.log(body);
    NOTIFICATION_CONTENT.innerHTML = `<p class="yb-fillWidth" style="height: 100%; line-height: 2.5; padding-left: 10px;">${body}</p>`;
}

function contractNotification() {
    
    NOTIFICATION_WIDGET.classList.remove('expanded');
    NOTIFICATION_CONTENT.innerHTML = "";
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
    if (USER_AUTHORIZED == "true"){
        yb_checkNotification();
        setInterval(yb_checkNotification, 10000, 'all');
    }
});