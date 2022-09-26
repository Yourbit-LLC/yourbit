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
    $('#content-container').animate({'top':'1vh'}, 'fast');

};


function spaceTagIn() {
    const space_tag = document.getElementById('space-identifier-tag');
    if (space_tag.style.display === 'none'){
        $('#space-identifier-tag').fadeIn('slow');
    }
}

function getFeed() {
    let csrfToken = parent.getCSRF();
    let spaceId = getSpaceId();
    let type = 0
    if (spaceId === 0) {
        type = 'global';
    }
    if (spaceId === 1) {
        type = 'chatspace';
    }
    if (spaceId === 2) {
        type = 'photospace';
    }
    if (spaceId === 3){
        type = 'videospace';
    }
    $.ajax(
        $.ajax(
            {
                type:"POST",
                headers: {
                    'X-CSRFToken': csrfToken
                  },
                //zero just used as placeholder for profile ID outside of profile feeds
                url: `/social/feed/${type}/0`, 
                
                success: function(data){
                    let bitstream = data;

                }
    
            }
    
        )
    )
}