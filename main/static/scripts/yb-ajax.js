/*

                    main/yb-ajax.js
                    11/8/2022
                    Yourbit, LLC


*/
//Used when getting a page that doesn't require data submission
//Html Response
var temp_data;

function yb_getFeed(new_feed, callback, callback2, session_start){
    let user_tz = Intl.DateTimeFormat().resolvedOptions().timeZone
    let tz_slash = user_tz.indexOf('/');
    let replace_tz = user_tz[tz_slash];
    let time_zone = user_tz.replace(replace_tz, '-');
    //<div class="post-wrapper" class="container-bit-${type}" data-type="${type}" data-id = "${id}" data-button-color = "${feedback_background_color}" data-icon-color = "${feedback_icon_color}" data-background = "${primary_color}" id = "bit-${id}" style="background-color: ${primary_color} ">
    let start = 0;
    let location = yb_getSessionValues("location");
    console.log(new_feed)
    let url;
    console.log(location)
    
    if (location === "home"){
        url = `
        ${base_url}/api/bits/?type=${new_feed.type}&filter=${new_feed.filter}&sort=${new_feed.sort}&start=${start.toString()}
        `
    }

    if (location === "profile"){
        url = `
        ${base_url}/api/bits/?profile=${new_feed.id}&type=${new_feed.type}&filter=${new_feed.filter}&sort=${new_feed.sort}&start=${start.toString()}
        `
    }

    if (location === "history"){
        url = `
        ${base_url}/api/bits/?dataset=${new_feed.dataset}&type=${new_feed.type}&filter=${new_feed.filter}&sort=${new_feed.sort}&start=${start.toString()}
        `
    }

    if (location === "stuff"){
        if (new_feed.is_cluster === true) {
            url = `
            ${base_url}/api/bits/?cluster=${new_feed.cluster}&type=${new_feed.type}&filter=${new_feed.filter}&sort=${new_feed.sort}&start=${start.toString()}
            `
        } else {
            url = `
            ${base_url}/api/stuff/?type=${new_feed.type}&filter=${new_feed.filter}&sort=${new_feed.sort}&start=${start.toString()}
            `
        }
    }

    console.log(url);

    fetch(url)
    .then((resp) => resp.json())
    .then(function(data){

        console.log(session_start)
        console.log(new_feed.type)
        $('#page-header').remove();

        $('#bit-container').remove();
        let content_container = document.getElementById("content-container")


        if (location === "profile") {
            
            var bit_container =  yb_createElement("div", "bit-container", "yb-sub-container")
            bit_container.setAttribute("style", "top:100vh; padding-top:60px;");

            content_container.appendChild(bit_container);
            
        } 
        else if (location == "home") {
            
            let title = new_feed.type.charAt(0).toUpperCase() + new_feed.type.slice(1);
            let title_display = document.getElementById("page-title-display")
            
            title_display.innerHTML = title + " Space";
            
            var bit_container =  yb_createElement("div", "bit-container", "yb-sub-container")
            bit_container.setAttribute("style", "top:100vh;");

            content_container.appendChild(bit_container);
 
        } else {
            var bit_container =  yb_createElement("div", "bit-container", "yb-sub-container")

            content_container.appendChild(bit_container);

        }
        
  
            
        console.log(data)
        bitstream_index = [];

        if (data.bits_found === true){
            let bitstream = data.content
            let render_bitstream = ''
            $(".feed-message").remove();
            let liked_bits = data.liked_bits;
            let disliked_bits = data.disliked_bits;
            //For each bit received in response add to the bit container
            for (var bit in bitstream) {
                //Create a reusable variable from selected data
                let blueprint = bitstream[bit];

                //Pass selected data to build bit for assembly
                packaged_bit = BuildBit(blueprint, liked_bits, disliked_bits);

                new_bit = packaged_bit.built_bit;

                bit_container.appendChild(new_bit)
                
                bitstream_index.push(packaged_bit.element_id);


            }

        } else {
            $(".feed-message").remove();
            
            let message = yb_createElement("h2", "no-bits-message", "feed-message");
            
            message.setAttribute("style", "color:white; transform: translate(0, -10px); background-color: black; border-radius: 30px; text-align:center; width: 80%; padding: 10px; margin-left: auto; margin-right: auto;");
            message.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" height="48" width="48">
                    <path d="M22.65 34h3V22h-3ZM24 18.3q.7 0 1.175-.45.475-.45.475-1.15t-.475-1.2Q24.7 15 24 15q-.7 0-1.175.5-.475.5-.475 1.2t.475 1.15q.475.45 1.175.45ZM24 44q-4.1 0-7.75-1.575-3.65-1.575-6.375-4.3-2.725-2.725-4.3-6.375Q4 28.1 4 23.95q0-4.1 1.575-7.75 1.575-3.65 4.3-6.35 2.725-2.7 6.375-4.275Q19.9 4 24.05 4q4.1 0 7.75 1.575 3.65 1.575 6.35 4.275 2.7 2.7 4.275 6.35Q44 19.85 44 24q0 4.1-1.575 7.75-1.575 3.65-4.275 6.375t-6.35 4.3Q28.15 44 24 44Zm.05-3q7.05 0 12-4.975T41 23.95q0-7.05-4.95-12T24 7q-7.05 0-12.025 4.95Q7 16.9 7 24q0 7.05 4.975 12.025Q16.95 41 24.05 41ZM24 24Z"/>
                </svg>
                
                <p>${data.message}</p>
            `
            $('#content-container').append(message);
        }
        
        let loaded = yb_getLoaded();
        if (loaded  === false) {

            if (location === "home"){
                post_fly_in(callback2);
                setTimeout(initUI, 1000);
            } else {
                $(bit_container).animate({"top":"0px"})
            }
            yb_setLoaded(true);
        } 
        let mobile_spacer = yb_createElement("div", "mobile-spacer", "ui-spacer");
        bit_container.appendChild(mobile_spacer);
        console.log(bitstream_index)
        if (callback != "none"){
            callback();
        }
        
        
    })
}




//This function is ran on interval of any feed pages
function yb_checkUnfed() {
    let url = `${base_url}/feed/widget/api/get/unfed/`;
    fetch(
        url, 
        {
            method:'GET',
            headers: {
                'content-type' : 'application/json',
                'X-CSRFToken' : csrfToken,
            }
        }
    )
    .then((resp) => resp.json())
    .then(function(data){
        let is_new_bits = data.is_new_bits;
        let new_bits = data.new_bits;
        if (is_new_bits) {
            for (var bit in new_bits){
                let blueprint = new_bits[bit];
                let this_bit = BuildBit(blueprint);
                let bit_container = document.getElementById('bit-container');
                let visible_length = yb_lenBitsOnScreen();
                let feed_location = yb_getBitByIndex(visible_length);

                //Prepend new bit to bit container, in future change to append before next sibling for dynachron.
                bit_container.insertBefore(this_bit.built_bit, feed_location);

                
            }
        }
    })
}

function yb_updateSeenBits(id) {
    let csrfToken = getCSRF();
    let url = `${base_url}/bitstream/widget/api/put/seen_bit/`;
    fetch(
        url,
        {
            method:'POST',
            headers: {
                'Content-type' : 'application/json',
                'X-CSRFToken': csrfToken
            },
            body: JSON.stringify({"action":"update_seen", "bit_id":id})
        })
    .then((resp) => resp.json())
    .then(function(data){
        $(`#view-count-${data.id}`).html(data.view_count)
    })
}


//Publish a bit with attachments
function yb_submitFileBit(this_bit) {
    //Get CSRF token
    let csrfToken = getCSRF();
    console.log(this_bit)
    //Get base url
    let base_url = window.location.origin;

    //Create form data object
    let url = `${base_url}/profile/publish/`

    $.ajax(
        {
            type: 'POST',
            contentType: false,
            // The following is necessary so jQuery won't try to convert the object into a string
            processData: false,
            headers: {
                'X-CSRFToken': csrfToken
            },
            url: url,
            data: request,
            
            success: function(response) {

                //Data is blueprint for bit
                let blueprint = response;
                let bit_container = document.getElementById('bit-container');
                let end_bit = getLenBitIndex();
                let first_bit_id = yb_getBitOnScreen(1);
                first_bit_id = first_bit_id.substring(1);
                console.log(first_bit_id)
                let first_bit = document.getElementById(first_bit_id)
                //Clear and hide form
                clearBitForm();
                dropCreateBit(hideCreateBit);

                //Pass blueprint to bit builder to generate new bit
                let new_bit = BuildBit(blueprint);

                //Prepend new bit to bit container, in future change to append before next sibling for dynachron.
                bit_container.insertBefore(new_bit.built_bit, first_bit);

            }   
        }   
    )

    
}

function yb_editBit(data) {
    
    //Actions 1 = edit title, 2 = edit body, 3 = edit Title/Body
    
    let id = document.getElementById('bit-id-hidden-field').value;

    let this_bit = document.getElementById(`bit-${id}`);

    //Get CSRF token
    let csrfToken = getCSRF();
    
    let edits = new FormData();
    edits.append('bit_id', id)
    
    let action;

    //If 1 - Title Change
    let this_title = this_bit.querySelector('.bit-title').innerHTML;


    if (data.title != this_title) {
        
        action = '1';
        edits.append('title', data.title)
    }

    //If 2 - Body Change
    let body_area = this_bit.querySelector(`.description-bit-${data.type}`);
    let this_body = body_area.querySelector('p').innerHTML;
    if (data.body != this_body) {
        if (action === '1') {
            action = '3';
        } else {
            action = '2';
        }
        edits.append('body', data.body)
    }

    edits.append('action', action)
    //Set url
    var url = `${base_url}/profile/edit/`

    //Create ajax version of request below
    $.ajax({
        type: 'POST',
        contentType: false,
        // The following is necessary so jQuery won't try to convert the object into a string
        processData: false,
        headers: {
            'X-CSRFToken': csrfToken
        },
        url: url,
        data: edits,
        success: function(response) {
            let bit = response.this_bit;
            clearBitForm();
            dropCreateBit(hideCreateBit);
            
            let body_area = this_bit.querySelector(`.description-bit-${bit.type}`);
            console.log(response.edited);
            if (response.edited === "body"){
                body_area.querySelector('p').innerHTML = bit.body
                setTimeout(() => {
                    this_bit.classList.add('animate');
                    }, 100);
                yb_getDisplay();
            }
            if (response.edited === "title"){
                $(`#title-bit-${id}`).html(bit.title);
                setTimeout(() => {
                    this_bit.classList.add('animate');
                    }, 100);
                yb_getDisplay();

            }
            if (response.edited === "both"){
                body_area.querySelector('p').innerHTML = bit.body;
                $(`#title-bit-${id}`).html(bit.title);
                setTimeout(() => {
                    this_bit.classList.add('animate');
                    }, 100);
                yb_getDisplay();
            }
            if (response.edited === "none"){
                console.log("No changes made")
            }
            showNotification(expandNotification, "Successfully Edited Bit");
        }
    })
}
    


function yb_Interact(action, bit, data) {

    let csrfToken = getCSRF();
    let request = {}
    let this_id = bit.getAttribute("data-catid");
    request["bit_id"] = this_id
    let url;

    if (action === "like") {
        url = `${base_url}/profile/api/interact/like/`

    }
    if (action === "dislike") {
        url = `${base_url}/profile/api/interact/dislike/`
    }
    if (action === "comment") {
        url = `${base_url}/profile/api/interact/comment/`
        request["comment"] = data
    }
    if (action === "share") {
        url = `${base_url}/profile/api/interact/share/`
    }

    $.ajax({
        type: 'POST',
        url: url,
        headers: {
            'X-CSRFToken': csrfToken,
            'Content-Type': 'application/json',
        },
        data: JSON.stringify(request),
        success: function(response) {
            console.log(action)
            let cat_id = bit.getAttribute("data-catid");
            
            let like_counter = document.getElementById(`like-count-${cat_id}`);
            let dislike_counter = document.getElementById(`dislike-count-${cat_id}`);
            let comment_counter;
            let share_counter;

            console.log(cat_id);
            console.log(response.interaction)
            if (response.interaction === "added")  {
                
                like_counter = document.getElementById(`like-count-${cat_id}`);
                dislike_counter = document.getElementById(`dislike-count-${cat_id}`);
                let this_button = document.getElementById(`${action}-${cat_id}`);
                let this_icon = document.getElementById(`${action}-icon-${cat_id}`);
                let this_bit = document.getElementById(`bit-${cat_id}`);
                
                //Get button and icon colors
                let button_color = this_bit.getAttribute("data-button-color");
                let icon_color = this_bit.getAttribute("data-icon-color");
                this_button.style.backgroundColor = button_color;
                this_icon.style.fill = icon_color;

                like_counter.innerHTML = response.like_count;
                dislike_counter.innerHTML = response.dislike_count;

                //If action is like or dislike, check if other button is active, if so, deactivate it.
                if (action === "dislike"){
                    let like_button = document.getElementById(`like-${cat_id}`);
                    let like_icon = document.getElementById(`like-icon-${cat_id}`);
                    let dislike_icon = document.getElementById(`dislike-icon-${cat_id}`);
                    like_button.style.backgroundColor = "rgba(0,0,0,0)";
                    like_icon.style.fill = "white";
                    like_icon.classList.remove('flash');
                
                //If action is dislike, check if like button is active, if so, deactivate it.
                } else if (action === "like") {
                    let dislike_button = document.getElementById(`dislike-${cat_id}`);
                    let dislike_icon = document.getElementById(`dislike-icon-${cat_id}`);
                    let like_icon = document.getElementById(`like-icon-${cat_id}`);
                    dislike_button.style.backgroundColor = "rgba(0,0,0,0)";
                    dislike_icon.style.fill = "white";
                    like_icon.classList.remove('flash');
                }

        
            } else {
                let this_button = document.getElementById(`${action}-${cat_id}`);
                let this_icon = document.getElementById(`${action}-icon-${cat_id}`);
                
                this_button.style.backgroundColor = "rgba(0,0,0,0)";
                this_icon.style.fill = "white";
                like_icon.classList.remove('flash');
                like_counter.innerHTML = response.like_count;
                dislike_counter.innerHTML = response.dislike_count;

            }
            
            
        }
    });
}

function yb_getComments(bit_id) {
    let url = `${base_url}/api/comments/${bit_id}/`
    fetch(url)
    .then((resp) => resp.json())
    .then(function(data) {
        let comments = data.comments;
        let this_bit = document.getElementById(`bit-${bit_id}`);
        let comment_container = this_bit.querySelector(".comment-container");

        if (comments.length > 0) {
        
            for (let i = 0; i < comments.length; i++) {
                let comment = comments[i];
                let comment_box = yb_buildComment(comment);
                comment_container.appendChild(comment_box);
            }
            
        } else {
            let comment_box = document.createElement("div");
            comment_box.classList.add("comment-box");
            let comment_body = document.createElement("div");
            comment_body.classList.add("no-comment-body");
            comment_body.innerHTML = "No Comments Yet";
            comment_box.appendChild(comment_body);
            comment_container.appendChild(comment_box);
        }
    });
}

function yb_sendComment(bit_id, comment) {

    let url = `${base_url}/profile/api/interact/comment/`
    let csrfToken = getCSRF();
    let request = {}
    request["comment"] = comment;
    request["bit_id"] = bit_id;
    
    fetch(url, {
        method:'POST',
        headers: {
            'Content-type' : 'application/json',
            'X-CSRFToken':csrfToken
        },
        body: JSON.stringify(request),
    })
    .then((resp) => resp.json())
    .then(function(data) {
        let comment = data.comment;
        let this_bit = document.getElementById(`bit-${bit_id}`);
        let background_color;
        let comment_container = document.getElementById(`comment-container-${bit_id}`);
        let this_button = document.getElementById(`show-comment-${bit_id}`);
        let this_icon = document.getElementById(`comment-icon-${bit_id}`);
        let this_state = this_button.getAttribute("data-state");
        comment_bubble = yb_buildComment(comment);
        comment_container.insertBefore(comment_bubble, comment_container.firstChild);

        let comment_counter = document.getElementById(`comment-count-${bit_id}`);
        comment_counter.innerHTML = data.comment_count;
        if (this_state === "show") {
            yb_showComments(bit_id);
            background_color = this_bit.getAttribute("data-button-color");
            this_icon.style.fill = this_bit.getAttribute("data-icon-color");
            this_button.style.backgroundColor = background_color;



        }
    });
}

function yb_deleteBit(id) {
    var url = `${base_url}/api/bits/${id}/`
    let csrfToken = getCSRF();
    fetch(url, {
        method:'DELETE',
        headers: {
            'Content-type' : 'application/json',
            'X-CSRFToken': csrfToken
        }
    }).then((response) => {
        $(`#bit-${id}`).animate({transform: 'scale(-100%, -100%)'})
        $(`#bit-${id}`).remove();
    })


}



function yb_getConversations(container, filter){
    let url;


    url = `${base_url}/api/conversations/?filter=${filter}`

    console.log("fetch request ran")
    fetch(url)
    .then((resp) => resp.json())
    .then(function(data) {
        console.log("data-returned")
        console.log(data.convos_found)
        
        if (data.convos_found == true){
            let nothing_message = document.getElementById("nothing-message")

            if (nothing_message != null){
                nothing_message.remove()
            }
            let this_list = data.convos;
            console.log(this_list)
            for (var item in this_list){
                let this_item = this_list[item]
                console.log(this_item)
                let receiver = this_item.receiver;
                let receiver_name = receiver.first_name + " " + receiver.last_name
                let custom = this_item.receiver_custom


                let this_blueprint = {
                    "this_id":this_item.id,
                    "name": receiver_name,
                    "username": receiver.username,
                    "time": this_item.time,
                    "image": custom.image,
                    "primary_color": custom.primary_color,
                    "title_color": custom.title_color,
                }


                let display_conversation = yb_buildContactItem(this_blueprint, "conversation");
                container.appendChild(display_conversation)

                


                
            }
        }

    });
}


function yb_sendMessage(body, conversation, receiver) {
    var url = `${base_url}/api/messages/`
    let csrfToken = getCSRF();
    fetch(url, {
        method:'POST',
        headers: {
            'Content-type' : 'application/json',
            'X-CSRFToken': csrfToken           
        },
        body: JSON.stringify({"new_conversation":false,"body":body, "conversation":conversation, "receiver":receiver})
    })
    .then((resp) => resp.json())
    .then(function(data){
        let message_field = document.getElementById("message-field")
        message_field.value = "";
        let this_message = data.message;
        let message_container = document.getElementById("message-container");
        let is_sender = true
        let this_blueprint = {
            "id": this_message.id,
            "sender":this_message.sender,
            "time": this_message.time,
            "body": this_message.body,
            "image": this_message.image,
            "is_sender":is_sender,
            
        }
        let display_message = BuildMessage(this_blueprint);
        message_container.insertBefore(display_message, message_container.firstChild);

        
    });
}

function yb_newConversation(receiver, body) {
    var url = `${base_url}/api/messages/`
    let csrfToken = getCSRF();
    fetch(url, {
        method:'POST',
        headers: {
            'Content-type' : 'application/json',
            'X-CSRFToken': csrfToken
        },
        body: JSON.stringify({"new_conversation":true,"body":body, "receiver":receiver})
    })
    .then((resp) => resp.json())
    .then(function(data){
        let conversation = data.conversation;
        let this_id = conversation.id;
        let that_username = conversation.receiver.username;
        dropCreateBit(hideCreateBit);
        messages_conversation_url(this_id, that_username);

    });
}

function yb_getMessages(id) {
    let url=`${base_url}/api/conversations/${id}/`;
    fetch(url)
    .then((resp) => resp.json())
    .then(function(data){
        let messages = data.messages;
        let message_container = document.getElementById("message-container");
        let message_spacer = yb_createElement("div", "message-spacer", "list-spacer");
        message_spacer.setAttribute("style", "height: 40px;")
        
        message_container.appendChild(message_spacer);
        
        let message_receiver = data.receiver
        console.log(messages)
        
        let header_name = document.getElementById("receiver-name");
        header_name.innerHTML = message_receiver;

        
        for (var message in messages){
            
            let user_id = yb_getSessionValues("id");
            console.log(user_id);

            let this_message = messages[message];
            console.log(this_message);
            console.log(this_message.sender);
            let is_sender;

            if (this_message.sender === parseInt(user_id)) {
                is_sender = true;
            } else {
                is_sender = false;
            }

            let this_blueprint = {
                "id": this_message.id,
                "sender":this_message.sender,
                "time": this_message.time,
                "body": this_message.body,
                "image": this_message.image,
                "is_sender": is_sender
            }

            let display_message = BuildMessage(this_blueprint);
            message_container.appendChild(display_message);

        }
    });
    
function yb_deleteConvo(id){
    var url = `${base_url}/api/conversation/${id}/`
    let csrfToken = getCSRF();
    fetch(url, {
        method:'DELETE',
        headers: {
            'Content-type' : 'application/json',
            'X-CSRFToken': csrfToken
        }
    }).then((resp) => resp.json())
    .then(function(data) {
        let id = data.id
        $(`#conversation-${id}`).animate({transform: 'scale(-100%, -100%)'})
        $(`#conversation-${id}`).fadeOut('slow');
    })
}

function yb_deleteMessage(id) {
    var url = `${base_url}/api/messages/${id}/`
    let csrfToken = getCSRF();
    fetch(url, {
        method:'DELETE',
        headers: {
            'Content-type' : 'application/json',
            'X-CSRFToken': csrfToken
        }
    }).then((resp) => resp.json())
    .then(function(data) {
        let id = data.id
        $(`#message-${id}`).animate({transform: 'scale(-100%, -100%)'})
        $(`#message-${id}`).fadeOut('slow');
    })
}
}

function yb_addFriend(id){
    let url = `${base_url}/profile/api/add_friend/`
    let csrfToken = getCSRF();
    fetch(url,
    {
        method: "POST",
        headers: {
            'Content-type' : 'application/json',
            'X-CSRFToken' : csrfToken
        },
        body: JSON.stringify({"this_id":id})
    }).then((resp) => resp.json())
    .then(function(data){
        let body = `You added ${data.first_name} as a friend!`;
        showNotification(expandNotification, body);
    })

}

function yb_follow(id){
    let url = `${base_url}/profile/api/connect/follow/`;
    let csrfToken = getCSRF();
    fetch(url,
    {
        method: "POST",
        headers: {
            'Content-type' : 'application/json',
            'X-CSRFToken' : csrfToken
        },
        body: JSON.stringify({"user_id":id})
    }).then((resp) => resp.json())
    .then(function(data){
        let body = `You followed ${data.username}!`;
        showNotification(expandNotification, body);
    });
}

function yb_listPhotos(){
    let url=`${base_url}/api/photos/`;
    fetch(url)
    .then((resp) => resp.json())
    .then(function(data){
        let images_found = data.images_found;
        if (images_found === true){
            let these_images = data.images
            for (var image in these_images) {
                //Gather necessary information from response and store in variables
                let this_image = these_images[image];
                let id = this_image.id;
                let source_url = this_image.image;
                
                //Use yb_renderImage to generate the image element
                this_image = yb_renderImage(source_url, "small-tile-image", `image-${id}`);
                
                //Assign this_grid to the image grid on screen
                let this_grid = document.getElementById("image-grid-container");

                //Append this_image to this_grid
                this_grid.appendChild(this_image);
            }
        }
    })
}

function yb_fillBitForm(id) {
    let url = `${base_url}/api/bits/${id}/`
    fetch(url)
    .then((resp) => resp.json())
    .then(function(data) {
        let title_field = document.getElementById("mobile-title");
        let body_field = document.getElementById("mobile-body");
        title_field.value = data.title;
        body_field.value = data.body;

    })
}


function yb_enhanceText(length, style, text) {
    let csrfToken = getCSRF();
    let url = `${base_url}/profile/api/enhance/`;
    let request = new FormData();
    console.log(request)
    request.append('text_length', length);
    request.append('style', style);
    request.append('text', text);
    $.ajax({
        type: 'POST',
        contentType: false,
        // The following is necessary so jQuery won't try to convert the object into a string
        processData: false,
        headers: {
            
            'X-CSRFToken': csrfToken
        },
        url: url,
        data: request,
        success: function(response) {
            console.log(response)
            $("#mobile-body").val(response.text);
        }
    })
}

function updateCustom(action, option, value){
    let cookie = document.cookie;
    let csrfToken = cookie.substring(cookie.indexOf('=') + 1);
    let request = new FormData();
    console.log(option);
    request.append('action', action);
    request.append('field', option);
    request.append('value', value);
    $.ajax (
        {
            type: 'POST',
            contentType: false,
            // The following is necessary so jQuery won't try to convert the object into a string
            processData: false,
            headers: {
                'X-CSRFToken': csrfToken
            },
            url: '/profile/customize/',
            data: request,

            success: function(response) {
                console.log('Successfully Updated Information')

            }
    }
    )

}

function yb_setTimezone(){
    let csrfToken = getCSRF();
    let user_tz = Intl.DateTimeFormat().resolvedOptions().timeZone
    let url = `${base_url}/profile/api/widget/timezone/`
    fetch(url,
        {
            method: "POST",
            headers: {
                'Content-type' : 'application/json',
                'X-CSRFToken' : csrfToken
            },
            body: JSON.stringify({"user_tz":user_tz})
            
        })
    .then((resp) => resp.json())
    .then(function(data){
        console.log(data)
    });
}

function yb_updateBitFilter(location, dataset){
    if (location === "home") {
        let url = `${base_url}/api/bits/?type=${new_feed.type}&filter=${new_feed.filter}&sort=${new_feed.sort}&start=${start.toString()}`
    }
    if (location === "profile") {
        let url = `${base_url}/api/bits/?type=${new_feed.type}&filter=${new_feed.filter}&sort=${new_feed.sort}&start=${start.toString()}`
    }
}

function yb_submitReport(type){
    let csrfToken = getCSRF();
    let request = new FormData();

    let url = `${base_url}/support/api/submit/${type}/`;
    let subject = document.getElementById("report-subject-field").value;
    let body = document.getElementById("report-description-field").value;

    request.append('subject', subject);
    request.append('body', body);
    if (type === "bug"){
        let location = yb_getSessionValues("location");
        request.append('location', location);

    }
    if (type === "user"){
        let user_reported = document.getElementById("report-user-field").value;
        request.append('username', user_reported);

    }
    $.ajax({
        type: 'POST',
        contentType: false,
        // The following is necessary so jQuery won't try to convert the object into a string
        processData: false,
        headers: {
            'X-CSRFToken': csrfToken
        },
        url: url,
        data: request,
        success: function(response) {
            console.log(response)
            yb_closeCard();
            let body = "Thanks! Your report has been submitted."
            showNotification(expandNotification, body);
        }
    });

}

function yb_createCluster(name, type){
    let csrfToken = getCSRF();
    let url = `${base_url}/profile/api/create/cluster/`;
    let request = new FormData();
    request.append('name', name);
    request.append('type', type);
    
    $.ajax({
        type: 'POST',
        contentType: false,
        // The following is necessary so jQuery won't try to convert the object into a string
        processData: false,
        headers: {
            'X-CSRFToken': csrfToken
        },
        url: url,
        data: request,
        success: function(response) {
            console.log(response)
            dropCreateBit(hideCreateBit);
            let body = `Created Cluster named ${response.name}`
            showNotification(expandNotification, body);
        }
    });

}

function yb_loadSortFilter(){
    let url = `${base_url}/settings/api/feed/`;
    $.ajax(
        {
            type: 'GET',
            url: url,
            success: function(response) {
                console.log(response)
                if (response.sorting === "time"){
                    console.log("time")
                    let element = document.getElementById("chrono-container");
                    yb_toggleOn(element);
                }
                if (response.sorting === "best"){
                    let element = document.getElementById("best-container");
                    yb_toggleOn(element);
                }
                if (response.filtering === "trending"){
                    let element = documen.getElementById("trendiest-container");
                    yb_toggleOn(element);
                }
            }
        }
    );
}

function yb_loadInclusionFilter(){
    let url = `${base_url}/settings/api/feed/`;
    $.ajax(
        {
            type: 'GET',
            url: url,
            success: function(response) {
                console.log(response)
                if (response.show_friends === true){
                    
                    let element = document.getElementById("friend-container");
                    yb_toggleOn(element);
                }
                if (response.show_following === true){
                    let element = document.getElementById("follow-container");
                    yb_toggleOn(element);
                }
                if (response.show_communities === true){
                    let element = document.getElementById("community-container");
                    yb_toggleOn(element);
                }

            }
        }
    );
}

function yb_loadCustomFilter(){
    let url = `${base_url}/api/custom/`;
    $.ajax(
        {
            type: 'GET',
            url: url,
            success: function(response) {
                console.log(response)
                if (response.only_my_colors === true){
                    let element = document.getElementById("my-color-check");
                    yb_toggleOn(element);
                }
                if (response.ui_colors_on === true){
                    let element = document.getElementById("ui-color-check");
                    yb_toggleOn(element);
                }
                if (response.text_colors_on === true){
                    let element = document.getElementById("text-color-check");
                    yb_toggleOn(element);
                }
                if (response.wallpaper_on === true){
                    let element = document.getElementById("wallpaper-check");
                    yb_toggleOn(element);
                } 

                if (response.bit_colors_on === true){
                    let element = document.getElementById("bit-color-check");
                    yb_toggleOn(element);
                }
            }
        }
    );
}

function yb_updateFeedSettings(data) {
    let url = `${base_url}/settings/api/feed/`;
    let csrfToken = getCSRF();
    $.ajax({
        type: 'PUT',
        headers: {
            'X-CSRFToken': csrfToken
        },
        url: url,
        data: {
            'sorting': data.sort,
            'filtering': data.filter,
            'show_friends': data.friends,
            'show_following': data.following,
            'show_communities': data.communities,
        },
        success: function(response) {
            console.log(response)
            yb_closeCard();
            let body = "Feed settings updated."
            showNotification(expandNotification, body);
        }
    })

}

function yb_listClusters(bit_id=null) {
    let url = "/api/clusters/";
    $.ajax({
        url: url,
        type: "GET",
        success: function(data) {
            let is_clusters = data.is_clusters

            //Check if there are clusters for this user
            if (is_clusters === true) {

                //If there are clusters, show them
                
                let clusters = data.cluster_list;
                let location = yb_getSessionValues("location")
                let this_container;
                
                if (location === "stuff"){
                    this_container = document.getElementById("bit-container");
                    this_container.innerHTML = "";
                    //For each cluster send blueprint to build function
                    for (let i = 0; i < clusters.length; i++) {

                        let blueprint = clusters[i];
                        console.log(blueprint);
                        let this_item = yb_buildFolder(blueprint);

                        //Append this item to this container
                        this_container.appendChild(this_item);

                        this_item.addEventListener("click", function() {
                            let this_cluster = this_item.getAttribute("data-id");
                            let cluster_name = this_item.getAttribute("data-name");
                            cluster_url(this_cluster, cluster_name);
                        });
                    }
                } else if (location === "home" || location === "profile"){
                    this_container = document.getElementById(`bit-context-${bit_id}`);
                    //For each cluster send blueprint to build function
                    for (let i = 0; i < clusters.length; i++) {

                        let text = clusters[i].name;
                        let id = clusters[i].id;
                        let this_item = yb_createElement("p", `list-option-${id}`, "bit-context-option");
                        this_item.innerHTML = text;
                        this_item.setAttribute("data-id", id);
                        this_item.setAttribute("style", "margin-top: 3px; margin-bottom: 3px; margin-left: 5px; width: 98%;");
                        //Append this item to this container
                        this_container.appendChild(this_item);

                        this_item.addEventListener("click", function() {
                            let this_cluster = this_item.getAttribute("data-id");
                            let cluster_name = this_item.getAttribute("data-name");
                            cluster_url(this_cluster, cluster_name);
                        });
                    }
                }
            }
        }
    })

}
