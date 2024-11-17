var contact_search = document.getElementById('contact-search-input');
var contact_filter_container = document.getElementById('contact-filter-container');
var contact_filters = document.getElementsByClassName('contact-filter');
var tag_container = document.getElementById('yb-tagContainer');
var selected_contacts = document.getElementById('selected-contacts');
var recipient_iteration = 0;
var contact_list = document.getElementById('contact-list');

function yb_conversationRemoveContact(e) {
    let this_id = e.currentTarget.getAttribute("data-catid");
    let this_name = e.currentTarget.getAttribute("data-username");
    let this_tag = document.getElementById(`tag-${this_id}`);

    this_tag.remove();

    let current_value = selected_contacts.value;
    let new_value = current_value.replace(`${this_id},`, "");
    selected_contacts.value = new_value;

    contact_search.focus();
    recipient_iteration -= 1;
    contact_search.style.paddingLeft = `${recipient_iteration}10px`;
}

function yb_conversationAddContact(e) {
    let this_id = e.currentTarget.getAttribute("data-catid");
    let this_name = e.currentTarget.getAttribute("data-username");

    let contact_tag = yb_buildFieldTag(this_name, this_id);

    if (recipient_iteration == 0) {
        contact_tag.style.transform = "translateY(-50%) translateX(0px)";
    } else {
        contact_tag.style.transform = `translateY(-50%) translateX(${recipient_iteration}10px)`;
    }

    tag_container.appendChild(contact_tag);

    selected_contacts.value += `${this_id},`;
    
    contact_search.value = "";

    contact_search.focus();
    

}

function yb_createConversation() {
    let recipient_field = document.getElementById("selected-contacts");
    let csrf_token = getCSRF();
    $.ajax({
        type: 'POST',
        url: '/messages/api/conversations/',
        headers: {
            'X-CSRFToken': csrf_token,
        },
        data: {
            members: recipient_field.value
        },
        success: function(response) {
            console.log("Response ID: " + response.id);
            console.log(response);
            
            yb_toggleConversation2Way(response.id)
        }
    })
}

function yb_getContacts(event) {
    let this_element = event.currentTarget;
    let this_filter = event.currentTarget.getAttribute("name");
    contact_list.innerHTML = "";
    $(contact_list).load("/messages/list/contacts/"+this_filter+"/");
    yb_updateActiveTab("contact-filter", this_element);

}

$(document).ready(function () {
    $(contact_search).on('change keyup', function() {
        query = this.value;

        type = 'user';
        
    });

    for (var i = 0; i < contact_filters.length; i++) {
        contact_filters[i].addEventListener("click", yb_getContacts);
    }

    // yb_hide2WayLoad();
    let next_button = document.getElementById("new-message-next");
    
    next_button.addEventListener("click", yb_createConversation)
});