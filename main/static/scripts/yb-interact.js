/*

                    interact.js
                    Dated: 11/8/2022
                    Updated: 11/8/2022
                    Yourbit, LLC


*/




function hideComments(bit_id, label_id) {
    $(`#${bit_id}`).hide();
    $(`#${label_id}`).hide();

}

function getComments(id, container_id) {
    let data = new FormData()
    data.append('id', id)
    html = requestPostHtml(data, '/bitstream/get-comments/');
    $(container_id).html(html);
}

//Used when updating info on a page
//Html Response
function requestInteraction(values) {
    //Get CSRF from yourbit getCSRF function
    let csrfToken = getCSRF();

    
    let action = values.action;
    

    let this_id = values.id
    
    info = {
        "action": action,
        "this_id": this_id
    }

    let url = `/api/bits/${this_id}/`
    fetch(url, {
        method:'PUT',
        headers: {
            'Content-type' : 'application/json',
            'X-CSRFToken':csrfToken
        },
        body: JSON.stringify({"action":action, "this_id": this_id}),
    })
    .then((resp) => resp.json())
    .then(function(data){
        let this_bit = data.this_bit
        console.log(this_bit)
        let subaction = data.action
        console.log(subaction)
        let this_id = this_bit.id

        let custom = this_bit.custom

        if (action === "like"){
            if (subaction === "like"){
                $(`#like-${this_id}`).css({"background-color":custom.feedback_background_color});
                $(`#like-icon-${this_id}`).css({"fill":custom.feedback_icon_color});
                $(`#like-count-${this_id}`).html(this_bit.like_count)
            } else {
                $(`#like-${this_id}`).css({"background-color":"rgba(0,0,0,0)"});
                $(`#like-icon-${this_id}`).css({"fill":"white"});
                $(`#like-count-${this_id}`).html(this_bit.like_count)
            }

        }
        if (action === "dislike"){
            if (subaction === "dislike") {
                $(`#dislike-${this_id}`).css({"background-color":custom.feedback_background_color});
                $(`#dislike-icon-${this_id}`).css({"fill":custom.feedback_icon_color});
                $(`#dislike-count-${this_id}`).html(this_bit.like_count)
            } else {
                $(`#dislike-${this_id}`).css({"background-color":"rgba(0,0,0,0)"});
                $(`#dislike-icon-${this_id}`).css({"fill":"white"});
                $(`#dislike-count-${this_id}`).html(this_bit.like_count)
            }

        }
    })

}

$('.feedback-icon').click(function() {
    let id = $(this).attr('data-catid');
    let action = $(this).attr('name');

    if (action === 'like') {
        let active_button = `#like-${id}`;
        values = {
            'id':id,
            'action':action
        }
        requestInteraction(values)
        
    }
    if (action === 'dislike') {
        let active_button = `#dislike-${id}`;
        values = {
            'id':id,
            'action':action
        }
        requestInteraction(values)
        
    }

    if (action === 'comment') {
        let active_button = `#comment-${id}`;
        values = {
            'id':id,
            'action':action
        }
        let comment_body = $('#field-write-comment-text').value;
        
        //Add comment body to data form
        data.update('body', comment_body);
        
        //Request Interaction
        requestInteraction(values)
        
        //Show comments section on successful post
        ShowComments(comment_display_id, comment_label_id)
        //Get comments section returned by backend and add it to comments html
        $('#comment-display-container-'+id).html(html);

    }
    
    if (action === 'show_comment') {
        let active_button = `#like${id}`;
        console.log('comment_clicked')
        let comment_display_id = `chat-comment-display-container${catid}`;
        console.log(comment_display_id)
        let comment_label_id = `comments-display-label${catid}`
        $(this).replaceWith(`<button type="button" class="feedback-icon" name = "hide_comment" onclick="hideComments('${comment_display_id}','${comment_label_id}')" id="comment-post-button" href="#" data-catid="${catid}" ><svg id="feedback-icon-source" xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="M6 14H18V12H6ZM6 11H18V9H6ZM6 8H18V6H6ZM22 22 18 18H4Q3.175 18 2.588 17.413Q2 16.825 2 16V4Q2 3.175 2.588 2.587Q3.175 2 4 2H20Q20.825 2 21.413 2.587Q22 3.175 22 4ZM4 4V16Q4 16 4 16Q4 16 4 16H18.825L20 17.175V4Q20 4 20 4Q20 4 20 4H4Q4 4 4 4Q4 4 4 4ZM4 4V17.175V16Q4 16 4 16Q4 16 4 16V4Q4 4 4 4Q4 4 4 4Q4 4 4 4Q4 4 4 4Z"/></svg></button>`);
        ShowComments(comment_display_id, comment_label_id)
    }

    if (action === 'hide_comment') {
        let active_button = `#like${id}`;
        let comment_display_id = `chat-comment-display-container${catid}`;
        console.log(comment_display_id)
        let comment_label_id = `comments-display-label${catid}`
        $(this).replaceWith(`<button type="button" class="feedback-icon" name = "show_comment" onclick="hideComments('${comment_display_id}','${comment_label_id}')" id="comment-post-button" href="#" data-catid="${catid}" ><svg id="feedback-icon-source" xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="M6 14H18V12H6ZM6 11H18V9H6ZM6 8H18V6H6ZM22 22 18 18H4Q3.175 18 2.588 17.413Q2 16.825 2 16V4Q2 3.175 2.588 2.587Q3.175 2 4 2H20Q20.825 2 21.413 2.587Q22 3.175 22 4ZM4 4V16Q4 16 4 16Q4 16 4 16H18.825L20 17.175V4Q20 4 20 4Q20 4 20 4H4Q4 4 4 4Q4 4 4 4ZM4 4V17.175V16Q4 16 4 16Q4 16 4 16V4Q4 4 4 4Q4 4 4 4Q4 4 4 4Q4 4 4 4Z"/></svg></button>`);
        hideComments(comment_display_id, comment_label_id);
    }
});