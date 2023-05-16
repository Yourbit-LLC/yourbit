function yb_handleInputChange(field_label) {
    let field_container = document.getElementById(`field-container-${field_label}`);
    let field_input = document.getElementById(`field-${field_label}`);
    field_container.classList.add("changed");
    field_input.classList.add("changed");

    let save_button = yb_createButton(field_label, "button-save", "yb-form-button", "Save");
    save_button.setAttribute("style", "height: 32px; color: green;");
    field_container.appendChild(save_button);
}


$(document).ready(function(){
    //Get the user ID from session values
    let this_id = yb_getSessionValues("id");
    yb_showBackTask();
    
    //Handle input change
    var fname_keyup_ran = false;
    $("#field-first-name").on("change keyup", function(){
        console.log("ran keyup")
        if (fname_keyup_ran) {
            return;
        } else {
            yb_handleInputChange("first-name");
            fname_keyup_ran = true;
        }
    });

    
    var lname_keyup_ran = false;
    $("#field-last-name").on("change keyup", function(){
        if (lname_keyup_ran) {
            return;
        } else {
            yb_handleInputChange("last-name");
            lname_keyup_ran = true;
        }

    }
    );

    
    var email_keyup_ran = false;
    $("#field-email-address").on("change keyup", function(){
        if (email_keyup_ran) {
            return;
        } else {
            yb_handleInputChange("email-address");
            email_keyup_ran = true;
        }
    }
    );

    
    var phone_keyup_ran = false;
    $("#field-phone-number").on("change keyup", function(){
        if (phone_keyup_ran) {
            return;
        } else {
            yb_handleInputChange("phone-number");
            phone_keyup_ran = true;
        }
    }
    );

    
    var username_keyup_ran = false;
    $("#field-username").on("change keyup", function(){
        if (username_keyup_ran) {
            
            return;
        } else {
            yb_handleInputChange("username");
            username_keyup_ran = true;
        }
    }
    );


});