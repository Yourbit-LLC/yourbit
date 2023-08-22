/*
--Mobile Search Functions--
*/

var base_url = window.location.origin;

var query;
var type;


$('#mobile-search-icon').click(function() {
    showSearch();
});


function showSearch() {
    let search = document.getElementById('search-mobile');
    $('#search-mobile').fadeIn('fast');
    search.style.transform = 'translate(0, -100vh)';
    $('#mobile-searchbar').focus();
}

function searchFocus() {
    let search = document.getElementById('search-mobile');
    
}

function dropSearch(hide) {
    let search = document.getElementById('search-mobile');
    search.style.transform = 'translate(0, 100vh)';
    setTimeout(hide, 200);
}

function hideSearch() {
    $('#search-mobile').hide();
}

$('#mobile-searchbar').on('change keyup', function(e) {
    let event_type = e.input;
    console.log(event_type)
    let searchBar = document.getElementById('mobile-searchbar');
    let query = searchBar.value;
    $('#mobile-instant-results').empty();
    console.log(query);
    if (query != 0) {
        setTimeout(fetchResults, 100, displayResults, query);
    } else {
        $('#mobile-instant-results').empty();
    }
    
});

$("#mobile-submit-search-button").click(function() {

    let entry_field = document.getElementById('mobile-searchbar');
    let type_field = document.getElementById('search-type');
    type = type_field.value;
    query = entry_field.value;
    search_url(query, type);

});

function yb_getSearchResults() {
    let query = getQuery();
    let type = getType();
    console.log(query);
    console.log(type);
    $.ajax({
            type: 'GET',
            url: `/search/results/query=${query}/type=${type}/`,
        
        success: function(data) {
            let results = data.results;
            for (let i = 0; i < results.length; i++) {
                let result = results[i];
                let display_result = BuildListItem(result);
                let result_container = document.getElementById('result-container');
                result_container.appendChild(display_result);
                display_result.addEventListener('click', function(e) {
                    let this_element = e.currentTarget;
                    let username = this_element.getAttribute('data-username');
                    console.log(username);
                    let new_data = {"username": username};
                    profile_url(new_data)
                });
                dropSearch(hideSearch);

            }
        }
})}

function getType() {
    return type;
}

function getQuery() {
    return query;
}

function fetchResults(callback, query) {
    let cookie = document.cookie;
    let csrfToken = getCSRF();
    $.ajax( {
        type: 'POST',
        headers: {
            'X-CSRFToken': csrfToken
        },
        url: '/search/',
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
    console.log(users);
    let user = '';
    console.log(users.length)
    let result_container = document.getElementById('mobile-instant-results');

    result_container.innerHTML = '';
    
    for (let i = 0; i < users.length; i++) {
        
        user = users[i];
        
        let profile_info = results[user];
        let user_info = profile_info.user;
        let custom = profile_info.custom;
        
        user_name = user_info['first_name'] + ' ' + user_info['last_name'];
        image = custom['image'];
        result_object = yb_createElement('div', `quick-result-${user_info.id}`, 'quick-result');
        result_object.setAttribute('data-username', user_info.username);
        result_object.innerHTML = `<img class="quick-result-image" src="${image}"> <p data-username = "${user_info.username}" class="quick-result-label" >${user_name}</p>`;
        
        result_object.addEventListener('click', function(e) {
            let this_element = e.currentTarget;
            let username = this_element.getAttribute('data-username');
            console.log(username);
            data = {"username": username}
            hideSearch();
            profile_url(data);
        });
        
        result_container.appendChild(result_object);

    }
}

function profileNavigate(user) {
    let username = user;
    window.location.href = `${base_url}/social/profile/${username}`;
};

$('#cancel-button').click(function() {
    dropSearch(hideSearch);
});