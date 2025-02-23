function getElementId(e) {
    return `bit-${e.currentTarget.getAttribute("data-catid")}`;
}
// Function for sending a new comment on a bit
function yb_pressSendComment(e){
    // Retrieves the ID of the current target element
    console.log("send comment pressed");
    let this_element = e.currentTarget;
    let this_id = e.currentTarget.getAttribute("data-catid");
    let element_id;
    console.log(this_id)

    // Constructs the element ID using the retrieved ID
    if (yb_getSessionValues("location") == "bit-focus"){
        element_id = this_element.getAttribute("data-field-override");
    } else {
        element_id = `bit-${this_id}`;
    }

    console.log(element_id)
    // Retrieves the bit element using the constructed ID
    let this_bit = document.getElementById(element_id);
    let comment_field = this_bit.querySelector(`.yb-field-commentField`);
    let comment = comment_field.value;
    console.log(comment)

    // Checks if the comment field is not empty
    if (comment_field.value != "") {
        // Retrieves the CSRF token
        
        // Sends the comment to the server
        yb_sendComment(this_id, comment, element_id);
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

function yb_toggleBitButton(button, this_element) {
    let csrf_token = getCSRF();
    let this_button = this_element
    let this_count = this_element.parentElement.querySelector(`#${button}-count-${this_id}`);
    let this_icon = this_element.querySelector(`#${button}-icon-${this_id}`);
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
    let this_element = e.currentTarget;
    yb_toggleBitButton("like", this_element);
}

function yb_pressShare(event){
    let this_bit = event.currentTarget;
    let bit_id = this_bit.getAttribute("data-id")
    yb_navigateTo("drawer", "share-bit", bit_id);
}

// Function for handling the click event of the dislike button
function yb_pressDislike(e){
    let this_element = e.currentTarget;
    yb_toggleBitButton("dislike", this_element);
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

    // Sends a request to edit the bit
    yb_navigateTo("2way", "edit-bit", this_id);
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
