$(document).ready(function() {
    let dataset = $("#yb-browse-nav").attr("data-dataset"); 
    
    let filter = yb_getSessionValues("filter");
    let sort = yb_getSessionValues("sort");
    let type = yb_getSessionValues("space");


    let data = {
        "type": type,
        "dataset":dataset,
        "filter": filter,
        "sort": sort,

    }

    yb_getFeed(data, hideSplash, true);

    yb_showSpaceBar();
    headerDropIn();

});