
var menu = document.getElementById("profile-menu");
function show_profile_menu() {
    let width = screen.width;
    if (width > 800){
        if (menu.style.visibility === 'hidden') {
            menu.style.visibility='visible';

            menu.style.transform= 'translate(0em)';
        } else {
            menu.style.visibility='hidden';

            menu.style.transform= 'translate(17em)';
        }
    }

    if (width < 800) {
        if (menu.style.visibility === 'hidden') {
            menu.style.visibility='visible';

            menu.style.transform= 'translate(0, -95vh)';
        } else {
            menu.style.visibility='hidden';

            menu.style.transform= 'translate(0, 0vh)';
        }
    }
    }

const createPost = document.getElementById("create-post");
const writePost = document.getElementById("write-post");
function show_create_post() {
    $("#create-post").fadeIn('slow');
}

function hide_create_post() {
    $("#create-post").fadeOut('slow');
}
var postList = document.getElementById("content-container");
function post_fly_in() {
    postList.style.transform = 'translate(0, 0)';

}

function show_post_detail() {
    const post_display = document.getElementsByClassName("large-post-container");
    post_display.style.display="block";
    post_display.style.zindex="10";

}

function show_notifications() {
    const notification_panel = document.getElementById("notifications-dropdown");
    if (notification_panel.style.visibility === 'hidden') {
        
        notification_panel.style.visibility='visible';
        notification_panel.style.display='block';
    } else {

        notification_panel.style.visibility='hidden';
        notification_panel.style.display='none';

    }
}

function show_messages() {
    const messages_panel = document.getElementById("messages-dropdown");
    if (messages_panel.style.visibility === 'hidden') {
        
        messages_panel.style.visibility='visible';
        messages_panel.style.display='block';

    } else {

        messages_panel.style.visibility='hidden';
        messages_panel.style.display='none';

    }
}

function ShowDescription(bit_id) {
    var bit_id = bit_id;
    var description = document.getElementById(bit_id);
    if (description.style.display === 'none') {
        description.style.display='block';
    } else {
        description.style.display='none';
    }
    
}

function ShowComments(bit_id, label_id) {
    var bit_id = bit_id;
    var label_id = label_id;
    var comments = document.getElementById(bit_id);
    var comment_display_lbl = document.getElementById(label_id);
    if (comments.style.display === 'none') {
        comments.style.display='flex';
        comment_display_lbl.style.display='block';
    } else {
        comments.style.display='none';
        comment_display_lbl.style.display='none';
    }
}

function VideoForm() {
    var chat_form = document.getElementById('write-post');
    var video_form = document.getElementById('upload-video');
    var photo_form = document.getElementById('upload-photo');
    if (chat_form.style.display === 'grid') {
        chat_form.style.display = 'none';
    } if (photo_form.style.display === 'grid'){
        photo_form.style.display = 'none';
    }

    video_form.style.display = 'grid';
}

function PhotoForm() {
    var chat_form = document.getElementById('write-post');
    var video_form = document.getElementById('upload-video');
    var photo_form = document.getElementById('upload-photo');
    if (chat_form.style.display === 'grid') {
        chat_form.style.display = 'none';
    } if (video_form.style.display === 'grid'){
        video_form.style.display = 'none';
    }

    photo_form.style.display = 'grid';

}

function ChatForm() {
    var chat_form = document.getElementById('write-post');
    var video_form = document.getElementById('upload-video');
    var photo_form = document.getElementById('upload-photo');
    if (video_form.style.display === 'grid') {
        video_form.style.display = 'none';
    } if (photo_form.style.display === 'grid'){
        photo_form.style.display = 'none';
    }

    chat_form.style.display = 'grid';

}

// function LikeBit(bit_id) {
//     var bit_id = bit_id;
//     var like_button = document.getElementById(bit_id)
//     $.ajax({
//         type:'POST',
//         url: "{% url 'like' ${bit_id} %}",
//         success: function(response){
//             if (response === 'success') {


//             }
//         }
//     })

// }