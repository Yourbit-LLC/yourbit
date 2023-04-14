/*
            main/builders.js
            11/15/2022
            Yourbit, LLC

            Contains: blueprints for building various dynamically
            generated content items on yourbit. Pass all fetched
            data to builders to be prepared for appending to html.


*/
function showProfileImage(){
    $(".large-profile-image").animate({"height": "150px", "width":"150px"}, 'fast');
    
}

//Function for generating bits
function BuildBit(bit, liked_bits, disliked_bits){
   
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
    new_bit.setAttribute("data-userid", `${user.id}`);
    new_bit.setAttribute("data-button-color", `${feedback_background_color}`);
    new_bit.setAttribute("data-icon-color", `${feedback_icon_color}`);
    new_bit.setAttribute("data-secondary-color", `${accent_color}`);
    new_bit.setAttribute("data-primary-color", `${primary_color}`);
    new_bit.setAttribute("style", `background-color: ${primary_color};`);

    //Title
    let has_title = bit.has_title;
    let title_content = "";
    if (has_title){
        let title = bit.title;
        title_content= yb_createElement("div", `title-bit-${id}`, "bit-title");
        title_content.setAttribute("style", `color:${title_color}; text-align:center;`);
        title_content.innerHTML = `<hr><h3>${title}</h3><hr>`  ;

        
    } else {
        title_content= yb_createElement("div", `title-bit-${id}`, "bit-title");
        title_content.setAttribute("style", `display:none;`);
        
    }

    new_bit.appendChild(title_content);
    //Body
    let body = bit.body;

    //Interactions
    let like_count = bit.like_count;
    let dislike_count = bit.dislike_count;
    let comment_count = bit.comment_count;

    
    let options_button = yb_createButton("options", `options-bit-${id}`, "bit-options");
    
    options_button.innerHTML = `<svg id="feedback-icon-source" xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="M6 14q-.825 0-1.412-.588Q4 12.825 4 12t.588-1.413Q5.175 10 6 10t1.412.587Q8 11.175 8 12q0 .825-.588 1.412Q6.825 14 6 14Zm6 0q-.825 0-1.412-.588Q10 12.825 10 12t.588-1.413Q11.175 10 12 10t1.413.587Q14 11.175 14 12q0 .825-.587 1.412Q12.825 14 12 14Zm6 0q-.825 0-1.413-.588Q16 12.825 16 12t.587-1.413Q17.175 10 18 10q.825 0 1.413.587Q20 11.175 20 12q0 .825-.587 1.412Q18.825 14 18 14Z"/></svg>`
    new_bit.appendChild(options_button);

    //generate header

    let header = yb_createElement("div", `header-bit-${id}`, "header-bit");

    let profile_image_container = yb_createElement("div", `profile-image-${id}`, "container-image-tiny");
    profile_image_container.setAttribute("data-username", username);
    profile_image_container.setAttribute("style", `border-color: ${accent_color};`);
    profile_image_container.innerHTML = `<img class="image-thumbnail-small" style="object-fit:fill; border-radius: 50%;" src="${profile_image}">`
    header.appendChild(profile_image_container);

    let user_info = yb_createElement("p", `bit-info-${id}`, "bit-user-info");

    user_info.innerHTML = `<strong id="chat-user-name" style="color:${title_color};">${name}</strong> <small style="color:${text_color};">@${username}</small>`
    header.appendChild(user_info)

    //Prepare time for viewing by splitting at "/" place the 2 pieces in the corresponding areas
    let split_time = time.split("/");

    let display_date = split_time [0];
    let display_time = split_time[1];
    
    let time_label = yb_createElement("p", `time-posted-${id}`, "bit-time-label");
    time_label.innerHTML = `${display_date}<br><small>${display_time}</small>`
    header.appendChild(time_label);

    new_bit.appendChild(header);

    //Content Attachments
    
    if (type === 'photo'){
        let index = 0;
        let photo = bit.photos[index]
        let attachment = yb_createElement("img", `photo-bit-${id}`, "attached-photo");
        attachment.setAttribute("src", photo.image);
        attachment.setAttribute('data-id', id);
        attachment.setAttribute('data-index', index);
        new_bit.appendChild(attachment)
        attachment.addEventListener("click", function(){
            let source = this.getAttribute("src");
            let this_id = this.getAttribute("data-id");
            let this_index = this.getAttribute("data-index");
            yb_openImage(source, this_index, this_id)
        })

    }

    if (type === 'video'){
        let bit_video = bit.video
        let video_player = yb_createElement("video", `video-${id}`, "attached-video");
        video_player.setAttribute("src", bit_video);
        video_player.setAttribute("controls", "true");
        video_player.setAttribute("playsinline", "true");

        new_bit.appendChild(video_player);
    }
    

    let text_content = yb_createElement("div", `description-bit-${id}`, `description-bit-${type}`)
    
    text_content.innerHTML = `
            <p style="color: ${text_color}; text-align:${paragraph_align}">${body}</p>
        
    `;

    new_bit.appendChild(text_content)
    

    let bit_interactions = yb_createElement("div", `bit-feedback-${type}`, `container-feedback-bit-${type}`);
    
    //Likes
    let like_button = yb_createButton("like", `like-${id}`, "feedback-icon");
    like_button.setAttribute("data-catid", id)
    like_button.innerHTML = `<svg id="feedback-icon-source" xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path id="like-icon-${id}" style="fill:" d="M15.5 11Q16.15 11 16.575 10.575Q17 10.15 17 9.5Q17 8.85 16.575 8.425Q16.15 8 15.5 8Q14.85 8 14.425 8.425Q14 8.85 14 9.5Q14 10.15 14.425 10.575Q14.85 11 15.5 11ZM8.5 11Q9.15 11 9.575 10.575Q10 10.15 10 9.5Q10 8.85 9.575 8.425Q9.15 8 8.5 8Q7.85 8 7.425 8.425Q7 8.85 7 9.5Q7 10.15 7.425 10.575Q7.85 11 8.5 11ZM12 17.5Q13.775 17.5 15.137 16.525Q16.5 15.55 17.1 14H15.45Q14.925 14.9 14.025 15.45Q13.125 16 12 16Q10.875 16 9.975 15.45Q9.075 14.9 8.55 14H6.9Q7.5 15.55 8.863 16.525Q10.225 17.5 12 17.5ZM12 22Q9.925 22 8.1 21.212Q6.275 20.425 4.925 19.075Q3.575 17.725 2.788 15.9Q2 14.075 2 12Q2 9.925 2.788 8.1Q3.575 6.275 4.925 4.925Q6.275 3.575 8.1 2.787Q9.925 2 12 2Q14.075 2 15.9 2.787Q17.725 3.575 19.075 4.925Q20.425 6.275 21.212 8.1Q22 9.925 22 12Q22 14.075 21.212 15.9Q20.425 17.725 19.075 19.075Q17.725 20.425 15.9 21.212Q14.075 22 12 22ZM12 12Q12 12 12 12Q12 12 12 12Q12 12 12 12Q12 12 12 12Q12 12 12 12Q12 12 12 12Q12 12 12 12Q12 12 12 12ZM12 20Q15.325 20 17.663 17.663Q20 15.325 20 12Q20 8.675 17.663 6.337Q15.325 4 12 4Q8.675 4 6.338 6.337Q4 8.675 4 12Q4 15.325 6.338 17.663Q8.675 20 12 20Z"/></svg>`;

    //Check if bit is liked
    for (const key in liked_bits) {

        let value = liked_bits[key];
        if (value.id === id){
            like_button.innerHTML = `<svg id="feedback-icon-source" xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path id="like-icon-${id}" style="fill: ${feedback_icon_color}" d="M15.5 11Q16.15 11 16.575 10.575Q17 10.15 17 9.5Q17 8.85 16.575 8.425Q16.15 8 15.5 8Q14.85 8 14.425 8.425Q14 8.85 14 9.5Q14 10.15 14.425 10.575Q14.85 11 15.5 11ZM8.5 11Q9.15 11 9.575 10.575Q10 10.15 10 9.5Q10 8.85 9.575 8.425Q9.15 8 8.5 8Q7.85 8 7.425 8.425Q7 8.85 7 9.5Q7 10.15 7.425 10.575Q7.85 11 8.5 11ZM12 17.5Q13.775 17.5 15.137 16.525Q16.5 15.55 17.1 14H15.45Q14.925 14.9 14.025 15.45Q13.125 16 12 16Q10.875 16 9.975 15.45Q9.075 14.9 8.55 14H6.9Q7.5 15.55 8.863 16.525Q10.225 17.5 12 17.5ZM12 22Q9.925 22 8.1 21.212Q6.275 20.425 4.925 19.075Q3.575 17.725 2.788 15.9Q2 14.075 2 12Q2 9.925 2.788 8.1Q3.575 6.275 4.925 4.925Q6.275 3.575 8.1 2.787Q9.925 2 12 2Q14.075 2 15.9 2.787Q17.725 3.575 19.075 4.925Q20.425 6.275 21.212 8.1Q22 9.925 22 12Q22 14.075 21.212 15.9Q20.425 17.725 19.075 19.075Q17.725 20.425 15.9 21.212Q14.075 22 12 22ZM12 12Q12 12 12 12Q12 12 12 12Q12 12 12 12Q12 12 12 12Q12 12 12 12Q12 12 12 12Q12 12 12 12Q12 12 12 12ZM12 20Q15.325 20 17.663 17.663Q20 15.325 20 12Q20 8.675 17.663 6.337Q15.325 4 12 4Q8.675 4 6.338 6.337Q4 8.675 4 12Q4 15.325 6.338 17.663Q8.675 20 12 20Z"/></svg>`;
            like_button.style.backgroundColor = feedback_background_color;
            break;
        } 
    }
    
    bit_interactions.appendChild(like_button);
    
    //Like Counter
    let like_counter = yb_createElement("p", `like-count-${id}`, "counter");
    like_counter.innerHTML = like_count;
    bit_interactions.appendChild(like_counter);
    
    //Like Event Listener
    like_button.addEventListener("click", function(e){

        let this_element = e.currentTarget;
        yb_Interact("like", this_element, "none");


    
    });
    
    //Dislikes
    let dislike_button = yb_createButton("dislike", `dislike-${id}`, "feedback-icon");
    dislike_button.setAttribute("data-catid", id)
    dislike_button.innerHTML = `<svg id="feedback-icon-source" xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path id="dislike-icon-${id}" style="fill:" d="M15.5 11Q16.15 11 16.575 10.575Q17 10.15 17 9.5Q17 8.85 16.575 8.425Q16.15 8 15.5 8Q14.85 8 14.425 8.425Q14 8.85 14 9.5Q14 10.15 14.425 10.575Q14.85 11 15.5 11ZM8.5 11Q9.15 11 9.575 10.575Q10 10.15 10 9.5Q10 8.85 9.575 8.425Q9.15 8 8.5 8Q7.85 8 7.425 8.425Q7 8.85 7 9.5Q7 10.15 7.425 10.575Q7.85 11 8.5 11ZM12 17.5Q13.775 17.5 15.137 16.525Q16.5 15.55 17.1 14H15.45Q14.925 14.9 14.025 15.45Q13.125 16 12 16Q10.875 16 9.975 15.45Q9.075 14.9 8.55 14H6.9Q7.5 15.55 8.863 16.525Q10.225 17.5 12 17.5ZM12 22Q9.925 22 8.1 21.212Q6.275 20.425 4.925 19.075Q3.575 17.725 2.788 15.9Q2 14.075 2 12Q2 9.925 2.788 8.1Q3.575 6.275 4.925 4.925Q6.275 3.575 8.1 2.787Q9.925 2 12 2Q14.075 2 15.9 2.787Q17.725 3.575 19.075 4.925Q20.425 6.275 21.212 8.1Q22 9.925 22 12Q22 14.075 21.212 15.9Q20.425 17.725 19.075 19.075Q17.725 20.425 15.9 21.212Q14.075 22 12 22ZM12 12Q12 12 12 12Q12 12 12 12Q12 12 12 12Q12 12 12 12Q12 12 12 12Q12 12 12 12Q12 12 12 12Q12 12 12 12ZM12 20Q15.325 20 17.663 17.663Q20 15.325 20 12Q20 8.675 17.663 6.337Q15.325 4 12 4Q8.675 4 6.338 6.337Q4 8.675 4 12Q4 15.325 6.338 17.663Q8.675 20 12 20Z"/></svg>`;

    //Check if user has already liked this bit
    for (const key in disliked_bits) {
        
        let value = disliked_bits[key];
        if (value.id === id){
            dislike_button.innerHTML = `<svg id="feedback-icon-source" xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path id="dislike-icon-${id}" style="fill: ${feedback_icon_color}" d="M15.5 11Q16.15 11 16.575 10.575Q17 10.15 17 9.5Q17 8.85 16.575 8.425Q16.15 8 15.5 8Q14.85 8 14.425 8.425Q14 8.85 14 9.5Q14 10.15 14.425 10.575Q14.85 11 15.5 11ZM8.5 11Q9.15 11 9.575 10.575Q10 10.15 10 9.5Q10 8.85 9.575 8.425Q9.15 8 8.5 8Q7.85 8 7.425 8.425Q7 8.85 7 9.5Q7 10.15 7.425 10.575Q7.85 11 8.5 11ZM12 17.5Q13.775 17.5 15.137 16.525Q16.5 15.55 17.1 14H15.45Q14.925 14.9 14.025 15.45Q13.125 16 12 16Q10.875 16 9.975 15.45Q9.075 14.9 8.55 14H6.9Q7.5 15.55 8.863 16.525Q10.225 17.5 12 17.5ZM12 22Q9.925 22 8.1 21.212Q6.275 20.425 4.925 19.075Q3.575 17.725 2.788 15.9Q2 14.075 2 12Q2 9.925 2.788 8.1Q3.575 6.275 4.925 4.925Q6.275 3.575 8.1 2.787Q9.925 2 12 2Q14.075 2 15.9 2.787Q17.725 3.575 19.075 4.925Q20.425 6.275 21.212 8.1Q22 9.925 22 12Q22 14.075 21.212 15.9Q20.425 17.725 19.075 19.075Q17.725 20.425 15.9 21.212Q14.075 22 12 22ZM12 12Q12 12 12 12Q12 12 12 12Q12 12 12 12Q12 12 12 12Q12 12 12 12Q12 12 12 12Q12 12 12 12Q12 12 12 12ZM12 20Q15.325 20 17.663 17.663Q20 15.325 20 12Q20 8.675 17.663 6.337Q15.325 4 12 4Q8.675 4 6.338 6.337Q4 8.675 4 12Q4 15.325 6.338 17.663Q8.675 20 12 20Z"/></svg>`;
            dislike_button.style.backgroundColor = feedback_background_color;
            break;
        } else {
            dislike_button.innerHTML = `<svg id="feedback-icon-source" xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path id="dislike-icon-${id}" style="fill:" d="M15.5 11Q16.15 11 16.575 10.575Q17 10.15 17 9.5Q17 8.85 16.575 8.425Q16.15 8 15.5 8Q14.85 8 14.425 8.425Q14 8.85 14 9.5Q14 10.15 14.425 10.575Q14.85 11 15.5 11ZM8.5 11Q9.15 11 9.575 10.575Q10 10.15 10 9.5Q10 8.85 9.575 8.425Q9.15 8 8.5 8Q7.85 8 7.425 8.425Q7 8.85 7 9.5Q7 10.15 7.425 10.575Q7.85 11 8.5 11ZM12 17.5Q13.775 17.5 15.137 16.525Q16.5 15.55 17.1 14H15.45Q14.925 14.9 14.025 15.45Q13.125 16 12 16Q10.875 16 9.975 15.45Q9.075 14.9 8.55 14H6.9Q7.5 15.55 8.863 16.525Q10.225 17.5 12 17.5ZM12 22Q9.925 22 8.1 21.212Q6.275 20.425 4.925 19.075Q3.575 17.725 2.788 15.9Q2 14.075 2 12Q2 9.925 2.788 8.1Q3.575 6.275 4.925 4.925Q6.275 3.575 8.1 2.787Q9.925 2 12 2Q14.075 2 15.9 2.787Q17.725 3.575 19.075 4.925Q20.425 6.275 21.212 8.1Q22 9.925 22 12Q22 14.075 21.212 15.9Q20.425 17.725 19.075 19.075Q17.725 20.425 15.9 21.212Q14.075 22 12 22ZM12 12Q12 12 12 12Q12 12 12 12Q12 12 12 12Q12 12 12 12Q12 12 12 12Q12 12 12 12Q12 12 12 12Q12 12 12 12ZM12 20Q15.325 20 17.663 17.663Q20 15.325 20 12Q20 8.675 17.663 6.337Q15.325 4 12 4Q8.675 4 6.338 6.337Q4 8.675 4 12Q4 15.325 6.338 17.663Q8.675 20 12 20Z"/></svg>`;
        }
    }
    

    bit_interactions.appendChild(dislike_button);

    let dislike_counter = yb_createElement("p", `dislike-count-${id}`, "counter");
    dislike_counter.innerHTML = dislike_count;
    bit_interactions.appendChild(dislike_counter);
    
    dislike_button.addEventListener("click", function(e){

        let this_element = e.currentTarget;
        yb_Interact("dislike", this_element, "none");


    
    });
    //Comment Label
    let comment_label = yb_createElement("p", `comment-label-${id}`, "comment-label");
    comment_label.innerHTML = "Comments";
    comment_label.setAttribute("style", `display: none; color: ${title_color}; font-weight: bold;`)
    new_bit.appendChild(comment_label);

    //Comment Container
    let comment_container = yb_createElement("div", `comment-container-${id}`, "comment-container");
    comment_container.style.display = "none";
    new_bit.appendChild(comment_container);

    //Comments
    let comment_button = yb_createButton("show-comment", `show-comment-${id}`, "feedback-icon");
    comment_button.setAttribute("data-catid", id)
    comment_button.setAttribute("data-state", "show")
    comment_button.innerHTML = `<svg id="feedback-icon-source" xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path id="comment-icon-${id}" d="M6 14H18V12H6ZM6 11H18V9H6ZM6 8H18V6H6ZM22 22 18 18H4Q3.175 18 2.588 17.413Q2 16.825 2 16V4Q2 3.175 2.588 2.587Q3.175 2 4 2H20Q20.825 2 21.413 2.587Q22 3.175 22 4ZM4 4V16Q4 16 4 16Q4 16 4 16H18.825L20 17.175V4Q20 4 20 4Q20 4 20 4H4Q4 4 4 4Q4 4 4 4ZM4 4V17.175V16Q4 16 4 16Q4 16 4 16V4Q4 4 4 4Q4 4 4 4Q4 4 4 4Q4 4 4 4Z"/></svg>`
    bit_interactions.appendChild(comment_button);

    //Comment Button Event Listener
    comment_button.addEventListener("click", function(e){
        let this_element = e.currentTarget;
        let this_id = this_element.getAttribute("data-catid");
        let this_bit = document.getElementById(`bit-${this_id}`);
        let this_icon = document.getElementById(`comment-icon-${this_id}`);
        let this_state = this_element.getAttribute("data-state");

        if (this_state === "show"){
            yb_showComments(this_id);
            this_icon.style.fill = this_bit.getAttribute("data-icon-color");
            this_element.style.backgroundColor = this_bit.getAttribute("data-button-color");
            this_element.setAttribute("data-state", "hide");

        }   else if (this_state === "hide"){
            yb_hideComments(this_id);
            this_icon.style.fill = "white";
            this_element.style.backgroundColor = "transparent";
            this_element.setAttribute("data-state", "show");
        }



    });
    

    //Comment Counter
    let comment_counter = yb_createElement("p", `comment-count-${id}`, "counter");
    comment_counter.innerHTML = comment_count;
    bit_interactions.appendChild(comment_counter);

    //Shares
    let share_button = yb_createButton("share", `share-${id}`, "feedback-icon");
    share_button.innerHTML = `<svg id="feedback-icon-source" xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="M6 23Q5.175 23 4.588 22.413Q4 21.825 4 21V10Q4 9.175 4.588 8.587Q5.175 8 6 8H9V10H6Q6 10 6 10Q6 10 6 10V21Q6 21 6 21Q6 21 6 21H18Q18 21 18 21Q18 21 18 21V10Q18 10 18 10Q18 10 18 10H15V8H18Q18.825 8 19.413 8.587Q20 9.175 20 10V21Q20 21.825 19.413 22.413Q18.825 23 18 23ZM11 16V4.825L9.4 6.425L8 5L12 1L16 5L14.6 6.425L13 4.825V16Z"/></svg>`
    bit_interactions.appendChild(share_button);

    let share_counter = yb_createElement("p", `share-count-${id}`, "counter");
    share_counter.innerHTML = "0";
    bit_interactions.appendChild(share_counter);

    //Dontation
    let donate_button = yb_createButton("donate", `donate-bit-${id}`, "feedback-icon");
    donate_button.innerHTML = `<svg id="feedback-icon-source" xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="M11.025 21V18.85Q9.7 18.55 8.738 17.7Q7.775 16.85 7.325 15.3L9.175 14.55Q9.55 15.75 10.288 16.375Q11.025 17 12.225 17Q13.25 17 13.963 16.538Q14.675 16.075 14.675 15.1Q14.675 14.225 14.125 13.712Q13.575 13.2 11.575 12.55Q9.425 11.875 8.625 10.938Q7.825 10 7.825 8.65Q7.825 7.025 8.875 6.125Q9.925 5.225 11.025 5.1V3H13.025V5.1Q14.275 5.3 15.088 6.012Q15.9 6.725 16.275 7.75L14.425 8.55Q14.125 7.75 13.575 7.35Q13.025 6.95 12.075 6.95Q10.975 6.95 10.4 7.438Q9.825 7.925 9.825 8.65Q9.825 9.475 10.575 9.95Q11.325 10.425 13.175 10.95Q14.9 11.45 15.788 12.537Q16.675 13.625 16.675 15.05Q16.675 16.825 15.625 17.75Q14.575 18.675 13.025 18.9V21Z"/></svg>`
    bit_interactions.appendChild(donate_button);

    //Append interaction container
    new_bit.appendChild(bit_interactions);

    let comment_field_container = yb_createElement("div", `field-write-comment-${id}`, "comment-field-container");
    
    //Comment Field
    let comment_field = yb_createElement("input", `field-write-comment-${id}`, "write-comment-field-text");
    comment_field.setAttribute("placeholder", "Write Comment");
    comment_field.setAttribute("style", `color: white; border: 2px solid ${accent_color}`);
    comment_field_container.appendChild(comment_field);

    //Comment Submit Button
    let submit_comment_button = yb_createButton("send_comment", `button-submit-comment-${id}`, "send-comment")
    submit_comment_button.setAttribute("data-catid", id);
    submit_comment_button.setAttribute("style", "background-color: rgba(255, 255, 255, 0.5)");
    submit_comment_button.innerHTML = `<svg style="display: block; top: 50%; left: 50%; transform: translate(-50%, -50%); position: absolute;" xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="M6 19.05 7.975 18.25Q7.725 17.525 7.513 16.775Q7.3 16.025 7.175 15.275L6 16.075Q6 16.075 6 16.075Q6 16.075 6 16.075ZM10 18H14Q14.45 17 14.725 15.562Q15 14.125 15 12.625Q15 10.15 14.175 7.937Q13.35 5.725 12 4.525Q10.65 5.725 9.825 7.937Q9 10.15 9 12.625Q9 14.125 9.275 15.562Q9.55 17 10 18ZM12 13Q11.175 13 10.588 12.412Q10 11.825 10 11Q10 10.175 10.588 9.587Q11.175 9 12 9Q12.825 9 13.413 9.587Q14 10.175 14 11Q14 11.825 13.413 12.412Q12.825 13 12 13ZM18 19.05V16.075Q18 16.075 18 16.075Q18 16.075 18 16.075L16.825 15.275Q16.7 16.025 16.488 16.775Q16.275 17.525 16.025 18.25ZM12 1.975Q14.475 3.775 15.738 6.55Q17 9.325 17 13Q17 13 17 13Q17 13 17 13L19.1 14.4Q19.525 14.675 19.763 15.125Q20 15.575 20 16.075V22L15.025 20H8.975L4 22V16.075Q4 15.575 4.238 15.125Q4.475 14.675 4.9 14.4L7 13Q7 13 7 13Q7 13 7 13Q7 9.325 8.262 6.55Q9.525 3.775 12 1.975Z"/></svg>`
    comment_field_container.appendChild(submit_comment_button);

    submit_comment_button.addEventListener("click", function(e){
        let this_id = e.currentTarget.getAttribute("data-catid");
        console.log(this_id)
        let element_id = `bit-${this_id}`;
        console.log(element_id)
        let this_bit = document.getElementById(element_id);
        let comment_field = this_bit.querySelector(`.write-comment-field-text`);
        let comment = comment_field.value;
        console.log(comment)


        if (comment_field.value != "") {
            yb_sendComment(this_id, comment);
            comment_field.value = "";
            this_bit.querySelector(".no-comment-body").remove();
            
        }
        else {
            console.log("no comment");
        }
    });

    new_bit.appendChild(comment_field_container)

    let bit_comments = `
        <p class = "comments-display-label" id="label-comments-${id}" style="display:none;"><b>Comments:</b></p>
        <div class = "${type}-comment-display-container" id="container-display-comments-${id}" style="display: none;">
            
        </div>

    
    `;

    let timer;

    new_bit.addEventListener("pointerdown", function(event) {
        console.log("mousedown");
        let scrolling = yb_isScrolling();
        console.log(scrolling)
        if (scrolling === false){       
        
        let this_element = event.currentTarget;
        timer = setTimeout(function() {

                console.log("bit held");
            
                let bit_id = this_element.getAttribute("data-id");

                let this_user = yb_getSessionValues("id");
                let bit_user = this_element.getAttribute("data-userid");
                let content_container = document.getElementById("content-container")
                context_menu = yb_createElement("div", `bit-context-${bit_id}`, "bit-context-menu");
                
                divider = yb_createElement("div", `context-backdrop-${bit_id}`, "bit-context-backdrop");
                divider.setAttribute("data-bit-id", this_element.id)
                
                this_element.appendChild(divider);
                this_element.appendChild(context_menu);
                this_element.style.zIndex = "7";
                console.log("this user: " + this_user);
                console.log("bit user: " + bit_user);


                exit_menu = yb_createElement("div", "context-menu-exit", "context-menu-exit");
                exit_menu.setAttribute("data-bit-id", this_element.id)
                

                content_container.appendChild(exit_menu);
                if (this_user === bit_user){

                    
                    edit_option = yb_createElement("div", `bit-edit`, "bit-context-option");
                    edit_option.setAttribute("data-id", bit_id)
                    edit_option.setAttribute("data-bit-id", `bit-${bit_id}`)
                    
                    edit_option.innerHTML=`
                        <svg class="list-icon" xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="M5 19h1.4l8.625-8.625-1.4-1.4L5 17.6ZM19.3 8.925l-4.25-4.2 1.4-1.4q.575-.575 1.413-.575.837 0 1.412.575l1.4 1.4q.575.575.6 1.388.025.812-.55 1.387ZM17.85 10.4 7.25 21H3v-4.25l10.6-10.6Zm-3.525-.725-.7-.7 1.4 1.4Z"/></svg>
                        <p>Edit Bit</p>
                    `
                    context_menu.appendChild(edit_option);
                    edit_option.addEventListener("click", function() {
                        yb_handleEditBit(this);
                        hideContextMenu("close", this);

                    });

                    add_to_cluster = yb_createElement("div", `bit-add`, "bit-context-option");
                    add_to_cluster.setAttribute("data-id", bit_id);
                    add_to_cluster.innerHTML= `
                        <svg class="list-icon" xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="M13 14h2v-3h3V9h-3V6h-2v3h-3v2h3Zm-5 4q-.825 0-1.412-.587Q6 16.825 6 16V4q0-.825.588-1.413Q7.175 2 8 2h12q.825 0 1.413.587Q22 3.175 22 4v12q0 .825-.587 1.413Q20.825 18 20 18Zm0-2h12V4H8v12Zm-4 6q-.825 0-1.412-.587Q2 20.825 2 20V6h2v14h14v2ZM8 4v12V4Z"/></svg>
                        <p>Add to Cluster</p>
                    `;
                    context_menu.appendChild(add_to_cluster);
                    add_to_cluster.addEventListener("click", function() {

                        let this_id = this.getAttribute("data-id");
                        console.log("click on option on bit: " + bit_id)

                        let this_menu = document.getElementById("bit-context-"+ this_id);
                        $(`#bit-context-${this_id}`).animate({"width":"70vw", "height": "200px"}, "fast")
                        $(`#bit-context-${this_id}`).empty()
                        $(`#bit-context-${this_id}`).html(`
                            <h4 style="color: white; margin-left:10px; grid-row: 1;">Add to...</h4>
                        `);
                        create_cluster = yb_createElement("div", `list-create-cluster`, "bit-context-option");
                        
                        create_cluster.innerHTML = `
                            <svg class="list-icon" xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="M11 19v-6H5v-2h6V5h2v6h6v2h-6v6Z"/></svg>
                            <p>New Cluster</p>
                        `
                        $(`#bit-context-${this_id}`).append(create_cluster);
                        

                    });
                    
                    hide_option = yb_createElement("div", `bit-hide`, "bit-context-option");
                    hide_option.setAttribute("data-id", bit_id);
                    hide_option.setAttribute("data-bit-id", this_element.id);
                    hide_option.innerHTML = `
                        <svg class="list-icon" xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="m16.1 13.3-1.45-1.45q.225-1.175-.675-2.2-.9-1.025-2.325-.8L10.2 7.4q.425-.2.862-.3Q11.5 7 12 7q1.875 0 3.188 1.312Q16.5 9.625 16.5 11.5q0 .5-.1.938-.1.437-.3.862Zm3.2 3.15-1.45-1.4q.95-.725 1.688-1.588.737-.862 1.262-1.962-1.25-2.525-3.588-4.013Q14.875 6 12 6q-.725 0-1.425.1-.7.1-1.375.3L7.65 4.85q1.025-.425 2.1-.638Q10.825 4 12 4q3.775 0 6.725 2.087Q21.675 8.175 23 11.5q-.575 1.475-1.512 2.738Q20.55 15.5 19.3 16.45Zm.5 6.15-4.2-4.15q-.875.275-1.762.413Q12.95 19 12 19q-3.775 0-6.725-2.087Q2.325 14.825 1 11.5q.525-1.325 1.325-2.463Q3.125 7.9 4.15 7L1.4 4.2l1.4-1.4 18.4 18.4ZM5.55 8.4q-.725.65-1.325 1.425T3.2 11.5q1.25 2.525 3.587 4.012Q9.125 17 12 17q.5 0 .975-.062.475-.063.975-.138l-.9-.95q-.275.075-.525.112Q12.275 16 12 16q-1.875 0-3.188-1.312Q7.5 13.375 7.5 11.5q0-.275.037-.525.038-.25.113-.525Zm7.975 2.325ZM9.75 12.6Z"/></svg>
                        <p>Hide Bit</p>
                    `
                    context_menu.appendChild(hide_option);
                    hide_option.addEventListener("click", function() {
                        let this_id = this.getAttribute("data-id");
                        let this_element = `#bit-context-${this_id}`;
                        
                        yb_handleHideBit(bit_id);
                        
                        hideContextMenu("close", this_element);
                    })
                    
                    delete_option = yb_createElement("div", `bit-delete`, "bit-context-option");
                    delete_option.innerHTML = `
                        <svg class="list-icon" xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path style="fill: red;" d="M7 21q-.825 0-1.412-.587Q5 19.825 5 19V6H4V4h5V3h6v1h5v2h-1v13q0 .825-.587 1.413Q17.825 21 17 21ZM17 6H7v13h10ZM9 17h2V8H9Zm4 0h2V8h-2ZM7 6v13Z"/></svg>
                        <p style="color:red;">Delete Bit</p>
                    `
                    delete_option.setAttribute("data-bit-id", this_element.id);
                    delete_option.addEventListener("click", function(event) {

                        yb_deleteBit(bit_id);
                        this_element = event.currentTarget;
                        hideContextMenu("delete", this_element);
                    });
                    context_menu.appendChild(delete_option);
                } else {
                    add_to_cluster = yb_createElement("div", `bit-add`, "bit-context-option");
                    add_to_cluster.innerHTML= `
                        <svg class="list-icon" xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="M13 14h2v-3h3V9h-3V6h-2v3h-3v2h3Zm-5 4q-.825 0-1.412-.587Q6 16.825 6 16V4q0-.825.588-1.413Q7.175 2 8 2h12q.825 0 1.413.587Q22 3.175 22 4v12q0 .825-.587 1.413Q20.825 18 20 18Zm0-2h12V4H8v12Zm-4 6q-.825 0-1.412-.587Q2 20.825 2 20V6h2v14h14v2ZM8 4v12V4Z"/></svg>
                        <p>Add to Cluster</p>
                    `
                    context_menu.appendChild(add_to_cluster);

                    hide_option = yb_createElement("div", `bit-edit`, "bit-context-option");
                    hide_option.innerHTML = `
                        <svg class="list-icon" xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="m16.1 13.3-1.45-1.45q.225-1.175-.675-2.2-.9-1.025-2.325-.8L10.2 7.4q.425-.2.862-.3Q11.5 7 12 7q1.875 0 3.188 1.312Q16.5 9.625 16.5 11.5q0 .5-.1.938-.1.437-.3.862Zm3.2 3.15-1.45-1.4q.95-.725 1.688-1.588.737-.862 1.262-1.962-1.25-2.525-3.588-4.013Q14.875 6 12 6q-.725 0-1.425.1-.7.1-1.375.3L7.65 4.85q1.025-.425 2.1-.638Q10.825 4 12 4q3.775 0 6.725 2.087Q21.675 8.175 23 11.5q-.575 1.475-1.512 2.738Q20.55 15.5 19.3 16.45Zm.5 6.15-4.2-4.15q-.875.275-1.762.413Q12.95 19 12 19q-3.775 0-6.725-2.087Q2.325 14.825 1 11.5q.525-1.325 1.325-2.463Q3.125 7.9 4.15 7L1.4 4.2l1.4-1.4 18.4 18.4ZM5.55 8.4q-.725.65-1.325 1.425T3.2 11.5q1.25 2.525 3.587 4.012Q9.125 17 12 17q.5 0 .975-.062.475-.063.975-.138l-.9-.95q-.275.075-.525.112Q12.275 16 12 16q-1.875 0-3.188-1.312Q7.5 13.375 7.5 11.5q0-.275.037-.525.038-.25.113-.525Zm7.975 2.325ZM9.75 12.6Z"/></svg>
                        <p>Hide Bit</p>
                    `
                    context_menu.appendChild(hide_option);
                    
                    block_option = yb_createElement("div", `bit-block`, "bit-context-option");

                    report_option = yb_createElement("div", `bit-report`, "bit-context-option");

                }
                exit_menu.addEventListener("click", function(e) {
                    this_element = e.currentTarget;
                    hideContextMenu("close", this_element);
                    
                });

                divider.addEventListener("click", function(e) {
                    this_element = e.currentTarget;
                    hideContextMenu("close", this_element);
                });
        }, 1250); // time in milliseconds        
        } else {
                    console.log("scroll in progress...")
        }

        event.preventDefault();
        
    });


    new_bit.addEventListener("pointerup", function() {
        console.log("mouseup");
        clearTimeout(timer);
    });

    return {'element_id':element_id, 'built_bit':new_bit}


}

//Function for generating list items
function BuildListItem(result, type){
    let id = result.this_id
    let primary_color = result.primary_color;
    let image = result.image;
    let name = result.first_name + " " + result.last_name;
    let handle = result.username;
    let element_id = `${type}-${id}`;
    let new_item = yb_createElement("div", `result-${element_id}`, "full-result");
    new_item.setAttribute("style", `background-color: ${primary_color};`);
    new_item.setAttribute("data-catid", `${result.this_id}`);
    new_item.setAttribute("data-username", `${handle}`);
    new_item.innerHTML =`
        
            <div class = 'full-result-image-container'>
                <img class='full-result-image' src="${image}">
            </div>
            <div class='full-result-name-container'>
                <p class = 'full-result-name'><strong>${name}</strong></p>
                <p class = 'full-result-username'>
                    <small>@${handle}</small>
                </p>
            </div>
    `
    
    return new_item
}

//Function for generating list items
function yb_buildContactItem(result, type){
    let id = result.this_id
    let primary_color = result.primary_color;
    let image = result.image;
    let name = result.name;
    let handle = result.username;
    let element_id = `${type}-${id}`;
    let new_item = yb_createElement("div", `result-${element_id}`, "full-result");
    new_item.setAttribute("style", `background-color: ${primary_color};`);
    new_item.setAttribute("data-catid", `${result.this_id}`);
    new_item.innerHTML =`
        
            <div class = 'full-result-image-container'>
                <img class='full-result-image' src="${image}">
            </div>
            <div class='full-result-name-container'>
                <p class = 'full-result-name'><strong>${name}</strong></p>
                <p class = 'full-result-username'>
                    <small>@${handle}</small>
                </p>
            </div>
    `
    new_item.addEventListener('click', function() {
        
        messages_conversation_url(id, handle);
        yb_endTask("#message-task")
        yb_hideWidget()
        $(".minibar").animate({"bottom":"140px"});

    })
    return new_item
}

//Function for generating message bubbles
function BuildMessage(this_message){
    
    let id= this_message.id
    let time = this_message.time
    let sender = this_message.sender
    let sender_name = sender.first_name + " " + sender.last_name
    let body = this_message.body
    let profile_image = this_message.image
    let is_sender = this_message.is_sender

    console.log(is_sender)
    let new_element;

    if (is_sender === true){
        new_element = yb_createElement("div", `message-${id}`, "message-bubble message-bubble-right");
        new_element.setAttribute("data-id", id);

        new_body = yb_createElement("p", `message-body-${id}`, "message-body");
        new_body.innerHTML = body;
        new_element.appendChild(new_body);

        new_time = yb_createElement("p", `message-time-${id}`, "message-time");
        new_time.innerHTML = `<small>${time}</small>`;
        new_element.appendChild(new_time);

        new_avatar = yb_renderImage(profile_image, "message-hangover-right", new_element);
        new_avatar.style.display = "none";
        new_avatar.style.marginRight = "10px";
        new_element.appendChild(new_avatar);

    } else {
        new_element = yb_createElement("div", `message-${id}`, "message-bubble message-bubble-left");
        new_element.setAttribute("data-id", id)
        
        new_body = yb_createElement("p", `message-body-${id}`, "message-body");
        new_body.innerHTML = body;
        new_element.appendChild(new_body);

        new_time = yb_createElement("p", `message-time-${id}`, "message-time");
        new_time.innerHTML = `<small>${time}</small>`;
        new_element.appendChild(new_time);

        new_avatar = yb_renderImage(profile_image, "message-hangover-right", new_element);
        new_avatar.style.display = "none";
        new_avatar.style.marginRight = "10px";
        new_element.appendChild(new_avatar);

    }


    return new_element


}

function yb_buildNotification(notification){
    console.log(notification)
    //General information
    let id = notification.id;
    let type = notification.type;
    console.log(type)
    
    //From user name
    let from_user = notification.from_user;
    let name = from_user.first_name + " " + from_user.last_name;
    let username = from_user.username;

    //Create notification element
    let notification_element = yb_createElement("div", `notification-${id}`, "list-item-notification");
    notification_element.setAttribute("data-id", id);
    notification_element.setAttribute("data-type", type);
    

    //Initialize body and icon label
    let body;
    let icon_label;

    let accept_button;
    let ignore_button;

    let responses = yb_createElement("div", `notification-responses-${id}`, "button-container-list-item");

    if (type === 1){
        body = `<p>${name} liked your bit</p>`;
        icon_label = `<svg class="icon-notification-type" xmlns="http://www.w3.org/2000/svg" height="40" viewBox="0 96 960 960" width="40"><path d="M360 798.666h226.667q15 0 26.166-6.833Q624 785 630.667 772l80-186.667q2-5 3.333-13.333 1.333-8.334 1.333-13.334V532q0-15-8.166-23.167Q699 500.667 684 500.667H480l27.333-137.334q2-8.666-.333-16.333-2.334-7.666-8-13.333l-23.667-24.333L306.667 492q-5.333 8-9.333 16.667-4 8.666-4 18.666V732q0 26.333 19.833 46.5Q333 798.666 360 798.666ZM480 976q-82.333 0-155.333-31.5t-127.334-85.833Q143 804.333 111.5 731.333T80 576q0-83 31.5-156t85.833-127q54.334-54 127.334-85.5T480 176q83 0 156 31.5T763 293q54 54 85.5 127T880 576q0 82.333-31.5 155.333T763 858.667Q709 913 636 944.5T480 976Zm0-66.666q139.333 0 236.334-97.334 97-97.333 97-236 0-139.333-97-236.334-97.001-97-236.334-97-138.667 0-236 97Q146.666 436.667 146.666 576q0 138.667 97.334 236 97.333 97.334 236 97.334ZM480 576Z"/></svg>`
        
        let bit = notification.bit;
        
        let accept_button = yb_createButton("accept", "notification-accept-button", "yb-button-no-background", "Send Thanks!");
        accept_button.setAttribute("data-id", id);
        responses.appendChild(accept_button);

        let ignore_button = yb_createButton("ignore", "notification-ignore-button", "yb-button-no-background", "Close");
        ignore_button.setAttribute("data-id", id);

        responses.appendChild(ignore_button);

        ignore_button.addEventListener("click", function(){
            let this_id = this.getAttribute("data-id");
            yb_removeNotification(this_id);
        });
        

        notification_element.setAttribute("data-bit-id", bit.id);
    
    } else if (type === 2){
        body = `<p>${name} commented on your bit</p>`;
        icon_label = `<svg class="icon-notification-type" xmlns="http://www.w3.org/2000/svg" height="40" viewBox="0 96 960 960" width="40"><path d="M240 656h480v-66.666H240V656Zm0-126.667h480v-66.666H240v66.666Zm0-126.667h480V336H240v66.666ZM880 976 720 816H146.666q-26.333 0-46.499-20.167Q80 775.667 80 749.334V242.666q0-26.333 20.167-46.499Q120.333 176 146.666 176h666.668q27 0 46.833 20.167Q880 216.333 880 242.666V976ZM146.666 242.666v506.668h601.001l65.667 65.667V242.666H146.666Zm0 0v572.335-572.335Z"/></svg>`
        
        let accept_button = yb_createButton("accept", "notification-accept-button", "yb-button-no-background", "View");
        
        accept_button.setAttribute("data-id", id);
        responses.appendChild(accept_button);

        let ignore_button = yb_createButton("ignore", "notification-ignore-button", "yb-button-no-background", "Close");
        ignore_button.setAttribute("data-id", id);
        responses.appendChild(ignore_button);



    } else if (type === 3){
        body = `<p>${name} followed you</p>`;
        icon_label = `<svg class="icon-notification-type" xmlns="http://www.w3.org/2000/svg" height="40" viewBox="0 96 960 960" width="40"><path d="M226 794q59-42.333 121.333-65.5Q409.667 705.334 480 705.334T613 728.5q62.667 23.167 121.667 65.5 41-49.667 59.833-103.667 18.834-54 18.834-114.333 0-141-96.167-237.167T480 242.666q-141 0-237.167 96.167T146.666 576q0 60.333 19.167 114.333T226 794Zm253.876-184.667q-58.209 0-98.043-39.957Q342 529.419 342 471.209q0-58.209 39.957-98.042 39.958-39.834 98.167-39.834t98.043 39.958Q618 413.248 618 471.457q0 58.21-39.957 98.043-39.958 39.833-98.167 39.833ZM480.312 976q-82.645 0-155.645-31.5-73-31.5-127.334-85.833Q143 804.333 111.5 731.489T80 575.823q0-82.823 31.5-155.49 31.5-72.666 85.833-127Q251.667 239 324.511 207.5T480.177 176q82.823 0 155.49 31.5 72.666 31.5 127 85.833Q817 347.667 848.5 420.355T880 575.688q0 82.645-31.5 155.645-31.5 73-85.833 127.334Q708.333 913 635.645 944.5T480.312 976ZM480 909.334q54.333 0 105-15.834 50.667-15.833 97.667-52.167-47-33.666-98-51.5Q533.667 772 480 772t-104.667 17.833q-51 17.834-98 51.5 47 36.334 97.667 52.167 50.667 15.834 105 15.834Zm0-366.667q31.333 0 51.334-20 20-20 20-51.334 0-31.333-20-51.333-20.001-20-51.334-20-31.333 0-51.334 20-20 20-20 51.333 0 31.334 20 51.334 20.001 20 51.334 20Zm0-71.334Zm0 369.334Z"/></svg>`

        let accept_button = yb_createButton("accept", "notification-accept-button", "yb-button-no-background", "Follow Back");
        
        accept_button.setAttribute("data-id", id);
        responses.appendChild(accept_button);

        accept_button.addEventListener("click", function(){
            let this_id = this.getAttribute("data-id");
            yb_followUser(this_id);
        });


        let ignore_button = yb_createButton("ignore", "notification-ignore-button", "yb-button-no-background", "Close");
        ignore_button.setAttribute("data-id", id);
        responses.appendChild(ignore_button);

        ignore_button.addEventListener("click", function(){
            let this_id = this.getAttribute("data-id");
            yb_removeNotification(this_id);
        });

    } else if (type === 4){
        body = `<p>${name} sent you a friend request</p>`;
        icon_label = `<svg class="icon-notification-type" xmlns="http://www.w3.org/2000/svg" height="40" viewBox="0 96 960 960" width="40"><path d="M226 794q59-42.333 121.333-65.5Q409.667 705.334 480 705.334T613 728.5q62.667 23.167 121.667 65.5 41-49.667 59.833-103.667 18.834-54 18.834-114.333 0-141-96.167-237.167T480 242.666q-141 0-237.167 96.167T146.666 576q0 60.333 19.167 114.333T226 794Zm253.876-184.667q-58.209 0-98.043-39.957Q342 529.419 342 471.209q0-58.209 39.957-98.042 39.958-39.834 98.167-39.834t98.043 39.958Q618 413.248 618 471.457q0 58.21-39.957 98.043-39.958 39.833-98.167 39.833ZM480.312 976q-82.645 0-155.645-31.5-73-31.5-127.334-85.833Q143 804.333 111.5 731.489T80 575.823q0-82.823 31.5-155.49 31.5-72.666 85.833-127Q251.667 239 324.511 207.5T480.177 176q82.823 0 155.49 31.5 72.666 31.5 127 85.833Q817 347.667 848.5 420.355T880 575.688q0 82.645-31.5 155.645-31.5 73-85.833 127.334Q708.333 913 635.645 944.5T480.312 976ZM480 909.334q54.333 0 105-15.834 50.667-15.833 97.667-52.167-47-33.666-98-51.5Q533.667 772 480 772t-104.667 17.833q-51 17.834-98 51.5 47 36.334 97.667 52.167 50.667 15.834 105 15.834Zm0-366.667q31.333 0 51.334-20 20-20 20-51.334 0-31.333-20-51.333-20.001-20-51.334-20-31.333 0-51.334 20-20 20-20 51.333 0 31.334 20 51.334 20.001 20 51.334 20Zm0-71.334Zm0 369.334Z"/></svg>`
        
        let accept_button = yb_createButton("accept", "notification-accept-button", "yb-button-no-background", "Preview");
        accept_button.setAttribute("data-id", id);
        accept_button.setAttribute("data-username", username);

        responses.appendChild(accept_button);

        accept_button.addEventListener("click", function(){
            let this_id = this.getAttribute("data-id");
            let username = this.getAttribute("data-username");
            $("#notification-container").fadeOut(200);
            let profile_preview = yb_createElement("div", "profile-preview", "general-container");
            
            let ui_container = document.getElementById("general-ui-container");
            $("#general-ui-container").css("top", "15vh");
            $("#general-ui-container").animate({"height": "500px"}, "faster");
            ui_container.appendChild(profile_preview);


            $.ajax({
                url: `/api/profiles/${username}/`,
                type: "GET",
                success: function(data){
                    let custom = data.custom;
                    let user = data.user;

                    let preview_image = yb_renderImage(custom.image, "large-profile-image", "profile-preview-image");
                    profile_preview.appendChild(preview_image);

                    let preview_name = yb_createElement("h3", "profile-preview-name", "profile-preview-name");
                    preview_name.innerHTML = user.first_name + " " + user.last_name;
                    profile_preview.appendChild(preview_name);

                    let preview_username = yb_createElement("p", "profile-preview-username", "profile-preview-username");
                    preview_username.innerHTML = "<small>@</small>" + user.username;
                    profile_preview.appendChild(preview_username);

                    let bio_container = yb_createElement("div", "profile-preview-bio-container", "profile-preview-bio-container");
                    bio_container.innerHTML = data.user_bio;
                    profile_preview.appendChild(bio_container);

                    let show_connections_button = yb_createButton("show-connections", "profile-preview-show-connections", "wide-button", "Show Connections");
                    show_connections_button.setAttribute("data-id", user.id);
                    
                    show_connections_button.setAttribute("style", "background-color: #000000; color: white; font-weight: bold; width: 150px;");
                    profile_preview.appendChild(show_connections_button);
                    
                    
                    let mutual_friends = yb_createElement("p", "profile-preview-mutual-friends", "profile-preview-mutual-friends");
                    mutual_friends.innerHTML = "<i><small>No mutual friends</small></i>";
                    profile_preview.appendChild(mutual_friends);
                    
                    let preview_buttons = yb_createElement("div", "profile-preview-buttons", "profile-preview-buttons");
                    
                    let preview_accept_button = yb_createButton("accept", "profile-preview-accept-button", "wide-button", "Accept");
                    preview_accept_button.setAttribute("data-id", user.id);
                    preview_accept_button.setAttribute("data-username", username);
                    preview_accept_button.setAttribute("style", "background-color: #00b300; color: white; font-weight: bold; margin-right: 10px;");

                    
                    preview_buttons.appendChild(preview_accept_button);
                    
                    preview_accept_button.addEventListener("click", function(){
                        let this_id = this.getAttribute("data-id");
                        yb_addFriend(this_id);
                    });

                    let preview_deny_button = yb_createButton("deny", "profile-preview-deny-button", "wide-button", "Deny");
                    preview_deny_button.setAttribute("data-id", this_id);
                    preview_deny_button.setAttribute("data-username", username);
                    preview_deny_button.setAttribute("style", "background-color: #ff0000; color: white; font-weight: bold; margin-left: 10px;");
                    
                    preview_buttons.appendChild(preview_deny_button);
                    
                    preview_deny_button.addEventListener("click", function(){
                        let this_id = this.getAttribute("data-id");
                        denyFriend(this_id);
                    });
                    
                    preview_buttons.setAttribute("style", "display: block; position: absolute; width:100%; bottom: 20px; left: 50%; transform: translateX(-50%);")
                    profile_preview.appendChild(preview_buttons);

                
                },
            })
        });

        let ignore_button = yb_createButton("ignore", "notification-ignore-button", "yb-button-no-background", "Deny");
        ignore_button.setAttribute("data-id", id);
        responses.appendChild(ignore_button);


    } else if (type === 5){
        body = `<p>${name} accepted your friend request</p>`;
        icon_label = `<svg class="icon-notification-type" xmlns="http://www.w3.org/2000/svg" height="40" viewBox="0 96 960 960" width="40"><path d="M226 794q59-42.333 121.333-65.5Q409.667 705.334 480 705.334T613 728.5q62.667 23.167 121.667 65.5 41-49.667 59.833-103.667 18.834-54 18.834-114.333 0-141-96.167-237.167T480 242.666q-141 0-237.167 96.167T146.666 576q0 60.333 19.167 114.333T226 794Zm253.876-184.667q-58.209 0-98.043-39.957Q342 529.419 342 471.209q0-58.209 39.957-98.042 39.958-39.834 98.167-39.834t98.043 39.958Q618 413.248 618 471.457q0 58.21-39.957 98.043-39.958 39.833-98.167 39.833ZM480.312 976q-82.645 0-155.645-31.5-73-31.5-127.334-85.833Q143 804.333 111.5 731.489T80 575.823q0-82.823 31.5-155.49 31.5-72.666 85.833-127Q251.667 239 324.511 207.5T480.177 176q82.823 0 155.49 31.5 72.666 31.5 127 85.833Q817 347.667 848.5 420.355T880 575.688q0 82.645-31.5 155.645-31.5 73-85.833 127.334Q708.333 913 635.645 944.5T480.312 976ZM480 909.334q54.333 0 105-15.834 50.667-15.833 97.667-52.167-47-33.666-98-51.5Q533.667 772 480 772t-104.667 17.833q-51 17.834-98 51.5 47 36.334 97.667 52.167 50.667 15.834 105 15.834Zm0-366.667q31.333 0 51.334-20 20-20 20-51.334 0-31.333-20-51.333-20.001-20-51.334-20-31.333 0-51.334 20-20 20-20 51.333 0 31.334 20 51.334 20.001 20 51.334 20Zm0-71.334Zm0 369.334Z"/></svg>`
        
        let accept_button = yb_createButton("accept", "notification-accept-button", "yb-button-no-background", "Say Hello!");
        accept_button.setAttribute("data-id", id);
        responses.appendChild(accept_button);

        let ignore_button = yb_createButton("ignore", "notification-ignore-button", "yb-button-no-background", "Close");
        ignore_button.setAttribute("data-id", id);
        responses.appendChild(ignore_button);

        responses.appendChild(ignore_button);
        ignore_button.addEventListener("click", function(){
            let this_id = this.getAttribute("data-id");
            yb_removeNotification(this_id);
        });


    } else if (type === 6){
        body = `<p>${name} sent you a message</p>`;
        icon_label = `<svg class="icon-notification-type" xmlns="http://www.w3.org/2000/svg" height="40" viewBox="0 96 960 960" width="40"><path d="M146.666 896q-27 0-46.833-19.833T80 829.334V322.666q0-27 19.833-46.833T146.666 256h666.668q27 0 46.833 19.833T880 322.666v506.668q0 27-19.833 46.833T813.334 896H146.666ZM480 601.333 146.666 385.999v443.335h666.668V385.999L480 601.333Zm0-66.666 330.667-212.001H150l330 212.001ZM146.666 385.999v-63.333 506.668-443.335Z"/></svg>`

        let message = notification.message;
        
        let conversation = notification.conversation;
        

        let accept_button = yb_createButton("accept", "notification-accept-button", "yb-button-no-background", "Reply");
        accept_button.setAttribute("data-id", id);
        responses.appendChild(accept_button);

        accept_button.addEventListener("click", function(){
            let this_id = this.getAttribute("data-id");
            messages_conversation_url(conversation, username);
            yb_closeCard();
            yb_removeNotification(this_id);
        });


        let ignore_button = yb_createButton("ignore", "notification-ignore-button", "yb-button-no-background", "Close");
        ignore_button.setAttribute("data-id", id);
        responses.appendChild(ignore_button);
        ignore_button.addEventListener("click", function(){
            let this_id = this.getAttribute("data-id");
            yb_removeNotification(this_id);
        });

    } else if (type === 7){
        body = `<p>${name} sent you a donation</p>`;
        icon_label = `<svg class="icon-notification-type" xmlns="http://www.w3.org/2000/svg" height="40" viewBox="0 96 960 960" width="40"><path d="M448.667 860.667h60v-51.334q57.333-7.666 92-38 34.666-30.333 34.666-83.999 0-48.001-27.333-81.001-27.334-32.999-97.333-61Q452 522.667 427 505q-25-17.667-25-47.667Q402 428 423.167 411q21.166-17 58.833-17 30.667 0 51.333 14.5Q554 423 566.667 449.333l53.333-24q-15-35-43.5-57t-65.833-25.666V292h-60v50.667Q400 351 371 382.333t-29 75q0 48.334 29.167 77.334 29.166 29 88.833 52.666 65.667 26.334 90.5 47.334 24.834 21 24.834 52.667 0 32.333-25.5 50.5Q524.333 756 486.667 756q-37 0-65.834-21.5Q392 713 380 674l-56 20q18.667 46.667 48.833 74.167 30.167 27.5 75.834 39.166v53.334ZM480 976q-82.333 0-155.333-31.5t-127.334-85.833Q143 804.333 111.5 731.333T80 576q0-83 31.5-156t85.833-127q54.334-54 127.334-85.5T480 176q83 0 156 31.5T763 293q54 54 85.5 127T880 576q0 82.333-31.5 155.333T763 858.667Q709 913 636 944.5T480 976Zm0-66.666q139.333 0 236.334-97.334 97-97.333 97-236 0-139.333-97-236.334-97.001-97-236.334-97-138.667 0-236 97Q146.666 436.667 146.666 576q0 138.667 97.334 236 97.333 97.334 236 97.334ZM480 576Z"/></svg>`

        let accept_button = yb_createButton("accept", "notification-accept-button", "yb-button-no-background", "Send Thanks!");
        accept_button.setAttribute("data-id", id);
        responses.appendChild(accept_button);

        let ignore_button = yb_createButton("ignore", "notification-ignore-button", "yb-button-no-background", "Hide");
        ignore_button.setAttribute("data-id", id);
        responses.appendChild(ignore_button);
    }

    //Create notification element
    
    notification_element.innerHTML = `${icon_label} ${body}`
    notification_element.appendChild(responses); 

    return notification_element

}

//Function for generating comment bubbles
function yb_buildComment(comment){
    //Set up variables
    let user = comment.user;
    let sender_name = user.first_name + " " + user.last_name;
    let custom = comment.custom;
    let comment_id = comment.id;
    let profile_image = custom.image;
    let time = comment.time;
    let body = comment.body;
    let this_id = yb_getSessionValues("id");
    let is_sender;
    let comment_bubble;
    let comment_wrapper;
    let this_bit = document.getElementById(`bit-${comment.bit}`);
    let primary_color = this_bit.getAttribute("data-primary-color");
    let secondary_color = custom.accent_color;

    console.log()
    console.log(this_id)
    //Check if user is sender
    if (user.id === parseInt(this_id)){
        
        is_sender = true;
    } else {
        is_sender = false;
    }

    //Build comment bubble right side for sender and left side for receiver
    if (is_sender === true){
        //Build comment bubble for sender
        comment_wrapper = yb_createElement("div", `comment-wrapper-${comment_id}`, "comment-wrapper-right");
        comment_bubble = yb_createElement("div", `comment-${comment_id}`, "comment-bubble-right");
        comment_bubble.setAttribute("data-cat-id", comment_id);
        comment_bubble.setAttribute("style", `background-color: ${primary_color}`);
        //Create profile image
        rendered_image = yb_renderImage(profile_image, "image-hang-left", "yb-comment-image");
        rendered_image.setAttribute("style", `border: 2px solid ${secondary_color}`)
        comment_bubble.appendChild(rendered_image);
        
        //Create comment name
        let comment_name = yb_createElement("p", `comment-name-${comment_id}`, "comment-name");
        comment_name.innerHTML = sender_name;
        comment_bubble.appendChild(comment_name);
        
        //Create comment body
        let comment_body = yb_createElement("p", `comment-body-${comment_id}`, "comment-body");
        comment_body.innerHTML = body;
        comment_bubble.appendChild(comment_body);
        
        //Create comment time
        let comment_time = yb_createElement("p", `comment-time-${comment_id}`, "comment-time");
        comment_time.innerHTML = `<small>${time}</small>`;
        comment_bubble.appendChild(comment_time);
        comment_wrapper.appendChild(comment_bubble);
        return comment_wrapper

    } else {
        //Create comment bubble
        comment_bubble = yb_createElement("div", `comment-${comment_id}`, "comment-bubble-left");
        comment_bubble.setAttribute("data-cat-id", comment_id);

        //Create comment image
        rendered_image = yb_renderImage(profile_image, "image-hang-right", "yb-comment-image");
        comment_bubble.appendChild(rendered_image);

        //Create comment name
        let comment_name = yb_createElement("p", `comment-name-${comment_id}`, "comment-name");
        comment_name.innerHTML = sender_name;
        comment_bubble.appendChild(comment_name);

        //Create comment body
        let comment_body = yb_createElement("p", `comment-body-${comment_id}`, "comment-body");
        comment_body.innerHTML = body;
        comment_bubble.appendChild(comment_body);

        //Create comment time
        let comment_time = yb_createElement("p", `comment-time-${comment_id}`, "comment-time");
        comment_time.innerHTML = `<small>${time}</small>`;
        comment_bubble.appendChild(comment_time);
        return comment_bubble;

    }


    
}

function yb_GenerateFeedHeader(type){
    let browse_nav = yb_createElement("div", "yb-browse-nav", "yb-browse-nav")
    let location_title = `
        <h2 style='color: lightgray; text-align: center;'>${type} Space</h2>
    `


    var page_header_source = `

        

        <div id='yb-browse-nav' style='display:grid; grid-template-columns: auto auto auto auto auto;'>
            <select type="text" class='filter-button-wide-active' name="yb-align-text" id="yb-filter-dropdown" style='color: white;' value="all">
                <option value="all">All</option>
                <option value="friends">Friends</option>
                <option value="following">Following</option>
                <option value="public">Public</option>
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