
const createPost = document.getElementById("createPost");
const writePost = document.getElementById("writePost");
function show_create_post() {
    $("#createPost").fadeIn('slow');
}

function hide_create_post() {
    $("#createPost").fadeOut('slow');
}
const postList = document.getElementById("posts");
function post_fly_in() {
    postList.style.transform = 'translate(0, 0)';

}

function ShowDescription(bit_id) {
    var description_id= "video-caption" + bit_id;
    var description = document.getElementByID(description_id);
    if (description.style.display === 'none') {
        description.style.display='block';
    } else {
        description.style.display='none';
    }
    
}