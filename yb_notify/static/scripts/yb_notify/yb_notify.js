const NOTIFICATION_WIDGET = document.getElementById('notification-widget');

function showNotification(callback1, body) {
    NOTIFICATION_WIDGET.classList.add('active');
    setTimeout(callback1, 1000, showText, body);
};

function expandNotification(callback, dark) {
    NOTIFICATION_WIDGET.classList.add('expanded');
    $(NOTIFICATION_WIDGET).html(`
    
    `);
    callback(body);
    setTimeout(contractNotification, 5000);
    
};

function showText(body) {
    NOTIFICATION_WIDGET.innerHTML = `
        <p style='display:block; position: relative; margin: auto; top:50%; left: 50%; transform:translate(-50%, -50%); margin-left: 20px;'>${body}</p>
    `;
}

function contractNotification() {
    
    NOTIFICATION_WIDGET.classList.remove('expanded');
    setTimeout(hideNotification, 1000);
};

function hideNotification() {
    NOTIFICATION_WIDGET.classList.remove('active');
};

function yb_clearNotifications() {
    NOTIFICATION_WIDGET.innerHTML = "";
}

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