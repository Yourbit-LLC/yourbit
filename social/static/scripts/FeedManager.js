var base_url = window.location.origin;

var postList = document.getElementById("content-container");
var topSpacer = document.getElementById("mobile-spacer-top")
var width = screen.width;
$(document).ready(function() {
    post_fly_in(postList);
    scaleFeed();
    setTimeout(spaceTagIn, 200)
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
function post_fly_in(postList) {
    console.log('trigger post animation')
    postList.style.transform = 'translate(0, -100vh)';

};

function spaceTagIn() {
    $('#space-identifier-tag').fadeIn('slow');
}