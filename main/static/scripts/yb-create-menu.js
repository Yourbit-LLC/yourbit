/* 

    
    Create Menu Script Yourbit
    This script is for the menu for creating various items on 
    yourbit. Users can create bits, messages or comunities using 
    this menu.  


*/

//Global variables
var total_width_message = 0;
var message_contact_object_id = 0;
var stored_message_contacts = [];

var total_width_bit = 0;

$(document).ready(function() {
    let close_button = document.getElementById("cb-panel-close");
    let go_back = document.getElementById("back-create");
    close_button.addEventListener("click", function() {
        yb_resetCreate();
        dropCreateBit(hideCreateBit);
    });
});


function yb_createFormHeader(header_label){
    

    //Create header element
    let form_header = yb_createElement("div", "create-bit-header", "header-create-form");

    //Create back button
    let go_back = yb_createElement("div", "back-create", "back-create");
    go_back.innerHTML = `
        <svg id="back-create" xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="M10 22 0 12 10 2l1.775 1.775L3.55 12l8.225 8.225Z"/></svg>
    `
    form_header.appendChild(go_back);
    go_back.addEventListener("click", function() {
        yb_resetCreate();
    });

    //Create header text
    let header_text = yb_createElement("div", "create-bit-header-text", "create-bit-header-text");
    header_text.innerHTML = header_label;
    form_header.appendChild(header_text);

    return form_header;
}

//Function for fetchning contacts from yourbits user database
function yb_fetchContacts(callback, query) {
    let cookie = document.cookie;
    let csrfToken = getCSRF();
    if (query == "") {
        let container = document.getElementById('cm-contact-result-container');
        container.innerHTML = '';
    } else {
        
        $.ajax( {
            type: 'POST',
            headers: {
                'X-CSRFToken': csrfToken
            },
            url: '/search/',
            data: { 
                
                query: query,
                applied_filter: "user",

            },
            success: function(data){
                let response = data;
                callback(response);
            }
        })
    }
};

//Function for displaying contacts retrieved using fetch contacts
function yb_displayContacts(response) {
    let results = response.user_results;
    let users = Object.keys(results);
    let user = '';
    let x = 0;
    for (let i = 0; i < users.length; i++) {
        console.log(x)
        user = users[x];
        console.log(user)
        user_profile = results[user];
        user_info = user_profile.user;
        console.log(user_info)
        user_name = user_info.first_name + ' ' + user_info.last_name;
        custom = user_profile.custom;
        image = custom.image;

        let container = document.getElementById('cm-contact-result-container');

        let quick_result = yb_createElement('div', `quick-result-${user_info.id}`, 'quick-result');
        quick_result.setAttribute('data-username', user_info.username);
        quick_result.setAttribute('data-id', user_info.id);
        let quick_result_image = yb_createElement('img', `quick-result-image-${user_info.id}`, 'quick-result-image');
        quick_result_image.setAttribute('src', image);
        quick_result.appendChild(quick_result_image);
       
        let quick_result_label = yb_createElement('p', `quick-result-label-${user_info.id}`, 'quick-result-label');
        quick_result_label.innerHTML = user_name;
        quick_result.appendChild(quick_result_label);

        
        container.appendChild(quick_result);

        quick_result.addEventListener('click', function(e) {
            console.log("clicked")
            let this_element = e.currentTarget;
            let this_element_id = this_element.getAttribute('id');
            let this_user_id = this_element.getAttribute('data-id');
            let hidden_field = document.getElementById('hidden-to');

            this_element = document.getElementById(this_element_id);

            let this_text = this_element.querySelector('.quick-result-label');
            this_text = this_text.innerHTML;
            let this_username = this_element.getAttribute('data-username');

            let this_entry = yb_createElement('div', `contact-entry-${message_contact_object_id}`, 'contact-entry');
            this_entry.setAttribute("style", `position: absolute;  color: white; width: fit-content; background-color: black; height: 18px; z-index: 2; top: 13px; left: ${total_width_message + 8}px; border-radius: 10px; height: 25px;`);
            
            let entry_label = yb_createElement('div', `entry-label`, 'entry-label');
            entry_label.setAttribute('style', "display: grid; grid-template-columns: auto 20px; margin: 0; padding: 0; margin-right: 5px; line-height: 0.5;");
            entry_label.innerHTML = `<p style="font-size: 12px; margin-left: 10px; margin-top: 10px;">${this_text}</p>` + '<svg style="position: relative; left:50%; top: 50%; transform: translate(-50%, -51%);" xmlns="http://www.w3.org/2000/svg" height="20" width="20"><path style="fill:red;" d="M6.062 15 5 13.938 8.938 10 5 6.062 6.062 5 10 8.938 13.938 5 15 6.062 11.062 10 15 13.938 13.938 15 10 11.062Z"/></svg>';
            this_entry.appendChild(entry_label);

            to_field = document.getElementById('mobile-to');
            to_field.value = ''; 
            container.innerHTML = '';

            let to_summary = document.getElementById('mobile-to-container');
            hidden_field.value = "";
            hidden_field.value += `${this_username},`;
            to_summary.appendChild(this_entry);


            let style = this_entry.getBoundingClientRect();
            let width = style.width;
            total_width_message += width;

            to_field.style.textIndent = `${total_width_message + 8}px`;

            
            console.log(width)
            console.log(`The width of the element's content is ${width}px`);

            
            to_field.setAttribute('placeholder', '');
            to_field.focus();

            message_contact_object_id += 1;
        });
        x = x + 1;
        console.log(x)
    }


}


//Fuction for clearing the form from the create menu and going back to create options
function yb_resetCreate(){
    $("#create-container").fadeOut();
    $("#sub-function-script").attr("src", "");
    $("#create-button-container").remove();
    $("#create-options").fadeIn();
    $("#yb-title-cb").html("");
    let container = document.getElementById("create-bit-mobile");
    container.setAttribute("data-state", "0");
}


//Generates the type selector element based on the create option selected
function yb_buildTypeSelector(type) {
    let bit_type_select = yb_createElement("div", "create-bit-type-mobile", "create-bit-type");
    
    let bit_type_text = yb_createElement("div", "text-type-button", "type-button");
    bit_type_text.setAttribute("name", "chat");
    bit_type_text.innerHTML = `<svg class="space-button-image" xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="M.95 17.8V1.85q0-.5.325-.825Q1.6.7 2.1.7h14.25q.5 0 .825.325.325.325.325.825V12q0 .5-.325.825-.325.325-.825.325H5.6Zm5.8.9q-.5 0-.825-.325-.325-.325-.325-.825v-2.4h13.9V5.4h2.4q.5 0 .825.325.325.325.325.825v16.8L18.4 18.7Zm8.1-15.35H3.6v8.05l.9-.9h10.35Zm-11.25 0v8.05Z"/></svg>`
    
    //If type is equal to chat set the button to active
    if (type === "chat") {
        bit_type_text.classList.add("active");
    }

    
    bit_type_text.addEventListener("click", function() {
        changeBitForm("chat");
    });
    

    bit_type_select.appendChild(bit_type_text);

    let bit_type_video = yb_createElement("div", "video-type-button", "type-button");
    bit_type_video.setAttribute("name", "video");
    bit_type_video.innerHTML = `<svg class="space-button-image" xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="m9.15 17.15 8-5.15-8-5.15ZM12 22.8q-2.25 0-4.213-.85-1.962-.85-3.424-2.312Q2.9 18.175 2.05 16.212 1.2 14.25 1.2 12t.85-4.225Q2.9 5.8 4.363 4.338q1.462-1.463 3.424-2.301Q9.75 1.2 12 1.2t4.225.837q1.975.838 3.438 2.301 1.462 1.462 2.299 3.437Q22.8 9.75 22.8 12q0 2.25-.838 4.212-.837 1.963-2.299 3.426Q18.2 21.1 16.225 21.95q-1.975.85-4.225.85Zm0-2.65q3.425 0 5.788-2.363Q20.15 15.425 20.15 12t-2.362-5.788Q15.425 3.85 12 3.85q-3.425 0-5.787 2.362Q3.85 8.575 3.85 12q0 3.425 2.363 5.787Q8.575 20.15 12 20.15ZM12 12Z"/></svg>`
    
    //If the type is equal to video set the button to active
    if (type === "video") {
        bit_type_video.classList.add("active");
    }

    bit_type_select.appendChild(bit_type_video);

    bit_type_video.addEventListener("click", function() {
        changeBitForm("video");
    });

    let bit_type_photo = yb_createElement("div", "photo-type-button", "type-button");
    bit_type_photo.setAttribute("name", "photo");
    bit_type_photo.innerHTML = `<svg class="space-button-image" xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="M12 17.75q1.925 0 3.263-1.337Q16.6 15.075 16.6 13.15q0-1.925-1.337-3.263Q13.925 8.55 12 8.55q-1.925 0-3.262 1.337Q7.4 11.225 7.4 13.15q0 1.925 1.338 3.263Q10.075 17.75 12 17.75Zm0-2.65q-.8 0-1.375-.575t-.575-1.375q0-.8.575-1.375T12 11.2q.8 0 1.375.575t.575 1.375q0 .8-.575 1.375T12 15.1Zm-8.15 6.725q-1.1 0-1.875-.775-.775-.775-.775-1.875V7.125q0-1.1.775-1.875.775-.775 1.875-.775h3.025l2.05-2.25h6.15l2.05 2.25h3.025q1.1 0 1.875.775.775.775.775 1.875v12.05q0 1.1-.775 1.875-.775.775-1.875.775Zm16.3-2.65V7.125h-4.2l-2.05-2.25h-3.8l-2.05 2.25h-4.2v12.05ZM12 13.15Z"/></svg>`

    //If the type is equal to photo set the button to active
    if (type === "photo") {
        bit_type_photo.classList.add("active");
    }

    bit_type_select.appendChild(bit_type_photo);

    bit_type_photo.addEventListener("click", function(){
        changeBitForm("photo");
    });

    return bit_type_select;
}

//Generates the submission bar and assigns a value to the publish button based on option
function yb_buildSubmissionBar(form, type=null) {
    let button_container = yb_createElement("div", "create-button-container", "slide-up-button-container");

    let name;
    let label;
    console.log(form);
    if (form === "bit-form") {
        name = "publish_bit";
        let bit_type_select = yb_buildTypeSelector(type);
        button_container.appendChild(bit_type_select);
        label = "Publish";
    } else if (form === "message-form") {
        name = "send_message";
        label = "Send";

    } else if (form === "community-form") {
        name = "create_community";
        label = "Create";

    } else if (form === "cluster-form") {
        name = "create_cluster";
        label = "Create";
    }

    let publish_button = yb_createButton(name, "mobile-publish-bit", "mobile-publish-bit", label);
    publish_button.setAttribute("type", "button");
    button_container.appendChild(publish_button);

    publish_button.addEventListener("click", function(e) {
        let current_element = e.target;
        this.disabled = true;

        this.style.width = "33.25px";
        this.style.height = "33.25px";
        this.style.borderRadius = "50%";
        this.innerHTML = `<div class="loading-circle cbl"></div>`;
        this.style.backgroundColor = "transparent";
        yb_handleCreateSubmit(current_element);
    });

    return button_container;

}

function yb_handleContactSuggestion(this_element) {
    //Set query to this value
    let query = this_element.value;
    let to_field = document.getElementById("mobile-to");
    let result_container = document.getElementById("cm-contact-result-container");
    //Clear previous results from container
    result_container.innerHTML = ``;

    //Fetch contacts by updated query
    yb_fetchContacts(yb_displayContacts, query);
    
    let cursorPosition = this_element.selectionStart;
    console.log(cursorPosition);

    //If backspace and no pending value clear recipient
    if (e.keyCode === 8) {
        //Check Cursor Position
        if (cursorPosition === 0){
            if (message_contact_object_id > 0){
                let contact_object = document.getElementById(`contact-entry-${message_contact_object_id - 1}`);
                
                let style = contact_object.getBoundingClientRect();
                let width = style.width;
                total_width_message -= width;

                message_contact_object_id -= 1;
                
                contact_object.remove();

                to_field.style.textIndent = `${total_width_message + 8}px`;
                if (message_contact_object_id === 0){
                    to_field.setAttribute("placeholder", "Search Users");
                }

            }
        }
        console.log('Backspace key pressed');
    }
}

function yb_handleAddRecipient(){
    let to_field = document.getElementById("mobile-to");
    let add_recipient_button = document.getElementById("button-add-recipient");
    to_field.style.display = "block";
    to_field.focus();
    to_field.setAttribute("placeholder", "Search Users");
    add_recipient_button.style.display = "none";

}

function yb_toggleScope(this_element){
    let action = this_element.getAttribute("name");
    let scope_field = document.getElementById("bit-scope-hidden-field");

    if (action === "toggle_private" && scope_field.value != "private"){
        this_element.classList.add("active");
        document.getElementById("bit-public").classList.remove("active");
        scope_field.value = "private";
    } else if (action === "toggle_public" && scope_field.value != "public"){
        this_element.classList.add("active");
        document.getElementById("bit-private").classList.remove("active");
        scope_field.value = "public";
    }

}


function yb_scheduleMenu(this_element) {
    let menu_element = yb_createElement("div", "schedule-menu", "yb-options-up");
    menu_element.setAttribute("style", "width: 90%; margin: 0 auto;");

    let parent_element = this_element.parentElement;

    let menu_header = yb_createElement("p", "schedule-menu-header", "yb-options-header");
    menu_header.innerHTML = "Schedule";
    menu_element.appendChild(menu_header);
    
    let form_fields = yb_createElement("div", "schedule-form-fields", "yb-options-form-fields");
    

    let date_field = yb_createInput("text", "yb-single-line-input", "schedule-date", "Publish Date");
    date_field.setAttribute("style", "grid-column: 1; background-color: rgba(255,255,255,0.5");
    date_field.addEventListener("click", function(){
        this.blur();
        this.type = "date";
        setTimeout(this.focus(), 100);
    });
    form_fields.appendChild(date_field);


    let time_field = yb_createInput("text", "yb-single-line-input", "schedule-time", "Time");
    time_field.setAttribute("style", "grid-column: 2; background-color: rgba(255,255,255,0.5");
    time_field.addEventListener("click", function(){
        this.blur();
        this.type = "time";
        setTimeout(this.focus(), 100);
    });
    form_fields.appendChild(time_field);
    
    let submission_button = yb_createButton("set_schedule", "yb-submit-button", "yb-form-button", "Schedule");
    submission_button.setAttribute("type", "button");
    submission_button.setAttribute("style", "margin-top: 10px; text-align: center;");
    
    
    menu_element.appendChild(form_fields);
    menu_element.appendChild(submission_button);
    parent_element.appendChild(menu_element);
}

function yb_handleBitOption(this_element){
    let this_button = this_element.getAttribute("name");
    if (this_button === "schedule") {
        yb_scheduleMenu(this_element);
    } else if (this_button === "enhance") {
        yb_enhanceMenu(this_element);
    } else if (this_button === "monetize") {
        yb_monetizeMenu(this_element);
    } else if (this_button === "evaporate") {
        yb_evaporateMenu(this_element);
    }
}


function yb_createBitOptionsForm(option_field){
    //define bit_options
    let bit_options = yb_createElement("div", "create-bit-options", "create-bit-options");

    //Create scope options elements
    let scope_options = yb_createElement("div", "scope-options", "scope-options");
    let default_public = yb_getSessionValues("default-public");
    let private_toggle_class;
    let public_toggle_class;

    //Check default post scope from provided context in session values
    if (default_public === "true"){
        private_toggle_class = "half-toggle-left";
        public_toggle_class = "half-toggle-right active";
        option_field.value = "public";
    } else {
        private_toggle_class = "half-toggle-left active";
        public_toggle_class = "half-toggle-right";
        option_field.value = "private";
    }

    //Define scope options buttons
    let private_button = yb_createButton("toggle_private", "bit-private", private_toggle_class, "Private");
    private_button.setAttribute("type","button");
    private_button.addEventListener("click", function() {
        yb_toggleScope(this);
    });

    let public_button = yb_createButton("toggle_public", "bit-public", public_toggle_class, "Public");
    public_button.setAttribute("type","button");
    public_button.addEventListener("click", function() {
        yb_toggleScope(this);
    });
    
    //Append scope options to scope option element
    scope_options.appendChild(private_button);
    scope_options.appendChild(public_button);
    scope_options.style.gridColumn = "1";

    bit_options.appendChild(scope_options);

    let schedule_button = yb_createButton("schedule", "bit-schedule", "bit-options-button", `<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M360-300q-42 0-71-29t-29-71q0-42 29-71t71-29q42 0 71 29t29 71q0 42-29 71t-71 29ZM200-80q-33 0-56.5-23.5T120-160v-560q0-33 23.5-56.5T200-800h40v-80h80v80h320v-80h80v80h40q33 0 56.5 23.5T840-720v560q0 33-23.5 56.5T760-80H200Zm0-80h560v-400H200v400Zm0-480h560v-80H200v80Zm0 0v-80 80Z"/>`);
    schedule_button.setAttribute("type","button");
    schedule_button.style.gridColumn = "2";
    schedule_button.addEventListener("click", function() {
        console.log("clicked schedule");
        yb_handleBitOption(this);
    });
    bit_options.appendChild(schedule_button);

    let auto_delete_button = yb_createButton("evaporate", "yb-bit-evaporate", "bit-options-button", `<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M280-720v520-520Zm170 600H280q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v172q-17-5-39.5-8.5T680-560v-160H280v520h132q6 21 16 41.5t22 38.5Zm-90-160h40q0-63 20-103.5l20-40.5v-216h-80v360Zm160-230q17-11 38.5-22t41.5-16v-92h-80v130ZM680-80q-83 0-141.5-58.5T480-280q0-83 58.5-141.5T680-480q83 0 141.5 58.5T880-280q0 83-58.5 141.5T680-80Zm66-106 28-28-74-74v-112h-40v128l86 86Z"/></svg>`);
    auto_delete_button.setAttribute("type","button");
    auto_delete_button.style.gridColumn = "3";
    auto_delete_button.addEventListener("click", function() {
        console.log("clicked auto delete");
        yb_handleBitOption(this);
    });
    bit_options.appendChild(auto_delete_button);
    
    let monetization_option_button = yb_createButton("monetize", "yb-bit-monetize", "bit-options-button", `<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M444-200h70v-50q50-9 86-39t36-89q0-42-24-77t-96-61q-60-20-83-35t-23-41q0-26 18.5-41t53.5-15q32 0 50 15.5t26 38.5l64-26q-11-35-40.5-61T516-710v-50h-70v50q-50 11-78 44t-28 74q0 47 27.5 76t86.5 50q63 23 87.5 41t24.5 47q0 33-23.5 48.5T486-314q-33 0-58.5-20.5T390-396l-66 26q14 48 43.5 77.5T444-252v52Zm36 120q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/></svg>`);
    monetization_option_button.setAttribute("type","button");
    monetization_option_button.style.gridColumn = "4";
    monetization_option_button.addEventListener("click", function() {
        console.log("clicked monetize");
        yb_handleBitOption(this);
    });
    bit_options.appendChild(monetization_option_button);
    
    //Attach script to form
    let enhance_button = yb_createButton("enhance", "yb-bit-enhance", "bit-options-button", '<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 96 960 960" width="24"><path d="m800 376-38-82-82-38 82-38 38-82 38 82 82 38-82 38-38 82Zm-460 0-38-82-82-38 82-38 38-82 38 82 82 38-82 38-38 82Zm460 460-38-82-82-38 82-38 38-82 38 82 82 38-82 38-38 82ZM204 964 92 852q-12-12-12-29t12-29l446-446q12-12 29-12t29 12l112 112q12 12 12 29t-12 29L262 964q-12 12-29 12t-29-12Zm30-84 286-288-56-56-288 286 58 58Z"/></svg>');
    enhance_button.setAttribute("type", "button");
    enhance_button.style.gridColumn = "5";
    
    
    //Append enhance button to bit options
    bit_options.appendChild(enhance_button);

    //Add event listener to enhance button
    enhance_button.onclick = function() {
        console.log("clicked enhance");
        yb_handleBitOption(this);
        
        // this_form.appendChild(context_menu);
        // let type = 'friendly';
        // let length = 'up to 3 sentences';
        // let text = $('#mobile-body').val();
        // yb_enhanceText(length, type, text);
        
    }

    return bit_options;

}

//Function for dynamically generating form for creating a charbit
function yb_chatBitForm(form, type_field, option_field, script_source, edit_mode = false) {
        let sub_function_script = document.getElementById("sub-function-script")
        let this_source = document.getElementById("create-bit-source").value;
        let container = document.getElementById("create-bit-mobile");
        container.setAttribute("data-state", "1");
        sub_function_script.src = this_source;
        
        let title_entry = document.getElementById("yb-title-cb");
        

        form.innerHTML = '';

        //hide options
        $('#create-options').fadeOut();
        
        //Show Form
        $('#create-container').fadeIn();

        let form_header = yb_createFormHeader("Create Chat Bit");

        title_entry.appendChild(form_header);

        let create_inputs = yb_createElement("div", "mobile-create-inputs", "create-inputs");
        create_inputs.setAttribute("style", "position: relative; margin-left: auto; margin-right: auto;");
        
        let hidden_to_field = yb_createInput("hidden", "hidden-text", "hidden-to",  "none");
        create_inputs.appendChild(hidden_to_field);
        
        //Set hidden form field to describe bit type on submission
        type_field.value = 'chat';
        option_field.value='bit';

        //Create form fields to correspond with creation
        let recipient_button = yb_createButton("add_recipient", "button-add-recipient", "button-mini");
        recipient_button.setAttribute("type", "button");
        recipient_button.innerHTML = "<p style='font-size: 18px; position: relative; margin: auto;'><b>+</b></p><p style='position: relative; margin: auto;'>Add Recipient</p>";
        create_inputs.appendChild(recipient_button);

        recipient_button.addEventListener("click", function() {
            yb_handleAddRecipient();
        });


    
        let to_field_container = yb_createElement("div", "mobile-to-container", "smart-input-container");
        to_field_container.setAttribute("style", "position: relative; margin-left: auto; margin-right: auto; width: 100%; margin-top: 10px;");
        
    
        let to_field = yb_createInput("text", "yb-single-line-input", "mobile-to", "Search Users");
        to_field.setAttribute("style", "z-index: 1; display:none;");
        to_field_container.appendChild(to_field);
        let result_container = yb_createElement("div", "cm-contact-result-container", "yb-list-widget");
        result_container.setAttribute("style", "background-color:rgba(0,0,0,0.5); color:white; height: auto; overflow-y: scroll;max-height: 200px; width: 95%; margin: 0 auto; border-radius: 10px; margin-top: 10px;");
        
        
        let title_field = yb_createInput("text","yb-single-line-input", "mobile-title", "Title (optional)");
        let body_field = yb_createInput("textarea", "yb-single-line-input", "mobile-body", "Body"); 

        //Append each form field to the form
        
        create_inputs.appendChild(to_field_container);
        create_inputs.appendChild(result_container);
        create_inputs.appendChild(title_field);
        create_inputs.appendChild(body_field);

        //Create bit options elements
        let options_form = yb_createBitOptionsForm(option_field);
        //Append scope options to form
        create_inputs.appendChild(options_form);

        form.appendChild(create_inputs);


        let submission_bar = yb_buildSubmissionBar("bit-form", "chat");
        form.appendChild(submission_bar);

        to_field.addEventListener("keyup", function(event){
            let this_element = event.currentTarget;
            yb_handleContactSuggestion(this_element);
    
        });
}

//Function for dynamically generating form for creating a video bit
function yb_videoBitForm(form, type_field, option_field, script_source, edit_mode = false) {
    let sub_function_script = document.getElementById("sub-function-script")
    let this_source = document.getElementById("create-bit-source").value;
    sub_function_script.src = this_source;
    let title_entry = document.getElementById("yb-title-cb");
    let container = document.getElementById("create-bit-mobile");
    container.setAttribute("data-state", "1");

    form.innerHTML = '';

    //hide options
    $('#create-options').fadeOut();
    
    //Show Form
    $('#create-container').fadeIn();

    let form_header = yb_createFormHeader("Create Video Bit");

    title_entry.appendChild(form_header);

    let create_inputs = yb_createElement("div", "mobile-create-inputs", "create-inputs");
    create_inputs.setAttribute("style", "position: relative; margin-left: auto; margin-right: auto;")

    let hidden_to_field = yb_createInput("hidden", "hidden-text", "hidden-to",  "none");
    create_inputs.appendChild(hidden_to_field);
    
    //Set hidden form field to describe bit type on submission
    type_field.value = 'video';
    option_field.value='bit';


    //Create scope options elements
    let scope_options = yb_createElement("div", "scope-options", "scope-options");
    let default_public = yb_getSessionValues("default-public");
    let private_toggle_class;
    let public_toggle_class;

    
    //Check default post scope from provided context in session values
    if (default_public === "true"){
        private_toggle_class = "half-toggle-right";
        public_toggle_class = "half-toggle-left active";
        option_field.value = "public";
    } else {
        private_toggle_class = "half-toggle-right active";
        public_toggle_class = "half-toggle-left";
        option_field.value = "private";
    }
    //Define scope options buttons
    let private_button = yb_createButton("toggle_private", "bit-private", "half-toggle-left", "Private");
    private_button.addEventListener("click", function() {
        yb_toggleScope(this);
    });

    let public_button = yb_createButton("toggle_public", "bit-public", "half-toggle-right", "Public");
    public_button.addEventListener("click", function() {
        yb_toggleScope(this);
    });
    
    //Append scope options to scope option element
    scope_options.appendChild(private_button);
    scope_options.appendChild(public_button);

    //Append scope options to form
    create_inputs.appendChild(scope_options);

    
    //Create form fields to correspond with creation
    let recipient_button = yb_createButton("add_recipient", "button-add-recipient", "button-mini");
    recipient_button.setAttribute("type", "button");
    recipient_button.innerHTML = "<p style='font-size: 18px; position: relative; margin: auto;'><b>+</b></p><p style='position: relative; margin: auto;'>Add Recipient</p>";
    create_inputs.appendChild(recipient_button);

    recipient_button.addEventListener("click", function() {
        yb_handleAddRecipient();
    });


    
    let to_field_container = yb_createElement("div", "mobile-to-container", "smart-input-container");
    to_field_container.setAttribute("style", "position: relative; margin-left: auto; margin-right: auto; width: 100%; margin-top: 10px;");
    

    let to_field = yb_createInput("text", "yb-single-line-input", "mobile-to", "Search Users");
    to_field.setAttribute("style", "z-index: 1; display:none;");
    to_field_container.appendChild(to_field);
    
    let result_container = yb_createElement("div", "cm-contact-result-container", "yb-list-widget");
    result_container.setAttribute("style", "background-color:rgba(0,0,0,0.5); color:white; height: auto; overflow-y: scroll;max-height: 200px; width: 95%; margin: 0 auto; border-radius: 10px; margin-top: 10px;");
    
    let title_field = yb_createInput("input", "yb-single-line-input", "mobile-title",  "Title");
    let body_field = yb_createInput("textarea","yb-text-area", "mobile-body");
    let meta_tags = yb_createInput("input", "yb-single-line-input", "mobile-tags", "Meta Tags (separate by comma)");
    let upload_field = yb_createInput("file", "yb-file-field", "mobile-file-field", "none");
    //restrict upload field file types
    upload_field.setAttribute("accept", "video/*");

    

    //Change form fields to correspond with creation
    
    create_inputs.appendChild(to_field_container);
    create_inputs.appendChild(result_container);
    create_inputs.appendChild(title_field);
    create_inputs.appendChild(body_field);
    create_inputs.appendChild(upload_field)
    create_inputs.appendChild(meta_tags);

    form.appendChild(create_inputs);
    
    //Append type buttons
    let create_bit = document.getElementById("create-bit-mobile");
    let submission_bar = yb_buildSubmissionBar("bit-form", "video");
    create_bit.appendChild(submission_bar);

    to_field.addEventListener("keyup", function(event){
        let this_element = event.currentTarget;
        yb_handleContactSuggestion(this_element);

    });
}

//Function for dynamically generating form for creating a photo bit
function yb_photoBitForm(form, type_field, option_field, script_source, edit_mode = false) {
    let sub_function_script = document.getElementById("sub-function-script")
    let this_source = document.getElementById("create-bit-source").value;
    sub_function_script.src = this_source;
    let title_entry = document.getElementById("yb-title-cb");
    let container = document.getElementById("create-bit-mobile");
    container.setAttribute("data-state", "1");
    form.innerHTML = '';

    //hide options
    $('#create-options').fadeOut();
    
    //Show Form
    $('#create-container').fadeIn();

    let form_header = yb_createFormHeader("Create Photo Bit");

    title_entry.appendChild(form_header);

    let create_inputs = yb_createElement("div", "mobile-create-inputs", "create-inputs");
    create_inputs.setAttribute("style", "position: relative; margin-left: auto; margin-right: auto;")

    let hidden_to_field = yb_createInput("hidden", "hidden-text", "hidden-to",  "none");
    create_inputs.appendChild(hidden_to_field);    
    
    //Set hidden form field to describe bit type on submission
    type_field.value = 'photo';
    option_field.value='bit';

    //Create scope options elements
    let scope_options = yb_createElement("div", "scope-options", "scope-options");
    let default_public = yb_getSessionValues("default-public");
    let private_toggle_class;
    let public_toggle_class;


    //Check default post scope from provided context in session values
    if (default_public === "true"){
        private_toggle_class = "half-toggle-right";
        public_toggle_class = "half-toggle-left active";
        option_field.value = "public";
    } else {
        private_toggle_class = "half-toggle-right active";
        public_toggle_class = "half-toggle-left";
        option_field.value = "private";
    }
    //Define scope options buttons
    let private_button = yb_createButton("toggle_private", "bit-private", "half-toggle-left", "Private");
    private_button.addEventListener("click", function() {
        yb_toggleScope(this);
    });

    let public_button = yb_createButton("toggle_public", "bit-public", "half-toggle-right", "Public");
    public_button.addEventListener("click", function() {
        yb_toggleScope(this);
    });
    
    //Append scope options to scope option element
    scope_options.appendChild(private_button);
    scope_options.appendChild(public_button);

    //Append scope options to form
    create_inputs.appendChild(scope_options);


    //Create form fields to correspond with creation
    let recipient_button = yb_createButton("add_recipient", "button-add-recipient", "button-mini");
    recipient_button.setAttribute("type", "button");
    recipient_button.innerHTML = "<p style='font-size: 18px; position: relative; margin: auto;'><b>+</b></p><p style='position: relative; margin: auto;'>Add Recipient</p>";
    create_inputs.appendChild(recipient_button);

    recipient_button.addEventListener("click", function() {
        yb_handleAddRecipient();
    });
    
    let to_field_container = yb_createElement("div", "mobile-to-container", "smart-input-container");
    to_field_container.setAttribute("style", "position: relative; margin-left: auto; margin-right: auto; width: 100%; margin-top: 10px;");
    

    let to_field = yb_createInput("text", "yb-single-line-input", "mobile-to", "Search Users");
    to_field.setAttribute("style", "z-index: 1; display:none;");
    to_field_container.appendChild(to_field);
    
    let result_container = yb_createElement("div", "cm-contact-result-container", "yb-list-widget");
    result_container.setAttribute("style", "background-color:rgba(0,0,0,0.5); color:white; height: auto; overflow-y: scroll;max-height: 200px; width: 95%; margin: 0 auto; border-radius: 10px; margin-top: 10px;");
    
    let title_field = yb_createInput("text", "yb-single-line-input", "mobile-title", "Caption");
    let body_field = yb_createInput("textarea", "yb-text-area", "mobile-body", "Description");
    let upload_field = yb_createInput("file", "yb-file-field", "mobile-file-field", "none")
    //restrict upload field to images
    upload_field.setAttribute("accept", "image/*");
    
    
    //Change form fields to correspond with creation
    create_inputs.appendChild(to_field_container);
    create_inputs.appendChild(result_container);
    create_inputs.appendChild(title_field);
    create_inputs.appendChild(body_field);
    create_inputs.appendChild(upload_field);

    form.appendChild(create_inputs);
    
    //Append type buttons
    let submission_bar = yb_buildSubmissionBar("bit-form", "photo");
    form.appendChild(submission_bar);

    to_field.addEventListener("keyup", function(event){
        let this_element = event.currentTarget;
        yb_handleContactSuggestion(this_element);

    });

}


/* Type button refers to the content type buttons in create bit */
$('.type-button').click(function() {
    let button_name = $(this).attr('name');
    console.log(button_name);
    changeBitForm(button_name);
});


function yb_showMessageForm(user=null){
    let sub_function_script = document.getElementById("sub-function-script")
    let form = document.getElementById("create-container");
    let option_field = document.getElementById("create-option-hidden-field");
    let title_entry = document.getElementById("yb-title-cb");
    let container = document.getElementById("create-bit-mobile");
    container.setAttribute("data-state", "1");
    form.innerHTML = '';

    //hide options
    $('#create-options').fadeOut();
    
    //Show Form
    $('#create-container').fadeIn();

    let form_header = yb_createFormHeader("Create New Message");

    title_entry.appendChild(form_header);

    let create_inputs = yb_createElement("div", "mobile-create-inputs", "create-inputs");
    create_inputs.setAttribute("style", "position: relative; margin-left: auto; margin-right: auto;");
    form.appendChild(create_inputs);

    option_field.value = 'message';

    let hidden_to_field = yb_createInput("hidden", "hidden-text", "hidden-to",  "none");
    create_inputs.appendChild(hidden_to_field);

    
    let to_field_container = yb_createElement("div", "mobile-to-container", "smart-input-container");
    to_field_container.setAttribute("style", "position: relative; margin-left: auto; margin-right: auto; width: 100%; margin-top: 10px;");
    

    let to_field = yb_createInput("text", "yb-single-line-input", "mobile-to", "Search Users");
    to_field.setAttribute("style", "z-index: 1;");
    to_field_container.appendChild(to_field);
    let body_field = yb_createInput("textarea", "yb-text-area", "mobile-body", "Message")
    let result_container = yb_createElement("div", "cm-contact-result-container", "yb-list-widget");
    result_container.setAttribute("style", "background-color:rgba(0,0,0,0.5); color:white; height: auto; overflow-y: scroll;max-height: 200px; width: 95%; margin: 0 auto; border-radius: 10px; margin-top: 10px;");
    
    to_field.addEventListener("keyup", function(e){
        //Set query to this value
        let query = this.value;
        //Clear previous results from container
        result_container.innerHTML = ``;

        //Fetch contacts by updated query
        yb_fetchContacts(yb_displayContacts, query);
        
        let cursorPosition = this.selectionStart;
        console.log(cursorPosition);

        //If backspace and no pending value clear recipient
        if (e.keyCode === 8) {
            //Check Cursor Position
            if (cursorPosition === 0){
                if (message_contact_object_id > 0){
                    let contact_object = document.getElementById(`contact-entry-${message_contact_object_id - 1}`);
                    
                    let style = contact_object.getBoundingClientRect();
                    let width = style.width;
                    total_width_message -= width;

                    message_contact_object_id -= 1;
                    
                    contact_object.remove();

                    to_field.style.textIndent = `${total_width_message + 8}px`;
                    if (message_contact_object_id === 0){
                        to_field.setAttribute("placeholder", "Search Users");
                    }

                }
            }
            console.log('Backspace key pressed');
        }


    });

    create_inputs.appendChild(to_field_container);
    create_inputs.appendChild(result_container);
    create_inputs.appendChild(body_field);

    let submission_bar = yb_buildSubmissionBar("message-form");
    form.appendChild(submission_bar);

    let this_source = document.getElementById("send-message-source").value;
    sub_function_script.src = this_source;

}

function yb_showClusterForm(){
    let sub_function_script = document.getElementById("sub-function-script")
    let form = document.getElementById("create-container");
    let option_field = document.getElementById("create-option-hidden-field");
    let title_entry = document.getElementById("yb-title-cb");
    let container = document.getElementById("create-bit-mobile");
    container.setAttribute("data-state", "1");
    form.innerHTML = '';

    //hide options
    $('#create-options').fadeOut();
    
    //Show Form
    $('#create-container').fadeIn();

    let form_header = yb_createFormHeader("Create a Cluster");

    title_entry.appendChild(form_header);

    let create_inputs = yb_createElement("div", "mobile-create-inputs", "create-inputs");
    
    //Description field
    let description = yb_createElement("p", "mobile-cluster-description", "yb-card-intro");
    description.innerHTML = "A Cluster is a folder containing your saved Bits.<br><br> You can access the clusters you have created by navigating to your inventory from the profile menu."
    
    //name field
    let name_field = yb_createInput("text", "yb-single-line-input", "mobile-cluster-name",  "Cluster Name");
    
    //Type Field
    let type_field = yb_createElement("select", "select-type-cb", "yb-single-line-input");
    type_field.setAttribute("value","all");
    //Type Opptions
    let option1 = yb_createElement("option", "option-type-cb-all", "yb-option");
    option1.setAttribute("value", "all");
    option1.innerHTML = "All Types";
    let option2 = yb_createElement("option", "option-type-cb-chat", "yb-option");
    option2.setAttribute("value", "chat");
    option2.innerHTML = "ChatBits";
    let option3 = yb_createElement("option", "option-type-cb-photo", "yb-option");
    option3.setAttribute("value", "photo");
    option3.innerHTML = "PhotoBits";
    let option4 = yb_createElement("option", "option-type-cb-video", "yb-option");
    option4.setAttribute("value", "video");
    option4.innerHTML = "VideoBits";



    option_field.value = 'cluster';
    
    //change form fields to correspond with creation
    create_inputs.appendChild(description);
    create_inputs.appendChild(name_field);
    //append all options to select field
    type_field.appendChild(option1);
    type_field.appendChild(option2);
    type_field.appendChild(option3);
    type_field.appendChild(option4);

    //Append select field to create inputs
    create_inputs.appendChild(type_field);
    type_field.value = 'all';


    form.appendChild(create_inputs);

    let submission_bar = yb_buildSubmissionBar("cluster-form");
    form.appendChild(submission_bar);

}

function yb_showCommunityForm(){
    let sub_function_script = document.getElementById("sub-function-script")
    let form = document.getElementById("create-container");
    let option_field = document.getElementById("create-option-hidden-field");
    let title_entry = document.getElementById("yb-title-cb");
    let container = document.getElementById("create-bit-mobile");
    container.setAttribute("data-state", "1");
    form.innerHTML = '';

    //hide options
    $('#create-options').fadeOut();
    
    //Show Form
    $('#create-container').fadeIn();

    let form_header = yb_createFormHeader("Create a Community");

    title_entry.appendChild(form_header);
    let create_inputs = yb_createElement("div", "mobile-create-inputs", "create-inputs");
    create_inputs.setAttribute("style", "position: relative; margin-left: auto; margin-right: auto;");
    form.appendChild(create_inputs);

    let name_field = yb_createInput("text", "yb-single-line-input", "mobile-community-name",  "Name");
    let handle_field = yb_createInput("text", "yb-single-line-input", "mobile-community-handle",  "Handle");


    option_field.value = 'community';
    
    //change form fields to correspond with creation

    create_inputs.appendChild(name_field);
    create_inputs.appendChild(handle_field);

    form.appendChild(create_inputs);
    
    let submission_bar = yb_buildSubmissionBar("community-form");
    form.appendChild(submission_bar);

    
}



/*

                Create Bit

*/

const createPost = document.getElementById("create-post");
const writePost = document.getElementById("write-post");

    //Animation In

function show_create_post() {
    $("#create-post").fadeIn('slow');
}

    //Animation Out

function hide_create_post() {
    $("#create-post").fadeOut('slow');
}

/*
    ------- Function Change Mobile Bit form ----------
*/
function yb_cleanForms(callback, form, type_field, option_field, script_source){
    $("#sub-function-script").attr("src", "");
    $("#create-button-container").remove();
    $("#create-bit-header").remove();
    callback(form, type_field, option_field, script_source);
}


function changeBitForm(button_name) {

    /* Set form equal to mobile-bit-inputs container */
    let form = document.getElementById('mobile-create-inputs');
    let type_field = document.getElementById('bit-type-hidden-field')
    let option_field = document.getElementById('create-option-hidden-field');
    let script_source = document.getElementById('create-script');
    let header = document.getElementById('create-bit-header');
    
    if (button_name === 'chat') {
        type_field.value = 'chat';
        yb_cleanForms(yb_chatBitForm, form, type_field, option_field, script_source);
        
        
    }
    
    if (button_name === 'video') {
        type_field.value = 'video';
        yb_cleanForms(yb_videoBitForm, form, type_field, option_field, script_source);
        
        
    }

    if (button_name === 'photo') {
        type_field.value = 'photo';
        yb_cleanForms(yb_photoBitForm, form, type_field, option_field, script_source);
        
        
    }
};

function yb_handleSubmit(action) {
    
    
    if (action === "publish_bit") {
        
        let type = document.getElementById('bit-type-hidden-field').value;
        yb_collectBitData(type, yb_submitBit);

    } else if (action === "edit") {
        
        yb_collectBitData(type, yb_editBit);

    } else if (action === "send_message") {
        
        yb_createMessage();

    } else if (action === "create_cluster") {

        yb_collectSubmitClusterData();
    }

    

}

function yb_collectSubmitClusterData() {
    
    let name_field = document.getElementById('mobile-cluster-name');
    let type_field = document.getElementById('yb-select-cluster-type');
    let type = type_field.value;
    let name = name_field.value;
    
    name_field.value = "";
    
    console.log(name);
    yb_createCluster(name, type);

}

function yb_createMessage() {
    
    let body = document.getElementById("mobile-body").value;
    let to = document.getElementById("hidden-to").value;
    
    $.ajax({
        url: `/messages/api/check_existing/${to}/`,
        type: "GET",
        success: function(data){
            let is_conversation = data.is_conversation;


            dropCreateBit(hideCreateBit);

            if (is_conversation) {                
                let this_id = data.conversation_id;
                let that_user = data.conversation_recipient;
                console.log(that_user)
                console.log(this_id)
                messages_conversation_url(this_id, that_user);
                yb_sendMessage(body, this_id, that_user);

            } else {
                console.log(to)
                yb_newConversation(to, body);
                
            }
        }
    })

}

function yb_publishBit(this_element){

}

function yb_handleCreateSubmit(this_element){
    let action = this_element.getAttribute("name");
    
    let private_toggle = document.getElementsByName("toggle-private")[1];
    console.log(private_toggle)
    let public_toggle = document.getElementsByName("toggle-public");
    console.log(public_toggle)
    $(this_element).css("pointer-events", "none");
    yb_handleSubmit(action);

}

$("#mobile-title").click(function(){
    console.log("clicked")
})

//Collect information from form fields
function yb_collectBitData(type, callback) {
    //Create form data for new bit
    let new_bit = {};
    var is_valid = true; /*Is valid verifies if forms are complete, initial value = true */ 
    console.log("gather_bit_step1")

    //Compile information from fields to append to new_bit
    let title_field = document.getElementById('mobile-title');
    let body_field = document.getElementById("mobile-body");
    let scope = document.getElementById("bit-scope-hidden-field").value;
    let to_summary = document.getElementById("hidden-to").value;
    
    //Bit configuration options
    new_bit.type = type;
    new_bit.scope = scope;
    new_bit.to_summary = to_summary;

    /*Check bit type in order to properly validate form and transmit data */
    if (type === 'chat') {

        /*Get title*/
        let title = title_field.value;
        /*Check if there is a title and append data to new_bit */
        if (title.length > 0) {
            new_bit.title = title
        } else {
            new_bit.title= "yb-no-title"
        }

        /*Get body and append it to new_bit */
        let body = body_field.value;
        if (body.length > 0) {
            new_bit.body =  body
        } else {
            is_valid = false;
            body_field.style.backgroundColor = 'rgba(255, 0, 0, 0.8)';
            body_field.attr('placeholder') = 'Must Enter a body';
        }

    }
    
    if (type === 'photo') {
        console.log("gather_bit_step2");
        /*Get title and append it to new_bit*/
        let title = title_field.value;
        new_bit.title = title

        if (title.length > 0) {
            new_bit.title = title;
        } else {
            is_valid = false;
            body_field.style.backgroundColor = 'rgba(255, 0, 0, 0.8)';
            body_field.attr('placeholder') = 'Must Enter a Title';
        }

        /*Get body and append it to new_bit*/
        let body = body_field.value;
        
        if (body.length > 0) {
            new_bit.body = body;
        } else {
            new_bit.body = "yb-no-body";
        }
        /*Get image and append it to new_bit*/
        let img = $('#mobile-file-field')[0].files[0];

        new_bit.photo = img


    }

    if (type === 'video') {
            /*Get title and append it to new_bit*/
            let title = document.getElementById("mobile-title");
            new_bit.title = title
            /*Get body and append it to new_bit*/
            let body = document.getElementById("mobile-body");
            new_bit.body = body
            /*Get video and append it to new_bit*/
            let vid = $('#mobile-file-field')[0].files[0];
            new_bit.video = vid
    } 

    if (is_valid === true) {
        console.log(new_bit)
        callback(new_bit);
    }
}


//AJAX call to submit bit
function yb_submitBit(this_bit) {
    
    console.log("gather_bit_step3");
    
    //Get CSRF token
    let csrfToken = getCSRF();
    console.log(this_bit)
    
    //Get base url
    let base_url = window.location.origin;
    let url = `${base_url}/profile/publish/`
    let scope = document.getElementById('bit-scope-hidden-field').value;
    let this_data = new FormData();
    this_data.append('type', this_bit.type);
    this_data.append('title', this_bit.title);
    this_data.append('body', this_bit.body);
    this_data.append('is_public', scope);
    
    if (this_bit.type === 'photo') {
        this_data.append('photo', this_bit.photo);
    }
    if (this_bit.type === 'video') {
        this_data.append('video', this_bit.video);
    }

    $.ajax(
        {

            type:'POST',            
            contentType: false,
            // The following is necessary so jQuery won't try to convert the object into a string
            processData: false,
            headers: {
                'X-CSRFToken':csrfToken,
            },
            url: url,
            data: this_data,
            
            success: function(response) {

                //Data is blueprint for bit
                let blueprint = response;
                let bit_container = document.getElementById('bit-container');

                //Clear and hide form
                yb_resetCreate();
                dropCreateBit(hideCreateBit);



                //Pass blueprint to bit builder to generate new bit
                let new_bit = BuildBit(blueprint);
                let location = yb_getSessionValues('location');
                if (location === 'profile' || location === 'home') {
                    let bits_on_screen = yb_getBitsOnScreen();

                    if (bits_on_screen.length > 0) {
                        
                        let end_bit = getLenBitIndex();
                        let first_bit_id = yb_getBitOnScreen(1);
                        first_bit_id = first_bit_id.substring(1);
                        console.log(first_bit_id)
                        let first_bit = document.getElementById(first_bit_id)

                        //Prepend new bit to bit container, in future change to append before next sibling for dynachron.
                        bit_container.insertBefore(new_bit.built_bit, first_bit);
                        // Add the animation class to the element after a short delay
                        setTimeout(() => {
                            new_bit.built_bit.classList.add('animate');
                            }, 100);

                        yb_getDisplay();

                    } else {

                        $("#no-bits-message").remove();
                        bit_container.appendChild(new_bit.built_bit);
                        setTimeout(() => {
                            new_bit.built_bit.classList.add('animate');
                            }, 100);
                        yb_getDisplay();
                        
                    }

                }

            }   
        }   
    )

    
}

function clearBitForm() {
    if (width < 700) {
        $('#mobile-title').val('');
        $('#mobile-body').val('');
    }
}

$(document).ready(function() {

    

    //Get chatbit button from document
    let chatbit_button = document.getElementById("button-chatbit");
    //Add event listener to chatbit button
    chatbit_button.addEventListener('click',function() {
        let option = $(this).attr('name');
        //set variables for forms
        let form = document.getElementById('create-container');
        let type_field = document.getElementById('bit-type-hidden-field');
        let scope_field = document.getElementById('bit-scope-hidden-field');
        let option_field = document.getElementById('create-option-hidden-field');
        let private_toggle = document.getElementsByName("toggle-private")[0];
        let public_toggle = document.getElementsByName("toggle-public")[0];
        let script_source = document.getElementById('create-script');
        yb_chatBitForm(form, type_field, option_field, script_source);
    });
    
    //Get photobit button from document
    let photobit_button = document.getElementById("button-photobit");
    //Add event listener to photo bit button
    photobit_button.addEventListener('click', function() {
        let option = $(this).attr('name');
        //set variables for forms
        let form = document.getElementById('create-container');
        let type_field = document.getElementById('bit-type-hidden-field');
        let scope_field = document.getElementById('bit-scope-hidden-field');
        let option_field = document.getElementById('create-option-hidden-field');
        let private_toggle = document.getElementsByName("toggle-private")[0];
        let public_toggle = document.getElementsByName("toggle-public")[0];
        let script_source = document.getElementById('create-script');
        yb_photoBitForm(form, type_field, option_field, script_source);
    })
    
    //Get video bit button from document
    let videobit_button = document.getElementById("button-videobit");
    //Add event listner to video bit button
    videobit_button.addEventListener('click', function() {
        let option = $(this).attr('name');
        //set variables for forms
        let form = document.getElementById('create-container');
        let type_field = document.getElementById('bit-type-hidden-field');
        let scope_field = document.getElementById('bit-scope-hidden-field');
        let option_field = document.getElementById('create-option-hidden-field');
        let private_toggle = document.getElementsByName("toggle-private")[0];
        let public_toggle = document.getElementsByName("toggle-public")[0];
        let script_source = document.getElementById('create-script');
        yb_videoBitForm(form, type_field, option_field, script_source);
    });

    //Get cluster button from document
    let cluster_button = document.getElementById("button-cluster");
    //Add event listener to cluster button
    cluster_button.addEventListener('click', function() {
        yb_showClusterForm();
    })

    //Get community button from document
    let community_button = document.getElementById("button-community");
    //Add event listener to commnity button
    community_button.addEventListener('click', function() {
        yb_showCommunityForm();
    
    });

    //Get new message button from document
    let new_message_button = document.getElementById("button-new-message");
    //Add event listener to new_message_button
    new_message_button.addEventListener('click', function(){
        $("#scope-options").hide();
        $("#create-bit-type-mobile").hide();
        $("#create-bit-header").css({"height": "50px"});
        yb_showMessageForm();
    });

});




//Show create video bit form


/*
    Universal Create Bit Functions
*/
