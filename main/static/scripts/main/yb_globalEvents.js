//YB Events JS File
//Yourbit, LLC - 2023
//Author: Austin Chaney
//Date: 10/26/2023

//File Contains all event listeners for the Yourbit UI

//Swipe down to close menu

function yb_handleActivateSwipeDown(element) {
    element.addEventListener("touchstart", function(event) {
        var initialY = event.touches[0].clientY;

        // Add an event listener for touchend event
        element.addEventListener("touchend", function(event) {
            var finalY = event.changedTouches[0].clientY;
            var deltaY = finalY - initialY;
    
            // Check if the user has swiped down
            if (deltaY > 100) {
                console.log(deltaY)
                // Perform actions to exit fullscreen
                // Add your code here to handle fullscreen exit
                setTimeout(yb_swipeDownObject, 300, element);
            }
        });
    });
}

function yb_handleActivateSwipeUp(element) {
    element.addEventListener("touchstart", function(event) {
        var initialY = event.touches[0].clientY;

        // Add an event listener for touchend event
        element.addEventListener("touchend", function(event) {
            var finalY = event.changedTouches[0].clientY;
            var deltaY = finalY - initialY;

            // Check if the user has swiped up
            if (deltaY < -100) {
                console.log(deltaY)
                // Perform actions to enter fullscreen
                // Add your code here to handle fullscreen entry
                setTimeout(yb_swipeUpObject, 300, element);
            }
        });
    });
}


function yb_activateSwipe(direction, element){
    if (direction === "down"){
        yb_handleActivateSwipeDown(element);
    } else if (direction === "up"){
        yb_handleActivateSwipeUp(element);
    }
}

function yb_closeCard(element_id){
    $(element_id).animate({"top": "100vh"}, 25);
    $(element_id).remove();
    $("#yb-divider-top").fadeOut();
}


// /* Initialize Core UI Event Listeners */
// $(document).ready(function(){

//     //Create menu button event listener
    

//     //Main Menu Button Event Listener
//     MENU_BUTTON.addEventListener("click", function(){
//         yb_loadSlideUpTemplate("url", "/templates/menu", MAIN_MENU);
//     });

//     //Initialize event listeners in create options
//     let create_options = document.getElementsByClassName("create-option");
//     for (let i = 0; i < create_options.length; i++) {
//         let this_option = create_options[i];
//         this_option.addEventListener("click", function(){
//             if (this_option.name === "chat") {
//                 yb_updateSlideUpTemplate("url", "/create/chat", CREATE_MENU);
//             } else if (this_option.name === "photo") {
//                 yb_updateSlideUpTemplate("url", "/create/photo", CREATE_MENU);
//             } else if (this_option.name === "video") {
//                 yb_updateSlideUpTemplate("url", "/create/video", CREATE_MENU);
//             } else if (this_option.name === "cluster") {
//                 yb_updateSlideUpTemplate("url", "/create/cluster", CREATE_MENU);
//             } else if (this_option.name === "community") {
//                 yb_updateSlideUpTemplate("url", "/create/community", CREATE_MENU);
//             } else if (this_option.name === "messages") {
//                 yb_updateSlideUpTemplate("url", "/create/messages", CREATE_MENU);
//             } else {
//                 console.log("Error: Invalid Create Option");
//             }
//         });
//     }



// });