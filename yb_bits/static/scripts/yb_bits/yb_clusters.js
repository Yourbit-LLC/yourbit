function yb_deleteCluster(id) {
    $.ajax({
        type: 'POST',
        url: '/bits/delete-cluster/',
        data: {
            'id': id,
        },
        success: function(response) {
            document.getElementById('cluster-' + id).remove();
        },
        error: function(response) {
            console.log(response);
        }
    });

}
