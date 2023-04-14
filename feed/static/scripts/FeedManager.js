//List that keeps track of all bit elements in feed (Functions on line 40)
var bitstream_index = [];
var bits_visible = [];
var videos = [];


/****************************
 *                          *
 *        Scrolling         *
 *                          *
 ****************************/

//Setup variables
var isScrolling = false; //Scrolling is false by default, variable is used to prevent issues with context menus on scroll
var CONTAINER = document.getElementById("content-container"); //used var instead of const to avoid event listener getting stuck


function yb_getDisplay() {

    bits_visible = []; //Refresh bits visible before updating
    
    //For each bit in bitstream index (all downloaded bits)
    for (var bit in bitstream_index) {

        let element = bitstream_index[bit];
        
        //Check if element is in viewport
        if (isInViewport(element)){
            let type = $(element).attr('data-type');
            let id = $(element).attr('data-id');
            
            let button_bkd = $(element).attr('data-button-color');
            let button_color = $(element).attr('data-icon-color');
            yb_updateSeenBits(id);

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
}

function yb_EventPause(){
    scrolling = true;
    console.log("scrolling: " + scrolling)
    setTimeout(function(){
        isScrolling = false;
        console.log("scrolling: " + scrolling)
    }, 200)
}



function yb_setIsScrolling(option){
    scrolling = option;
}

function yb_isScrolling() {
    return isScrolling;
}

var debounced_function = debounce(yb_getDisplay, 500);

CONTAINER.addEventListener("scroll", yb_EventPause);
CONTAINER.addEventListener("scroll", debounced_function);


//Tracker functions
function getBitByIndex(index) {
    return bitstream_index[index];
}
function getLenBitIndex() {
    return bitstream_index.length - 1;
}

function yb_lenBitsOnScreen(){
    return bits_visible.length - 1;
}

function yb_getBitOnScreen(index) {
    return bits_visible[index];
}
