var contact_search = document.getElementById('contact-search-input');
var contact_filter_container = document.getElementById('contact-filter-container');
var selected_contacts = document.getElementById('selected-contacts');

function yb_conversationRemoveContact(e) {
    let this_id = e.currentTarget.getAttribute("data-catid");
    let this_name = e.currentTarget.getAttribute("data-username");
    let this_tag = document.getElementById(`tag-${this_id}`);

    this_tag.remove();

    let current_value = selected_contacts.value;
    let new_value = current_value.replace(`${this_id},`, "");
    selected_contacts.value = new_value;

    contact_search.focus();
}

function yb_conversationAddContact(e) {
    let this_id = e.currentTarget.getAttribute("data-catid");
    let this_name = e.currentTarget.getAttribute("data-username");

    let contact_tag = yb_buildFieldTag(this_name, this_id);

    contact_filter_container.appendChild(contact_tag);

    selected_contacts.value += `${this_id},`;
    
    contact_search.focus();

}

$(document).ready(function () {
    $(contact_search).on('change keyup', function() {
        query = this.value;

        type = 'user';
        yb_search("messages", type, query);
    });
});