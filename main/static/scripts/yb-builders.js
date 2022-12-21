/*
            main/builders.js
            11/15/2022
            Yourbit, LLC

            Contains: blueprints for building various dynamically
            generated content items on yourbit. Pass all fetched
            data to builders to be prepared for appending to html.


*/

//Profile Page
function buildProfile(profile_data){

    //Get profile user id from data
    let user = profile_data.user

    let profile_id = profile_data.id

    let user_id = user.id
    //Get profile image from data
    let custom = profile_data.custom;

    let profile_image = custom.image;
    
    //Get profile name from data 
    let profile_first_name = user.first_name;
    let profile_last_name = user.last_name;
    let profile_name = profile_first_name + " " + profile_last_name
    
    //Get username from data 
    let handle = user.username;

    //Get motto from data
    let motto = profile_data.motto;

    //Get bio from data
    let bio = profile_data.bio;
    
    let data_element = yb_createElement("input", "profile-data", "yb-dat-hidden")
    data_element.setAttribute("type", "hidden");

    let profile_splash = yb_createElement("div", "profile-page-splash", "splash-page");

    //Create Profile Splash
    profile_splash.innerHTML = `
        <div class='splash-page' id='profile-page-splash' data-id=${profile_id}>
            <div class='space-splash-label' id="profile-splash-label">
                <img class='large-profile-image' id="profile-image-splash" src="${profile_image}">
                <div id="profile-name-splash">
                    <h2 id="profile-name-header">${profile_name}</h2>
                    <h3 id="profile-handle-label">@${handle}</h3>
                </div>
                <div class='profile-interaction-container' style="text-align: center;">
                    <button class='button-profile-interaction' id="profile-button-connect" data-id="${user_id}">Connect</button>
                    <button class='button-profile-interaction' id="profile-button-message" data-id="${user_id}">Message</button>
                    <button class='button-profile-interaction' id="profile-button-about" data-id="${user_id}">About</button>
                </div>
            </div>
            <div class='splash-bio-container'>
                <h3>${motto}</h3>
                <p>${bio}</h3>
            </div>
            <div class='swipe-up-element'>
                <svg class='swipe-up-icon' xmlns="http://www.w3.org/2000/svg" height="48" width="48"><path d="M14.15 30.75 12 28.6l12-12 12 11.95-2.15 2.15L24 20.85Z"/></svg>
                <p class='swipe-up-text'>Slide Up for Bitstream</p>
            </div>
            <script type="text/javascript" src="/static/scripts/yb-profiles.js/"></script>
        </div>
    
    `
    return {'splash':profile_splash, 'data':data_element}
}

//Function for generating bits
function BuildBit(bit){
    console.log(bit)
    //Bit information
    let id = bit.id;
    let time = bit.time;
    
    //Set Element Class (Defines layout and styling)
    let type = bit.type;

    //Define bit ID which is returned to position bit in feed index
    let element_id = `#bit-${id}`;

    //User and Profile
    let user = bit.user;

    let first_name = user.first_name;
    let last_name = user.last_name;
    let name = first_name + " " + last_name

    let username = user.username;

    //Customizations
    let custom = bit.custom;
    
    //Profile Image
    let profile_image = custom.image;

    //colors
    let primary_color = custom.primary_color;
    let accent_color = custom.accent_color;
    let title_color = custom.title_color;
    let text_color = custom.text_color;
    let feedback_icon_color = custom.feedback_icon_color;
    let feedback_background_color = custom.feedback_background_color;
    let paragraph_align = custom.paragraph_align;
    
    //Prepare new bit by creating an element
    new_bit = document.createElement("div");

    //Apply All Attributes: element id, element class, data type, data-id, data-button-color, data icon color, data background color, style
    new_bit.setAttribute("id", `bit-${id}`); //Assign ID
    new_bit.setAttribute("class", `post-wrapper container-bit-${type}`); //Assign class
    new_bit.setAttribute("data-type", `${type}`);
    new_bit.setAttribute("data-id", `${id}`);
    new_bit.setAttribute("data-button-color", `${feedback_background_color}`);
    new_bit.setAttribute("data-icon-color", `${feedback_icon_color}`);
    new_bit.setAttribute("data-primary-color", `${primary_color}`);
    new_bit.setAttribute("style", `background-color: ${primary_color};`);

    //Title
    let has_title = bit.has_title;
    if (has_title){
        let title = bit.title;
        let title_content= `            
        <div id="${type}-bit-title" style="display:block;">
            <hr>
                <h3 style="color:{title_color};">
                    ${title}
                </h3>
            <hr>
        </div>`
        
    } else {
        let title_content =`
        <div id="${type}-bit-title" style="display:none;">
        </div>
        `
        
    }


    //Body
    let body = bit.body;

    //Interactions
    let like_count = bit.like_count;
    let dislike_count = bit.dislike_count;
    let comment_count = bit.comment_count;

    //generate header

    let header = yb_createElement("div", `header-bit-${id}`, "header-bit");

    let profile_image_container = yb_createElement("div", `profile-image-${id}`, "container-image-tiny");
    profile_image_container.setAttribute("data-username", username)
    profile_image_container.innerHTML = `<img style="border-color: ${accent_color}" class="image-thumbnail-small" src="${profile_image}">`
    header.appendChild(profile_image_container);

    let user_info = yb_createElement("p", `bit-info-${id}`, "bit-user-info");

    user_info.innerHTML = `<strong id="chat-user-name" style="color:${title_color};">${name}</strong> <small style="color:${text_color};">@${username}</small>`
    header.appendChild(user_info)


    let time_label = yb_createElement("p", `time-posted-${id}`, "bit-time-label");
    time_label.innerHTML = `${time}<br><small>@${time}</small>`
    header.appendChild(time_label);

    new_bit.appendChild(header);

    //Content Attachments
    
    if (type === 'photo'){
        let attachment = yb_createElement("img", `photo-bit-${id}`, "attached-photo");
        attachment.setAttribute("src", photo);
        new_bit.appendChild(attachment)

    }

    if (type === 'video'){
        let bit_video = bit.video
        let attachments = `
            <video src="${ bit_video }" width="100%" id="video-${id}" playsinline controls></video>              
        `
        html_snippet += attachments;
    }
    

    let text_content = yb_createElement("div", `description-bit-${id}`, `description-bit-${type}`)
    
    text_content.innerHTML = `
            <p >${body}</p>
        
    `;

    new_bit.appendChild(text_content)
    

    let bit_interactions = yb_createElement("div", `bit-feedback-${type}`, "container-feedback-bit");
    
    //Likes
    let like_button = yb_createButton("like", `like-${id}`, "feedback-icon");
    like_button.setAttribute("data-catid", id)
    like_button.innerHTML = `<svg id="feedback-icon-source" xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path id="active-like-icon-${id}" style="fill:" d="M15.5 11Q16.15 11 16.575 10.575Q17 10.15 17 9.5Q17 8.85 16.575 8.425Q16.15 8 15.5 8Q14.85 8 14.425 8.425Q14 8.85 14 9.5Q14 10.15 14.425 10.575Q14.85 11 15.5 11ZM8.5 11Q9.15 11 9.575 10.575Q10 10.15 10 9.5Q10 8.85 9.575 8.425Q9.15 8 8.5 8Q7.85 8 7.425 8.425Q7 8.85 7 9.5Q7 10.15 7.425 10.575Q7.85 11 8.5 11ZM12 17.5Q13.775 17.5 15.137 16.525Q16.5 15.55 17.1 14H15.45Q14.925 14.9 14.025 15.45Q13.125 16 12 16Q10.875 16 9.975 15.45Q9.075 14.9 8.55 14H6.9Q7.5 15.55 8.863 16.525Q10.225 17.5 12 17.5ZM12 22Q9.925 22 8.1 21.212Q6.275 20.425 4.925 19.075Q3.575 17.725 2.788 15.9Q2 14.075 2 12Q2 9.925 2.788 8.1Q3.575 6.275 4.925 4.925Q6.275 3.575 8.1 2.787Q9.925 2 12 2Q14.075 2 15.9 2.787Q17.725 3.575 19.075 4.925Q20.425 6.275 21.212 8.1Q22 9.925 22 12Q22 14.075 21.212 15.9Q20.425 17.725 19.075 19.075Q17.725 20.425 15.9 21.212Q14.075 22 12 22ZM12 12Q12 12 12 12Q12 12 12 12Q12 12 12 12Q12 12 12 12Q12 12 12 12Q12 12 12 12Q12 12 12 12Q12 12 12 12ZM12 20Q15.325 20 17.663 17.663Q20 15.325 20 12Q20 8.675 17.663 6.337Q15.325 4 12 4Q8.675 4 6.338 6.337Q4 8.675 4 12Q4 15.325 6.338 17.663Q8.675 20 12 20Z"/></svg>`
    bit_interactions.appendChild(like_button);

    let like_counter = yb_createElement("p", `like-count-${id}`, "counter");
    like_counter.innerHTML = "0";
    bit_interactions.appendChild(like_counter);
    
    
    //Dislikes
    let dislike_button = yb_createButton("dislike", `dislike-${id}`, "feedback-icon");
    dislike_button.setAttribute("data-catid", id)
    dislike_button.innerHTML = `<svg id="feedback-icon-source" xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path id="dislike-icon-${id}" d="M15.5 11Q16.15 11 16.575 10.575Q17 10.15 17 9.5Q17 8.85 16.575 8.425Q16.15 8 15.5 8Q14.85 8 14.425 8.425Q14 8.85 14 9.5Q14 10.15 14.425 10.575Q14.85 11 15.5 11ZM8.5 11Q9.15 11 9.575 10.575Q10 10.15 10 9.5Q10 8.85 9.575 8.425Q9.15 8 8.5 8Q7.85 8 7.425 8.425Q7 8.85 7 9.5Q7 10.15 7.425 10.575Q7.85 11 8.5 11ZM12 13.5Q10.225 13.5 8.863 14.475Q7.5 15.45 6.9 17H8.55Q9.075 16.1 9.975 15.55Q10.875 15 12 15Q13.125 15 14.025 15.55Q14.925 16.1 15.45 17H17.1Q16.5 15.45 15.137 14.475Q13.775 13.5 12 13.5ZM12 22Q9.925 22 8.1 21.212Q6.275 20.425 4.925 19.075Q3.575 17.725 2.788 15.9Q2 14.075 2 12Q2 9.925 2.788 8.1Q3.575 6.275 4.925 4.925Q6.275 3.575 8.1 2.787Q9.925 2 12 2Q14.075 2 15.9 2.787Q17.725 3.575 19.075 4.925Q20.425 6.275 21.212 8.1Q22 9.925 22 12Q22 14.075 21.212 15.9Q20.425 17.725 19.075 19.075Q17.725 20.425 15.9 21.212Q14.075 22 12 22ZM12 12Q12 12 12 12Q12 12 12 12Q12 12 12 12Q12 12 12 12Q12 12 12 12Q12 12 12 12Q12 12 12 12Q12 12 12 12ZM12 20Q15.325 20 17.663 17.663Q20 15.325 20 12Q20 8.675 17.663 6.337Q15.325 4 12 4Q8.675 4 6.338 6.337Q4 8.675 4 12Q4 15.325 6.338 17.663Q8.675 20 12 20Z"/></svg>`
    bit_interactions.appendChild(dislike_button);

    let dislike_counter = yb_createElement("p", `dislike-count-${id}`, "counter");
    dislike_counter.innerHTML = "0";
    bit_interactions.appendChild(dislike_counter);
    
    //Comments
    let comment_button = yb_createButton("show-comment", `show-comment-${id}`, "feedback-icon");
    comment_button.setAttribute("data-catid", id)
    comment_button.innerHTML = `<svg id="feedback-icon-source" xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path id="comment-icon-${id}" d="M6 14H18V12H6ZM6 11H18V9H6ZM6 8H18V6H6ZM22 22 18 18H4Q3.175 18 2.588 17.413Q2 16.825 2 16V4Q2 3.175 2.588 2.587Q3.175 2 4 2H20Q20.825 2 21.413 2.587Q22 3.175 22 4ZM4 4V16Q4 16 4 16Q4 16 4 16H18.825L20 17.175V4Q20 4 20 4Q20 4 20 4H4Q4 4 4 4Q4 4 4 4ZM4 4V17.175V16Q4 16 4 16Q4 16 4 16V4Q4 4 4 4Q4 4 4 4Q4 4 4 4Q4 4 4 4Z"/></svg>`
    bit_interactions.appendChild(comment_button);
    

    let comment_counter = yb_createElement("p", `comment-count-${id}`, "counter");
    comment_counter.innerHTML = "0";
    bit_interactions.appendChild(comment_counter);

    //Shares
    let share_button = yb_createButton("share", `share-${id}`, "feedback-icon");
    share_button.innerHTML = `<svg id="feedback-icon-source" xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="M6 14H18V12H6ZM6 11H18V9H6ZM6 8H18V6H6ZM22 22 18 18H4Q3.175 18 2.588 17.413Q2 16.825 2 16V4Q2 3.175 2.588 2.587Q3.175 2 4 2H20Q20.825 2 21.413 2.587Q22 3.175 22 4ZM4 4V16Q4 16 4 16Q4 16 4 16H18.825L20 17.175V4Q20 4 20 4Q20 4 20 4H4Q4 4 4 4Q4 4 4 4ZM4 4V17.175V16Q4 16 4 16Q4 16 4 16V4Q4 4 4 4Q4 4 4 4Q4 4 4 4Q4 4 4 4Z"/></svg>`
    bit_interactions.appendChild(share_button);

    let share_counter = yb_createElement("p", `share-count-${id}`, "counter");
    share_counter.innerHTML = "0";
    bit_interactions.appendChild(share_counter);

    //Dontation
    let donate_button = yb_createButton("donate", `donate-bit-${id}`, "feedback-icon");
    donate_button.innerHTML = `<svg id="feedback-icon-source" xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="M11.025 21V18.85Q9.7 18.55 8.738 17.7Q7.775 16.85 7.325 15.3L9.175 14.55Q9.55 15.75 10.288 16.375Q11.025 17 12.225 17Q13.25 17 13.963 16.538Q14.675 16.075 14.675 15.1Q14.675 14.225 14.125 13.712Q13.575 13.2 11.575 12.55Q9.425 11.875 8.625 10.938Q7.825 10 7.825 8.65Q7.825 7.025 8.875 6.125Q9.925 5.225 11.025 5.1V3H13.025V5.1Q14.275 5.3 15.088 6.012Q15.9 6.725 16.275 7.75L14.425 8.55Q14.125 7.75 13.575 7.35Q13.025 6.95 12.075 6.95Q10.975 6.95 10.4 7.438Q9.825 7.925 9.825 8.65Q9.825 9.475 10.575 9.95Q11.325 10.425 13.175 10.95Q14.9 11.45 15.788 12.537Q16.675 13.625 16.675 15.05Q16.675 16.825 15.625 17.75Q14.575 18.675 13.025 18.9V21Z"/></svg>`
    bit_interactions.appendChild(donate_button);

    new_bit.appendChild(bit_interactions)

    let comment_field_container = yb_createElement("div", `field-write-comment-${id}`, "comment-field-container");
    
    let comment_field = yb_createElement("input", `field-write-comment-${id}`, "write-comment-field-text");
    comment_field.setAttribute("placeholder", "Write Comment");
    comment_field_container.appendChild(comment_field);

    let submit_comment_button = yb_createButton("send_comment", `button-submit-comment-${id}`, "send-comment")
    submit_comment_button.setAttribute("data-catid", id);
    submit_comment_button.setAttribute("style", "background-color: rgba(255, 255, 255, 0.5)");
    submit_comment_button.innerHTML = `<svg fill="${text_color}" style="display: block; margin: auto; position: relative;" xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="M6 19.05 7.975 18.25Q7.725 17.525 7.513 16.775Q7.3 16.025 7.175 15.275L6 16.075Q6 16.075 6 16.075Q6 16.075 6 16.075ZM10 18H14Q14.45 17 14.725 15.562Q15 14.125 15 12.625Q15 10.15 14.175 7.937Q13.35 5.725 12 4.525Q10.65 5.725 9.825 7.937Q9 10.15 9 12.625Q9 14.125 9.275 15.562Q9.55 17 10 18ZM12 13Q11.175 13 10.588 12.412Q10 11.825 10 11Q10 10.175 10.588 9.587Q11.175 9 12 9Q12.825 9 13.413 9.587Q14 10.175 14 11Q14 11.825 13.413 12.412Q12.825 13 12 13ZM18 19.05V16.075Q18 16.075 18 16.075Q18 16.075 18 16.075L16.825 15.275Q16.7 16.025 16.488 16.775Q16.275 17.525 16.025 18.25ZM12 1.975Q14.475 3.775 15.738 6.55Q17 9.325 17 13Q17 13 17 13Q17 13 17 13L19.1 14.4Q19.525 14.675 19.763 15.125Q20 15.575 20 16.075V22L15.025 20H8.975L4 22V16.075Q4 15.575 4.238 15.125Q4.475 14.675 4.9 14.4L7 13Q7 13 7 13Q7 13 7 13Q7 9.325 8.262 6.55Q9.525 3.775 12 1.975Z"/></svg>`
    comment_field_container.appendChild(submit_comment_button);

    new_bit.appendChild(comment_field_container)

    let bit_comments = `
        <p class = "comments-display-label" id="label-comments-${id}" style="display:none;"><b>Comments:</b></p>
        <div class = "${type}-comment-display-container" id="container-display-comments-${id}" style="display: none;">
            
        </div>

    
    `;


    return {'element_id':element_id, 'built_bit':new_bit}


}

//Function for generating list items
function BuildListItem(result){
    let primary_color = result.primary_color
    let image = result.image
    let handle = result.username
    let link = result.link
    let html_snippet =`
        <div class='full-result' style="background-color: ${primary_color}">
            <div class = 'full-result-image-container'>
                <img class='full-result-image' src="${image}">
            </div>
            <div class='full-result-name-container'>
                <p class = 'full-result-name'><strong>{name}</strong></p>
                <p class = 'full-result-username'>
                    <small>@${handle}</small>
                </p>
            
            </div>
            <a class='profile-search-link' href="${link}"></a>

        </div>
    `
    return html_snippet
}

//Function for generating message bubbles
function BuildMessage(message, is_sender){
    let id= message.id
    let time = message.time
    let sender_name = message.first_name + " " + message.last_name
    let body = message.body

    if (is_sender){
        let html_snippet = `
            <div class = "message-bubble-right" id="message-${id}">
                <p class='message-name'>${sender_name}</p>
                <p class='message-body'>${body}</p>
                <p class='time-message'>${time}</p>
            </div>

        `
    } else {

        let html_snippet=`
            <div class ="message-bubble-left" id="message-${id}">
                <p class="message-name">${sender_name}</p>
                <p class="message-body">${sender_name}</p>
                <p class="time-message">${time}</p>
            </div>
        `

    }


    return html_snippet


}

//Function for generating comment bubbles
function BuildComment(comment){
    let sender_name = comment.first_name + " " + comment.last_name
    let comment_id = comment.id
    let profile_image = comment.profile_image
    let body = comment.body
    if (is_sender){
        let html_snippet = `
            <div class = "comment-bubble-right" id="message-${id}">
                <img class='image-hang-left' src="${profile_image}">
                <p class='comment-name'>${sender_name}</p>
                <p class='comment-body'>${body}</p>
                <p class='time-comment'>${time}</p>
            </div>

        `
    } else {

        let html_snippet=`
            <div class ="comment-bubble-left" id="message-${id}">
                <img class='image-hang-right' src="${profile_image}">
                <p class="comment-name">${sender_name}</p>
                <p class="comment-body">${sender_name}</p>
                <p class="time-comment">${time}</p>
            </div>
        `

    }
    
}

function yb_GenerateFeedHeader(type){
    var page_header_source = `

        <h2 style='color: lightgray; text-align: center;'>${type} Space</h2>
        </div>

        <div id='yb-browse-nav' style='display:grid; grid-template-columns: auto auto auto auto auto;'>
        <select type="text" class='filter-button-wide-active' name="yb-align-text" id="yb-filter-dropdown" style='color: white;' value="all">
            <option value="all">All</option>
            <option value="friends">Friends</option>
            <option value="following">Following</option>
            <option value="oublic">Public</option>
        </select>
        <select type="text" class='filter-button-wide-active' name="yb-align-text" id="yb-sort-dropdown" style='color: white;' value="chrono">
            <option value="chrono">Chrono</option>
            <option value="dyno-chrono">Dynamic Chrono</option>
            <option value="recommended">Recomended</option>
            <option value="trending">Trending</option>
            <option value="top-liked">Top Liked</option>
        </select>
        <button class='filter-button-active' name = 'advanced-filter'>
            <svg class='filter-button-icon' xmlns="http://www.w3.org/2000/svg" height="20" width="20"><path d="M9.5 16q-.208 0-.354-.146T9 15.5v-4.729L4.104 4.812q-.187-.25-.052-.531Q4.188 4 4.5 4h11q.312 0 .448.281.135.281-.052.531L11 10.771V15.5q0 .208-.146.354T10.5 16Zm.5-6.375L13.375 5.5H6.604Zm0 0Z"/>
            </svg>
            <div class='dropdown-menu' id="advanced-filter-dropdown"></div>
        </button>
        <button class='filter-button-active' name='search'>
            <svg class='filter-button-icon' xmlns="http://www.w3.org/2000/svg" height="20" width="20"><path d="m15.938 17-4.98-4.979q-.625.458-1.375.719Q8.833 13 8 13q-2.083 0-3.542-1.458Q3 10.083 3 8q0-2.083 1.458-3.542Q5.917 3 8 3q2.083 0 3.542 1.458Q13 5.917 13 8q0 .833-.26 1.583-.261.75-.719 1.375L17 15.938ZM8 11.5q1.458 0 2.479-1.021Q11.5 9.458 11.5 8q0-1.458-1.021-2.479Q9.458 4.5 8 4.5q-1.458 0-2.479 1.021Q4.5 6.542 4.5 8q0 1.458 1.021 2.479Q6.542 11.5 8 11.5Z"/></svg>
            <div class='dropdown-menu' id='search-dropdown'></div>
        </button>
        <button class='filter-button-active' name='customize'>
            <svg class='filter-button-icon' xmlns="http://www.w3.org/2000/svg" height="20" width="20"><path d="M10 18q-1.646 0-3.104-.625-1.458-.625-2.552-1.719t-1.719-2.552Q2 11.646 2 10q0-1.667.635-3.115.636-1.447 1.75-2.541Q5.5 3.25 6.99 2.625 8.479 2 10.167 2q1.625 0 3.052.562 1.427.563 2.489 1.542 1.063.979 1.677 2.292Q18 7.708 18 9.208q0 2-1.396 3.396T13.208 14h-1.416q-.167 0-.292.104-.125.104-.125.271 0 .313.313.521Q12 15.104 12 16q0 .771-.562 1.385Q10.875 18 10 18Zm0-8Zm-4.5.75q.521 0 .885-.365.365-.364.365-.885t-.365-.885Q6.021 8.25 5.5 8.25t-.885.365q-.365.364-.365.885t.365.885q.364.365.885.365Zm2.5-3q.521 0 .885-.365.365-.364.365-.885t-.365-.885Q8.521 5.25 8 5.25t-.885.365q-.365.364-.365.885t.365.885q.364.365.885.365Zm4 0q.521 0 .885-.365.365-.364.365-.885t-.365-.885Q12.521 5.25 12 5.25t-.885.365q-.365.364-.365.885t.365.885q.364.365.885.365Zm2.5 3q.521 0 .885-.365.365-.364.365-.885t-.365-.885q-.364-.365-.885-.365t-.885.365q-.365.364-.365.885t.365.885q.364.365.885.365ZM10 16.5q.229 0 .365-.177.135-.177.135-.323 0-.333-.312-.583-.313-.25-.313-1.042t.552-1.333q.552-.542 1.344-.542h1.437q1.375 0 2.334-.958.958-.959.958-2.334 0-2.396-1.844-4.052Q12.812 3.5 10.167 3.5q-2.792 0-4.729 1.896Q3.5 7.292 3.5 10t1.896 4.604Q7.292 16.5 10 16.5Z"/>
            </svg>
            <div class='dropdown-menu' id='customize-dropdown'></div>
        </button>

        </div>

        <br>
    `
    return page_header_source;
}

function buildSettings() {
    $("#content-container").load('/settings/templates/settings/settings.html/');
}

function buildRewards() {
    $("#content-container").load('/rewards/templates/rewards/rewards.html');
    
}