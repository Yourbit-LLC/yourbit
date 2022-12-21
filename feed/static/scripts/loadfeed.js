$(document).ready(function() {
    showSpaceSplash('#yourbit-splash');
    loadFeed('global', hideMainSplash);
    
    
});

$('.filter-button-wide-active').change(function() {

    //Create form data to send to yourbi request function
    let data = new FormData()
    let filter = document.getElementById('yb-filter-dropdown').value;
    let sort = document.getElementById('yb-sort-dropdown').value;
    let type = $('#content-container').attr('data-space');
    let location = getLocation();
    requestGetFeed(data, `/bitstream/get/user_feed/${type}/0/${filter}/${sort}/`);

});



$('.space-button').click(function() {
    let location = $(this).attr('data-location');
    let type = $(this).attr('name');
    if (type === 'global')
        showSpaceSplash('#global-space-splash');
    
    if (type === 'chatspace')
        showSpaceSplash('#chat-space-splash');

    if (type === 'videospace')
        showSpaceSplash('#video-space-splash');

    if (type === 'photospace')
        showSpaceSplash('#photo-space-splash');

    changeSpace(type, hideSplash)
});

function loadFeed(type, callback){
    let csrfToken = getCSRF();
    let filter = getFilter();
    let sort = getSort();
    requestGetFeed(`/bitstream/get/user_feed/${type}/0/${filter}/${sort}/`)
    let feed_loaded = getFeedLoaded();
    if (feed_loaded  === false) {


        post_fly_in();
        feed_loaded = true;
        setTimeout(initUI, 1000);
    

    } 
    setTimeout(callback, 1200);
}

            




function changeSpace(type, callback) {
    loadFeed(type, callback);
}

function post_fly_in() {
    console.log('trigger post animation');
    $('#content-container').animate({'top':'1vh'}, 'fast');

};

function initUI(callback) {
    $(".navigation-bar").animate({'bottom':'0'}, 'slow');
    $("#mobile-create-button").animate({'left':'8px'}, 'slow');
    $("#mobile-search-button").animate({'right':'8px'}, 'slow');
    $('#main-splash-text').animate({'bottom': '0'}, 200);
    $('#main-splash-image').animate({'top':'0px'},200);

}