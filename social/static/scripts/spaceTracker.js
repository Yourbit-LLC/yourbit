/*
    The space tracker is used for assisting the front end
    with recognizing which space is active in order to change
    to the correct space on command

*/

var first_space = true; //Used to track first load for animation purposes
var space_id = 0; //Space_id stores the space that the user is currently active in
var iframe; 


function getIframe() {
    if (space_id === 0) {
        iframe = document.getElementById('global-feed');
    }
    if (space_id === 1) {
        iframe = document.getElementById('chat-feed');
    }

    if (space_id === 2) {
        iframe = document.getElementById('video-feed');
    }

    if (space_id === 3) {
        iframe = document.getElementById('video-feed');
    }

    return iframe;
}

function getSpaceId() {
    //returns space ID to front end documents requesting it
    return space_id;
}

function setSpaceId(new_space_id) {
    //Sets a new space ID with a value passed from other documents
    space_id = new_space_id;
}


function setFirstSpace() {
    //Sets first time of loading feed to be false for animation purposes
    first_space = false;

}
function getFirstSpace() {
    //Tells other documents whether or not this is first load
    return first_space;
}

function showSpaceSplash(splash) {
    //Displays splash screens between spaces
    $(splash).show();
    $(splash).animate({'left':'0vw'});
}

function hideSplash() {
    //Hides the splash screen on feed load
    $('.splash-page').fadeOut();
}