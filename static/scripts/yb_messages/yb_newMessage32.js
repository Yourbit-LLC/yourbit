var contact_search = document.getElementById('contact-search-input');
var contact_filter_container = document.getElementById('contact-filter-container');
var contact_filters = document.getElementsByClassName('contact-filter');
var selected_contact_list = [];
var selected_contact_filter = document.getElementById('selected-contact-filter');
var tag_container = document.getElementById('yb-tagContainer');
var tag_container_height = tag_container.offsetHeight;
var selected_contacts = document.getElementById('selected-contacts');
var recipient_iteration = 0;
var contact_list = document.getElementById('contact-list');


function yb_conversationRemoveContact(e) {
    let this_id = e.currentTarget.getAttribute("data-catid");
    let this_name = e.currentTarget.getAttribute("data-username");
    let this_tag = document.getElementById(`tag-${this_id}`);
    let this_button = contact_list.querySelector("#add-contact-button-"+this_id);
    let this_icon = this_button.querySelector('[id^="add-contact-icon"]');
    this_tag.classList.remove("end");
    setTimeout(function() {
        this_tag.remove();
    }, 300);

    let current_value = selected_contacts.value;
    let new_value = current_value.replace(`${this_id},`, "");
    selected_contacts.value = new_value;

    contact_search.focus();

    if (tag_container.offsetHeight < tag_container_height) {
        contact_list.style.height = `${contact_list.offsetHeight + tag_container_height}px`;
        tag_container_height = tag_container.offsetHeight;
    }

    //remove id from selected content list
    selected_contact_list = selected_contact_list.filter(item => item !== this_id);

    this_button.style.backgroundColor = "black";
    this_icon.style.transform = "translate(-50%, -50%) rotate(0deg)";

    this_button.classList.remove("selected");
}

function yb_refreshContacts() {
    contact_list.innerHTML = "";

    
    $(contact_list).load("/messages/list/contacts/"+selected_contact_filter.value+"/");

    contact_list.style.height = `${contact_list.offsetHeight - tag_container_height}px`;


    
}

function yb_conversationAddContact(e) {
    let this_id = e.currentTarget.getAttribute("data-catid");
    let this_name = e.currentTarget.getAttribute("data-username");
    let this_element = e.currentTarget;
    let this_icon = this_element.querySelector('[id^="add-contact-icon"]');

    //Get theme preference from browser media
    let theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? "dark" : "light";

    if (this_element.classList.contains("selected")){

        this_element.style.backgroundColor = "black";

        yb_conversationRemoveContact(e);

        this_icon.style.transform = "translate(-50%, -50%) rotate(0deg)";

    
    
    } else {
        
        this_element.style.backgroundColor = "#A8071A";

        let contact_tag = yb_buildFieldTag(this_name, this_id);

        tag_container.appendChild(contact_tag);
        contact_tag.classList.add("end");
        contact_tag.querySelector(".field-tag-delete").addEventListener("click", yb_conversationRemoveContact);
        this_icon.style.transform = "translate(-50%, -50%) rotate(-405deg)";
    
        selected_contacts.value += `${this_id},`;

        recipient_iteration += 1;

        if (tag_container.offsetHeight > tag_container_height) {
            contact_list.style.height = `${contact_list.offsetHeight - tag_container_height}px`;
            tag_container_height = tag_container.offsetHeight;
        }

        

        this_element.classList.add("selected");

        selected_contact_list.push(this_id);

        if (contact_search.value != "") {
            yb_refreshContacts();
        }

        contact_search.value = "";
    

    }

    

    contact_search.focus();
    //After focus highlight all text
    contact_search.select();
    

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
    selected_contact_filter.value = this_filter;

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
    
    next_button.addEventListener("click", yb_createConversation);

    contact_search.focus();
});