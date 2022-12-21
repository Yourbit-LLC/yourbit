//List that keeps track of all bit elements in feed
var bitstream_index = [];
var bits_visible = [];
var videos = [];

//Page Base URL
var base_url = window.location.origin;

//Create bit container

//Document Ready 


var CONTAINER = document.getElementById("content-container");

CONTAINER.addEventListener("scroll", (event) => {
    console.log("scroll")
    bits_visible = [];
    for (var bit in bitstream_index) {
        let element = bitstream_index[bit];
        if (isInViewport(element)){
            let type = $(element).attr('data-type');
            let id = $(element).attr('data-id');
            
            let button_bkd = $(element).attr('data-button-color');
            let button_color = $(element).attr('data-icon-color');
            getUserInteractions(id, button_bkd, button_color);

            if (type==='video'){
                let content_url = $(element).attr('data-content');
                $(`#yb-player-bs-${id}`).attr('src') = content_url;
            }

            if (type==='photo'){
                let content_url = $(element).attr('data-content');
                $(`#yb-viewer-bs-${id}`).attr('src') = content_url
            }
            bits_visible.push(element)

        } else {
            if (element in bits_visible) {
                bits_visible.pop(element)
                if (type==='video'){
                    let content_url = $(element).attr('data-content');
                    $(`#yb-player-bs-${id}`).attr('src',"");
                }

                if (type==='photo'){
                    let content_url = $(element).attr('data-content');
                    $(`#yb-viewer-bs-${id}`).attr('src',"");
                }
            }
        }

    }
    console.log("Bits Loaded: " + bitstream_index);
    console.log("Bits Visible: " + bits_visible);

})

$('.filter-button-wide-active').change(function() {

    //Create form data to send to yourbit request function
    let data = new FormData()
    let filter = document.getElementById('yb-filter-dropdown').value;
    let sort = document.getElementById('yb-sort-dropdown').value;
    let type = $('html').attr('data-space');
    console.log(filter)
    let location = getLocation();
    requestGetFeed(`/bitstream/get/user_feed/${type}/0/${filter}/${sort}/`);

});

$('.filter-button-active').click(function() {
    let action = $(this).attr('name');
    if (action === 'advanced-filter') {
        $('#advanced-filter-dropdown').show();
    }
    if (action === 'search'){
        $('#search-dropdown').show();
        
    }
    if (action === 'customize'){
        $('#customize-dropdown').show();
    }


});

function checkBits(){
    let url = `${base_url}/api/bitstream/update/`
    fetch(url)
    .then((resp) => resp.json())
    .then(function(data){
        if (data.new_bit) {
            $("#content-container").prepend(data.bit);
        }

    })
}

function getUserInteractions(id, bg_color, color){
    let url = `${base_url}/api/interactions/?id=${id}/`
    fetch(url)
    .then((resp) => resp.json())
    .then(function(data){
        if (data.is_liked === true) {
            $(`#like-${id}`).css({'background-color':bg_color});
            $(`#like-icon-${id}`).css({'background-color':color});
        }
        if (data.is_disliked === true) {
            $(`#dislike-${id}`).css({'background-color':bg_color});
            $(`#dislike-icon-${id}`).css({'background-color':color});
        }

    })

}

function editBit(data) {
    //Actions 1 = edit title, 2 = edit body, 3 = edit Title/Body
    let action = data.action;
    let edits = new FormData();
    edits.append('type', action)

    //If 1 - Title Change
    if (action === '1') {
        edits.append('title', title)
    }

    //If 2 - Body Change
    if (action === '2') {
        edits.append('body',body)
    }

    //If 3 - Both Change
    if (action === '3') {
        edits.append('title', title)
        edits.append('body',body)
    }

    //Set url
    var url = `${base_url}/api/bits/${id}/`
    
    //Fetch request
    fetch(url, {
        method:'POST',
        headers: {
            'Content-type' : 'application/json',
            'X-CSRFToken':csrfToken
        },
        body: edits,
    })
    .then((resp) => resp.json())
    .then(function(data){
        let bit = data.bit;
        if (data.edited === "body"){
            $(`description-bit-${bit.type}-${id}`);
        }
        if (data.edited === "title"){

        }
        if (data.edited === "both"){

        }

    });
}

function deleteBit(id) {
    var url = `${base_url}/api/bits/${id}/`
    let csrfToken = getCSRF();
    fetch(url, {
        method:'DELETE',
        headers: {
            'Content-type' : 'application/json',
            'X-CSRFToken': csrfToken
        }
    }).then((response) => {
        $(`#bit-${id}`).animate({transform: 'scale(-100%, -100%)'})
        $(`#bit-${id}`).fadeOut('slow');
    })


}


function popIn() {
    let bit = document.getElementById('bit-3');
    console.log(bit)
    let bit_container = document.getElementById('bit-container')
    let new_node = document.createElement("h2");
    new_node.innerHTML = "Test";
    console.log(new_node)
    bit.parentNode.insertBefore(new_node, bit.nextSibling);
}
