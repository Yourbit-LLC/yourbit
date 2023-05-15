$(document).ready(function() {
    yb_showMiniBar(); 
    yb_showMenuTask();   
    let dataset = $("#yb-browse-nav").attr("data-dataset"); 
    let cluster = $("#yb-browse-nav").attr("data-cluster");
    console.log("cluster:" + cluster);
    let is_cluster;
    let filter = yb_getSessionValues("filter");
    let sort = yb_getSessionValues("sort");
    let type = yb_getSessionValues("space");


    if (cluster === "none") {
        is_cluster = false;
    } else {
        is_cluster = true;
    }

    let data = {
        "type": type,
        "dataset":dataset,
        "is_cluster": is_cluster,
        "filter": filter,
        "sort": sort,

    }

    yb_getFeed(data, hideSplash, true);

    let create_cluster_button = document.getElementById("button-create-cluster");
    create_cluster_button.addEventListener("click", function() {
        showCreateBit(raiseCreateBit);
        yb_showClusterForm();
    });

});