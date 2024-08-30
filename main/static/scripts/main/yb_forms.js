try {
    var live_fields = document.querySelectorAll('.yb-live-field');
    var form_fields = document.querySelectorAll('.yb-form-field');
    var form_config = document.getElementById('yb-form-config');
    var live_text_areas = document.querySelectorAll('.yb-live-textArea');
    var text_areas = document.querySelectorAll('.yb-form-textArea');
    var form_id = form_config.getAttribute('data-form-id');
    var message = form_config.getAttribute('data-message');
    var change_state = false
    var save_button = document.getElementsByClassName('yb-form-save');
    var form_tabs = document.querySelectorAll('.yb-form-tab');
} catch(e) {
    console.log(e);
    live_fields = document.querySelectorAll('.yb-live-field');
    form_fields = document.querySelectorAll('.yb-form-field');
    form_config = document.getElementById('yb-form-config');
    live_text_areas = document.querySelectorAll('.yb-live-textArea');
    text_areas = document.querySelectorAll('.yb-form-textArea');
    form_id = form_config.getAttribute('data-form-id');
    message = form_config.getAttribute('data-message');
    change_state = false
    save_button = document.getElementsByClassName('yb-form-save');
    form_tabs = document.querySelectorAll('.yb-form-tab');
}

function yb_continue_back(back_type, back_location, data=null) {
        
    if (back_type = "page") {

        yb_2WayPage(back_location);
    } else if (back_type = "2Way") {
        yb_navigateTo("2Way", back_location, data);
    } else {
        yb_navigateTo("core", back_location);
    }
}

function yb_submitForm(form_id, success_message="Form Submitted Successfully") {
    let form = $(`#${form_id}`);
    let formData = form.serialize();

    $.ajax({
        type: "POST",
        url: form.attr('action'),
        type:"POST",
        data: formData,

        success: function(data){
            if (data.success) {
                showNotification(expandNotification, success_message);
            } else {
               showNotification(expandNotification, "Oops! Something went wrong..."); 
            }

        }
    })
}


function yb_backWarning(back_type, back_location, data=null) {
    if (change_state == false) {
        yb_continue_back(back_type, back_location, data);
    } else {
        
        yb_displayPrompt(
            "You have unsaved changes.",
            "Select an option to continue...",
            {
                "continue": {
                    "name": "continue",
                    "label": "Don't Save",
                    "color": "red",
                    "action": function () {
                        yb_continue_back(back_type, back_location, data);
                        yb_closePrompt();
                    },
                },

                "save": {
                    "name": "save",
                    "label": "Save and Continue",
                    "color": "green",
                    "action": function () {
                        yb_submitForm(form_id, message);
                        yb_continue_back(back_type, back_location, data);
                        yb_closePrompt();
                    }, 
            
                },
            }
        );
    }

}

$(document).ready(function () {

    console.log('loaded');
    //Event listener for enter key press
    for (var i = 0; i < live_fields.length; i++) {
        live_fields[i].addEventListener('input', function (e) {
            if (e.key === 'Enter') {
                form_fields[i].blur();
            }
        });
    }

    for (var i = 0; i < live_fields.length; i++) {
        live_fields[i].addEventListener('blur', function () {
            yb_submitForm(form_id, message);
        });
    }

    for (var i = 0; i < form_fields.length; i++) {
        form_fields[i].addEventListener('input', function () {
            change_state = true;
            console.log('changed');
            save_button[0].style.backgroundColor = "green";
            save_button[0].style.color = "white";
            
        });
    }
    console.log(form_fields);
    for (var i = 0; i < form_tabs.length; i++) {
        form_tabs[i].addEventListener('click', function () {
            //Get name of tab
            var tab_name = this.getAttribute('name');
            
            console.log("tab_name: ", tab_name);

            for (var i = 0; i < form_tabs.length; i++) {
                form_tabs[i].classList.remove('active');
            }

            this.classList.add('active');

            var tab_content = document.getElementById(tab_name);
            var parent = tab_content.parentElement; // Adjust this if your element is nested deeper
            var rect = tab_content.getBoundingClientRect();
            var parentRect = parent.getBoundingClientRect();
            
            // Calculate the offset to scroll
            var offsetTop = rect.top - parentRect.top + parent.scrollTop;
            
            parent.scrollTo({
                top: offsetTop,
                behavior: "smooth"
            });
        });
    }

    save_button[0].addEventListener('click', function () {
        yb_submitForm(form_id, message);
        change_state = false;
        save_button[0].style.backgroundColor = "gray";
        save_button[0].style.color = "black";
    });

    //On focus of text area select all text inside
    for (var i = 0; i < live_text_areas.length; i++) {
        live_text_areas[i].addEventListener('focus', function () {
            this.select();
        });
    }

    for (var i = 0; i < text_areas.length; i++) {
        text_areas[i].addEventListener('focus', function () {
            this.select();
        });
    }

    for (var i = 0; i < live_text_areas.length; i++) {
        live_text_areas[i].addEventListener('blur', function () {
            yb_submitForm(form_id, message);
        });
    }

    for (var i = 0; i < text_areas.length; i++) {
        text_areas[i].addEventListener('blur', function () {
            change_state = true;
            save_button[0].style.backgroundColor = "green";
            save_button[0].style.color = "white";
        });
    }


});