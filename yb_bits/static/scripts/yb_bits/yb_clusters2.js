function yb_deleteCluster(id) {
    //csrf token
    let csrf_token = getCSRF();
    $.ajax({
        type: 'POST',
        url: '/bits/delete-cluster/',
        data: {
            'id': id,
        },
        headers: {
            'X-CSRFToken': csrf_token
        },
        success: function(response) {
            document.getElementById('cluster-' + id).remove();
        },
        error: function(response) {
            console.log(response);
        }
    });

}
