$('.filter-button-wide-active').change(function() {

    //Create form data to send to yourbit request function
    let data = new FormData()
    let filter = document.getElementById('yb-filter-dropdown').value;
    let sort = document.getElementById('yb-sort-dropdown').value;
    let type = yb_getSessionValues("space");
    let location = yb_getSessionValues("location")
    if (location === 'home') {
        yb_getFeed(data, hideSplash(), 0);
    }
});

$('#input-feed-search').change(function(){
    let query = $(this).attr("value");
    let type = yb_getSessionValues("space");
    yb_bitSearch(type, query);

})

