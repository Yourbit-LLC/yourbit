/*
--Create Bit Functions--
*/

$('#mobile-create-icon').click(function() {
    showCreateBit(raiseCreateBit);
});

$('#bit-panel-close').click(function() {
    dropCreateBit(hideCreateBit)
});

function showCreateBit(callback) {
    let create_bit = document.getElementById('create-bit-mobile');
    create_bit.style.visibility='visible';
    callback(titleFocus);
}

function titleFocus() {
    let create_bit = document.getElementById('create-bit-mobile');
    $('#mobile-title').focus();
}

function raiseCreateBit(callback){
    let create_bit = document.getElementById('create-bit-mobile');
    create_bit.style.transform = 'translate(0, -80vh)';
    setTimeout(callback, 500);
}

function dropCreateBit(followUp) {
    let create_bit = document.getElementById('create-bit-mobile');
    create_bit.style.transform = 'translate(0, 0vh)';
    followUp();
}

function hideCreateBit() {
    let create_bit = document.getElementById('create-bit-mobile');
    create_bit.style.visibility='hidden';
}

$('#mobile-publish-bit').click(function() {
    submitBit()
});

function submitBit() {
    let title_field = document.getElementById("mobile-title");
    let body_field = document.getElementById("mobile-body");
    let title = title_field.value;
    let body = body_field.value;
    let cookie = document.cookie;
    let csrfToken = cookie.substring(cookie.indexOf('=') + 1);
    console.log(title)
    $.ajax(
        {
            type: 'POST',
            headers: {
                'X-CSRFToken': csrfToken
            },
            url: '/social/publish/',
            data: {
                title: title,
                body: body
            },
            success: function(){
                iframe.contentWindow.location.reload();
                dropCreateBit(hideCreateBit);

            }
        }
    )
}

$('.type-button').click(function() {
    let button_name = $(this).attr('name');
    changeType(button_name);
});

function changeType(button_name) {
    if (button_name === 'chat'){
        $('bit-type-hidden-field').val('chat');
        

    }

    if (button_name === 'video'){
        $('bit-type-hidden-field').val('video');
    }

    if (button_name === 'photo'){
        $('bit-type-hidden-field').val('photo');
    }

};

/*
    ------- Function Change Mobile Bit form ----------
*/

function changeBitForm(button_name) {

    /* Set form equal to mobile-bit-inputs container */
    let form = document.getElementById('mobile-bit-inputs');

    
    if (button_name === 'chat') {
        form.innerHTML = `                            
            <input type="text" class="single-line-input" id="mobile-title" placeholder="Title (Optional)" style="color:white; font-size: 16px; font-weight: 600;">
            <textarea id="mobile-body" placeholder="Body" style="color:white; font-size: 14px;"></textarea>
        `
        $('#text-type-button').replaceWith(`<a id = "text-type-button" class = "type-button-active" name = "chat"><svg class="space-button-image" xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="M.95 17.8V1.85q0-.5.325-.825Q1.6.7 2.1.7h14.25q.5 0 .825.325.325.325.325.825V12q0 .5-.325.825-.325.325-.825.325H5.6Zm5.8.9q-.5 0-.825-.325-.325-.325-.325-.825v-2.4h13.9V5.4h2.4q.5 0 .825.325.325.325.325.825v16.8L18.4 18.7Zm8.1-15.35H3.6v8.05l.9-.9h10.35Zm-11.25 0v8.05Z"/></svg></a>`);
        $('#photo-type-button').replaceWith(`<a id = "photo-type-button" class = "type-button" onclick="changeBitForm('photo')" name = "photo"><svg class="space-button-image" xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="M12 17.75q1.925 0 3.263-1.337Q16.6 15.075 16.6 13.15q0-1.925-1.337-3.263Q13.925 8.55 12 8.55q-1.925 0-3.262 1.337Q7.4 11.225 7.4 13.15q0 1.925 1.338 3.263Q10.075 17.75 12 17.75Zm0-2.65q-.8 0-1.375-.575t-.575-1.375q0-.8.575-1.375T12 11.2q.8 0 1.375.575t.575 1.375q0 .8-.575 1.375T12 15.1Zm-8.15 6.725q-1.1 0-1.875-.775-.775-.775-.775-1.875V7.125q0-1.1.775-1.875.775-.775 1.875-.775h3.025l2.05-2.25h6.15l2.05 2.25h3.025q1.1 0 1.875.775.775.775.775 1.875v12.05q0 1.1-.775 1.875-.775.775-1.875.775Zm16.3-2.65V7.125h-4.2l-2.05-2.25h-3.8l-2.05 2.25h-4.2v12.05ZM12 13.15Z"/></svg></a>`);
        $('#video-type-button').replaceWith(`<a id = "video-type-button" class = "type-button" onclick="changeBitForm('video')" name = "video"><svg class="space-button-image" xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="m9.15 17.15 8-5.15-8-5.15ZM12 22.8q-2.25 0-4.213-.85-1.962-.85-3.424-2.312Q2.9 18.175 2.05 16.212 1.2 14.25 1.2 12t.85-4.225Q2.9 5.8 4.363 4.338q1.462-1.463 3.424-2.301Q9.75 1.2 12 1.2t4.225.837q1.975.838 3.438 2.301 1.462 1.462 2.299 3.437Q22.8 9.75 22.8 12q0 2.25-.838 4.212-.837 1.963-2.299 3.426Q18.2 21.1 16.225 21.95q-1.975.85-4.225.85Zm0-2.65q3.425 0 5.788-2.363Q20.15 15.425 20.15 12t-2.362-5.788Q15.425 3.85 12 3.85q-3.425 0-5.787 2.362Q3.85 8.575 3.85 12q0 3.425 2.363 5.787Q8.575 20.15 12 20.15ZM12 12Z"/></svg></a>`);
    }
    
    if (button_name === 'video') {
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
        form.innerHTML = `
            <input type="text" class="single-line-input" id="mobile-title" placeholder="Title (Optional)" style="color:white; font-size: 16px; font-weight: 600;">
            <textarea id="mobile-body" placeholder="Info" style="color:white; font-size: 14px;"></textarea>
            <input type="file" id="mobile-file-field" accept=".jpg, .jpeg, .png"/>
        `
        $('#text-type-button').replaceWith(`<a id = "text-type-button" onclick="changeBitForm('chat')" class = "type-button" name = "chat"><svg class="space-button-image" xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="M.95 17.8V1.85q0-.5.325-.825Q1.6.7 2.1.7h14.25q.5 0 .825.325.325.325.325.825V12q0 .5-.325.825-.325.325-.825.325H5.6Zm5.8.9q-.5 0-.825-.325-.325-.325-.325-.825v-2.4h13.9V5.4h2.4q.5 0 .825.325.325.325.325.825v16.8L18.4 18.7Zm8.1-15.35H3.6v8.05l.9-.9h10.35Zm-11.25 0v8.05Z"/></svg></a>`);
        $('#photo-type-button').replaceWith(`<a id = "photo-type-button" class = "type-button-active" name = "photo"><svg class="space-button-image" xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="M12 17.75q1.925 0 3.263-1.337Q16.6 15.075 16.6 13.15q0-1.925-1.337-3.263Q13.925 8.55 12 8.55q-1.925 0-3.262 1.337Q7.4 11.225 7.4 13.15q0 1.925 1.338 3.263Q10.075 17.75 12 17.75Zm0-2.65q-.8 0-1.375-.575t-.575-1.375q0-.8.575-1.375T12 11.2q.8 0 1.375.575t.575 1.375q0 .8-.575 1.375T12 15.1Zm-8.15 6.725q-1.1 0-1.875-.775-.775-.775-.775-1.875V7.125q0-1.1.775-1.875.775-.775 1.875-.775h3.025l2.05-2.25h6.15l2.05 2.25h3.025q1.1 0 1.875.775.775.775.775 1.875v12.05q0 1.1-.775 1.875-.775.775-1.875.775Zm16.3-2.65V7.125h-4.2l-2.05-2.25h-3.8l-2.05 2.25h-4.2v12.05ZM12 13.15Z"/></svg></a>`);
        $('#video-type-button').replaceWith(`<a id = "video-type-button" onclick="changeBitForm('video')" class = "type-button" name = "video"><svg class="space-button-image" xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="m9.15 17.15 8-5.15-8-5.15ZM12 22.8q-2.25 0-4.213-.85-1.962-.85-3.424-2.312Q2.9 18.175 2.05 16.212 1.2 14.25 1.2 12t.85-4.225Q2.9 5.8 4.363 4.338q1.462-1.463 3.424-2.301Q9.75 1.2 12 1.2t4.225.837q1.975.838 3.438 2.301 1.462 1.462 2.299 3.437Q22.8 9.75 22.8 12q0 2.25-.838 4.212-.837 1.963-2.299 3.426Q18.2 21.1 16.225 21.95q-1.975.85-4.225.85Zm0-2.65q3.425 0 5.788-2.363Q20.15 15.425 20.15 12t-2.362-5.788Q15.425 3.85 12 3.85q-3.425 0-5.787 2.362Q3.85 8.575 3.85 12q0 3.425 2.363 5.787Q8.575 20.15 12 20.15ZM12 12Z"/></svg></a>`);
    
    }
}
