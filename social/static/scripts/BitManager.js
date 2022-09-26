/*
    ------------------[   Bit Manager   ]-----------------------

    The bit manager contains scripting for creating and displaying
    bits on yourbit. 

    Includes:
        -Create Bit Functions
        -Create Bit Functions for mobile
        -Gather bit
        -Gather bit for mobile
        -Submit bit
        -Mobile and desktop create bit functions

*/

/* Get necessary platform information */


/*
--Create Bit Functions for mobile--
*/

$('#mobile-create-icon').click(function() {
    $('#cb-divider').show();
    showCreateBit(raiseCreateBit);
});

$('#bit-panel-close').click(function() {
    dropCreateBit(hideCreateBit)
});

/* Function to set display of create bit to block */
function showCreateBit(callback) {
    let create_bit = document.getElementById('create-bit-mobile');
    create_bit.style.visibility='visible';
    callback(titleFocus);
}

/* Function to animate create bit onto the screen */
function raiseCreateBit(callback){
    let create_bit = document.getElementById('create-bit-mobile');
    create_bit.style.transform = 'translate(0, -80vh)';
    setTimeout(callback, 500);
}

/* Places the cursor in the title field on reveal */

function titleFocus() {
    let create_bit = document.getElementById('create-bit-mobile');
    $('#mobile-title').focus();
}

/* Before hiding create bit, ru a drop animation followUp = hideCreateBit() */

function dropCreateBit(followUp) {
    let create_bit = document.getElementById('create-bit-mobile');
    create_bit.style.transform = 'translate(0, 0vh)';
    followUp();
}

/* Hide Create bit after drop down animation */
function hideCreateBit() {
    let create_bit = document.getElementById('create-bit-mobile');
    create_bit.style.visibility='hidden';
    $('#cb-divider').hide();

}

/* Type button refers to the content type buttons in create bit */
$('.type-button').click(function() {
    let button_name = $(this).attr('name');
    console.log(button_name);
    changeBitForm(button_name);
});

/*
    ------- Function Change Mobile Bit form ----------
*/

function changeBitForm(button_name) {

    /* Set form equal to mobile-bit-inputs container */
    let form = document.getElementById('mobile-bit-inputs');
    let type_field = document.getElementById('bit-type-hidden-field')
    let header = document.getElementById('create-bit-header');
    
    if (button_name === 'chat') {
        type_field.value = 'chat';
        $('#create-bit-header').html('Create Chat Bit');
        form.innerHTML = `                            
            <input type="text" class="single-line-input" id="mobile-title" placeholder="Title (Optional)" style="color:white; font-size: 16px; font-weight: 600;">
            <textarea id="mobile-body" placeholder="Body" style="color:white; font-size: 14px;"></textarea>
        `
        $('#text-type-button').replaceWith(`<a id = "text-type-button" class = "type-button-active" name = "chat"><svg class="space-button-image" xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="M.95 17.8V1.85q0-.5.325-.825Q1.6.7 2.1.7h14.25q.5 0 .825.325.325.325.325.825V12q0 .5-.325.825-.325.325-.825.325H5.6Zm5.8.9q-.5 0-.825-.325-.325-.325-.325-.825v-2.4h13.9V5.4h2.4q.5 0 .825.325.325.325.325.825v16.8L18.4 18.7Zm8.1-15.35H3.6v8.05l.9-.9h10.35Zm-11.25 0v8.05Z"/></svg></a>`);
        $('#photo-type-button').replaceWith(`<a id = "photo-type-button" class = "type-button" onclick="changeBitForm('photo')" name = "photo"><svg class="space-button-image" xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="M12 17.75q1.925 0 3.263-1.337Q16.6 15.075 16.6 13.15q0-1.925-1.337-3.263Q13.925 8.55 12 8.55q-1.925 0-3.262 1.337Q7.4 11.225 7.4 13.15q0 1.925 1.338 3.263Q10.075 17.75 12 17.75Zm0-2.65q-.8 0-1.375-.575t-.575-1.375q0-.8.575-1.375T12 11.2q.8 0 1.375.575t.575 1.375q0 .8-.575 1.375T12 15.1Zm-8.15 6.725q-1.1 0-1.875-.775-.775-.775-.775-1.875V7.125q0-1.1.775-1.875.775-.775 1.875-.775h3.025l2.05-2.25h6.15l2.05 2.25h3.025q1.1 0 1.875.775.775.775.775 1.875v12.05q0 1.1-.775 1.875-.775.775-1.875.775Zm16.3-2.65V7.125h-4.2l-2.05-2.25h-3.8l-2.05 2.25h-4.2v12.05ZM12 13.15Z"/></svg></a>`);
        $('#video-type-button').replaceWith(`<a id = "video-type-button" class = "type-button" onclick="changeBitForm('video')" name = "video"><svg class="space-button-image" xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="m9.15 17.15 8-5.15-8-5.15ZM12 22.8q-2.25 0-4.213-.85-1.962-.85-3.424-2.312Q2.9 18.175 2.05 16.212 1.2 14.25 1.2 12t.85-4.225Q2.9 5.8 4.363 4.338q1.462-1.463 3.424-2.301Q9.75 1.2 12 1.2t4.225.837q1.975.838 3.438 2.301 1.462 1.462 2.299 3.437Q22.8 9.75 22.8 12q0 2.25-.838 4.212-.837 1.963-2.299 3.426Q18.2 21.1 16.225 21.95q-1.975.85-4.225.85Zm0-2.65q3.425 0 5.788-2.363Q20.15 15.425 20.15 12t-2.362-5.788Q15.425 3.85 12 3.85q-3.425 0-5.787 2.362Q3.85 8.575 3.85 12q0 3.425 2.363 5.787Q8.575 20.15 12 20.15ZM12 12Z"/></svg></a>`);
    }
    
    if (button_name === 'video') {
        type_field.value = 'video';
        $('#create-bit-header').html('Create Video Bit');
        form.innerHTML = `
            <input type="text" class="single-line-input" id="mobile-title" placeholder="Title (Optional)" style="color:white; font-size: 16px; font-weight: 600;">
            <textarea id="mobile-body" placeholder="Info" style="color:white; font-size: 14px;"></textarea>
            <input type="file" id="mobile-file-field" accept=".mp4, .mov, .avi, .3GP, .FLV, .MKV"/>
        `
        $('#text-type-button').replaceWith(`<a id = "text-type-button" onclick="changeBitForm('chat')" class = "type-button" name = "chat"><svg class="space-button-image" xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="M.95 17.8V1.85q0-.5.325-.825Q1.6.7 2.1.7h14.25q.5 0 .825.325.325.325.325.825V12q0 .5-.325.825-.325.325-.825.325H5.6Zm5.8.9q-.5 0-.825-.325-.325-.325-.325-.825v-2.4h13.9V5.4h2.4q.5 0 .825.325.325.325.325.825v16.8L18.4 18.7Zm8.1-15.35H3.6v8.05l.9-.9h10.35Zm-11.25 0v8.05Z"/></svg></a>`);
        $('#photo-type-button').replaceWith(`<a id = "photo-type-button" onclick="changeBitForm('photo')" class = "type-button" name = "photo"><svg class="space-button-image" xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="M12 17.75q1.925 0 3.263-1.337Q16.6 15.075 16.6 13.15q0-1.925-1.337-3.263Q13.925 8.55 12 8.55q-1.925 0-3.262 1.337Q7.4 11.225 7.4 13.15q0 1.925 1.338 3.263Q10.075 17.75 12 17.75Zm0-2.65q-.8 0-1.375-.575t-.575-1.375q0-.8.575-1.375T12 11.2q.8 0 1.375.575t.575 1.375q0 .8-.575 1.375T12 15.1Zm-8.15 6.725q-1.1 0-1.875-.775-.775-.775-.775-1.875V7.125q0-1.1.775-1.875.775-.775 1.875-.775h3.025l2.05-2.25h6.15l2.05 2.25h3.025q1.1 0 1.875.775.775.775.775 1.875v12.05q0 1.1-.775 1.875-.775.775-1.875.775Zm16.3-2.65V7.125h-4.2l-2.05-2.25h-3.8l-2.05 2.25h-4.2v12.05ZM12 13.15Z"/></svg></a>`);
        $('#video-type-button').replaceWith(`<a id = "video-type-button" class = "type-button-active" name = "video"><svg class="space-button-image" xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="m9.15 17.15 8-5.15-8-5.15ZM12 22.8q-2.25 0-4.213-.85-1.962-.85-3.424-2.312Q2.9 18.175 2.05 16.212 1.2 14.25 1.2 12t.85-4.225Q2.9 5.8 4.363 4.338q1.462-1.463 3.424-2.301Q9.75 1.2 12 1.2t4.225.837q1.975.838 3.438 2.301 1.462 1.462 2.299 3.437Q22.8 9.75 22.8 12q0 2.25-.838 4.212-.837 1.963-2.299 3.426Q18.2 21.1 16.225 21.95q-1.975.85-4.225.85Zm0-2.65q3.425 0 5.788-2.363Q20.15 15.425 20.15 12t-2.362-5.788Q15.425 3.85 12 3.85q-3.425 0-5.787 2.362Q3.85 8.575 3.85 12q0 3.425 2.363 5.787Q8.575 20.15 12 20.15ZM12 12Z"/></svg></a>`);
    }

    if (button_name === 'photo') {
        type_field.value = 'photo';
        $('#create-bit-header').html('Create Photo Bit');
        form.innerHTML = `
            <input type="text" class="single-line-input" id="mobile-title" placeholder="Title (Optional)" style="color:white; font-size: 16px; font-weight: 600;">
            <textarea id="mobile-body" placeholder="Info" style="color:white; font-size: 14px;"></textarea>
            <input type="file" id="mobile-file-field" accept=".jpg, .jpeg, .png"/>
        `
        $('#text-type-button').replaceWith(`<a id = "text-type-button" onclick="changeBitForm('chat')" class = "type-button" name = "chat"><svg class="space-button-image" xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="M.95 17.8V1.85q0-.5.325-.825Q1.6.7 2.1.7h14.25q.5 0 .825.325.325.325.325.825V12q0 .5-.325.825-.325.325-.825.325H5.6Zm5.8.9q-.5 0-.825-.325-.325-.325-.325-.825v-2.4h13.9V5.4h2.4q.5 0 .825.325.325.325.325.825v16.8L18.4 18.7Zm8.1-15.35H3.6v8.05l.9-.9h10.35Zm-11.25 0v8.05Z"/></svg></a>`);
        $('#photo-type-button').replaceWith(`<a id = "photo-type-button" class = "type-button-active" name = "photo"><svg class="space-button-image" xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="M12 17.75q1.925 0 3.263-1.337Q16.6 15.075 16.6 13.15q0-1.925-1.337-3.263Q13.925 8.55 12 8.55q-1.925 0-3.262 1.337Q7.4 11.225 7.4 13.15q0 1.925 1.338 3.263Q10.075 17.75 12 17.75Zm0-2.65q-.8 0-1.375-.575t-.575-1.375q0-.8.575-1.375T12 11.2q.8 0 1.375.575t.575 1.375q0 .8-.575 1.375T12 15.1Zm-8.15 6.725q-1.1 0-1.875-.775-.775-.775-.775-1.875V7.125q0-1.1.775-1.875.775-.775 1.875-.775h3.025l2.05-2.25h6.15l2.05 2.25h3.025q1.1 0 1.875.775.775.775.775 1.875v12.05q0 1.1-.775 1.875-.775.775-1.875.775Zm16.3-2.65V7.125h-4.2l-2.05-2.25h-3.8l-2.05 2.25h-4.2v12.05ZM12 13.15Z"/></svg></a>`);
        $('#video-type-button').replaceWith(`<a id = "video-type-button" onclick="changeBitForm('video')" class = "type-button" name = "video"><svg class="space-button-image" xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="m9.15 17.15 8-5.15-8-5.15ZM12 22.8q-2.25 0-4.213-.85-1.962-.85-3.424-2.312Q2.9 18.175 2.05 16.212 1.2 14.25 1.2 12t.85-4.225Q2.9 5.8 4.363 4.338q1.462-1.463 3.424-2.301Q9.75 1.2 12 1.2t4.225.837q1.975.838 3.438 2.301 1.462 1.462 2.299 3.437Q22.8 9.75 22.8 12q0 2.25-.838 4.212-.837 1.963-2.299 3.426Q18.2 21.1 16.225 21.95q-1.975.85-4.225.85Zm0-2.65q3.425 0 5.788-2.363Q20.15 15.425 20.15 12t-2.362-5.788Q15.425 3.85 12 3.85q-3.425 0-5.787 2.362Q3.85 8.575 3.85 12q0 3.425 2.363 5.787Q8.575 20.15 12 20.15ZM12 12Z"/></svg></a>`);
    
    }
};

/* Publish bit button listener mobile */
$('#mobile-publish-bit').click(function() {
    let type = document.getElementById('bit-type-hidden-field').value;
    gatherMobileBit(type, submitBit);
});


/*
    Gather information from create bit form into data for ajax
*/

function gatherMobileBit(type, callback) {
    let new_bit = new FormData();
    var is_valid = true; /*Is valid verifies if forms are complete, initial value = true */ 
    let title_field = document.getElementById('mobile-title');
    let body_field = document.getElementById("mobile-body");
    new_bit.append('type', type);
    /*Check bit type in order to properly validate form and transmit data */
    if (type === 'chat') {

        /*Get title*/
        let title = title_field.value;
        /*Check if there is a title and append data to new_bit */
        if (title.length > 0) {
            new_bit.append('title', title);
        } else {
            new_bit.append('title', 'yb-no-title');
        }

        /*Get body and append it to new_bit */
        let body = body_field.value;
        if (body.length > 0) {
            new_bit.append('body', body);
        } else {
            is_valid = false;
            body_field.style.backgroundColor = 'rgba(255, 0, 0, 0.8)';
            body_field.attr('placeholder') = 'Must Enter a body';
        }

    }
    
    if (type === 'photo') {
        /*Get title and append it to new_bit*/
        let title = title_field.value;
        new_bit.append('title', title);

        if (title.length > 0) {
            new_bit.append('title', title);
        } else {
            is_valid = false;
            body_field.style.backgroundColor = 'rgba(255, 0, 0, 0.8)';
            body_field.attr('placeholder') = 'Must Enter a Title';
        }

        /*Get body and append it to new_bit*/
        let summary = body_field.value;
        new_bit.append('body', summary);
        if (summary.length > 0) {
            new_bit.append('summary', summary);
        } else {
            new_bit.append('summary', 'yb-no-summary');
        }
        /*Get image and append it to new_bit*/
        let img = $('#mobile-file-field')[0].files[0];
        new_bit.append('photo', img);


    }

    if (type === 'video') {
            /*Get title and append it to new_bit*/
            let title = document.getElementById("mobile-title");
            new_bit.append('title', title);
            /*Get body and append it to new_bit*/
            let body = document.getElementById("mobile-body");
            new_bit.append('body', body);
            /*Get video and append it to new_bit*/
            let vid = $('#mobile-file-field')[0].files[0];
            new_bit.append('video', vid);
    } 

    if (is_valid === true) {
        callback(new_bit);
    }
}

/*
    Universal Create Bit Functions
*/

function submitBit(new_bit) {
    let cookie = document.cookie;
    let csrfToken = getCSRF();
    let iframe = getIframe();
    $.ajax(
        {
            type: 'POST',
            contentType: false,
            // The following is necessary so jQuery won't try to convert the object into a string
            processData: false,
            headers: {
                'X-CSRFToken': csrfToken
            },
            url: '/social/publish/',
            data: new_bit,
            success: function(){
                clearBitForm();
                iframe.contentWindow.location.reload();
                dropCreateBit(hideCreateBit);

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

/*Bits in feed */
          
$(".chat-bit-profile-picture-link").click(function() {
    let username = $(this).attr("data-username");
    console.log(username)
    window.top.location.replace(`${base_url}/social/profile/${username}`);
});

$('.feedback-icon').click(function(){
    var catid;
    catid = $(this).attr("data-catid");
    console.log(catid);
    button_name = $(this).attr("name");

    let cookie = document.cookie;
    let csrfToken = parent.getCSRF()
    console.log('csrf:' + csrfToken)

    if (button_name === "like"){
        $.ajax(
        {
            type:"POST",
            headers: {
                'X-CSRFToken': csrfToken
              },
            url: "/social/like/",
            data: {
                bit_id: catid 
            },
            success: function(data){
                let json_file = data;

                console.log(json_file.icon_color);
                if (json_file.action === 'like') {
                    let like_count = json_file.like_count
                    let dislike_count = json_file.dislike_count

                    dislike_count = dislike_count.toString();
                    like_count = like_count.toString();
                    $('#like' + catid).css("background-color", json_file.accent_color);
                    $('#like-icon-'+catid).css("fill", json_file.icon_color);
                    $('#dislike' + catid).css("background-color", "rgba(0,0,0,0)");
                    $('#active-dislike-icon-' + catid).css("fill", "white");
                    $('#dislike-icon-' + catid).css("fill", "white");
                    $('#like-count' + catid).replaceWith(`<p id="like-count${catid}" class="counter" style="grid-column: 2; color: lightgreen; margin-top: auto; margin-bottom: auto;">${like_count}</p>`);
                    $('#dislike-count' + catid).replaceWith(`<p id="dislike-count${catid}" class="counter" style="grid-column: 4; color: lightgreen; margin-top: auto; margin-bottom: auto;">${dislike_count}</p>`);
                    let to_user = json_file.to_user;
                    let from_user = json_file.from_user;
                    let type = 1;
                    parent.Notify(type, from_user, to_user);
                } else {
                    let like_count = json_file.like_count
                    let dislike_count = json_file.dislike_count

                    dislike_count = dislike_count.toString();
                    like_count = like_count.toString();
                    $('#like' + catid).css("background-color", "rgba(0,0,0,0)");
                    $('#active-like-icon-' + catid).css("fill", "white");
                    $('#like-icon' + catid).css("fill", "white");
                    $('#like-count' + catid).replaceWith(`<p id="like-count${catid}" class="counter" style="grid-column: 2; color: lightgreen; margin-top: auto; margin-bottom: auto;">${like_count}</p>`);
                    $('#dislike-count' + catid).replaceWith(`<p id="dislike-count${catid}" class="counter" style="grid-column: 4; color: lightgreen; margin-top: auto; margin-bottom: auto;">${dislike_count}</p>`);                   
                }

            }


        });
    }

    if (button_name === "dislike"){
        $.ajax(
            {
                type:"POST",
                headers: {
                    'X-CSRFToken': csrfToken
                  },
                url: "/social/dislike/",
                data: {
                    bit_id: catid
                },
                success: function(data){
                    let json_file = data;
                    if (json_file.action === 'dislike') {
                        let like_count = json_file.like_count
                        let dislike_count = json_file.dislike_count
                        dislike_count = dislike_count.toString();
                        like_count = like_count.toString();
                        $('#dislike' + catid).css("background-color", json_file.accent_color);
                        $('#dislike-icon-'+catid).css("fill", json_file.icon_color);
                        $('#like' + catid).css("background-color", "rgba(0,0,0,0)");
                        $('#active-like-icon-' + catid).css("fill", "white");
                        $('#like-icon-' + catid).css("fill", "white");
                        $('#dislike-count' + catid).replaceWith(`<p id="dislike-count${catid}" class="counter" style="grid-column: 4; color: lightgreen; margin-top: auto; margin-bottom: auto;">${dislike_count}</p>`);
                        $('#like-count' + catid).replaceWith(`<p id="like-count${catid}" class="counter" style="grid-column: 2; color: lightgreen; margin-top: auto; margin-bottom: auto;">${like_count}</p>`);  
                    } else {
                        let like_count = json_file.like_count
                        let dislike_count = json_file.dislike_count
                        dislike_count = dislike_count.toString();
                        like_count = like_count.toString();
                        $('#dislike' + catid).css("background-color", "rgba(0,0,0,0)"); 
                        $('#dislike-icon-' + catid).css("fill", "white");
                        $('#like-count' + catid).replaceWith(`<p id="like-count${catid}" class="counter" style="grid-column: 2; color: lightgreen; margin-top: auto; margin-bottom: auto;">${like_count}</p>`);
                        $('#dislike-count' + catid).replaceWith(`<p id="dislike-count${catid}" class="counter" style="grid-column: 4; color: lightgreen; margin-top: auto; margin-bottom: auto;">${dislike_count}</p>`);
                        $('#active-dislike-icon-' + catid).css("fill", "white");                            
                    }
                }

            }
        )
    }

    /* Comment Interactions */

    if (button_name === 'show_comment') {
        console.log('comment_clicked')
        let comment_display_id = `chat-comment-display-container${catid}`;
        console.log(comment_display_id)
        let comment_label_id = `comments-display-label${catid}`
        $(this).replaceWith(`<button type="button" class="feedback-icon" name = "hide_comment" onclick="hideComments('${comment_display_id}','${comment_label_id}')" id="comment-post-button" href="#" data-catid="${catid}" ><svg id="feedback-icon-source" xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="M6 14H18V12H6ZM6 11H18V9H6ZM6 8H18V6H6ZM22 22 18 18H4Q3.175 18 2.588 17.413Q2 16.825 2 16V4Q2 3.175 2.588 2.587Q3.175 2 4 2H20Q20.825 2 21.413 2.587Q22 3.175 22 4ZM4 4V16Q4 16 4 16Q4 16 4 16H18.825L20 17.175V4Q20 4 20 4Q20 4 20 4H4Q4 4 4 4Q4 4 4 4ZM4 4V17.175V16Q4 16 4 16Q4 16 4 16V4Q4 4 4 4Q4 4 4 4Q4 4 4 4Q4 4 4 4Z"/></svg></button>`);
        ShowComments(comment_display_id, comment_label_id)
    }

    if (button_name === 'hide_comment') {
        let comment_display_id = `chat-comment-display-container${catid}`;
        console.log(comment_display_id)
        let comment_label_id = `comments-display-label${catid}`
        $(this).replaceWith(`<button type="button" class="feedback-icon" name = "show_comment" onclick="hideComments('${comment_display_id}','${comment_label_id}')" id="comment-post-button" href="#" data-catid="${catid}" ><svg id="feedback-icon-source" xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="M6 14H18V12H6ZM6 11H18V9H6ZM6 8H18V6H6ZM22 22 18 18H4Q3.175 18 2.588 17.413Q2 16.825 2 16V4Q2 3.175 2.588 2.587Q3.175 2 4 2H20Q20.825 2 21.413 2.587Q22 3.175 22 4ZM4 4V16Q4 16 4 16Q4 16 4 16H18.825L20 17.175V4Q20 4 20 4Q20 4 20 4H4Q4 4 4 4Q4 4 4 4ZM4 4V17.175V16Q4 16 4 16Q4 16 4 16V4Q4 4 4 4Q4 4 4 4Q4 4 4 4Q4 4 4 4Z"/></svg></button>`);
        hideComments(comment_display_id, comment_label_id)
    }

});

function ShowComments(bit_id, label_id) {
    $(`#${bit_id}`).show();
    $(`#${label_id}`).show();

}

function hideComments(bit_id, label_id) {
    $(`#${bit_id}`).hide();
    $(`#${label_id}`).hide();

}


function getComments(id) {
    $.ajax ({
        type:"POST",
        headers: {
            'X-CSRFToken': csrfToken
          },
        url: "/social/get-comments/",
        data: {
            bit_id: id
        },
        success: function(data){
            let response = data;
            let comment_display_id = `chat-comment-display`;
            showComments(bit_id, label_id)

        }
        
})
}

$('.feedback-icon-active').click(function(){
    var catid;
    catid = $(this).attr("data-catid");
    console.log(catid);
    button_name = $(this).attr("name");

    let cookie = document.cookie;
    let csrfToken = parent.getCSRF();

    if (button_name === "like"){
        $.ajax(
        {
            type:"POST",
            headers: {
                'X-CSRFToken': csrfToken
              },
            url: "/social/like/",
            data: {
                bit_id: catid 
            },
            success: function(data){
                let json_file = data;
                console.log(json_file.icon_color);
                if (json_file.action === 'like') {
                    let like_count = json_file.like_count
                    let dislike_count = json_file.dislike_count

                    dislike_count = dislike_count.toString();
                    like_count = like_count.toString();
                    $('#like' + catid).css("background-color", json_file.accent_color);
                    $('#like-icon-'+catid).css("fill", json_file.icon_color);
                    $('#dislike' + catid).css("background-color", "rgba(0,0,0,0)");
                    $('#active-dislike-icon-' + catid).css("fill", "white");
                    $('#dislike-icon-' + catid).css("fill", "white");
                    console.log(like_count)
                    $('#like-count' + catid).replaceWith(`<p id="like-count${catid}" class="counter" style="grid-column: 2; color: lightgreen; margin-top: auto; margin-bottom: auto;">${like_count}</p>`);
                    $('#dislike-count' + catid).replaceWith(`<p id="dislike-count${catid}" class="counter" style="grid-column: 4; color: lightgreen; margin-top: auto; margin-bottom: auto;">${dislike_count}</p>`);
                    let to_user = json_file.to_user;
                    let from_user = json_file.from_user;
                    let type = 1;
                    parent.Notify(type, from_user, to_user);
                } else {
                    let like_count = json_file.like_count
                    let dislike_count = json_file.dislike_count

                    dislike_count = dislike_count.toString();
                    like_count = like_count.toString();
                    $('#like' + catid).css("background-color", "rgba(0,0,0,0)");
                    $('#active-like-icon-' + catid).css("fill", "white");
                    $('#like-icon' + catid).css("fill", "white");
                    $('#like-count' + catid).replaceWith(`<p id="like-count${catid}" class="counter" style="grid-column: 2; color: lightgreen; margin-top: auto; margin-bottom: auto;">${like_count}</p>`);
                    $('#dislike-count' + catid).replaceWith(`<p id="dislike-count${catid}" class="counter" style="grid-column: 4; color: lightgreen; margin-top: auto; margin-bottom: auto;">${dislike_count}</p>`);                   
                }

            }


        }
    )
    }

    if (button_name === "dislike"){
        $.ajax(
            {
                type:"POST",
                headers: {
                    'X-CSRFToken': csrfToken
                  },
                url: "/social/dislike/",
                data: {
                    bit_id: catid
                },
                success: function(data){
                    let json_file = data;
                    let user_name = json_file.user_name;
                    if (json_file.action === 'dislike') {
                        let like_count = json_file.like_count
                        let dislike_count = json_file.dislike_count
    
                        dislike_count = dislike_count.toString();
                        like_count = like_count.toString();
                        $('#dislike' + catid).css("background-color", json_file.accent_color);
                        $('#dislike-icon-'+catid).css("fill", json_file.icon_color);
                        $('#like' + catid).css("background-color", "rgba(0,0,0,0)");
                        $('#active-like-icon-' + catid).css("fill", "white");
                        $('#like-icon-' + catid).css("fill", "white");
                        $('#like-count' + catid).replaceWith(`<p id="like-count${catid}" class="counter" style="grid-column: 2; color: lightgreen; margin-top: auto; margin-bottom: auto;">${like_count}</p>`);
                        $('#dislike-count' + catid).replaceWith(`<p id="dislike-count${catid}" class="counter" style="grid-column: 4; color: lightgreen; margin-top: auto; margin-bottom: auto;">${dislike_count}</p>`);
                        parent.showNotification(expandNotification, `Disliked ${user_name}'s bit`);  
                    } else {
                        let like_count = json_file.like_count
                        let dislike_count = json_file.dislike_count
    
                        dislike_count = dislike_count.toString();
                        like_count = like_count.toString();
                        $('#dislike' + catid).css("background-color", "rgba(0,0,0,0)");
                        $('#active-dislike-icon-' + catid).css("fill", "white");  
                        $('#dislike-icon-' + catid).css("fill", "white");
                        $('#like-count' + catid).replaceWith(`<p id="like-count${catid}" class="counter" style="grid-column: 2; color: lightgreen; margin-top: auto; margin-bottom: auto;">${like_count}</p>`);
                        $('#dislike-count' + catid).replaceWith(`<p id="dislike-count${catid}" class="counter" style="grid-column: 4; color: lightgreen; margin-top: auto; margin-bottom: auto;">${dislike_count}</p>`);                            
                        parent.showNotification(expandNotification, `Undisliked ${user_name}'s bit`);
                    }
                    
                }

            }
        )
    }

});


$('.send-comment').click(function() {
    var catid;
    catid = $(this).attr("data-catid");
    Comment(catid);
});

function Comment(catid) {
    let cookie = document.cookie;
    let csrfToken = parent.getCSRF();

    let form_value = $('#field-write-comment' + catid).val();
    console.log(form_value)

    $.ajax(
        {
            type:"POST",
            headers: {
                'X-CSRFToken': csrfToken
              },
            url: "/social/comment/",
            data: {
                bit_id: catid,
                comment: form_value
            },
            success: function(data){
                let json_file = data;
                let comment_count = json_file.comment_count;
                let accent_color = json_file.accent_color;
                let icon_color = json_file.icon_color;
                var from_user_name = json_file.from_user_name;
                console.log(accent_color)
                $('#chat-comment-display-container'+catid).prepend(
                    `<div id="right-comment-display-wrapper">
                        <div id="chat-comment-display-right" style="background-color: ${accent_color}">
                        <p id="comment-text">
                         <strong>${from_user_name}</strong>: ${form_value}</p><weak id="comment-time">Now</weak>
                        </div>
                    </div>
                    <br>`

                    )
                $('#field-write-comment' + catid).val('');
                $(`#comment-count${catid}`).replaceWith(`<p id="comment-count${catid}" class="counter">${comment_count}</p>`);
                $(`#comments-display-label${catid}`).show();
                $(`#chat-comment-display-container${catid}`).show();
                let comment_display = document.getElementById(`chat-comment-display-container${catid}`);
                comment_display.scrollTo(0, 0);
                let type = 2;
                let from_user = json_file.from_user;
                let to_user = json_file.to_user;
                parent.Notify(type, from_user, to_user);

                
                
            }

        }

    )
};

$('.create-option').click(function() {
    let name = $(this).attr('name')
    let form = document.getElementById('mobile-bit-inputs');
    let type_field = document.getElementById('bit-type-hidden-field')
    if (name === 'chat' ){
        type_field.value = 'chat';
        $('#create-options').fadeOut();
        $('#create-container').fadeIn();
        $('#create-bit-header-text').html('Create Chat Bit');
        form.innerHTML = `
            <input type="text" class="single-line-input" id="mobile-to" placeholder="To: (Optional)" style="color:white; font-size: 16px; font-weight: 600;"><br><br>                          
            <input type="text" class="single-line-input" id="mobile-title" placeholder="Title (Optional)" style="color:white; font-size: 16px; font-weight: 600;">
            <textarea id="mobile-body" placeholder="Body" style="color:white; font-size: 14px;"></textarea>
        `
        $('#text-type-button').replaceWith(`<a id = "text-type-button" class = "type-button-active" name = "chat"><svg class="space-button-image" xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="M.95 17.8V1.85q0-.5.325-.825Q1.6.7 2.1.7h14.25q.5 0 .825.325.325.325.325.825V12q0 .5-.325.825-.325.325-.825.325H5.6Zm5.8.9q-.5 0-.825-.325-.325-.325-.325-.825v-2.4h13.9V5.4h2.4q.5 0 .825.325.325.325.325.825v16.8L18.4 18.7Zm8.1-15.35H3.6v8.05l.9-.9h10.35Zm-11.25 0v8.05Z"/></svg></a>`);
        $('#photo-type-button').replaceWith(`<a id = "photo-type-button" class = "type-button" onclick="changeBitForm('photo')" name = "photo"><svg class="space-button-image" xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="M12 17.75q1.925 0 3.263-1.337Q16.6 15.075 16.6 13.15q0-1.925-1.337-3.263Q13.925 8.55 12 8.55q-1.925 0-3.262 1.337Q7.4 11.225 7.4 13.15q0 1.925 1.338 3.263Q10.075 17.75 12 17.75Zm0-2.65q-.8 0-1.375-.575t-.575-1.375q0-.8.575-1.375T12 11.2q.8 0 1.375.575t.575 1.375q0 .8-.575 1.375T12 15.1Zm-8.15 6.725q-1.1 0-1.875-.775-.775-.775-.775-1.875V7.125q0-1.1.775-1.875.775-.775 1.875-.775h3.025l2.05-2.25h6.15l2.05 2.25h3.025q1.1 0 1.875.775.775.775.775 1.875v12.05q0 1.1-.775 1.875-.775.775-1.875.775Zm16.3-2.65V7.125h-4.2l-2.05-2.25h-3.8l-2.05 2.25h-4.2v12.05ZM12 13.15Z"/></svg></a>`);
        $('#video-type-button').replaceWith(`<a id = "video-type-button" class = "type-button" onclick="changeBitForm('video')" name = "video"><svg class="space-button-image" xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="m9.15 17.15 8-5.15-8-5.15ZM12 22.8q-2.25 0-4.213-.85-1.962-.85-3.424-2.312Q2.9 18.175 2.05 16.212 1.2 14.25 1.2 12t.85-4.225Q2.9 5.8 4.363 4.338q1.462-1.463 3.424-2.301Q9.75 1.2 12 1.2t4.225.837q1.975.838 3.438 2.301 1.462 1.462 2.299 3.437Q22.8 9.75 22.8 12q0 2.25-.838 4.212-.837 1.963-2.299 3.426Q18.2 21.1 16.225 21.95q-1.975.85-4.225.85Zm0-2.65q3.425 0 5.788-2.363Q20.15 15.425 20.15 12t-2.362-5.788Q15.425 3.85 12 3.85q-3.425 0-5.787 2.362Q3.85 8.575 3.85 12q0 3.425 2.363 5.787Q8.575 20.15 12 20.15ZM12 12Z"/></svg></a>`);

    }
    if (name === 'video'){
        $('#create-options').fadeOut();
        $('#create-container').fadeIn();
        type_field.value = 'video';
        $('#create-bit-header-text').html('Create Video Bit');
        form.innerHTML = `
            <input type="text" class="single-line-input" id="mobile-to" placeholder="To: (Optional)" style="color:white; font-size: 16px; font-weight: 600;"><br><br>
            <input type="text" class="single-line-input" id="mobile-title" placeholder="Title (Optional)" style="color:white; font-size: 16px; font-weight: 600;">
            <textarea id="mobile-body" placeholder="Info" style="color:white; font-size: 14px;"></textarea>
            <input type="file" id="mobile-file-field" accept=".mp4, .mov, .avi, .3GP, .FLV, .MKV"/>
        `
        $('#text-type-button').replaceWith(`<a id = "text-type-button" onclick="changeBitForm('chat')" class = "type-button" name = "chat"><svg class="space-button-image" xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="M.95 17.8V1.85q0-.5.325-.825Q1.6.7 2.1.7h14.25q.5 0 .825.325.325.325.325.825V12q0 .5-.325.825-.325.325-.825.325H5.6Zm5.8.9q-.5 0-.825-.325-.325-.325-.325-.825v-2.4h13.9V5.4h2.4q.5 0 .825.325.325.325.325.825v16.8L18.4 18.7Zm8.1-15.35H3.6v8.05l.9-.9h10.35Zm-11.25 0v8.05Z"/></svg></a>`);
        $('#photo-type-button').replaceWith(`<a id = "photo-type-button" onclick="changeBitForm('photo')" class = "type-button" name = "photo"><svg class="space-button-image" xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="M12 17.75q1.925 0 3.263-1.337Q16.6 15.075 16.6 13.15q0-1.925-1.337-3.263Q13.925 8.55 12 8.55q-1.925 0-3.262 1.337Q7.4 11.225 7.4 13.15q0 1.925 1.338 3.263Q10.075 17.75 12 17.75Zm0-2.65q-.8 0-1.375-.575t-.575-1.375q0-.8.575-1.375T12 11.2q.8 0 1.375.575t.575 1.375q0 .8-.575 1.375T12 15.1Zm-8.15 6.725q-1.1 0-1.875-.775-.775-.775-.775-1.875V7.125q0-1.1.775-1.875.775-.775 1.875-.775h3.025l2.05-2.25h6.15l2.05 2.25h3.025q1.1 0 1.875.775.775.775.775 1.875v12.05q0 1.1-.775 1.875-.775.775-1.875.775Zm16.3-2.65V7.125h-4.2l-2.05-2.25h-3.8l-2.05 2.25h-4.2v12.05ZM12 13.15Z"/></svg></a>`);
        $('#video-type-button').replaceWith(`<a id = "video-type-button" class = "type-button-active" name = "video"><svg class="space-button-image" xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="m9.15 17.15 8-5.15-8-5.15ZM12 22.8q-2.25 0-4.213-.85-1.962-.85-3.424-2.312Q2.9 18.175 2.05 16.212 1.2 14.25 1.2 12t.85-4.225Q2.9 5.8 4.363 4.338q1.462-1.463 3.424-2.301Q9.75 1.2 12 1.2t4.225.837q1.975.838 3.438 2.301 1.462 1.462 2.299 3.437Q22.8 9.75 22.8 12q0 2.25-.838 4.212-.837 1.963-2.299 3.426Q18.2 21.1 16.225 21.95q-1.975.85-4.225.85Zm0-2.65q3.425 0 5.788-2.363Q20.15 15.425 20.15 12t-2.362-5.788Q15.425 3.85 12 3.85q-3.425 0-5.787 2.362Q3.85 8.575 3.85 12q0 3.425 2.363 5.787Q8.575 20.15 12 20.15ZM12 12Z"/></svg></a>`);
    }

    if (name === 'photo'){
        $('#create-options').fadeOut();
        $('#create-container').fadeIn();
        type_field.value = 'photo';
        $('#create-bit-header-text').html('Create Photo Bit');
        form.innerHTML = `
            <input type="text" class="single-line-input" id="mobile-to" placeholder="To: (Optional)" style="color:white; font-size: 16px; font-weight: 600;"><br><br>
            <input type="text" class="single-line-input" id="mobile-title" placeholder="Title (Optional)" style="color:white; font-size: 16px; font-weight: 600;">
            <textarea id="mobile-body" placeholder="Info" style="color:white; font-size: 14px;"></textarea>
            <input type="file" id="mobile-file-field" accept=".jpg, .jpeg, .png"/>
        `
        $('#text-type-button').replaceWith(`<a id = "text-type-button" onclick="changeBitForm('chat')" class = "type-button" name = "chat"><svg class="space-button-image" xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="M.95 17.8V1.85q0-.5.325-.825Q1.6.7 2.1.7h14.25q.5 0 .825.325.325.325.325.825V12q0 .5-.325.825-.325.325-.825.325H5.6Zm5.8.9q-.5 0-.825-.325-.325-.325-.325-.825v-2.4h13.9V5.4h2.4q.5 0 .825.325.325.325.325.825v16.8L18.4 18.7Zm8.1-15.35H3.6v8.05l.9-.9h10.35Zm-11.25 0v8.05Z"/></svg></a>`);
        $('#photo-type-button').replaceWith(`<a id = "photo-type-button" class = "type-button-active" name = "photo"><svg class="space-button-image" xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="M12 17.75q1.925 0 3.263-1.337Q16.6 15.075 16.6 13.15q0-1.925-1.337-3.263Q13.925 8.55 12 8.55q-1.925 0-3.262 1.337Q7.4 11.225 7.4 13.15q0 1.925 1.338 3.263Q10.075 17.75 12 17.75Zm0-2.65q-.8 0-1.375-.575t-.575-1.375q0-.8.575-1.375T12 11.2q.8 0 1.375.575t.575 1.375q0 .8-.575 1.375T12 15.1Zm-8.15 6.725q-1.1 0-1.875-.775-.775-.775-.775-1.875V7.125q0-1.1.775-1.875.775-.775 1.875-.775h3.025l2.05-2.25h6.15l2.05 2.25h3.025q1.1 0 1.875.775.775.775.775 1.875v12.05q0 1.1-.775 1.875-.775.775-1.875.775Zm16.3-2.65V7.125h-4.2l-2.05-2.25h-3.8l-2.05 2.25h-4.2v12.05ZM12 13.15Z"/></svg></a>`);
        $('#video-type-button').replaceWith(`<a id = "video-type-button" onclick="changeBitForm('video')" class = "type-button" name = "video"><svg class="space-button-image" xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="m9.15 17.15 8-5.15-8-5.15ZM12 22.8q-2.25 0-4.213-.85-1.962-.85-3.424-2.312Q2.9 18.175 2.05 16.212 1.2 14.25 1.2 12t.85-4.225Q2.9 5.8 4.363 4.338q1.462-1.463 3.424-2.301Q9.75 1.2 12 1.2t4.225.837q1.975.838 3.438 2.301 1.462 1.462 2.299 3.437Q22.8 9.75 22.8 12q0 2.25-.838 4.212-.837 1.963-2.299 3.426Q18.2 21.1 16.225 21.95q-1.975.85-4.225.85Zm0-2.65q3.425 0 5.788-2.363Q20.15 15.425 20.15 12t-2.362-5.788Q15.425 3.85 12 3.85q-3.425 0-5.787 2.362Q3.85 8.575 3.85 12q0 3.425 2.363 5.787Q8.575 20.15 12 20.15ZM12 12Z"/></svg></a>`);
    
    }

    if (name === 'community'){
        $('#create-options').fadeOut();

    }
    if (name === 'message'){
        $('#create-options').fadeOut();

    }
})


