try {
    //Form configuration fields from hidden input field
    var form_config = document.getElementById('yb-form-config');
    var form_id = form_config.getAttribute('data-form-id');
    var form = document.getElementById(form_id);
    var message = form_config.getAttribute('data-message');

    //Fields in form
    var live_fields = form.querySelectorAll('.yb-live-field');
    var form_fields = form.querySelectorAll('.yb-form-field');
    var color_buttons = form.querySelectorAll('.color-circle');
    var color_fields = form.querySelectorAll('.color-input');
    var live_color_fields = form.querySelectorAll('.live-color-input');
    var live_text_areas = form.querySelectorAll('.yb-live-textArea');
    var text_areas = form.querySelectorAll('.yb-form-textArea');
    var change_state = false    
    var save_button = form.getElementsByClassName('yb-form-save');
    var form_tabs = form.parentElement.querySelectorAll('.yb-form-tab');
    var validated_fields = [
        "email",
        "username",
        "password",
        "password2",
    ]
} catch(e) {
    console.log(e);
    form_config = document.getElementById('yb-form-config');
    form_id = form_config.getAttribute('data-form-id');
    form = document.getElementById(form_id);
    message = form_config.getAttribute('data-message');

    live_fields = form.querySelectorAll('.yb-live-field');
    form_fields = form.querySelectorAll('.yb-form-field');
    live_text_areas = form.querySelectorAll('.yb-live-textArea');
    text_areas = form.querySelectorAll('.yb-form-textArea');
    change_state = false
    save_button = form.getElementsByClassName('yb-form-save');
    form_tabs = form.querySelectorAll('.yb-form-tab');
    validated_fields = [
        "email",
        "username",
        "password",
        "password2",
    ]
}

function yb_continue_back(back_type, back_location, data=null) {
        
    if (back_type == "page") {

        yb_2WayPage(back_location);
    } else if (back_type == "2way") {
        yb_navigateTo("2way", back_location, data);
    } else {
        yb_navigateTo("core", back_location);
    }
}

function yb_submitForm(form_id, success_message="Form Submitted Successfully") {
    
    let formData = $(form).serialize();
    
    $.ajax({
        type: "POST",
        url: $(form).attr('action'),
        data: formData,

        success: function(data){
            if (typeof data === "string") {
                data = JSON.parse(data);
            }
            if (data.status == "success") {
                showNotification(expandNotification, success_message);
                if (form.getElementsByClassName("response-container")) {
                    let response_container = form.getElementsByClassName("response-container")[0];
                    console.log(data)
                    console.log(data.response)
                    response_container.getElementsByClassName("response-text")[0].innerHTML = data.response;
                    save_button[0].style.display = "none";
                    response_container.style.display = "block";
                }
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
        if (form_config.getAttribute('data-saves') == "true") {
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

}

function yb_validateField(field) {
    let field_name = field.name;
    let field_value = field.value;
    let url = "/accounts/validate_field/" + field_name + "/";
    let field_valid = false;
    let csrf_token = getCSRF();
    $.ajax({
        type: "POST",
        url: url,
        data: {
            "field_value": field_value,
        },

        headers: {
            "X-CSRFToken": csrf_token,
        },
        success: function(data) {
            if (data.status == "success") {
                if (data.message !="is_default") {
                    save_button[0].style.backgroundColor = "green";
                    save_button[0].style.color = "white";
                    save_button[0].style.disabled = false;
                    document.getElementById(field_name + "-error").style.display = "none";
                } else {
                    document.getElementById(field_name + "-error").style.display = "none";
                    save_button[0].style.backgroundColor = "gray";
                    save_button[0].style.color = "white";
                    save_button[0].style.disabled = true;
                }

            } else {
                field_valid = false;
                document.getElementById(field_name + "-error").innerHTML = data.message;
                document.getElementById(field_name + "-error").style.display = "block";
                save_button[0].style.backgroundColor = "gray";
                save_button[0].style.color = "white";
                save_button[0].style.disabled = true;
            }
        },
        error: function(data) {
            field_valid = false;
            document.getElementById(field_name + "-error").innerHTML = data.message;
        }

    });
    
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
            if (validated_fields.includes(this.name)) {
                yb_validateField(this);
            }
            else{
                save_button[0].style.backgroundColor = "green";
                save_button[0].style.color = "white";

            }
            
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

    for (var i = 0; i < color_buttons.length; i++) {
        color_buttons[i].addEventListener('click', function () {
            let color_input = this.nextElementSibling;
            color_input.click();
        });
    }

    for (var i = 0; i < color_fields.length; i++) {
        color_fields[i].addEventListener('input', function () {
            let color_input = this.previousElementSibling;
            let color = this.value;
            color_input.style.backgroundColor = color;
            change_state = true;
            save_button[0].style.backgroundColor = "green";
            save_button[0].style.color = "white";
        });
    }


    const form_container = document.querySelector('.yb-form-container');

    const observerOptions = {
        root: form_container, // Use the viewport as the container
        rootMargin: '0px 0px -70% 0px',
        threshold: 0 // 50% of the section must be visible
    };

    const sections = document.querySelectorAll('.setting-sub-container');
    const tabs = document.querySelectorAll('.yb-form-tab');
    
    try {
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Remove active class from all tabs
                tabs.forEach(tab => tab.classList.remove('active'));

                // Add active class to the corresponding tab
                const activeTab = document.querySelector(`.message-filter[name="${entry.target.id}"]`);
                if (activeTab) {
                    activeTab.classList.add('active');
                }
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        observer.observe(section);
    });
    } catch(e) {
        console.log(e);
    }


});