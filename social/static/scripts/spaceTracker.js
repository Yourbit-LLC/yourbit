var first_space = true;

function setFirstSpace() {
    first_space = false;

}
function getFirstSpace() {
    return first_space;
}

function showSpaceSplash(splash) {
    $(splash).show();
    $(splash).animate({'left':'0vw'});
}

function hideSplash() {
    $('.splash-page').fadeOut();
}