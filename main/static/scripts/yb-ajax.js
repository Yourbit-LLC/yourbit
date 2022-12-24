/*

                    main/yb-ajax.js
                    11/8/2022
                    Yourbit, LLC


*/
//Used when getting a page that doesn't require data submission
//Html Response
var temp_data;

function yb_getFeed(new_feed, callback, session_start){
    let user_tz = Intl.DateTimeFormat().resolvedOptions().timeZone
    let tz_slash = user_tz.indexOf('/');
    let replace_tz = user_tz[tz_slash];
    let time_zone = user_tz.replace(replace_tz, '-');
    //<div class="post-wrapper" class="container-bit-${type}" data-type="${type}" data-id = "${id}" data-button-color = "${feedback_background_color}" data-icon-color = "${feedback_icon_color}" data-background = "${primary_color}" id = "bit-${id}" style="background-color: ${primary_color} ">
    let start = 0;
    let location = getSessionValues("location");
    console.log(new_feed)
    let url
    console.log(location)
    
    if (location === "home"){
        url = `
        ${base_url}/api/bits/?type=${new_feed.type}&filter=${new_feed.filter}&sort=${new_feed.sort}&start=${start.toString()}
        `
    }

    if (location === "profile"){
        url = `
        ${base_url}/api/bits/?user=${new_feed.id}&type=${new_feed.type}&filter=${new_feed.filter}&sort=${new_feed.sort}&start=${start.toString()}
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
            ${base_url}/api/stuff/?cluster=${new_feed.cluster}&type=${new_feed.type}&filter=${new_feed.filter}&sort=${new_feed.sort}&start=${start.toString()}
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

        let interact_script = "/static/scripts/yb-interact.js/";

        if (location === "profile") {
            
            var bit_container =  yb_createElement("div", "bit-container", "yb-sub-container")
            bit_container.setAttribute("style", "top:100vh; padding-top:60px;");

            $("#content-container").append(bit_container);
            
        } 
        if (location == "home") {
            
            let page_header = yb_createElement("div", "page-header", "page-header");
            let title = new_feed.type.charAt(0).toUpperCase() + new_feed.type.slice(1);
            
            page_header.innerHTML = yb_GenerateFeedHeader(title);
            $("#content-container").append(page_header);      
            
            var bit_container =  yb_createElement("div", "bit-container", "yb-sub-container")
            bit_container.setAttribute("style", "top:100vh;");

            $("#content-container").append(bit_container);
 
        } else {
            var bit_container =  yb_createElement("div", "bit-container", "yb-sub-container")
            bit_container.setAttribute("style", "top:100vh;");

            $("#content-container").append(bit_container);
        }
        
  
            
        console.log(data)
        bitstream_index = [];

        if (data.bits_found === true){
            let bitstream = data.content
            let render_bitstream = ''
            $(".feed-message").remove();
            //For each bit received in response add to the bit container
            for (var bit in bitstream) {
                //Create a reusable variable from selected data
                let this_data = bitstream[bit];

                //Pass selected data to build bit for assembly
                packaged_bit = BuildBit(this_data);

                new_bit = packaged_bit.built_bit;
                console.log(new_bit);
                bit_container.appendChild(new_bit)
                
                bitstream_index.push(packaged_bit.element_id);


            }
            let new_script = yb_createScript("interact")
            bit_container.appendChild(new_script);
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
        
        let loaded = getLoaded();
        if (loaded  === false) {

            if (location === "home"){
                post_fly_in();
                setTimeout(initUI, 1000);
            } else {
                $(bit_container).animate({"top":"0px"})
            }
            setLoaded(true);
        }
        $("#bit-container").append(`        
        <div id="mobile-spacer">

        </div>`
        )
        console.log(bitstream_index)
        if (callback != "none"){
            callback();
        }
        
    })
}

function submitBit(this_bit) {
    let cookie = document.cookie;
    let csrfToken = getCSRF();
    
    
    let base_url = window.location.origin;

    let url = `${base_url}/api/bits/`

    fetch(url,{
        method:'POST',
        headers: {
            'Content-type' : 'application/json',
            'X-CSRFToken':csrfToken
        },
        body: JSON.stringify(this_bit)
    })
    .then((resp) => resp.json())
    .then(function(data){

        //Data is blueprint for bit
        let blueprint = data;
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
    });
    
    
}



function yb_getConversations(){
    let url = `${base_url}/api/conversations/`
    fetch(url)
    .then((resp) => resp.json())
    .then(function(data){
        if (data.convos_found == true){
            let this_list = data.convos;
            for (var item in this_list){
                let this_item = this_list[item]
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
                let bit_container = document.getElementById('bit-container');
                let display_conversation = BuildListItem(this_blueprint, "conversation");
                bit_container.appendChild(display_conversation)
                
            }
        } else {
            $("#bit-container").append(`<h2><h2>`)
        }


    });
}

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


function yb_getMessages(id) {
    let url=`${base_url}/api/conversations/${id}/`;
    fetch(url)
    .then((resp) => resp.json())
    .then(function(data){
        let messages = data;
        let bit_container = document.getElementById("bit-container");
        for (var message in messages){
            let this_message = messages[message];

            let this_blueprint = {
                "id": this_message.id,
                "sender":this_message.sender,
                "time": this_message.time,
                "body": this_message.body,
                "image": this_message.image
            }

            let display_message = BuildMessage(this_blueprint);
            bit_container.appendChild(display_message);

        }
    });

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