var base_url = window.location.origin;

var postList = document.getElementById("content-container");
var topSpacer = document.getElementById("mobile-spacer-top")
var width = screen.width;
$(document).ready(function() {
    console.log(parent.getFirstSpace())
    if (parent.getFirstSpace() === true){
        post_fly_in();
    } else {
        postList.style.transition = "0s";
        postList.style.top = "2vh";
    }
    setTimeout(spaceTagIn, 100)
    scaleFeed();
    console.log('ready')
});

function scaleFeed() {
    if (width > 700){
        postList.style.paddingTop = "40px"
        topSpacer.style.display = "none"
        
    } else {
        postList.style.paddingTop = "8vh"
    }
}
function post_fly_in() {
    console.log('trigger post animation')
    $('#content-container').animate({'top':'2vh'}, 'fast');

};


function spaceTagIn() {
    const space_tag = document.getElementById('space-identifier-tag');
    if (space_tag.style.display === 'none'){
        $('#space-identifier-tag').fadeIn('slow');
    }
}