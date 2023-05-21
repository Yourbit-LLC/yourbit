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

function yb_listClusters() {
    let url = "api/clusters/";
    $.ajax({
        url: url,
        type: "GET",
        success: function(data) {
            let is_clusters = data.is_clusters

            //Check if there are clusters for this user
            if (is_clusters === true) {

                //If there are clusters, show them
                let this_container = document.getElementById("bit-container");
                this_container.innerHTML = "";
                let clusters = data.cluster_list;

                //For each cluster send blueprint to build function
                for (let i = 0; i < clusters.length; i++) {

                    let blueprint = clusters[i];
                    let this_item = yb_buildFolder(blueprint);

                    //Append this item to this container
                    this_container.appendChild(this_item);
                }
            }
        }
    })

}
