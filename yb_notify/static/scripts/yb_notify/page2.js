try {
    var notify_filter_buttons = document.querySelectorAll('.notify-filter-button');
    var list_container = document.getElementById('notification-list');
} catch {
    notify_filter_buttons = document.querySelectorAll('.notify-filter-button');
    list_container = document.getElementById('notification-list');
}



function yb_buildNotifyItem(result, action=null){
    let id = result.id;
    console.log(result.id);
    console.log(result);
    console.log("ahbdiba");

    if (result.has_seen == false) {
        has_seen = "unseen";
    } else {
        has_seen = "seen";
    }

    icon = "";

    if (result.type == 1) {
        icon = `
            <svg xmlns="http://www.w3.org/2000/svg" height="32" viewBox="0 -960 960 960" width="32">
                <path class="yb-autoFill" d="M616.244-527.693q21.832 0 37.025-15.283 15.192-15.282 15.192-37.115 0-21.832-15.283-37.024t-37.115-15.192q-21.832 0-37.024 15.283-15.193 15.282-15.193 37.115 0 21.832 15.283 37.024t37.115 15.192Zm-272.307 0q21.832 0 37.024-15.283 15.193-15.282 15.193-37.115 0-21.832-15.283-37.024t-37.115-15.192q-21.832 0-37.025 15.283-15.192 15.282-15.192 37.115 0 21.832 15.283 37.024t37.115 15.192ZM480-272.309q62.615 0 114.461-35.038T670.922-400H618q-22 37-58.5 58.5T480-320q-43 0-79.5-21.5T342-400h-52.922q24.615 57.615 76.461 92.653Q417.385-272.309 480-272.309Zm.067 172.308q-78.836 0-148.204-29.92-69.369-29.92-120.682-81.21-51.314-51.291-81.247-120.629-29.933-69.337-29.933-148.173t29.92-148.204q29.92-69.369 81.21-120.682 51.291-51.314 120.629-81.247 69.337-29.933 148.173-29.933t148.204 29.92q69.369 29.92 120.682 81.21 51.314 51.291 81.247 120.629 29.933 69.337 29.933 148.173t-29.92 148.204q-29.92 69.369-81.21 120.682-51.291 51.314-120.629 81.247-69.337 29.933-148.173 29.933ZM480-480Zm0 320q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Z"/>
            </svg>
        `
    } else if (result.type == 2) {
        icon = `
            <svg id="feedback-icon-source" xmlns="http://www.w3.org/2000/svg" height="24" width="24">
                <path style="fill: white;" id="comment-icon-notify" d="M6 14H18V12H6ZM6 11H18V9H6ZM6 8H18V6H6ZM22 22 18 18H4Q3.175 18 2.588 17.413Q2 16.825 2 16V4Q2 3.175 2.588 2.587Q3.175 2 4 2H20Q20.825 2 21.413 2.587Q22 3.175 22 4ZM4 4V16Q4 16 4 16Q4 16 4 16H18.825L20 17.175V4Q20 4 20 4Q20 4 20 4H4Q4 4 4 4Q4 4 4 4ZM4 4V17.175V16Q4 16 4 16Q4 16 4 16V4Q4 4 4 4Q4 4 4 4Q4 4 4 4Q4 4 4 4Z"/>
            </svg>
        `
    } else {
        console.log("no icon loaded");
    }

    let name = result.from_user.display_name;
    let handle = result.from_user.username;
    let element_id = `notification-${id}`;
    let new_item = yb_createElement("div", `yb-fillWidth`, `notification-container-${id}`,);
    new_item.setAttribute("data-id", `${id}`);
    new_item.setAttribute("data-username", `${handle}`);

    let new_sub_item = yb_createElement("div", `yb-listItem notification ${has_seen}`, element_id);

    let notification_icon = yb_createElement("div", "notification-icon", `notification-icon-${id}`);
    notification_icon.innerHTML = icon;

    let notification_contents = yb_createElement("div", "notification-contents font-medium", `notification-contents-${id}`);
    notification_contents.innerHTML = `
    
        <b class="font-small yb-font-auto blend">
            ${result.title}
        </b>
        <p class="yb-font-auto blend">
            ${result.body}
        </p>
        <div class="font-gray blend" id="notification-time">
            <p>${result.time}</p>
        </div>

        `;

    let notification_close = yb_createElement("div", "notification-close", `notification-close-${id}`);
    notification_close.innerHTML = `
        <button class="yb-button-close notification">&times;</button>
    `;

    notification_close.addEventListener('click', function() {
        yb_dismissNotification(id);
    });

    

    new_sub_item.appendChild(notification_icon);
    new_sub_item.appendChild(notification_contents);
    new_sub_item.appendChild(notification_close);
    new_item.appendChild(new_sub_item);

    NOTIFICATION_CONTAINER.appendChild(new_item);

    new_item.addEventListener('click', function() {
        if (result.type === 4) {
            yb_openCard(`/profile/templates/friend_request/${result.friend_request}/`);

        } else if (result.type === 1 || result.type === 2 || result.type === 7) {
            yb_notificationMenu(result.type, id, result.bit);
        }
    });


}

function yb_dismissNotification(notification_id) {
    let csrf_token = getCSRF();
    let url = `/notify/api/notifications/${notification_id}/`;
    $.ajax({
        type: "DELETE",
        url: url,
        headers: {
            'X-CSRFToken': csrf_token,
        },
        success: function(data){
            console.log(data);
            let notification_element = document.getElementById(`notification-${notification_id}`);
            notification_element.remove();
        }
    })
}



var option_functions = {
    "View Bit": yb_viewBit, //This document
    "Send Thanks": yb_sendThanks, //This document
    "Cancel": yb_closeSlideUpTemplate, //main/yb_master.js
    // "Reply to Comment": yb_replyToComment, //Not yet created
    "View Profile": yb_navigateToProfile,
    "Accept": yb_acceptOption, //This document
}


//Function for handling notification response options
function yb_handleNotificationOptionClick(e) {
    let this_option = e.currentTarget;
    let this_id = this_option.getAttribute("data-oid");
    console.log(this_id);
    let this_option_name = this_option.getAttribute("name");
    yb_toggle2WayContainer("notifications");
    yb_closeSlideUpTemplate();
    option_functions[this_option_name](this_id);

}

//Function for drawing menu and listing options off
function yb_notificationMenu(type, this_id, rid=null) {
    let menu = document.getElementById("yb-slide-up-core");
    console.log(rid)

    let these_options = {};
    
    console.log("Notification Response Triggered")

    //Handle Notification Option Click location: This document -- Line 83

    if (type === 1) {

        //Prepare Options
        these_options = {
            "View Bit": 
                { 
                    "id": this_id,
                    "action" : yb_handleNotificationOptionClick
                },
            "Send Thanks": 
                {
                    "id": this_id,
                    "action": yb_handleNotificationOptionClick,
                },
            "Cancel": 
                {
                    "action" : yb_handleNotificationOptionClick, 
                }
        };
    } else if (type === 2) {
        these_options = {
            "Reply to Comment": 
                {
                    "id": this_id,
                    "action" : yb_handleNotificationOptionClick,
                },
            "View Bit": 
                {
                    "action" : yb_handleNotificationOptionClick,
                }, 
            "Cancel": 
                {
                    "action" : yb_handleNotificationOptionClick, 
                }
        };
    } else if (type === 3) {
        these_options = {
            "View Profile": 
                {
                    "action" : yb_handleNotificationOptionClick,
                }, 
            "Cancel": 
                {
                    "action" : yb_handleNotificationOptionClick, 
                }
        };
    } else if (type === 4) {
        these_options = {
            "Accept": 
                {
                    "action" : yb_handleNotificationOptionClick,
                },
                    
            "View Profile": 
                {
                    "action" : yb_handleNotificationOptionClick, 
                },
            "Cancel": 
                {
                    "action" : yb_handleNotificationOptionClick, 
                }
        };
    } else if (type === 5) {
        these_options = {
            "View Profile": 
                {
                    "action" : yb_handleNotificationOptionClick, 
                },
            "Send Message": 
                {
                    "action": yb_handleNotificationOptionClick,
                },
            "Cancel": 
                {
                    "action" : yb_handleNotificationOptionClick, 
                }
        };
    } else if (type === 6) {
        these_options = {
            "Reply to Message": 
                {
                    "action" : yb_handleNotificationOptionClick,
                },
            "View Conversation": 
                {
                    "action" : yb_handleNotificationOptionClick, 
                },
            "Cancel": 
                {
                    "action" : yb_handleNotificationOptionClick,
                }
            
        };
    } else if (type === 7) {
        these_options = {
            "View Bit": 
                {
                    "action" : yb_handleNotificationOptionClick, 
                },
            "Send Thanks": 
                {
                    "action" : yb_handleNotificationOptionClick,
                },
            "Cancel": 
                {
                    "action" : yb_handleNotificationOptionClick, 
                }
        };
    }



    let this_container = yb_createElement("div", "notification-response-container", "notification-response-container");

    for (let option in these_options) {
        
        let new_option = yb_createElement(
            "div", 
            "notification-response-option yb-menu-listButton yb-button-threeQuarter border-none squared yb-margin-T10 yb-widthConstraint-600 yb-font-auto bg-gray font-heavy pointer-object", 
            `notification-response-option-${option}`
        );
        
        let new_option_text = yb_createElement("p", "notification-response-text yb-margin-center all", `notification-response-text-${this_id}-${option.substring(0, 3)}`);
        new_option_text.innerHTML = option;

        new_option.appendChild(new_option_text);
        new_option.setAttribute("data-catid", this_id);
        
        new_option.setAttribute("data-oid", rid);
        
        new_option.setAttribute("name", option);
        new_option.addEventListener("click", yb_handleNotificationOptionClick);
        this_container.appendChild(new_option);
    }

    menu.appendChild(this_container);

    menu.classList.add("open");
}

function yb_clearNotifications() {
    list_container.innerHTML = "";
}



function yb_getNotificationList(notify_class, show_seen = 'True') {

  
    yb_clearNotifications();
    $(list_container).load(`/notify/notification-list/${notify_class}/?seen=True`);

};



function yb_handleFilterClick() {
    yb_getNotificationList(this.getAttribute('data-notify-class'));
    yb_updateActiveTab("notify-filter-button", this);
}

$(document).ready(function () {
    // yb_hide2WayLoad();
    for (let i = 0; i < notify_filter_buttons.length; i++){
        notify_filter_buttons[i].addEventListener('click', yb_handleFilterClick);
    }

});