$(document).ready(function() {
    yb_showMiniBar(); 
    yb_showMenuTask();   
    let dataset = $("#yb-browse-nav").attr("data-dataset"); 
    let cluster = yb_getSessionValues("cluster")
    let cluster_name = yb_getSessionValues("cluster-name")
    console.log("cluster:" + cluster);

    let filter = yb_getSessionValues("filter");
    let sort = yb_getSessionValues("sort");
    let type = yb_getSessionValues("space");

    let new_feed = {
        "is_cluster": true,
        "dataset": "cluster",
        "type": type,
        "cluster": cluster,
        "filter":filter,
        "sort":sort,
    };

    
    yb_showSpaceBar();
    headerDropIn();
    $("#page-title-display").html(cluster_name);
    yb_getFeed(new_feed, hideSplash, false);
})