var bit_container = document.getElementById("bit-container");

function yb_renderBit(data) {
    let this_bit = yb_buildBit(data);
    bit_container.appendChild(this_bit.built_bit);
}
 
function yb_updateFeed(update, data) {
    //Update the feed
    console.log("updating display...")
    console.log(update)
    if (update === true) {
        //Append the feed
        $('#bit-container').append(data);
    } else {
        //Update the feed
        console.log("appending html...")

        for (let i = 0; i < data.length; i++) {
            let blueprint = data[i];
            yb_renderBit(blueprint);
            
        }

    }
}

function yb_requestFeed(data=null) {
    //Get the feed
    console.log("feed requested")

    console.log(data.update)
    $.ajax({
        type: 'GET',
        url: '/bits/api/bitstream/',
        data: data,
        success: function(response) {
            //Update the feed
            yb_updateFeed(data.update, response);
            console.log(response)
        },
        error: function(response) {
            //Error
            console.log(response);
        }
    });
}

function yb_getFeed(update = false, next_page = false, previous_page = false) {
    // Initialize variables
    let sort_setting = yb_getSessionValues('sort');
    console.log(sort_setting)
    let filter_setting = yb_getSessionValues('filter');
    let space = yb_getSessionValues('space');
    let page = yb_getSessionValues('bitstream-page') || 1; // Default to page 1 if not set
    let request_data;

    // Adjust page number for next or previous page requests
    if (next_page) {
        page += 1;
    } else if (previous_page) {
        page -= 1;
    }

    // Ensure the page number doesn't fall below 1
    page = Math.max(page, 1);

    // Update the session values
    yb_setSessionValues('bitstream-page', page);

    // Create the request data
    request_data = {
        'update': update,
        'filter': filter_setting,
        'sort': sort_setting,
        'space': space,
        'page': page,
        'items_per_page': 8, // Assuming your Django view is set up to handle this
    }

    // Send the request to the backend
    yb_requestFeed(request_data);
}

//Functioning for submitting a new bit or bit edit
function yb_createBit(this_data, csrf_token) {
    
    $.ajax({
        type: 'POST',
        url: '/bits/api/bits/',
        data: this_data,
        headers: {
            'X-CSRFToken': csrf_token,
        },
        processData: false,
        contentType: false,
        success: function(response) {
            console.log(response);
            yb_toggle2WayContainer('create'); //Located in main/static/scripts/main/main.js
            yb_renderBit(response);
            // yb_getFeed(true); //Located in yb_bits/static/scripts/yb_bits/yb_ajax.js
        },
        error: function(response) {
            console.log(response);
            

        }
    });
}

// Function for updating comment stream

function yb_updateComments(update, response, bitId) {
    console.log(bitId)
    let this_bit = document.getElementById(`bit-${bitId}`);
    
    let comment_container = this_bit.querySelector(`.yb-comment-container`);
    comment_container.innerHTML = "";

    console.log(update);
    
    if (response.length > 0) {
        if (update === true){
            console.log("updating comments")
            let comment_bubble = yb_buildComment(response);
            comment_container.appendChild(comment_bubble);
        } else {
            console.log("appending comments")
            for (let i = 0; i < response.length; i++){

                let comment = response[i];
                
                console.log(comment)
                let comment_bubble = yb_buildComment(comment);
                comment_container.appendChild(comment_bubble);
            }
        }
    } else {
        console.log("no comments")
        let no_comments = document.createElement("p");
        no_comments.classList.add("align-center");
        no_comments.innerHTML = "No comments yet";
        comment_container.appendChild(no_comments);
    }

    


}


/* 
        Ajax function for sending a comment

        Example:
        let bitId = e.currentTarget.getAttribute("data-catid");
        let userId = e.currentTarget.getAttribute("data-userid");
        let commentBody = document.getElementById(`comment-input-${bitId}`).value;
        let csrf_token = getCSRF();

        yb_sendComment(bitId, userId, commentBody, csrf_token);
        
        Used in: 
        -yb_bits/yb_handlers.js

        Tags:
        send comment ajax function 

*/
function yb_sendComment(bitId, commentBody, csrf_token) {
    let this_data = JSON.stringify({
        bit: bitId,
        body: commentBody
        // Add other fields if necessary
    });

    $.ajax({
        url: '/bits/api/comments/',  // Update with the actual API endpoint
        method: 'POST',
        data: this_data,
        headers: {
            'X-CSRFToken': csrf_token,
            'Content-Type': 'application/json'  // Important for JSON data
        },
        success: function(data) {
            console.log('Comment posted successfully:', data);
            // Update UI with the new comment
            let comment_container = document.getElementById(`comment-container-${bitId}`);
            if (comment_container.classList.contains("open")) {
                yb_getComments(false, bitId);
            } else {
                yb_showComments(bitId);
            }
            // Implement the function to update the UI accordingly
        },
        error: function(jqXHR) {
            console.error('Error posting comment:', jqXHR.responseText);
            // Show error to user
            // Implement error handling UI logic
        }
    });
}


/*
        Ajax function for receiving a list of comments

        Example:
        yb_getComments(true, bitId);

        Used in:
        -yb_bits/yb_handlers.js

        Tags:
        get comments ajax function
*/

function yb_getComments(update, bitId) {
    
    console.log("getting comments...");
    console.log(bitId);
    $.ajax({
        type: 'GET',
        url: `/bits/api/comments/`,
        data: {
            'bit_id': bitId,
        },
        success: function(response) {
            //Update the feed
            console.log(response)
            yb_updateComments(update, response, bitId);
            
        },
        error: function(response) {
            //Error
            console.log(response);
        }
    });
}


/* 
        Ajax function for deleting a comment

        Example:
        let this_id = e.currentTarget.getAttribute("data-catid");
        let element_id = `bit-${this_id}`;
        let this_bit = document.getElementById(element_id);
        let comment_button = this_bit.querySelector(`.delete-comment-button`);
        let comment_data = {
            'bit_id': this_id,
        };

        yb_deleteComment(this_id, comment_data);

        Used in:
        -yb_bits/yb_handlers.js

        Tags:
        delete comment ajax function

*/
function yb_deleteComment(commentId, bitId, data=null, csrf_token) {
    //Delete a Comment
    console.log("deleting comment...")
    console.log(data)
    $.ajax({
        type: 'DELETE',
        url: `/bits/api/comments/${commentId} `,
        data: data,
        headers: {
            'X-CSRFToken': csrf_token,
        },
        success: function(response) {
            //Update the feed
            console.log(response)
            yb_getComments(false, bitId);
        },
        error: function(response) {
            //Error
            console.log(response);
        }
    });

}

/*
        Ajax function for sending a like

        Example:
        let bitId = e.currentTarget.getAttribute("data-catid");
        let userId = e.currentTarget.getAttribute("data-userid");
        let csrf_token = getCSRF();

        yb_sendLike(bitId, userId, csrf_token);

        Used in:
        -yb_bits/yb_handlers.js

        Tags:
        send like ajax function
*/

function yb_sendLike(bitId, data=null, csrf_token) {
    //post request for creating a like
    console.log("sending like...")
    console.log(data)
    
    $.ajax({
        type: 'POST',
        url: `/bits/api/likes/`,
        headers: {
            'X-CSRFToken': csrf_token,
        },
        data: data,
        success: function(response) {
            //Update the feed
            console.log(response)
            yb_getLikes(true, bitId);
        },
        error: function(response) {
            //Error
            console.log(response);
        }
    });
}

/*
        Ajax function for deleting a like

        Example:
        let this_id = e.currentTarget.getAttribute("data-catid");
        let element_id = `bit-${this_id}`;
        let this_bit = document.getElementById(element_id);
        let like_button = this_bit.querySelector(`#like-${this_id}`);
        let like_count = this_bit.querySelector(`#like-count-${this_id}`);
        let like_icon = this_bit.querySelector(`#like-icon-${this_id}`);
        let like_count_int = parseInt(like_count.innerHTML);
        let like_data = {
            'bit_id': this_id,
        };

        yb_deleteLike(this_id, like_data);

        Used in:
        -yb_bits/yb_handlers.js

        Tags:
        delete like ajax function

*/

function yb_deleteLike(likeId, data=null) {
    //Delete a Like
    console.log("deleting like...");
    console.log(data)
    $.ajax({
        type: 'DELETE',
        url: `/bits/api/likes/${likeId} `,
        data: data,
        success: function(response) {
            //Update the feed
            console.log(response)
        },
        error: function(response) {
            //Error
            console.log(response);
        }
    });

}

/*
        Ajax function for sending a dislike

        Example:
        let bitId = e.currentTarget.getAttribute("data-catid");
        let userId = e.currentTarget.getAttribute("data-userid");
        let csrf_token = getCSRF();

        yb_sendDislike(bitId, userId, csrf_token);

        Used in:
        -yb_bits/yb_handlers.js

        Tags:
        send dislike ajax function

*/
function yb_sendDislike(bit, data=null, csrf_token) {
    //post request for creating a dislike
    console.log("sending dislike...")
    console.log(data)
    $.ajax({
        type: 'POST',
        url: `/bits/api/dislikes/`,
        data: data,
        headers: {
            'X-CSRFToken': csrf_token,
        },
        success: function(response) {
            //Update the feed
            console.log(response)
            yb_getDislikes(true, bitId);
        },
        error: function(response) {
            //Error
            console.log(response);
        }
    });
}

/*
        Ajax function for deleting a dislike

        Example:
        let this_id = e.currentTarget.getAttribute("data-catid");
        let element_id = `bit-${this_id}`;
        let this_bit = document.getElementById(element_id);
        let dislike_button = this_bit.querySelector(`.dislike-button`);
        let dislike_count = this_bit.querySelector(`.dislike-count`);
        let dislike_icon = this_bit.querySelector(`.dislike-icon`);
        let dislike_count_int = parseInt(dislike_count.innerHTML);
        let dislike_data = {
            'bit_id': this_id,
        };

        yb_deleteDislike(this_id, dislike_data);

        Used in:
        -yb_bits/yb_handlers.js

        Tags:
        delete dislike ajax function

*/

function yb_deleteDislike(dislikeId, data=null) {
    //Delete a Dislike
    console.log("deleting dislike...");
    console.log(data)
    $.ajax({
        type: 'DELETE',
        url: `/bits/api/dislikes/${dislikeId} `,
        data: data,
        success: function(response) {
            //Update the feed
            console.log(response)
        },
        error: function(response) {
            //Error
            console.log(response);
        }
    });

}


