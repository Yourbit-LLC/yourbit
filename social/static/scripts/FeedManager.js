var base_url = window.location.origin;

var postList = document.getElementById("content-container");
var topSpacer = document.getElementById("mobile-spacer-top")
var width = screen.width;
$(document).ready(function() {
    post_fly_in(postList);
    scaleFeed();
    console.log('ready')
});

function scaleFeed() {
    if (width > 700){
        postList.style.paddingTop = "70px"
        topSpacer.style.display = "none"
        
    } else {
        postList.style.paddingTop = "45px"
    }
}
function post_fly_in(postList) {
    console.log('trigger post animation')
    postList.style.transform = 'translate(0, -100vh)';

};
