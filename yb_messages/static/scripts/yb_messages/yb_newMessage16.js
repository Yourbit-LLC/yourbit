var contact_search = document.getElementById('contact-search-input');
var contact_filter_container = document.getElementById('contact-filter-container');
var contact_filters = document.getElementsByClassName('contact-filter');
var selected_contact_filter = document.getElementById('selected-contact-filter');
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
    let this_element = e.currentTarget;
    let this_icon = this_element.getElementById("add-contact-icon");

    //Get theme preference from browser media
    let theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? "dark" : "light";

    if (this_element.classList.contains("selected")){

        this_element.style.backgroundColor = "black";

        yb_conversationRemoveContact(e);

        this_icon.style.transform = "translate(-50%, -50%) rotate(0deg)";

        this_element.classList.remove("selected");
    
    
    } else {
        if (theme == "dark"){
            this_element.style.backgroundColor = "#A8071A";
        } else {
            this_element.style.backgroundColor = "#FFB3B4";
        }
        this_element.classList.add("selected");

        
        let contact_tag = yb_buildFieldTag(this_name, this_id);

        tag_container.appendChild(contact_tag);
        contact_tag.querySelector(".field-tag-delete").addEventListener("click", yb_conversationRemoveContact);
        this_icon.style.transform = "translate(-50%, -50%) rotate(-405deg)";
    
        selected_contacts.value += `${this_id},`;
        
        contact_search.value = "";

        recipient_iteration += 1;
    }


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
    selected_contact_filter = this_filter;

    contact_list.innerHTML = "";
    if (contact_search.value != "") {
        query = contact_search.value;
        $(contact_list).load("/messages/list/contacts/"+this_filter+"/?q="+query);   
    } else {
        $(contact_list).load("/messages/list/contacts/"+this_filter+"/");
    }
    
    yb_updateActiveTab("contact-filter", this_element);

}

$(document).ready(function () {


    contact_search.addEventListener("keyup", function(event) {
        if (event.key == 'Enter') {
            event.preventDefault();
            yb_createConversation();
        } else {
            if (contact_search.value == "") {
                $(contact_list).load(`/messages/list/contacts/${selected_contact_filter.value}/`);
            } else {
                $(contact_list).load(`/messages/list/contacts/${selected_contact_filter.value}/?q=${contact_search.value}`);
            }
        }
    });

    for (var i = 0; i < contact_filters.length; i++) {
        contact_filters[i].addEventListener("click", yb_getContacts);
    }

    // yb_hide2WayLoad();
    let next_button = document.getElementById("new-message-next");
    
    next_button.addEventListener("click", yb_createConversation)
});