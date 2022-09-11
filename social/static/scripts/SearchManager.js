/*
--Mobile Search Functions--
*/

var base_url = window.location.origin;

$('#mobile-search-icon').click(function() {
    showSearch();
});


function showSearch() {
    let search = document.getElementById('search-mobile');
    $('#search-mobile').show();
    search.style.transform = 'translate(0, -100vh)';
    $('#mobile-searchbar').focus();
}

function searchFocus() {
    let search = document.getElementById('search-mobile');
    
}

function dropSearch() {
    let search = document.getElementById('search-mobile');
    search.style.transform = 'translate(0, 0vh)';
    $('#search-mobile').hide()
}

$('#mobile-searchbar').on('change keyup', function() {
    let searchBar = document.getElementById('mobile-searchbar');
    let query = searchBar.value;
    $('#mobile-instant-results').empty();
    console.log(query);
    if (query != 0) {
        fetchResults(displayResults, query);
    } else {
        $('#mobile-instant-results').empty();
    }
    
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
    let users = Object.keys(results);
    let user = '';
    let x = 0;
    for (let i = 0; i < users.length; i++) {
        console.log(x)
        user = users[x];
        console.log(user)
        user_info = results[user];
        console.log(user_info)
        user_name = user_info['name'];
        image = user_info['image'];
        $('#mobile-instant-results').append(`<div data-username = "${user}" class="quick-result"><img data-username = "${user}" class="quick-result-image" src="${image}"> <p data-username = "${user}" class="quick-result-label" >${user_name}</p><a href="${base_url}/social/profile/${user}" class="profile-result-link"></a></div>`);
        x = x + 1;
        console.log(x)
    }


}

function profileNavigate(user) {
    let username = user;

    window.location.href = `${base_url}/social/profile/${username}`;
    
};

