var bit_container; //The container that is currently active containing bits

var bitstream_index = new Map(); //Stores captured information on each bit in bitstream
var bitstream_data = new Map(); //Stores captured information on current bitstream
var loaded_bits = []; //Stores IDs of bits that have been loaded
var unloaded_bits = []; //Stores IDs of bits that have been unloaded
const SPACES = ["global", "chat", "video", "photo"]
var bitstream_json = {}; //Stores the JSON data for the current bitstream
var video_json = {}; //Stores the JSON data for the current video stream
var bit_elements;

const bitObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      const post = entry.target;

      if (entry.isIntersecting) {
        // Post has entered the viewport
        console.log(`${post.id} has entered the viewport`);
        post.classList.add('in-view');  // Optional: Highlight visible post
      } else {
        // Post has left the viewport
        console.log(`${post.id} has left the viewport`);
        post.classList.remove('in-view');  // Remove highlight when out of view
      }
    });
  }, {
    root: null,  // Defaults to the viewport
    threshold: 0.1  // Trigger when 10% of the post is visible
  });

  var bs_loadPointRegistry = [];


  const bs_loadPointObserver = new IntersectionObserver(function(entries, loadPointObserver) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            let point_state = entry.target.getAttribute("data-state");
            let point_type = entry.target.getAttribute("data-type");
            let point_page = entry.target.getAttribute("data-page");
            let request_data;
            console.log("load_point passed. Loading Page: " + point_page);
            if (point_state === "future") { 
                request_data = {
                    "update": true,
                    "page": point_page,
                }
                yb_getFeed(request_data);
                entry.target.setAttribute("data-state", "past");
            } else if (point_state === "past") {
                return;
            }

            
            
        }
    });
}, {threshold: 0.5});



function yb_createLoadPoint(type) {
    let this_count = bs_loadPointRegistry.length;
    let load_point = document.createElement("hr");
    load_point.classList.add("yb-load-point");
    load_point.setAttribute("data-point", this_count);
    load_point.setAttribute("data-state", "future");
    load_point.setAttribute("data-type", type);
    load_point.setAttribute("data-page", this_count + 4);
    bs_loadPointRegistry.push(load_point);
    bs_loadPointObserver.observe(load_point);
    return load_point;
}


function yb_getBitContainers(type=null) {
    const global_space_container = document.getElementById("global-bit-container"); //The container that contains the global space
    const chat_space_container = document.getElementById("chat-bit-container"); //The container that contains the chat space
    const video_space_container = document.getElementById("video-bit-container"); //The container that contains the video space
    const photo_space_container = document.getElementById("photo-bit-container"); //The container that contains the photo space
    if (yb_getSessionValues('location') === 'profile') {
        return [document.getElementById("profile-bit-container")];
    } else {
        //Always return global space container, plus bit type container
        if (type == "chat") {
            return [global_space_container, chat_space_container];
        } else if (type == "video") {
            return [global_space_container, video_space_container];
        } else if (type == "photo") {
            return [global_space_container, photo_space_container];
        } else {
            return [global_space_container, chat_space_container, video_space_container, photo_space_container];
        }
    }
}

function yb_renderBit(data) {
    //Render the bit to the bitstream
    let this_bit = yb_buildBit(data);
    let these_containers = yb_getBitContainers(data.type); 
    let bit_separator = yb_createElement("hr", "flat-bit-separator", `bit-separator-g-${data.id}`);
    console.log(these_containers);

    //Append global bit to the global bitstream container
    let this_node = these_containers[0].appendChild(this_bit.built_bit);
    this_node.id = `bit-global-${data.id}`;
    these_containers[0].appendChild(bit_separator)

    //Observe the global bit
    bitObserver.observe(this_node);

    try {
        //Append space specific bit to bitstream container
        bit_separator = yb_createElement("hr", "flat-bit-separator", `bit-separator-${data.type}-${data.id}`);
        
        //Append space specific bit to the space specific bitstream container
        this_node = these_containers[1].appendChild(this_bit.built_bit);
        this_node.id = `bit-${data.type}-${data.id}`;
        these_containers[1].appendChild(bit_separator);

        //Observe the space specific bit
        bitObserver.observe(this_node);
    } catch (error) {
        console.log("No second container returned.");
    }

}

function yb_jumpToBit (bit_id) {
    //Get active space
    let active_space = yb_getSessionValues('space');

    //Jump to a specific bit in the bitstream
    let bit = document.getElementById(`bit-${active_space}-${bit_id}`);
    if (bit) {
        bit.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
        console.log("Bit not found: " + bit_id);
    }
}

function yb_showSwipeUp() {
    let swipe_up = document.getElementById("swipe-up-element");
    let load_indicator = document.getElementById("load-indicator-container-profile");

    load_indicator.classList.remove("true");
    load_indicator.classList.add("false");
    swipe_up.classList.add("show");
}

// function onScrollToBottom() {
    // console.log("User has scrolled to the bottom of the container! More now please...");
    // // Your logic here that needs to be executed when the bottom is reached
    // $("load-indicator-container-bitstream").show();
    // data = {"update": true, };
    // yb_getFeed(true, true);
// }

function yb_updateFeed(update, data) {
    //Update the feed
    console.log("updating display...")
    console.log(update)
    const global_space_container = document.getElementById("global-bit-container"); //The container that contains the global space
    const chat_space_container = document.getElementById("chat-bit-container"); //The container that contains the chat space
    const video_space_container = document.getElementById("video-bit-container"); //The container that contains the video space
    const photo_space_container = document.getElementById("photo-bit-container"); //The container that contains the photo space

    let current_bit_container;
    
    if (yb_getSessionValues('space') != data.space){
        current_bit_container = document.getElementById(data.space + "-bit-subcontainer");
    } else {
        yb_getBitContainers();
    }

    if (update === true) {
        //Append the feed
        console.log("appending html...")
        if (data.length > 0) {

            //Render Bit Data to bitstream
            for (let i = 0; i < data.length; i++) {
                let blueprint = data[i];
                yb_renderBit(blueprint);

            }

            //Create a load point to end the section
            let load_point = yb_createLoadPoint("bitstream");
            let these_containers = yb_getBitContainers()
            
            for (let i = 0; i < these_containers.length; i++) {
                these_containers[i].appendChild(load_point);
            }
            

            if (data.page === 2) {
                
                //Preload the next page
                let next_data = {"update": true, "page": 3};
                yb_getFeed(next_data);
            }


            $("#load-indicator-container-bitstream").show();
            
            $("#no-bits-message").hide();

            bit_elements = document.getElementsByClassName("yb-bit-shell");

            
        } else {
            
            $("#load-indicator-container-bitstream").hide();
            $("#no-bits-message").show();

        }
            
    } else {
        //Update the feed
        if (data.length > 0) {
            console.log("appending html...")
            $(global_space_container).html("");
            $(chat_space_container).html("");
            $(video_space_container).html("");
            $(photo_space_container).html("");


            if (yb_getSessionValues('location') === 'profile'){
                console.log("profile data")
                yb_showSwipeUp();
            }

            for (let i = 0; i < data.length; i++) {
                let blueprint = data[i];
                yb_renderBit(blueprint);
                
            }

            //Create a load point to end the section
            let load_point = yb_createLoadPoint("bitstream");
            let these_containers = yb_getBitContainers();

            for (let i = 0; i < these_containers.length; i++) {
                these_containers[i].appendChild(load_point);    
            }

            //Preload the next page
            let next_data = {"update": true, "page": 2};
            yb_getFeed(next_data);

            $("#load-indicator-container-bitstream").show();
            $("#no-bits-message").hide();

            bit_elements = document.getElementsByClassName("yb-bit-shell");
        } else {
            $("#load-indicator-container-bitstream").hide();
            $("#no-bits-message").show();
        }



    }

    $(MAIN_LOADING_SCREEN).fadeOut(500).animate({opacity: 0}, 500);


}

function yb_requestFeed(data=null) {
    //Get the feed
    console.log("feed requested")

    let start_location = yb_getSessionValues('location');
    console.log("Starting Location " + start_location)

    console.log(data.update)
    $.ajax({
        type: 'GET',
        url: '/bits/api/bitstream/',
        data: data,
        success: function(response) {
            //Store feed data in bitstream_json
            for (let i = 0; i < response.length; i++) {
                let bit = response[i];
                bitstream_json[bit.id] = bit;
                if (response[i].type == "video") {
                    video_json[bit.id] = bit;
                }
            }
            
            //Update the feed
            console.log("Starting location: " + start_location)

            console.log("Current location: " + yb_getSessionValues('location'))

            if (start_location === yb_getSessionValues('location')) {
                yb_updateFeed(data.update, response);
            } else {
                console.log("User navigated away from the feed. Stopping render...")
                }
            
            if (yb_getSessionValues('location') != 'profile'){
                document.querySelector('.bit-container.active').classList.add('open');
            }
            
            console.log(response)
        },
        error: function(response) {
            //Error
            console.log(response);
        }
    });
}

function yb_preLoadSpaces() {
    for (let i = 0; i < SPACES.length; i++) {
        let space = SPACES[i];
        if (space != yb_getSessionValues('space')) {
            let space_data = {
                'update': false,
                'page': 1,
                'space_override': space,
            }
            yb_getFeed(space_data);
        }
    }
}

function yb_getFeed(data={"update": false, "page": 1}) {
    // Initialize variables
    let sort_setting = yb_getSessionValues('sort');
    console.log(sort_setting)
    let filter_setting = yb_getSessionValues('filter');
    
    //Define Space
    let space;
    if (data.space_override) {
        //If space override is container in data, use that space
        space = data.space_override;
    } else {   
        //Otherwise, use the session space
        space = yb_getSessionValues('space');
    }
    
    let request_data;

    // Adjust page number for next or previous page requests
    console.log("Page: " + data.page)

    // Update the session values
    yb_setSessionValues('bitstream-page', data.page);

    // Create the request data 
    request_data = {
        'update': data.update,
        'filter': filter_setting,
        'sort': sort_setting,
        'space': space,
        'page': data.page,
        'timezone': Intl.DateTimeFormat().resolvedOptions().timeZone
    }

    if (yb_getSessionValues('location') === 'profile') {
        // If we're requesting a specific user's feed, add the user's ID to the request data
        request_data['profile'] = document.getElementById('profile-data').getAttribute('data-username');

    }

    // Send the request to the backend
    yb_requestFeed(request_data);
}

/*

    The get from bitstream function returns 2 bits from the bitstream.
    The first bit is the global bit, which is the bit that is displayed in the global bitstream container.
    The second bit is the space bit, which is the bit that is displayed in the space specific bitstream container.

*/

function yb_getFromBitstream(id) {
    let global_bit = document.getElementById(`bit-g-${id}`);
    let space_bit = null;

    if (global_bit.getAttribute("data-type") == "video") {
        space_bit = document.getElementById(`bit-v-${id}`);
    } else if (global_bit.getAttribute("data-type") == "photo") {
        space_bit = document.getElementById(`bit-p-${id}`);
    }
    else if (global_bit.getAttribute("data-type") == "chat") {
        space_bit = document.getElementById(`bit-c-${id}`);
    }

    return space_bit, global_bit;
}

