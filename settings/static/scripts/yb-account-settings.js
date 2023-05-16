function yb_handleInputChange(field_label) {
    let field_container = document.getElementById(`field-container-${field_label}`);
    let field_input = document.getElementById(`field-${field_label}`);
    field_container.classList.add("changed");
    field_input.classList.add("changed");
}


$(document).ready(function(){
    //Get the user ID from session values
    let this_id = yb_getSessionValues("id");
    yb_showBackTask();
    //Get user data
    $.ajax({
        url: `/api/users/${this_id}/`,
        type: "GET",
        dataType: "json",
        success: function(data){
            console.log(data);
            $("#field-first-name").val(data.first_name);
            $("#field-last-name").val(data.last_name);
            $("#field-email-address").val(data.email);
            $("#field-phone-number").val(data.phone_number);
            $("#field-username").val(data.username);
            
        },
        error: function(data){
            console.log(data);
        }
    });

    //Handle input change

    const LAST_NAME_FIELD = document.getElementById("field-last-name");
    var lname_keyup_ran = false;
    LAST_NAME_FIELD.addEventListener("change keyup", function(){
        if (lname_keyup_ran) {
            return;
        } else {
            yb_handleInputChange("last-name");
            lname_keyup_ran = true;
        }

    }
    );

    const EMAIL_FIELD = document.getElementById("field-email-address");
    var email_keyup_ran = false;
    EMAIL_FIELD.addEventListener("change keyup", function(){
        if (email_keyup_ran) {
            return;
        } else {
            yb_handleInputChange("email-address");
            email_keyup_ran = true;
        }
    }
    );

    const PHONE_FIELD = document.getElementById("field-phone-number");
    var phone_keyup_ran = false;
    PHONE_FIELD.addEventListener("change", function(){
        if (phone_keyup_ran) {
            return;
        } else {
            yb_handleInputChange("phone-number");
            phone_keyup_ran = true;
        }
    }
    );

    const USERNAME_FIELD = document.getElementById("field-username");
    var username_keyup_ran = false;
    USERNAME_FIELD.addEventListener("change", function(){
        if (username_keyup_ran) {
            
            return;
        } else {
            yb_handleInputChange("username");
            username_keyup_ran = true;
        }
    }
    );


});

var fname_keyup_ran = false;
$("#field-first-name").on("change keyup", function(){
    console.log("keyup");
    if (fname_keyup_ran) {
        return;
    } else {
        yb_handleInputChange("first-name");
        fname_keyup_ran = true;
    }
});