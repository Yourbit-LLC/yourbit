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
    go_back.addEventListener("click", function() {
        yb_resetCreate();
    });
    close_button.addEventListener("click", function() {
        yb_resetCreate();
        dropCreateBit(hideCreateBit);
    });
});


function yb_resetCreate(){
    $("#create-container").remove();
    $("#create-options").fadeIn();
}

function yb_chatBitForm(form, type_field, option_field, script_source) {
        let sub_function_script = document.getElementById("sub-function-script")
        let this_source = document.getElementById("create-bit-source").value;
        sub_function_script.src = this_source;

        //hide options
        $('#create-options').fadeOut();
        
        //Show Form
        $('#create-container').fadeIn();

        //On creation of bits show scope options
        $('#scope-options').fadeIn();
        
        //Set header to corresponding creation
        $('#create-bit-header-text').html(`Create Chat Bit`);

        $("#mobile-publish-bit").attr("name", "publish")

        //On creation of bits show type options (text, photo, video)
        $('#create-bit-type-mobile').fadeIn();

        //Set hidden form field to describe bit type on submission
        type_field.value = 'chat';
        option_field.value='bit';

        //Create form fields to correspond with creation
        let to_field = yb_createInput("text", "yb-single-line-input", "mobile-to", "Send To: (optional)");
        let title_field = yb_createInput("text","yb-single-line-input", "mobile-title", "Title (optional)");
        let body_field = yb_createInput("textarea", "yb-single-line-input", "mobile-body", "Body"); 

        //Append each form field to the form
        form.innerHTML = ''
        form.appendChild(to_field);
        form.appendChild(title_field);
        form.appendChild(body_field);

        //Attach script

        //Append type buttons
        let type_grid = document.getElementById("create-bit-type-mobile");


        let type_button_text = yb_createElement("a", "text-type-button", "type-button-active");
        type_button_text.innerHTML = `
            <svg class="space-button-image" xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="M.95 17.8V1.85q0-.5.325-.825Q1.6.7 2.1.7h14.25q.5 0 .825.325.325.325.325.825V12q0 .5-.325.825-.325.325-.825.325H5.6Zm5.8.9q-.5 0-.825-.325-.325-.325-.325-.825v-2.4h13.9V5.4h2.4q.5 0 .825.325.325.325.325.825v16.8L18.4 18.7Zm8.1-15.35H3.6v8.05l.9-.9h10.35Zm-11.25 0v8.05Z"/></svg>
        `
        type_button_text.setAttribute("name", "chat")

        type_button_text.addEventListener("click", function() {
            changeBitForm("chat");
        });
        

        let type_button_photo = yb_createElement("a", "photo-type-button", "type-button");
        type_button_photo.innerHTML = `
            <svg class="space-button-image" xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="M12 17.75q1.925 0 3.263-1.337Q16.6 15.075 16.6 13.15q0-1.925-1.337-3.263Q13.925 8.55 12 8.55q-1.925 0-3.262 1.337Q7.4 11.225 7.4 13.15q0 1.925 1.338 3.263Q10.075 17.75 12 17.75Zm0-2.65q-.8 0-1.375-.575t-.575-1.375q0-.8.575-1.375T12 11.2q.8 0 1.375.575t.575 1.375q0 .8-.575 1.375T12 15.1Zm-8.15 6.725q-1.1 0-1.875-.775-.775-.775-.775-1.875V7.125q0-1.1.775-1.875.775-.775 1.875-.775h3.025l2.05-2.25h6.15l2.05 2.25h3.025q1.1 0 1.875.775.775.775.775 1.875v12.05q0 1.1-.775 1.875-.775.775-1.875.775Zm16.3-2.65V7.125h-4.2l-2.05-2.25h-3.8l-2.05 2.25h-4.2v12.05ZM12 13.15Z"/></svg>
        `
        type_button_photo.setAttribute("name", "photo")
        type_button_photo.addEventListener("click", function(){
            changeBitForm("photo");
        });
        
        let type_button_video = yb_createElement("a", "video-type-button", "type-button");
        type_button_video.innerHTML = `
            <svg class="space-button-image" xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="m9.15 17.15 8-5.15-8-5.15ZM12 22.8q-2.25 0-4.213-.85-1.962-.85-3.424-2.312Q2.9 18.175 2.05 16.212 1.2 14.25 1.2 12t.85-4.225Q2.9 5.8 4.363 4.338q1.462-1.463 3.424-2.301Q9.75 1.2 12 1.2t4.225.837q1.975.838 3.438 2.301 1.462 1.462 2.299 3.437Q22.8 9.75 22.8 12q0 2.25-.838 4.212-.837 1.963-2.299 3.426Q18.2 21.1 16.225 21.95q-1.975.85-4.225.85Zm0-2.65q3.425 0 5.788-2.363Q20.15 15.425 20.15 12t-2.362-5.788Q15.425 3.85 12 3.85q-3.425 0-5.787 2.362Q3.85 8.575 3.85 12q0 3.425 2.363 5.787Q8.575 20.15 12 20.15ZM12 12Z"/></svg>
        `
        type_button_video.setAttribute("name", "video")
        type_button_video.addEventListener("click", function() {
            changeBitForm("video");
        });
    
        type_grid.appendChild(type_button_text);
        type_grid.appendChild(type_button_photo);
        type_grid.appendChild(type_button_video);

        let enhance_button = yb_createButton("button", "yb-enhance-button", "enhance-button", '<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 96 960 960" width="24"><path d="m800 376-38-82-82-38 82-38 38-82 38 82 82 38-82 38-38 82Zm-460 0-38-82-82-38 82-38 38-82 38 82 82 38-82 38-38 82Zm460 460-38-82-82-38 82-38 38-82 38 82 82 38-82 38-38 82ZM204 964 92 852q-12-12-12-29t12-29l446-446q12-12 29-12t29 12l112 112q12 12 12 29t-12 29L262 964q-12 12-29 12t-29-12Zm30-84 286-288-56-56-288 286 58 58Z"/></svg>Enhance');
        enhance_button.setAttribute("type", "button");
        enhance_button.setAttribute("style", "background-color: rgba(0, 0, 0, 0.5); border-width: 0px; border-radius: 10px; color: white; text-align: center;");
        form.appendChild(enhance_button);
        enhance_button.onclick = function() {
            console.log("click")
            let this_form = this.parentElement;
            let context_menu = yb_createElement("div", "enhance-menu", "bit-context-menu");
            
            context_menu.setAttribute("style", "padding: 10px 4px 10px 4px; width: 50vw;");
            
            context_menu.innerHTML = "Enhance Options:";
            let option_1 = yb_createElement("div", "enhance-option-1", "bit-context-option");
            option_1.innerHTML = '<svg class="list-icon" xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 96 960 960" width="24"><path d="M38 628q-18-36-28-73T0 480q0-112 76-188t188-76q63 0 120 26.5t96 73.5q39-47 96-73.5T696 216q112 0 188 76t76 188q0 38-10 75t-28 73q-11-19-26-34t-35-24q9-23 14-45t5-45q0-78-53-131t-131-53q-81 0-124.5 44.5T480 440q-48-56-91.5-100T264 296q-78 0-131 53T80 480q0 23 5 45t14 45q-20 9-35 24t-26 34ZM0 976v-63q0-44 44.5-70.5T160 816q13 0 25 .5t23 2.5q-14 20-21 43t-7 49v65H0Zm240 0v-65q0-65 66.5-105T480 766q108 0 174 40t66 105v65H240Zm540 0v-65q0-26-6.5-49T754 819q11-2 22.5-2.5t23.5-.5q72 0 116 26.5t44 70.5v63H780ZM480 846q-57 0-102 15t-53 35h311q-9-20-53.5-35T480 846Zm-320-70q-33 0-56.5-23.5T80 696q0-34 23.5-57t56.5-23q34 0 57 23t23 57q0 33-23 56.5T160 776Zm640 0q-33 0-56.5-23.5T720 696q0-34 23.5-57t56.5-23q34 0 57 23t23 57q0 33-23 56.5T800 776Zm-320-40q-50 0-85-35t-35-85q0-51 35-85.5t85-34.5q51 0 85.5 34.5T600 616q0 50-34.5 85T480 736Zm0-160q-17 0-28.5 11.5T440 616q0 17 11.5 28.5T480 656q17 0 28.5-11.5T520 616q0-17-11.5-28.5T480 576Zm0 40Zm1 280Z"/></svg><p style="text-align: left;">Friendlier</p>'
            context_menu.appendChild(option_1);

            let option_2 = yb_createElement("div","enhance-option-2", "bit-context-option");
            option_2.innerHTML = '<svg class="list-icon" xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 96 960 960" width="24"><path d="M160 936q-33 0-56.5-23.5T80 856V416q0-33 23.5-56.5T160 336h160v-80q0-33 23.5-56.5T400 176h160q33 0 56.5 23.5T640 256v80h160q33 0 56.5 23.5T880 416v440q0 33-23.5 56.5T800 936H160Zm0-80h640V416H160v440Zm240-520h160v-80H400v80ZM160 856V416v440Z"/></svg><p style="text-align: left;">More Professional</p>'
            context_menu.appendChild(option_2);

            let option_3 = yb_createElement("div", "enhance-option-3", "bit-context-option");
            option_3.innerHTML = '<svg class="list-icon" xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 96 960 960" width="24"><path d="M182 856q-51 0-79-35.5T82 734l42-300q9-60 53.5-99T282 296h396q60 0 104.5 39t53.5 99l42 300q7 51-21 86.5T778 856q-21 0-39-7.5T706 826l-90-90H344l-90 90q-15 15-33 22.5t-39 7.5Zm16-86 114-114h336l114 114q2 2 16 6 11 0 17.5-6.5T800 752l-44-308q-4-29-26-48.5T678 376H282q-30 0-52 19.5T204 444l-44 308q-2 11 4.5 17.5T182 776q2 0 16-6Zm482-154q17 0 28.5-11.5T720 576q0-17-11.5-28.5T680 536q-17 0-28.5 11.5T640 576q0 17 11.5 28.5T680 616Zm-80-120q17 0 28.5-11.5T640 456q0-17-11.5-28.5T600 416q-17 0-28.5 11.5T560 456q0 17 11.5 28.5T600 496ZM310 616h60v-70h70v-60h-70v-70h-60v70h-70v60h70v70Zm170-40Z"/></svg><p style="text-align: left;">More Entertaining</p>'
            context_menu.appendChild(option_3);

            this_form.appendChild(context_menu);
            
            // this_form.appendChild(context_menu);
            // let type = 'friendly';
            // let length = 'up to 3 sentences';
            // let text = $('#mobile-body').val();
            // yb_enhanceText(length, type, text);
            
        }
}

function yb_videoBitForm(form, type_field, option_field, script_source) {
    let sub_function_script = document.getElementById("sub-function-script")
    let this_source = document.getElementById("create-bit-source").value;
    sub_function_script.src = this_source;

    //hide options
    $('#create-options').fadeOut();

    //Show Form
    $('#create-container').fadeIn();

    //On creation of bits show scope options
    $('#scope-options').fadeIn();

    //On creation of bits show type options (text, photo, video)
    $('#create-bit-type-mobile').fadeIn();

    //Set header to corresponding creation
    $('#create-bit-header-text').html('Create Video Bit');

    //Set hidden form field to describe bit type on submission
    type_field.value = 'video';
    option_field.value='bit';

    let to_field = yb_createInput("input", "yb-single-line-input", "mobile-to",  "To: (optional)");
    let title_field = yb_createInput("input", "yb-single-line-input", "mobile-title",  "Title");
    let body_field = yb_createInput("textarea","yb-text-area", "mobile-body");
    let meta_tags = yb_createInput("input", "yb-single-line-input", "mobile-tags", "Meta Tags (separate by comma)");
    let upload_field = yb_createInput("file", "yb-file-field", "mobile-file-field", "none");

    //Change form fields to correspond with creation
    form.innerHTML = ``
    
    form.appendChild(to_field);
    form.appendChild(title_field);
    form.appendChild(body_field);
    form.appendChild(upload_field)
    form.appendChild(meta_tags);
    
    //Append type buttons
    let type_grid = document.getElementById("create-bit-type-mobile");
    
    
    let type_button_text = yb_createElement("a", "text-type-button", "type-button");
    type_button_text.innerHTML = `
        <svg class="space-button-image" xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="M.95 17.8V1.85q0-.5.325-.825Q1.6.7 2.1.7h14.25q.5 0 .825.325.325.325.325.825V12q0 .5-.325.825-.325.325-.825.325H5.6Zm5.8.9q-.5 0-.825-.325-.325-.325-.325-.825v-2.4h13.9V5.4h2.4q.5 0 .825.325.325.325.325.825v16.8L18.4 18.7Zm8.1-15.35H3.6v8.05l.9-.9h10.35Zm-11.25 0v8.05Z"/></svg>
    `
    type_button_text.setAttribute("name", "chat")

    type_button_text.addEventListener("click", function() {
        changeBitForm("chat");
    });
    

    let type_button_photo = yb_createElement("a", "photo-type-button", "type-button");
    type_button_photo.innerHTML = `
        <svg class="space-button-image" xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="M12 17.75q1.925 0 3.263-1.337Q16.6 15.075 16.6 13.15q0-1.925-1.337-3.263Q13.925 8.55 12 8.55q-1.925 0-3.262 1.337Q7.4 11.225 7.4 13.15q0 1.925 1.338 3.263Q10.075 17.75 12 17.75Zm0-2.65q-.8 0-1.375-.575t-.575-1.375q0-.8.575-1.375T12 11.2q.8 0 1.375.575t.575 1.375q0 .8-.575 1.375T12 15.1Zm-8.15 6.725q-1.1 0-1.875-.775-.775-.775-.775-1.875V7.125q0-1.1.775-1.875.775-.775 1.875-.775h3.025l2.05-2.25h6.15l2.05 2.25h3.025q1.1 0 1.875.775.775.775.775 1.875v12.05q0 1.1-.775 1.875-.775.775-1.875.775Zm16.3-2.65V7.125h-4.2l-2.05-2.25h-3.8l-2.05 2.25h-4.2v12.05ZM12 13.15Z"/></svg>
    `
    type_button_photo.setAttribute("name", "photo")
    type_button_photo.addEventListener("click", function(){
        changeBitForm("photo");
    });
    
    let type_button_video = yb_createElement("a", "video-type-button", "type-button-active");
    type_button_video.innerHTML = `
        <svg class="space-button-image" xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="m9.15 17.15 8-5.15-8-5.15ZM12 22.8q-2.25 0-4.213-.85-1.962-.85-3.424-2.312Q2.9 18.175 2.05 16.212 1.2 14.25 1.2 12t.85-4.225Q2.9 5.8 4.363 4.338q1.462-1.463 3.424-2.301Q9.75 1.2 12 1.2t4.225.837q1.975.838 3.438 2.301 1.462 1.462 2.299 3.437Q22.8 9.75 22.8 12q0 2.25-.838 4.212-.837 1.963-2.299 3.426Q18.2 21.1 16.225 21.95q-1.975.85-4.225.85Zm0-2.65q3.425 0 5.788-2.363Q20.15 15.425 20.15 12t-2.362-5.788Q15.425 3.85 12 3.85q-3.425 0-5.787 2.362Q3.85 8.575 3.85 12q0 3.425 2.363 5.787Q8.575 20.15 12 20.15ZM12 12Z"/></svg>
    `
    type_button_video.setAttribute("name", "video")
    type_button_video.addEventListener("click", function() {
        changeBitForm("video");
    });

    type_grid.appendChild(type_button_text);
    type_grid.appendChild(type_button_photo);
    type_grid.appendChild(type_button_video);

}

function yb_photoBitForm(form, type_field, option_field, script_source) {
    let sub_function_script = document.getElementById("sub-function-script")
    let this_source = document.getElementById("create-bit-source").value;
    sub_function_script.src = this_source;
    //hide options
    $('#create-options').fadeOut();

    //Show form
    $('#create-container').fadeIn();

    //On creation of bits show scope options
    $('#scope-options').fadeIn();

    //On creation of bits show type options (text, photo, video)
    $('#create-bit-type-mobile').fadeIn();

    //Set header to corresponding creation
    $('#create-bit-header-text').html('Create Photo Bit');

    //Set hidden form field to describe bit type on submission
    type_field.value = 'photo';
    option_field.value='bit';

    let to_field = yb_createInput("text", "yb-single-line-input", "mobile-to", "To: (optional)");
    let title_field = yb_createInput("text", "yb-single-line-input", "mobile-title", "Caption");
    let body_field = yb_createInput("textarea", "yb-text-area", "mobile-body", "Description");
    let upload_field = yb_createInput("file", "yb-file-field", "mobile-file-field", "none")
    //Change form fields to correspond with creation
    form.innerHTML = ``;

    form.appendChild(to_field);
    form.appendChild(title_field);
    form.appendChild(body_field);
    form.appendChild(upload_field);
    //Append type buttons
    let type_grid = document.getElementById("create-bit-type-mobile");


    let type_button_text = yb_createElement("a", "text-type-button", "type-button");
    type_button_text.innerHTML = `
        <svg class="space-button-image" xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="M.95 17.8V1.85q0-.5.325-.825Q1.6.7 2.1.7h14.25q.5 0 .825.325.325.325.325.825V12q0 .5-.325.825-.325.325-.825.325H5.6Zm5.8.9q-.5 0-.825-.325-.325-.325-.325-.825v-2.4h13.9V5.4h2.4q.5 0 .825.325.325.325.325.825v16.8L18.4 18.7Zm8.1-15.35H3.6v8.05l.9-.9h10.35Zm-11.25 0v8.05Z"/></svg>
    `
    type_button_text.setAttribute("name", "chat")

    type_button_text.addEventListener("click", function() {
        changeBitForm("chat");
    });
    

    let type_button_photo = yb_createElement("a", "photo-type-button", "type-button-active");
    type_button_photo.innerHTML = `
        <svg class="space-button-image" xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="M12 17.75q1.925 0 3.263-1.337Q16.6 15.075 16.6 13.15q0-1.925-1.337-3.263Q13.925 8.55 12 8.55q-1.925 0-3.262 1.337Q7.4 11.225 7.4 13.15q0 1.925 1.338 3.263Q10.075 17.75 12 17.75Zm0-2.65q-.8 0-1.375-.575t-.575-1.375q0-.8.575-1.375T12 11.2q.8 0 1.375.575t.575 1.375q0 .8-.575 1.375T12 15.1Zm-8.15 6.725q-1.1 0-1.875-.775-.775-.775-.775-1.875V7.125q0-1.1.775-1.875.775-.775 1.875-.775h3.025l2.05-2.25h6.15l2.05 2.25h3.025q1.1 0 1.875.775.775.775.775 1.875v12.05q0 1.1-.775 1.875-.775.775-1.875.775Zm16.3-2.65V7.125h-4.2l-2.05-2.25h-3.8l-2.05 2.25h-4.2v12.05ZM12 13.15Z"/></svg>
    `
    type_button_photo.setAttribute("name", "photo")
    type_button_photo.addEventListener("click", function(){
        changeBitForm("photo");
    });
    
    let type_button_video = yb_createElement("a", "video-type-button", "type-button");
    type_button_video.innerHTML = `
        <svg class="space-button-image" xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="m9.15 17.15 8-5.15-8-5.15ZM12 22.8q-2.25 0-4.213-.85-1.962-.85-3.424-2.312Q2.9 18.175 2.05 16.212 1.2 14.25 1.2 12t.85-4.225Q2.9 5.8 4.363 4.338q1.462-1.463 3.424-2.301Q9.75 1.2 12 1.2t4.225.837q1.975.838 3.438 2.301 1.462 1.462 2.299 3.437Q22.8 9.75 22.8 12q0 2.25-.838 4.212-.837 1.963-2.299 3.426Q18.2 21.1 16.225 21.95q-1.975.85-4.225.85Zm0-2.65q3.425 0 5.788-2.363Q20.15 15.425 20.15 12t-2.362-5.788Q15.425 3.85 12 3.85q-3.425 0-5.787 2.362Q3.85 8.575 3.85 12q0 3.425 2.363 5.787Q8.575 20.15 12 20.15ZM12 12Z"/></svg>
    `
    type_button_video.setAttribute("name", "video")
    type_button_video.addEventListener("click", function() {
        changeBitForm("video");
    });

    type_grid.appendChild(type_button_text);
    type_grid.appendChild(type_button_photo);
    type_grid.appendChild(type_button_video);
    

}


/* Type button refers to the content type buttons in create bit */
$('.type-button').click(function() {
    let button_name = $(this).attr('name');
    console.log(button_name);
    changeBitForm(button_name);
});

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

            },
            success: function(data){
                let response = data;
                callback(response);
            }
        })
    }
};



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


function yb_showMessageForm(){
    let form = document.getElementById('mobile-create-inputs');
    let option_field = document.getElementById('create-option-hidden-field');
    let script_element = document.getElementById('sub-function-script');

    let submit_button = document.getElementById('mobile-publish-bit');

    submit_button.innerHTML = "Send";
    form.innerHTML = ``;
    $('#create-bit-header-text').html('Create a Message');
    $('#create-options').fadeOut();
    $('#create-container').fadeIn();
    option_field.value = 'message';

    let hidden_to_field = yb_createInput("hidden", "hidden-text", "hidden-to",  "none");
    form.appendChild(hidden_to_field);

    
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

    form.appendChild(to_field_container);
    form.appendChild(result_container);
    form.appendChild(body_field);
    let script_source = document.getElementById("send-message-source");

    script_element.src = script_source;

    submit_button.addEventListener("click", function(){
        let body = document.getElementById("mobile-body").value;
        let to = document.getElementById("hidden-to").value;
        
        $.ajax({
            url: `/messages/api/check_existing/${to}/`,
            type: "GET",
            success: function(data){
                let is_conversation = data.is_conversation;


                dropCreateBit(hideCreateBit);

                if(is_conversation){                
                    let this_id = data.conversation_id;
                    let that_user = data.conversation_recipient;
                    console.log(that_user)
                    console.log(this_id)
                    messages_conversation_url(this_id, that_user);
                    yb_sendMessage(body, this_id, that_user);

                }else{
                    console.log(to)
                    yb_newConversation(to, body);
                    
                }
            }
        })

    });
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

function changeBitForm(button_name) {

    /* Set form equal to mobile-bit-inputs container */
    let form = document.getElementById('mobile-create-inputs');
    let type_field = document.getElementById('bit-type-hidden-field')
    let option_field = document.getElementById('create-option-hidden-field');
    let script_source = document.getElementById('create-script');
    let header = document.getElementById('create-bit-header');
    
    if (button_name === 'chat') {
        type_field.value = 'chat';
        yb_chatBitForm(form, type_field, option_field, script_source);
    }
    
    if (button_name === 'video') {
        type_field.value = 'video';
        yb_videoBitForm(form, type_field, option_field, script_source);
    }

    if (button_name === 'photo') {
        type_field.value = 'photo';
        yb_photoBitForm(form, type_field, option_field, script_source);
    }
};

/* Publish bit button listener mobile */
$('#mobile-publish-bit').click(function() {
    let action = $(this).attr("name")
    
    if (action === "publish") {
        let type = document.getElementById('bit-type-hidden-field').value;
        let private_toggle = document.getElementsByName("toggle-private")[1];
        console.log(private_toggle)
        let public_toggle = document.getElementsByName("toggle-public");
        $(this).css("pointer-events", "none");
        gatherMobileBit(type, yb_submitBit);
    } else if (action === "edit") {
        let type = document.getElementById('bit-type-hidden-field').value;
        let private_toggle = document.getElementsByName("toggle-private")[1];
        console.log(private_toggle)
        let public_toggle = document.getElementsByName("toggle-public");
        gatherMobileBit(type, yb_editBit);
        
    } 
});

$("#mobile-title").click(function(){
    console.log("clicked")
})

//Collect information from form fields
function gatherMobileBit(type, callback) {
    //Create form data for new bit
    let new_bit = {};
    var is_valid = true; /*Is valid verifies if forms are complete, initial value = true */ 
    console.log("gather_bit_step1")
    //Compile information from fields to append to new_bit
    let title_field = document.getElementById('mobile-title');
    let body_field = document.getElementById("mobile-body");
    new_bit.type = type;
    
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
    this_data.append('scope', scope);
    
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
                clearBitForm();
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
        let form = document.getElementById('mobile-create-inputs');
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
        let form = document.getElementById('mobile-create-inputs');
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
        let form = document.getElementById('mobile-create-inputs');
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
        $('#create-bit-header-text').html('Create a Cluster');
        //Hide options container
        $('#create-options').fadeOut();
        //Show create container
        $('#create-container').fadeIn();

        $("#mobile-publish-bit").html("Create");

        let description = yb_createElement("p", "mobile-cluster-description", "yb-card-intro");
        description.innerHTML = "A Cluster is a folder containing your saved Bits.<br><br> You can access the clusters you have created by navigating to your inventory from the profile menu."
        let name_field = yb_createInput("text", "yb-single-line-input", "mobile-cluster-name",  "Cluster Name");


        option_field.value = 'cluster';
        
        //change form fields to correspond with creation
        form.innerHTML = ``;
        form.appendChild(description);
        form.appendChild(name_field);

        document.getElementById('mobile-publish-bit').addEventListener("click", function(){
            let name_field = document.getElementById('mobile-cluster-name');
            let name = name_field.value;
            name_field.value = "";
            
            console.log(name);
            yb_createCluster(name);
            
        });

        script_source.src = "/static/scripts/yb-create-community.js"
    })

    //Get community button from document
    let community_button = document.getElementById("button-community");
    //Add event listener to commnity button
    community_button.addEventListener('click', function() {
        $('#create-bit-header-text').html('Create a Community');
        //Hide options container
        $('#create-options').fadeOut();
        //Show create container
        $('#create-container').fadeIn();

        $("#mobile-publish-bit").html("Create");

        let name_field = yb_createInput("text", "yb-single-line-input", "mobile-community-name",  "Name");
        let handle_field = yb_createInput("text", "yb-single-line-input", "mobile-community-handle",  "Handle");


        option_field.value = 'community';
        
        //change form fields to correspond with creation
        form.innerHTML = ``;

        form.appendChild(name_field);
        form.appendChild(handle_field);

        script_source.src = "/static/scripts/yb-create-community.js/"
    
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
