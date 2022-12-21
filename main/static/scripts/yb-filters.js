$('.filter-button-wide-active').change(function() {

    //Create form data to send to yourbi request function
    let data = new FormData()
    let filter = document.getElementById('yb-filter-dropdown').value;
    let sort = document.getElementById('yb-sort-dropdown').value;
    let type = $('#content-container').attr('data-space');
    let location = getLocation();
    if (location === 'home') {
        requestGetFeed(data, `/bitstream/get/user_feed/${type}/0/${filter}/${sort}/`);
    }
});