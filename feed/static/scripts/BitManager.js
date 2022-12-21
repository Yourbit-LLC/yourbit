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



/*Bits in feed */
          
$(".chat-bit-profile-picture-link").click(function() {
    let username = $(this).attr("data-username");
    console.log(username)
    window.top.location.replace(`${base_url}/social/profile/${username}`);
});


function getComments(id) {
    $.ajax ({
        type:"POST",
        headers: {
            'X-CSRFToken': csrfToken
          },
        url: "/bitstream/get-comments/",
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
            url: "/bitstream/like/",
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
                url: "/bitstream/dislike/",
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
            url: "/bitstream/comment/",
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


