function getElementId(e) {
    return `bit-${e.currentTarget.getAttribute("data-catid")}`;
}
// Function for sending a new comment on a bit
function yb_pressSendComment(e){
    // Retrieves the ID of the current target element
    let this_id = e.currentTarget.getAttribute("data-catid");
    console.log(this_id)
    // Constructs the element ID using the retrieved ID
    let element_id = `bit-${this_id}`;
    console.log(element_id)
    // Retrieves the bit element using the constructed ID
    let this_bit = document.getElementById(element_id);
    let comment_field = this_bit.querySelector(`.yb-field-commentField`);
    let comment = comment_field.value;
    console.log(comment)

    // Checks if the comment field is not empty
    if (comment_field.value != "") {
        // Retrieves the CSRF token
        let csrf_token = getCSRF();
        // Sends the comment to the server
        yb_sendComment(this_id, comment, csrf_token);
        // Clears the comment field
        comment_field.value = "";

    }
    else {
        console.log("no comment");
    }
}

// Function for deleting a user's own comment from a bit
function yb_pressCommentDelete(e){
    let this_id = e.currentTarget.getAttribute("data-catid");
    let bit_id = e.currentTarget.getAttribute("data-bitid");
    console.log(this_id)
    let element_id = `bit-${bit_id}`;
    console.log(element_id)
    
    let comment_data = {
        'bit_id': this_id,
    };
    let csrf_token = getCSRF();
    yb_deleteComment(this_id, bit_id, comment_data, csrf_token);
}

// Function for making a button and icon active
function yb_makeActive(button, icon=null) {
    button.classList.add("active");
    if (icon != null){
        icon.classList.add("active");
    }
}

// Function for making a button and icon inactive
function yb_makeInactive(button, icon=null) {
    button.classList.remove("active");
    if (icon != null){
        icon.classList.remove("active");
    }
}

function yb_pressHideComments(e){
    let this_id = e.currentTarget.getAttribute("data-catid");
    console.log(this_id)
    let element_id = `bit-${this_id}`;
    console.log(element_id)
    let this_bit = document.getElementById(element_id);
    let comment_button = document.getElementById(`show-comment-${this_id}`);
    let comment_icon = document.getElementById(`comment-icon-${this_id}`);

    let comment_container = this_bit.querySelector(`.yb-comment-container`);

    // Makes the comment button and icon inactive
    yb_makeInactive(comment_button, comment_icon);

    comment_container.classList.remove("open");

    // Removes the event listener from the comment button
    comment_button.removeEventListener("click", yb_pressHideComments);

    // Adds the event listener for showing the comments
    comment_button.addEventListener("click", yb_pressShowComments);
}

function yb_showComments(this_id) {
    
    console.log(this_id)
    let element_id = `bit-${this_id}`;
    console.log(element_id);
    let this_bit = document.getElementById(element_id);
    let comment_button = document.getElementById(`show-comment-${this_id}`);
    let comment_icon = document.getElementById(`comment-icon-${this_id}`);

    let comment_container = document.getElementById(`comment-container-${this_id}`);

    // Makes the comment button and icon active
    yb_makeActive(comment_button, comment_icon);

    // Retrieves and displays the comments for the bit
    yb_getComments(false, this_id);

    comment_container.classList.add("open");

    // Removes the event listener from the comment button
    comment_button.removeEventListener("click", yb_pressShowComments);

    // Adds the event listener for hiding the comments
    comment_button.addEventListener("click", yb_pressHideComments);


}

// Function for handling the click event of the show comments button
function yb_pressShowComments(e){
    let this_id = e.currentTarget.getAttribute("data-catid");
    console.log(this_id);
    yb_showComments(this_id);
}

function yb_toggleBitButton(button, this_id, this_bit) {
    let csrf_token = getCSRF();
    let this_button = this_bit.querySelector(`#${button}-${this_id}`);
    let this_count = this_bit.querySelector(`#${button}-count-${this_id}`);
    let this_icon = this_bit.querySelector(`#${button}-icon-${this_id}`);
    let this_count_int = parseInt(this_count.innerHTML);
    let this_data = {
        'bit_id': this_id,
    };

    // Checks if the like button is already active
    if (this_button.classList.contains("active")) {
        // Makes the this button and icon inactive
        yb_makeInactive(this_button, this_icon);
        // Decreases the this count by 1
        this_count.innerHTML = this_count_int - 1;
        // Sends a request to remove the this from the bit
        if (button == "like") {
            yb_sendLike(this_id, this_data, csrf_token);
        } else {
            yb_sendDislike(this_id, this_data, csrf_token);
        }

    }
    else {
        // Makes the this button and icon active
        yb_makeActive(this_button, this_icon);
        // Increases the this count by 1
        this_count.innerHTML = this_count_int + 1;
        // Sends a request to add a this to the bit
        if (button == "like") {
            yb_sendLike(this_id, this_data, csrf_token);
        } else {
            yb_sendDislike(this_id, this_data, csrf_token);
        }
    }

    if (button == "like") {
        let dislike_button = this_bit.querySelector(`#dislike-${this_id}`);
        let dislike_count = this_bit.querySelector(`#dislike-count-${this_id}`);
        let dislike_icon = this_bit.querySelector(`#dislike-icon-${this_id}`);
        let dislike_count_int = parseInt(dislike_count.innerHTML);
        let dislike_data = {
            'bit_id': this_id,
        };

        if (dislike_button.classList.contains("active")) {
            // Makes the dislike button and icon inactive
            yb_makeInactive(dislike_button, dislike_icon);
            // Decreases the dislike count by 1
            dislike_count.innerHTML = dislike_count_int - 1;
        }
    }

    if (button == "dislike") {
        let like_button = this_bit.querySelector(`#like-${this_id}`);
        let like_count = this_bit.querySelector(`#like-count-${this_id}`);
        let like_icon = this_bit.querySelector(`#like-icon-${this_id}`);
        let like_count_int = parseInt(like_count.innerHTML);
        let like_data = {
            'bit_id': this_id,
        };
        
        if (like_button.classList.contains("active")) {
            // Makes the like button and icon inactive
            yb_makeInactive(like_button, like_icon);
            // Decreases the like count by 1
            like_count.innerHTML = like_count_int - 1;
        }
    }
}

// Function for handling the click event of the like button
function yb_pressLike(e){
    let this_id = e.currentTarget.getAttribute("data-catid");
    console.log(this_id)
    let element_id = `bit-${this_id}`;
    console.log(element_id)
    let this_bit = document.getElementById(element_id);
    yb_toggleBitButton("like", this_id, this_bit);
}

// Function for handling the click event of the dislike button
function yb_pressDislike(e){
    let this_id = e.currentTarget.getAttribute("data-catid");
    console.log(this_id)
    let element_id = `bit-${this_id}`;
    console.log(element_id)
    let this_bit = document.getElementById(element_id);
    yb_toggleBitButton("dislike", this_id, this_bit);
}

// Function for handling the click event of the delete button on a bit's context menu
function yb_pressDelete(e){
    let this_id = e.currentTarget.getAttribute("data-catid");
    console.log(this_id)
    let element_id = `bit-${this_id}`;
    console.log(element_id)
    let this_bit = document.getElementById(element_id);
    let delete_button = this_bit.querySelector(`.delete-button`);
    let delete_data = {
        'bit_id': this_id,
    };

    // Sends a request to delete the bit
    yb_deleteBit(this_id, delete_data);
}

// Function for handling the click event of the edit button on a bit
function yb_pressEdit(e){
    let this_id = e.currentTarget.getAttribute("data-catid");
    console.log(this_id)
    let element_id = `bit-${this_id}`;
    console.log(element_id)
    let this_bit = document.getElementById(element_id);
    let edit_button = this_bit.querySelector(`.edit-button`);
    let edit_data = {
        'bit_id': this_id,
    };

    // Sends a request to edit the bit
    yb_editBit(this_id, edit_data);
}

function yb_contractBit(e) {
    let id = e.currentTarget.getAttribute("data-catid");
    let element_id = `body-bit-${id}`;
    let this_text = document.getElementById(element_id);
    let this_paragraph = this_text.querySelector(`.yb-bodyText-bit`);
    this_paragraph.style.paddingBottom = "0px";


    this_text.classList.remove("expanded");



    let show_more = this_text.querySelector(`.yb-showMore-bit`);
    let show_more_backdrop = this_text.querySelector(`.yb-showMore-backdrop`);

    show_more_backdrop.style.background = "linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.8))";
    show_more.innerHTML = "Show more";
    show_more.removeEventListener("click", yb_contractBit);
    show_more.addEventListener("click", yb_expandBit);

    let this_bit = document.getElementById(`bit-${id}`);
    this_bit.scrollIntoView({
        behavior: 'smooth', // Smooth scrolling
        block: 'start' // Scroll to the top of the element
    });

}

function yb_expandBit(e) {
    let id = e.currentTarget.getAttribute("data-catid");
    let element_id = `body-bit-${id}`;
    let this_text = document.getElementById(element_id);
    this_text.classList.add("expanded");

    let this_paragraph = this_text.querySelector(`.yb-bodyText-bit`);
    this_paragraph.style.paddingBottom = "50px";

    let show_more = this_text.querySelector(`.yb-showMore-bit`);
    
    let show_more_backdrop = this_text.querySelector(`.yb-showMore-backdrop`);

    show_more_backdrop.style.background = "transparent";
    show_more.innerHTML = "Show less";
    show_more.removeEventListener("click", yb_expandBit);
    show_more.addEventListener("click", yb_contractBit);

}

function yb_closeImage() {

    console.log("Swiped down to exit fullscreen!");
    $('.photo-viewer').animate({"top": "100vh"}, 200);
    $('.photo-viewer').fadeOut(200);
    $('.photo-viewer').remove();


}

function yb_fullScreenImage(source){
    let viewer = yb_createElement('div', 'photo-viewer', 'photo-viewer');
    let viewing_image = yb_renderImage(source, "full-screen-image", "full-screen-image");

    let photo_header = yb_createElement('div', 'div-header', 'div-header');
    photo_header.setAttribute("style", "position: absolute; display:grid; grid-template-columns: 1fr 1fr; top: 0px; left: 0px; width: 100%; height: 50px; background-color: rgba(0, 0, 0, 0.5);");
    photo_header.innerHTML = `
        <h3 class="yb-fillWidth yb-margin-L10 yb-autoText yb-center-margin tb"></h3>
        <div class='yb-button-close' id='cb-panel-close' onclick="yb_closeImage();"><svg class="yb-center-transform all yb-icon small" xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path class='yb-fill-white' d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/></svg></div>
    `

    
    viewer.appendChild(photo_header);

    viewer.appendChild(viewing_image);
    document.body.appendChild(viewer);

    $('.photo-viewer').fadeIn(200);
    $('.photo-viewer').animate({"top": "0px"}, 200);

}

function yb_openImage(source, index, this_id){
    let viewer = yb_createElement('div', 'photo-viewer', 'photo-viewer');
    viewer.setAttribute("style", "display: none");
    let viewing_image = yb_renderImage(source, "full-screen-image", "full-screen-image");

    let photo_header = yb_createElement('div', 'div-header', 'div-header');
    photo_header.setAttribute("style", "position: absolute; display:grid; grid-template-columns: 1fr 1fr; top: 0px; left: 0px; width: 100%; height: 50px; background-color: rgba(0, 0, 0, 0.5);");
    photo_header.innerHTML = `
        <h3 class="yb-fillWidth yb-margin-L10 yb-autoText yb-center-margin tb"></h3>
        <div class='yb-button-close' id='cb-panel-close' onclick="yb_closeImage();"><svg class="yb-center-transform all yb-icon small" xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path class='yb-fill-white' d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/></svg></div>
    `

    viewer.appendChild(photo_header);

    viewer.appendChild(viewing_image);
    document.body.appendChild(viewer);

    $('.photo-viewer').fadeIn(200);
    $('.photo-viewer').animate({"top": "0px"}, 200);

    $.ajax(
        {
            type: "GET",
            url: `/bits/api/bits/${this_id}/`,
        

            success: function(data) {
                let bit = data;
                let id = bit.id;
                let like_count = bit.like_count;
                let dislike_count = bit.dislike_count;
                let comment_count = bit.comment_count;

                let photo = bit.photos[index];

                let photo_header = yb_createElement('div', 'fs-image-header', 'fs-image-header');
                photo_header.setAttribute("style", "position: absolute; display:grid; grid-template-columns: 1fr 1fr; top: 0px; left: 0px; width: 100%; height: 50px; background-color: rgba(0, 0, 0, 0.5);");

                let full_viewing_image = yb_renderImage(photo.image, "full-screen-image", "full-screen-image");
                full_viewing_image.setAttribute("style", "visibility: hidden;");
                viewer.appendChild(full_viewing_image);

                full_viewing_image.onload = function() {
                    viewing_image.remove();
                    full_viewing_image.setAttribute("style", "visibility: visible;");
                    
                }

                let info_container = yb_createElement('div', 'photo-info-container', 'info-container-fs');
                info_container.setAttribute("style", "padding-left: 10px; color: white; text-shadow: 1px 1px 2px black; position: absolute; bottom: 60px;");
                
                let name_container = yb_createElement('b', 'photo-name-container', 'name-container-fs');
                name_container.innerHTML = bit.display_name;
                info_container.appendChild(name_container);

                let description = yb_createElement('p', 'photo-description-container', 'description-container-fs');
                description.setAttribute("style", "font-size: 14px;");
                description.innerHTML = bit.body;
                info_container.appendChild(description);
                
                viewer.appendChild(info_container);
                
                let interaction_container = yb_createElement('div', 'photo-interaction-container', 'interaction-container-fs');
                interaction_container.setAttribute("style", "position: absolute; display: grid; grid-template-columns: 50px auto 50px auto 50px auto 50px auto 50px;, width: 100%; bottom: 0px; left: 0px;");
                
                //Like Button
                let like_button = yb_createButton("like", `like-${id}`, "feedback-icon");
                like_button.setAttribute("data-catid", id)
                like_button.innerHTML = `<svg id="feedback-icon-source" xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path id="like-icon-${id}" style="fill:" d="M15.5 11Q16.15 11 16.575 10.575Q17 10.15 17 9.5Q17 8.85 16.575 8.425Q16.15 8 15.5 8Q14.85 8 14.425 8.425Q14 8.85 14 9.5Q14 10.15 14.425 10.575Q14.85 11 15.5 11ZM8.5 11Q9.15 11 9.575 10.575Q10 10.15 10 9.5Q10 8.85 9.575 8.425Q9.15 8 8.5 8Q7.85 8 7.425 8.425Q7 8.85 7 9.5Q7 10.15 7.425 10.575Q7.85 11 8.5 11ZM12 17.5Q13.775 17.5 15.137 16.525Q16.5 15.55 17.1 14H15.45Q14.925 14.9 14.025 15.45Q13.125 16 12 16Q10.875 16 9.975 15.45Q9.075 14.9 8.55 14H6.9Q7.5 15.55 8.863 16.525Q10.225 17.5 12 17.5ZM12 22Q9.925 22 8.1 21.212Q6.275 20.425 4.925 19.075Q3.575 17.725 2.788 15.9Q2 14.075 2 12Q2 9.925 2.788 8.1Q3.575 6.275 4.925 4.925Q6.275 3.575 8.1 2.787Q9.925 2 12 2Q14.075 2 15.9 2.787Q17.725 3.575 19.075 4.925Q20.425 6.275 21.212 8.1Q22 9.925 22 12Q22 14.075 21.212 15.9Q20.425 17.725 19.075 19.075Q17.725 20.425 15.9 21.212Q14.075 22 12 22ZM12 12Q12 12 12 12Q12 12 12 12Q12 12 12 12Q12 12 12 12Q12 12 12 12Q12 12 12 12Q12 12 12 12Q12 12 12 12ZM12 20Q15.325 20 17.663 17.663Q20 15.325 20 12Q20 8.675 17.663 6.337Q15.325 4 12 4Q8.675 4 6.338 6.337Q4 8.675 4 12Q4 15.325 6.338 17.663Q8.675 20 12 20Z"/></svg>`;
                interaction_container.appendChild(like_button);

                //Like Counter
                let like_counter = yb_createElement("p", `like-count-${id}`, "counter");
                like_counter.innerHTML = like_count;
                interaction_container.appendChild(like_counter);


                //Dislike Button
                let dislike_button = yb_createButton("dislike", `dislike-${id}`, "feedback-icon");
                dislike_button.setAttribute("data-catid", id)
                dislike_button.innerHTML = `<svg id="feedback-icon-source" xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path id="dislike-icon-${id}" style="fill:" d="M15.5 11Q16.15 11 16.575 10.575Q17 10.15 17 9.5Q17 8.85 16.575 8.425Q16.15 8 15.5 8Q14.85 8 14.425 8.425Q14 8.85 14 9.5Q14 10.15 14.425 10.575Q14.85 11 15.5 11ZM8.5 11Q9.15 11 9.575 10.575Q10 10.15 10 9.5Q10 8.85 9.575 8.425Q9.15 8 8.5 8Q7.85 8 7.425 8.425Q7 8.85 7 9.5Q7 10.15 7.425 10.575Q7.85 11 8.5 11ZM12 17.5Q13.775 17.5 15.137 16.525Q16.5 15.55 17.1 14H15.45Q14.925 14.9 14.025 15.45Q13.125 16 12 16Q10.875 16 9.975 15.45Q9.075 14.9 8.55 14H6.9Q7.5 15.55 8.863 16.525Q10.225 17.5 12 17.5ZM12 22Q9.925 22 8.1 21.212Q6.275 20.425 4.925 19.075Q3.575 17.725 2.788 15.9Q2 14.075 2 12Q2 9.925 2.788 8.1Q3.575 6.275 4.925 4.925Q6.275 3.575 8.1 2.787Q9.925 2 12 2Q14.075 2 15.9 2.787Q17.725 3.575 19.075 4.925Q20.425 6.275 21.212 8.1Q22 9.925 22 12Q22 14.075 21.212 15.9Q20.425 17.725 19.075 19.075Q17.725 20.425 15.9 21.212Q14.075 22 12 22ZM12 12Q12 12 12 12Q12 12 12 12Q12 12 12 12Q12 12 12 12Q12 12 12 12Q12 12 12 12Q12 12 12 12Q12 12 12 12ZM12 20Q15.325 20 17.663 17.663Q20 15.325 20 12Q20 8.675 17.663 6.337Q15.325 4 12 4Q8.675 4 6.338 6.337Q4 8.675 4 12Q4 15.325 6.338 17.663Q8.675 20 12 20Z"/></svg>`;
                interaction_container.appendChild(dislike_button);

                //Dislike Counter
                let dislike_counter = yb_createElement("p", `dislike-count-${id}`, "counter");
                dislike_counter.innerHTML = dislike_count;
                interaction_container.appendChild(dislike_counter);
                

                //Comment Button
                let comment_button = yb_createButton("show-comment", `show-comment-${id}`, "feedback-icon");
                comment_button.setAttribute("data-catid", id)
                comment_button.setAttribute("data-state", "show")
                comment_button.innerHTML = `<svg id="feedback-icon-source" xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path id="comment-icon-${id}" d="M6 14H18V12H6ZM6 11H18V9H6ZM6 8H18V6H6ZM22 22 18 18H4Q3.175 18 2.588 17.413Q2 16.825 2 16V4Q2 3.175 2.588 2.587Q3.175 2 4 2H20Q20.825 2 21.413 2.587Q22 3.175 22 4ZM4 4V16Q4 16 4 16Q4 16 4 16H18.825L20 17.175V4Q20 4 20 4Q20 4 20 4H4Q4 4 4 4Q4 4 4 4ZM4 4V17.175V16Q4 16 4 16Q4 16 4 16V4Q4 4 4 4Q4 4 4 4Q4 4 4 4Q4 4 4 4Z"/></svg>`
                interaction_container.appendChild(comment_button);

                //Comment Counter
                let comment_counter = yb_createElement("p", `comment-count-${id}`, "counter");
                comment_counter.innerHTML = comment_count;
                interaction_container.appendChild(comment_counter);


                //Shares
                let share_button = yb_createButton("share", `share-${id}`, "feedback-icon");
                share_button.innerHTML = `<svg id="feedback-icon-source" xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="M6 23Q5.175 23 4.588 22.413Q4 21.825 4 21V10Q4 9.175 4.588 8.587Q5.175 8 6 8H9V10H6Q6 10 6 10Q6 10 6 10V21Q6 21 6 21Q6 21 6 21H18Q18 21 18 21Q18 21 18 21V10Q18 10 18 10Q18 10 18 10H15V8H18Q18.825 8 19.413 8.587Q20 9.175 20 10V21Q20 21.825 19.413 22.413Q18.825 23 18 23ZM11 16V4.825L9.4 6.425L8 5L12 1L16 5L14.6 6.425L13 4.825V16Z"/></svg>`
                interaction_container.appendChild(share_button);

                //Share Counter
                let share_counter = yb_createElement("p", `share-count-${id}`, "counter");
                share_counter.innerHTML = "0";
                interaction_container.appendChild(share_counter);


                //Dontation
                let donate_button = yb_createButton("donate", `donate-bit-${id}`, "feedback-icon");
                donate_button.innerHTML = `<svg id="feedback-icon-source" xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="M11.025 21V18.85Q9.7 18.55 8.738 17.7Q7.775 16.85 7.325 15.3L9.175 14.55Q9.55 15.75 10.288 16.375Q11.025 17 12.225 17Q13.25 17 13.963 16.538Q14.675 16.075 14.675 15.1Q14.675 14.225 14.125 13.712Q13.575 13.2 11.575 12.55Q9.425 11.875 8.625 10.938Q7.825 10 7.825 8.65Q7.825 7.025 8.875 6.125Q9.925 5.225 11.025 5.1V3H13.025V5.1Q14.275 5.3 15.088 6.012Q15.9 6.725 16.275 7.75L14.425 8.55Q14.125 7.75 13.575 7.35Q13.025 6.95 12.075 6.95Q10.975 6.95 10.4 7.438Q9.825 7.925 9.825 8.65Q9.825 9.475 10.575 9.95Q11.325 10.425 13.175 10.95Q14.9 11.45 15.788 12.537Q16.675 13.625 16.675 15.05Q16.675 16.825 15.625 17.75Q14.575 18.675 13.025 18.9V21Z"/></svg>`
                interaction_container.appendChild(donate_button);

                viewer.appendChild(interaction_container);
            
                // Retrieve the #photo-viewer element
                var photoViewer = document.getElementById("photo-viewer");

                // Attach an event listener for touchstart event
                photoViewer.addEventListener("touchstart", function(event) {
                    var initialY = event.touches[0].clientY;

                    // Add an event listener for touchend event
                    photoViewer.addEventListener("touchend", function(event) {
                        var finalY = event.changedTouches[0].clientY;
                        var deltaY = finalY - initialY;
                
                        // Check if the user has swiped down
                        if (deltaY > 0) {
                            yb_closeImage();
                        }
                    });

                    
                });
                    
            }
        } 
    );

    
}
