
if (yb_getSessionValues('location') === 'profile') {
    var bit_container = document.getElementById("profile-bit-container");
} else {

    var bit_container = document.getElementById("bit-container");
}


function yb_renderBit(data, start_location) {
    console.log("Current Location " + start_location)
    if (start_location === yb_getSessionValues('location')) {
        let this_bit = yb_buildBit(data);
        bit_container.appendChild(this_bit.built_bit);
    } else {
        console.log("User navigated away from the feed. Stopping render...")
    
    }
    
}

function yb_showSwipeUp() {
    let swipe_up = document.getElementById("swipe-up-element");
    let load_indicator = document.getElementById("load-indicator-container-profile");

    load_indicator.classList.remove("true");
    load_indicator.classList.add("false");
    swipe_up.classList.add("show");
}
 
function yb_updateFeed(update, data, start_location) {
    //Update the feed
    console.log("updating display...")
    console.log(update)
    if (update === true) {
        //Append the feed
        $(bit_container).append(data);
    } else {
        //Update the feed
        console.log("appending html...")
        $(bit_container).html('');

        if (yb_getSessionValues('location') === 'profile'){
            console.log("profile data")
            yb_showSwipeUp();
        }

        for (let i = 0; i < data.length; i++) {
            let blueprint = data[i];
            yb_renderBit(blueprint, start_location);
            
        }

    }
}

function yb_requestFeed(data=null) {
    //Get the feed
    console.log("feed requested")

    let start_location = toString(yb_getSessionValues('location'));

    console.log(data.update)
    $.ajax({
        type: 'GET',
        url: '/bits/api/bitstream/',
        data: data,
        success: function(response) {
            //Update the feed
            yb_updateFeed(data.update, response, start_location);
            $(MAIN_LOADING_SCREEN).fadeOut(500).animate({opacity: 0}, 500);
            
            if (yb_getSessionValues('location') != 'profile'){
                bit_container.classList.add('open');
            }
            
            console.log(response)
        },
        error: function(response) {
            //Error
            console.log(response);
        }
    });
}

function yb_getFeed(update = false, next_page = false, previous_page = false) {
    // Initialize variables
    let sort_setting = yb_getSessionValues('sort');
    console.log(sort_setting)
    let filter_setting = yb_getSessionValues('filter');
    let space = yb_getSessionValues('space');
    let page = yb_getSessionValues('bitstream-page') || 1; // Default to page 1 if not set
    let request_data;

    // Adjust page number for next or previous page requests
    if (next_page) {
        page += 1;
    } else if (previous_page) {
        page -= 1;
    }

    // Ensure the page number doesn't fall below 1
    page = Math.max(page, 1);

    // Update the session values
    yb_setSessionValues('bitstream-page', page);

    // Create the request data
    request_data = {
        'update': update,
        'filter': filter_setting,
        'sort': sort_setting,
        'space': space,
        'page': page,
        'items_per_page': 8, // Assuming your Django view is set up to handle this
    }

    if (yb_getSessionValues('location') === 'profile') {
        // If we're requesting a specific user's feed, add the user's ID to the request data
        request_data['profile'] = document.getElementById('profile-data').getAttribute('data-username');

    }

    // Send the request to the backend
    yb_requestFeed(request_data);
}


$(document).ready(function() {
    yb_getFeed();
});