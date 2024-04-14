
function yb_getConversations() {
    //Get the conversations
    $.ajax({
        type: 'GET',
        url: '/messages/api/conversations/',
        success: function(response) {
            //Update the feed
            console.log(response);
            yb_renderConversations();
            
        },
        error: function(response) {
            //Error
            console.log(response);
        }
    });
}

function yb_sendMessage(data) {
    //Send a message
    $.ajax({
        type: 'POST',
        url: '/messages/api/messages/',
        data: data,
        success: function(response) {
            //Update the feed
            console.log(response);
        },
        error: function(response) {
            //Error
            console.log(response);
        }
    });
}
