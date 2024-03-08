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

//Function for handling notification response options
function yb_handleNotificationOptionClick(e) {
    let this_option = e.currentTarget;
    let this_id = this_option.getAttribute("data-catid");
    let this_option_name = this_option.getAttribute("name");

    if (this_option_name === "View Bit") {
      
        yb_viewBit(this_id);
    
    } else if (this_option_name === "Send Thanks") {
      
        yb_sendThanks(this_id);
    
    } else if (this_option_name === "Dismiss") {
      
        yb_dismissNotification(this_id);
    
    } else if (this_option_name === "Reply to Comment") {
      
        yb_replyToComment(this_id);
    
    } else if (this_option_name === "View Profile") {
      
        yb_navToProfile(this_id);
    
    } else if (this_option_name === "Accept") {
      
        yb_acceptRequest(this_id);
    
    } else if (this_option_name === "Message") {
      
        yb_openMessagesTo(this_id);
    
    } else if (this_option_name === "Reply to Message") {
      
        yb_replyToMessage(this_id);
    
    } else if (this_option_name === "View Conversation") {
      
        yb_viewConversation(this_id);

    } 

}

//Function for drawing menu and listing options off
function yb_notificationMenu(type, this_id) {
    let menu = document.getElementById("yb-slide-up-core");

    let these_options = {};


    if (type === 1) {

        //Prepare Options
        these_options = {
            "View Bit": yb_handleNotificationOptionClick,
            "Send Thanks": yb_handleNotificationOptionClick,
            "Dismiss": yb_handleNotificationOptionClick, 
        };
    } else if (type === 2) {
        these_options = {
            "Reply to Comment": yb_handleNotificationOptionClick,
            "View Bit": yb_handleNotificationOptionClick, 
            "Dismiss": yb_handleNotificationOptionClick, 
        };
    } else if (type === 3) {
        these_options = {
            "View Profile": yb_handleNotificationOptionClick, 
            "Dismiss": yb_handleNotificationOptionClick, 
        };
    } else if (type === 4) {
        these_options = {
            "Accept": yb_handleNotificationOptionClick,
            "View Profile": yb_handleNotificationOptionClick, 
            "Dismiss": yb_handleNotificationOptionClick, 
        };
    } else if (type === 5) {
        these_options = {
            "View Profile": yb_handleNotificationOptionClick, 
            "Send Message": yb_handleNotificationOptionClick,
            "Dismiss": yb_handleNotificationOptionClick, 
        };
    } else if (type === 6) {
        these_options = {
            "Reply to Message": yb_handleNotificationOptionClick,
            "View Conversation": yb_handleNotificationOptionClick, 
            "Dismiss": yb_handleNotificationOptionClick, 
        };
    } else if (type === 7) {
        these_options = {
            "View Bit": yb_handleNotificationOptionClick, 
            "Send Thanks": yb_handleNotificationOptionClick,
            "Dismiss": yb_handleNotificationOptionClick, 
        };
    }



    let this_container = yb_createElement("div", "notification-response-container", "notification-response-container");

    for (let option in these_options) {
        let this_function = these_options[option];
        let new_option = yb_createElement(
            "div", 
            "notification-response-option yb-button-threeQuarter border-none squared yb-margin-T10 yb-widthConstraint-600 yb-autoText bg-gray-dark font-heavy pointer-object", 
            `notification-response-option-${option}`
        );
        new_option.innerHTML = option;
        new_option.setAttribute("data-catid", this_id);
        new_option.setAttribute("name", option);
        new_option.addEventListener("click", this_function);
        this_container.appendChild(new_option);
    }

    menu.appendChild(this_container);

    menu.classList.add("active");


}

$(document).ready(function(){
    setInterval(yb_checkNotification, 60000, 'all');
});