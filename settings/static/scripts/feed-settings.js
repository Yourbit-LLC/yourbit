//Store original values of fields
var original_values = {}
var keyup_ran = {}

function yb_saveField(field_label, value){
    let csrfToken = getCSRF();
    $.ajax({
        url: "/settings/feed/",
        type: "POST",
        headers: {
            'X-CSRFToken': csrfToken
        },
        data: {
            "field": field_label,
            "value": value
        },
        success: function(data) {
            let response = data;
            if (response["message"] === "success") {
                original_values[field_label] = value;
                yb_resetField(field_label);
                let body = `Change Saved Successfully`;
                showNotification(expandNotification, body);
            } else {
                console.log("Error saving field");
                let body = `Error Saving Change`;
                showNotification(expandNotification, body);
            }
        }
    });

}

function yb_resetField(field_label){
    let field_container = document.getElementById(`field-container-${field_label}`);
    let field_input = document.getElementById(`field-${field_label}`);
    field_container.classList.remove("changed");
    field_input.classList.remove("changed");
    let cancel_button = document.getElementById(`button-cancel-${field_label}`);
    let save_button = document.getElementById(`button-save-${field_label}`);
    field_container.removeChild(cancel_button);
    field_container.removeChild(save_button);
    field_input.value = original_values[field_label];
    keyup_ran[field_label] = false;


}

function yb_handleInputChange(field_label) {
    let field_container = document.getElementById(`field-container-${field_label}`);
    let field_input = document.getElementById(`field-${field_label}`);
    field_container.classList.add("changed");
    field_input.classList.add("changed");
    let cancel_button = yb_createButton(field_label, `button-cancel-${field_label}`, "yb-form-button", '<svg style="fill:white;" xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 96 960 960" width="20"><path d="M288 864v-72h288q50 0 85-35t35-85q0-50-35-85t-85-35H330l93 93-51 51-180-180 180-180 51 51-93 93h246q80 0 136 56t56 136q0 80-56 136t-136 56H288Z"/></svg>');
    cancel_button.setAttribute("style", "height: 32px; width: 40px !important; background-color: red; margin: auto;");
    field_container.appendChild(cancel_button);
    cancel_button.addEventListener("click", function() {
        let field_label = this.getAttribute("name");
        yb_resetField(field_label);
    });

    let save_button = yb_createButton(field_label, `button-save-${field_label}`, "yb-form-button", '<svg style="fill:white;" xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 96 960 960" width="20"><path d="M816 384v456q0 29.7-21.15 50.85Q773.7 912 744 912H216q-29.7 0-50.85-21.15Q144 869.7 144 840V312q0-29.7 21.15-50.85Q186.3 240 216 240h456l144 144Zm-72 30L642 312H216v528h528V414ZM480 804q45 0 76.5-31.5T588 696q0-45-31.5-76.5T480 588q-45 0-76.5 31.5T372 696q0 45 31.5 76.5T480 804ZM264 504h336V360H264v144Zm-48-77v413-528 115Z"/></svg>');
    save_button.setAttribute("style", "height: 32px; width: 40px !important; background-color: green; margin: auto;");
    field_container.appendChild(save_button);
    save_button.addEventListener("click", function() {
        let field_label = this.getAttribute("name");
        let value = document.getElementById(`field-${field_label}`).value;
        yb_saveField(field_label, value);
    }
    );
}

$(document).ready(function() {
    
});