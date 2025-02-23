/*
--Mobile Search Functions--
*/
var base_url = window.location.origin;

const SEARCH_FILTER_BUTTONS = document.querySelectorAll('.search-filter-button');
const SEARCH_FILTER_FIELD = document.getElementById('field-search-filter');

var query;
var type;

function getType() {
    return type;
}

function getQuery() {
    return query;
}

function yb_displayResults(location, query, response) {
    let results = response.results;

    let objects = Object.keys(results);

    let result_container;

    if (location === "main") {
        result_container = document.getElementById('spotlight-content');
        result_container.innerHTML = "";
    } else if (location === "messages") {
        console.log("searching contacts from messages")
        result_container = document.getElementById('connection-list');
        result_container.innerHTML = "";
    }

    if (objects.length > 0) {    
        for (let i = 0; i < results.length; i++) {
            let result = results[i];
            console.log(result);

            result_object = yb_buildListItem(result)

            if (location === "main") {
                result_object.addEventListener('click', yb_navigateToProfile);
            } else if (location === "messages") {
                result_object.addEventListener('click', yb_conversationAddContact);
            }
            result_container.appendChild(result_object);
        }
    } else {
        result_container.innerHTML = `                        
        <div id="no-results-search" class="yb-center-margin lr yb-flexColumn" style="width: 300px; margin-top: 15%;">
            <svg class="yb-fill-gray yb-center-margin all" xmlns="http://www.w3.org/2000/svg" height="96" viewBox="0 -960 960 960" width="96"><path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z"/></svg>
            <h2 class="font-gray font-medium font-lightBold align-center">No Results Found for <q id="search-query-preview">${query}</q>...</h2>
        </div>
        `
    }
}

function yb_getSearchResults(location, type, query) {

    $.ajax( {
        type: 'GET',
        url: '/search/results/',
        data: { 
            filter: type,
            query: query
        },
        success: function(response){

            yb_displayResults(location, query, response);

        }
    })
};


function yb_search(location, type, query) {
    if (location == "main") {
        if (window.innerWidth > 768) {
            if (query.length > 0) {
                yb_openSpotlight();
            } else {
                yb_closeSpotlight();
                
            }
        }
    }

    yb_getSearchResults(location, type, query);
}

$(document).ready(function () {
    $(SEARCH_FIELD).on('change keyup', function() {
        query = this.value;

        type = SEARCH_FILTER_FIELD.value;
        yb_search("main", type, query);
    });

    $(FLOATING_TEXT_INPUT).on('change keyup', function() {
        query = this.value;

        type = SEARCH_FILTER_FIELD.value;
        yb_search("main", type, query);
    });



    for (let i = 0; i < SEARCH_FILTER_BUTTONS.length; i++) {
        SEARCH_FILTER_BUTTONS[i].addEventListener('click', function() {
            
            type = this.getAttribute('name');
            
            if (SEARCH_FIELD.value.length > 0) {
                yb_getSearchResults(type, query);
            }

            SEARCH_FILTER_FIELD.value = type;
            for (let i = 0; i < SEARCH_FILTER_BUTTONS.length; i++) {
                SEARCH_FILTER_BUTTONS[i].classList.remove('active');
            }
            yb_makeActive(this)
        })
    }

});
