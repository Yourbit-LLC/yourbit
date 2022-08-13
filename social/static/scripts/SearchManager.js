$('#mobile-searchbar').change(function() {
    let searchBar = document.getElementById('mobile-searchbar');
    let query = searchBar.value;
    fetchResults(displayResults, query);
});

function fetchResults(callback, query) {
    let cookie = document.cookie;
    let csrfToken = cookie.substring(cookie.indexOf('=') + 1);

    $.ajax( {
        type: 'POST',
        headers: {
            'X-CSRFToken': csrfToken
        },
        url: '/social/search/',
        data: { 
            
            query: query
        
        },
        success: function(data){
            let response = data;
            callback(response);
        }
    })
};

function displayResults(response) {
    let results = response.user_results;
    for (let i = 0; i < 5; i++) {
        let x = 0;
        let result = results[x];
        $('#mobile-instant-results').append(result)
        x += 1;


    }

}