var base_url = window.location.origin;

var postList = document.getElementById("content-container");
var topSpacer = document.getElementById("mobile-spacer-top")
var width = screen.width;
$(document).ready(function() {
    post_fly_in();
    setTimeout(spaceTagIn, 100)
    setTimeout(parent.hideSplash, 1500)
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