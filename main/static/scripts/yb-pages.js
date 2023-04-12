/*
        main/yb-pages.js
        11/14/2022
        Yourbit, LLC
        
        YB pages contains all of the functions for changing pages on yourbit.
        Each function loads a specific designated page from the backend server.

*/

//Load variables
CONTENT_CONTAINER = document.getElementById("content-container");
IFRAME_CONTAINER = document.getElementById("iframe-container")

//Profile Page



//List Page
function loadList(data) {

    let context = data.get("context")

    /*
        data = 
            context
            conversation_id
            connection_filter
    */


    //content
    if (context === 'conversation'){
        let id = data['conversation_id'];
        requestGetHtml(`/messages/conversation/${id}/`);
        history.pushState({}, "", `${current_url}/messages/conversation/${id}/`);
    }

    if (context === 'connection'){
        let list_filter = data['list_filter'];
        requestGetHtml(`/profile/connections/${list_filter}/`);
    }

    if (context === "search"){
        //pass

    }


    //context = conversations, connections
    return null
}

//Settings Page
function loadSettings(){
    

}

//Customization Page
function loadCustomize(){
    //iframe
    return null
}